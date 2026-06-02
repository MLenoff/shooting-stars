import type { Program, ProgramType } from './programs';

const SHEET_ID = '1K8kUllqEQXiZG1rW4BOSjVTkrHvZ2H2Teoud8WBb5Bc';

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        cols.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    cols.push(current.trim());
    rows.push(cols);
  }
  return rows;
}

export async function getProgramsFromSheet(): Promise<Program[]> {
  const { programs: localPrograms } = await import('./programs');
  const local = localPrograms.filter(p => p.active);

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
    const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 minutes
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);

    const text = await res.text();
    const rows = parseCSV(text);
    if (rows.length < 2) return local;

    const headers = rows[0];
    const col = (name: string) => headers.indexOf(name);

    const sheetPrograms = rows.slice(1)
      .filter(row => row[col('active')]?.trim().toUpperCase() === 'TRUE')
      .map(row => {
        const get = (name: string) => row[col(name)]?.trim() ?? '';
        const sessionsRaw = get('sessions');
        const availableDaysRaw = get('availableDays');
        const timeSlotsRaw = get('timeSlots');

        return {
          id: get('id'),
          name: get('name'),
          type: get('type') as ProgramType,
          description: get('description'),
          dates: get('dates'),
          times: get('times'),
          price: parseFloat(get('price')) || 0,
          deposit: get('deposit') ? parseFloat(get('deposit')) : undefined,
          totalPrice: get('totalPrice') ? parseFloat(get('totalPrice')) : undefined,
          ageGroup: get('ageGroup') || undefined,
          spotsAvailable: get('spotsAvailable') ? parseInt(get('spotsAvailable')) : undefined,
          flyer: get('flyer') || undefined,
          active: true,
          adultOnly: get('adultOnly').toUpperCase() === 'TRUE',
          requiresDatePicker: get('requiresDatePicker').toUpperCase() === 'TRUE',
          availableDays: availableDaysRaw
            ? (availableDaysRaw.split('|').map(d => d.trim()) as ('friday' | 'saturday' | 'sunday')[])
            : undefined,
          calendarEventTitle: get('calendarEventTitle') || undefined,
          sessions: sessionsRaw ? sessionsRaw.split('|').map(s => s.trim()) : undefined,
          contactUrl: get('contactUrl') || undefined,
          timeSlots: timeSlotsRaw ? timeSlotsRaw.split('|').map(s => s.trim()) : undefined,
        };
      });

    // Merge: sheet takes priority; any local program not in sheet is included as fallback.
    // Complex fields (sessionGroups, pricePerSession) can't live in the sheet — always pull from local.
    const localMap = new Map(local.map(p => [p.id, p]));
    const enriched = sheetPrograms.map(p => {
      const lp = localMap.get(p.id);
      return {
        ...p,
        sessionGroups: lp?.sessionGroups,
        pricePerSession: lp?.pricePerSession,
      };
    });
    const sheetIds = new Set(sheetPrograms.map(p => p.id));
    const localFallbacks = local.filter(p => !sheetIds.has(p.id));
    return [...enriched, ...localFallbacks];
  } catch (err) {
    console.error('Failed to load programs from sheet, falling back to local data:', err);
    return local;
  }
}
