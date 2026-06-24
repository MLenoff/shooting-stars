import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
import { createBookingEvent } from '@/lib/calendar';

export async function POST(req: NextRequest) {
  const { packId, customerEmail, customerName, programId, programName, date, slot } = await req.json();

  if (!packId || !customerEmail || !date || !slot) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Fetch pack and verify ownership
  const { data: pack, error } = await supabaseAdmin
    .from('session_packs')
    .select('*')
    .eq('id', packId)
    .eq('email', customerEmail.toLowerCase())
    .single();

  if (error || !pack) {
    return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
  }

  const remaining = pack.sessions_total - pack.sessions_used;
  if (remaining <= 0) {
    return NextResponse.json({ error: 'No sessions remaining' }, { status: 400 });
  }

  if (pack.expires_at && new Date(pack.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Pack expired' }, { status: 400 });
  }

  // Decrement sessions
  const { error: updateError } = await supabaseAdmin
    .from('session_packs')
    .update({ sessions_used: pack.sessions_used + 1 })
    .eq('id', packId);

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update session count' }, { status: 500 });
  }

  // Create Google Calendar event
  try {
    await createBookingEvent({ programName, programId, customerName, date, slot, customerEmail });
  } catch (err) {
    console.error('Calendar error:', err);
  }

  return NextResponse.json({ ok: true, sessionsRemaining: remaining - 1 });
}
