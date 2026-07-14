import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEETS_ID!;

function getAuth() {
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export interface SpotRow {
  rowIndex: number;
  programId: string;
  ageGroup: string;
  sessionLabel: string;
  maxSpots: number;
  enrolled: number;
  remaining: number;
}

export async function getAllSpots(): Promise<SpotRow[]> {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Spot Config!A2:E100',
  });
  const rows = res.data.values || [];
  return rows.map((r, i) => {
    const max = parseInt(r[3] || '0', 10);
    const enrolled = parseInt(r[4] || '0', 10);
    return {
      rowIndex: i + 2,
      programId: r[0] || '',
      ageGroup: r[1] || '',
      sessionLabel: r[2] || '',
      maxSpots: max,
      enrolled,
      remaining: Math.max(0, max - enrolled),
    };
  });
}

export async function getSpotsForProgram(programId: string, ageGroup = ''): Promise<SpotRow | null> {
  const all = await getAllSpots();
  return all.find(s => s.programId === programId && s.ageGroup === ageGroup) || null;
}

export async function incrementSpot(programId: string, ageGroup = ''): Promise<void> {
  const spot = await getSpotsForProgram(programId, ageGroup);
  if (!spot) return;
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Spot Config!E${spot.rowIndex}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[String(spot.enrolled + 1)]] },
  });
}

export async function resetSpot(programId: string, ageGroup = ''): Promise<void> {
  const spot = await getSpotsForProgram(programId, ageGroup);
  if (!spot) return;
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Spot Config!E${spot.rowIndex}`,
    valueInputOption: 'RAW',
    requestBody: { values: [['0']] },
  });
}

export async function updateSpot(programId: string, ageGroup = '', enrolled: number, maxSpots: number): Promise<void> {
  const spot = await getSpotsForProgram(programId, ageGroup);
  if (!spot) return;
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Spot Config!D${spot.rowIndex}:E${spot.rowIndex}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[String(maxSpots), String(enrolled)]] },
  });
}

const REG_SETTINGS_TAB = 'Registration Settings';

async function ensureRegSettingsTab(sheets: ReturnType<typeof google.sheets>): Promise<void> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const exists = meta.data.sheets?.some(s => s.properties?.title === REG_SETTINGS_TAB);
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: REG_SETTINGS_TAB } } }],
      },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${REG_SETTINGS_TAB}!A1:B1`,
      valueInputOption: 'RAW',
      requestBody: { values: [['program_id', 'force_open']] },
    });
  }
}

export async function getRegistrationOverrides(): Promise<Record<string, boolean>> {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${REG_SETTINGS_TAB}!A2:B100`,
    });
    const rows = res.data.values || [];
    return Object.fromEntries(
      rows.filter(r => r[0]).map(r => [r[0], r[1]?.toUpperCase() === 'TRUE'])
    );
  } catch {
    return {};
  }
}

export async function setRegistrationOverride(programId: string, forceOpen: boolean): Promise<void> {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  await ensureRegSettingsTab(sheets);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${REG_SETTINGS_TAB}!A2:B100`,
  });
  const rows = res.data.values || [];
  const rowIdx = rows.findIndex(r => r[0] === programId);
  if (rowIdx >= 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${REG_SETTINGS_TAB}!B${rowIdx + 2}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[forceOpen ? 'TRUE' : 'FALSE']] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${REG_SETTINGS_TAB}!A:B`,
      valueInputOption: 'RAW',
      requestBody: { values: [[programId, forceOpen ? 'TRUE' : 'FALSE']] },
    });
  }
}

export function getAcademyAgeGroup(age: number): string {
  if (age <= 6) return 'U6 & Under';
  if (age <= 9) return 'U7-U9';
  return 'U10+';
}
