import { google } from 'googleapis';

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
}

// Parse a time slot string like "4:30PM - 5:30PM" into { hour, minute } for start/end
function parseSlotTime(slot: string): { startHour: number; startMin: number; endHour: number; endMin: number } | null {
  const match = slot.match(/(\d+):(\d+)(AM|PM)\s*-\s*(\d+):(\d+)(AM|PM)/i);
  if (!match) return null;
  const [, sh, sm, sap, eh, em, eap] = match;
  const to24 = (h: string, m: string, ap: string) => {
    let hour = parseInt(h);
    if (ap.toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (ap.toUpperCase() === 'AM' && hour === 12) hour = 0;
    return { hour, min: parseInt(m) };
  };
  const start = to24(sh, sm, sap);
  const end = to24(eh, em, eap);
  return { startHour: start.hour, startMin: start.min, endHour: end.hour, endMin: end.min };
}

export async function getBookedDates(programId: string, month: string): Promise<string[]> {
  const auth = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  const timeMin = new Date(`${month}-01T00:00:00Z`).toISOString();
  const timeMax = new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 2)).toISOString();

  const res = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin,
    timeMax,
    q: programId,
    singleEvents: true,
  });

  return (res.data.items || [])
    .filter(e => e.start?.dateTime || e.start?.date)
    .map(e => (e.start?.dateTime || e.start?.date || '').substring(0, 10));
}

export async function getMonthBookedSlots(month: string): Promise<Record<string, string[]>> {
  const auth = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  const timeMin = new Date(`${month}-01T00:00:00-04:00`).toISOString();
  const timeMax = new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)).toISOString();

  const res = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin,
    timeMax,
    singleEvents: true,
    maxResults: 500,
  });

  const events = res.data.items || [];
  const byDate: Record<string, string[]> = {};

  const to12 = (hour: number, min: number) => {
    const ap = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${h12}:${String(min).padStart(2, '0')}${ap}`;
  };

  const extractLocalTime = (dt: string) => {
    if (dt.endsWith('Z')) {
      const d = new Date(dt);
      const parts = d.toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: false }).split(':');
      return { hour: parseInt(parts[0]), min: parseInt(parts[1]) };
    }
    const timePart = dt.substring(11, 16);
    const [h, m] = timePart.split(':').map(Number);
    return { hour: h, min: m };
  };

  for (const event of events) {
    const startDT = event.start?.dateTime;
    const endDT = event.end?.dateTime;
    if (!startDT || !endDT) continue;
    const dateKey = startDT.substring(0, 10);
    if (!byDate[dateKey]) byDate[dateKey] = [];

    const slotStr = event.description?.match(/Slot: (.+)/)?.[1];
    if (slotStr) {
      byDate[dateKey].push(slotStr.trim());
    } else {
      const s = extractLocalTime(startDT);
      const e = extractLocalTime(endDT);
      byDate[dateKey].push(`${to12(s.hour, s.min)} - ${to12(e.hour, e.min)}`);
    }
  }

  return byDate;
}

export async function getBookedSlots(date: string): Promise<string[]> {
  const auth = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  const timeMin = new Date(`${date}T00:00:00`).toISOString();
  const timeMax = new Date(`${date}T23:59:59`).toISOString();

  const res = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin,
    timeMax,
    singleEvents: true,
  });

  const events = res.data.items || [];
  const bookedSlots: string[] = [];

  const to12 = (hour: number, min: number) => {
    const ap = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${h12}:${String(min).padStart(2, '0')}${ap}`;
  };

  // Extract the local Eastern hour/minute from a Google Calendar dateTime string.
  // Handles both offset format ("2026-06-20T12:00:00-04:00") and UTC ("2026-06-20T16:00:00Z").
  const extractLocalTime = (dt: string) => {
    if (dt.endsWith('Z')) {
      // UTC — convert to Eastern using locale string
      const d = new Date(dt);
      const parts = d.toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: false }).split(':');
      return { hour: parseInt(parts[0]), min: parseInt(parts[1]) };
    }
    // Has offset (e.g. -04:00) — local time is in the raw string
    const timePart = dt.substring(11, 16);
    const [h, m] = timePart.split(':').map(Number);
    return { hour: h, min: m };
  };

  for (const event of events) {
    // Bookings made through our system have "Slot: X" in the description
    const slotStr = event.description?.match(/Slot: (.+)/)?.[1];
    if (slotStr) {
      bookedSlots.push(slotStr.trim());
      continue;
    }

    // Manually created events — derive slot from start/end time
    const startDT = event.start?.dateTime;
    const endDT = event.end?.dateTime;
    if (startDT && endDT) {
      const s = extractLocalTime(startDT);
      const e = extractLocalTime(endDT);
      bookedSlots.push(`${to12(s.hour, s.min)} - ${to12(e.hour, e.min)}`);
    }
  }

  return [...new Set(bookedSlots)];
}

export async function createBookingEvent({
  programName,
  programId,
  customerName,
  date,
  slot,
  customerEmail,
  customerPhone,
  playerDetails,
  playerLevel,
}: {
  programName: string;
  programId: string;
  customerName: string;
  date: string;
  slot: string;
  customerEmail?: string;
  customerPhone?: string;
  playerDetails?: string;
  playerLevel?: string;
}) {
  const parsed = parseSlotTime(slot);
  if (!parsed) return;

  const auth = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  const startDateTime = new Date(`${date}T00:00:00`);
  startDateTime.setHours(parsed.startHour, parsed.startMin, 0, 0);

  const endDateTime = new Date(`${date}T00:00:00`);
  endDateTime.setHours(parsed.endHour, parsed.endMin, 0, 0);

  const toLocalISO = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  };

  await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: {
      summary: `${programName} | ${customerName}`,
      description: [
        `Program: ${programId}`,
        `Slot: ${slot}`,
        playerDetails ? `Player: ${playerDetails}` : '',
        playerLevel ? `Level: ${playerLevel}` : '',
        `Parent: ${customerName}`,
        customerPhone ? `Phone: ${customerPhone}` : '',
        customerEmail ? `Email: ${customerEmail}` : '',
      ].filter(Boolean).join('\n'),
      start: { dateTime: toLocalISO(startDateTime), timeZone: 'America/New_York' },
      end: { dateTime: toLocalISO(endDateTime), timeZone: 'America/New_York' },
    },
  });
}
