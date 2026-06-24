import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date'); // format: YYYY-MM-DD
  const programId = searchParams.get('programId');
  const month = searchParams.get('month'); // format: YYYY-MM

  // Return booked time slots for a specific date
  if (date) {
    try {
      const { getBookedSlots } = await import('@/lib/calendar');
      const bookedSlots = await getBookedSlots(date);
      return NextResponse.json({ bookedSlots });
    } catch (err) {
      console.error('Calendar slots error:', err);
      return NextResponse.json({ bookedSlots: [] });
    }
  }

  // Month-level: return all booked slots per date for the whole month
  if (month && !programId) {
    try {
      const { getMonthBookedSlots } = await import('@/lib/calendar');
      const slotsByDate = await getMonthBookedSlots(month);
      return NextResponse.json({ slotsByDate });
    } catch (err) {
      console.error('Calendar month slots error:', err);
      return NextResponse.json({ slotsByDate: {} });
    }
  }

  if (!programId || !month) {
    return NextResponse.json({ bookedDates: [] });
  }

  try {
    const { getBookedDates } = await import('@/lib/calendar');
    const bookedDates = await getBookedDates(programId, month);
    return NextResponse.json({ bookedDates });
  } catch (err) {
    console.error('Calendar availability error:', err);
    return NextResponse.json({ bookedDates: [] });
  }
}
