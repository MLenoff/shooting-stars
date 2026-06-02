import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const programId = searchParams.get('programId');
  const month = searchParams.get('month'); // format: YYYY-MM

  if (!programId || !month) {
    return NextResponse.json({ bookedDates: [] });
  }

  try {
    const { google } = await import('googleapis');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const timeMin = new Date(`${month}-01T00:00:00Z`).toISOString();
    const timeMax = new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 2)).toISOString();

    const res = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin,
      timeMax,
      q: programId, // search by program id in event title
      singleEvents: true,
    });

    const bookedDates = (res.data.items || [])
      .filter(e => e.start?.dateTime || e.start?.date)
      .map(e => {
        const dt = e.start?.dateTime || e.start?.date || '';
        return dt.substring(0, 10); // YYYY-MM-DD
      });

    return NextResponse.json({ bookedDates });
  } catch (err) {
    console.error('Calendar availability error:', err);
    return NextResponse.json({ bookedDates: [] });
  }
}
