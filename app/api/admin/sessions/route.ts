import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Get all packs
export async function GET() {
  const { data } = await supabaseAdmin
    .from('session_packs')
    .select('*')
    .order('created_at', { ascending: false });

  return NextResponse.json({ packs: data || [] });
}

// Mark session used, add a session, or set values directly
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, action, sessions_used, sessions_total } = body;

  if (action === 'set') {
    const updates: Record<string, number> = {};
    if (typeof sessions_total === 'number') updates.sessions_total = Math.max(0, sessions_total);
    if (typeof sessions_used === 'number') updates.sessions_used = Math.max(0, sessions_used);
    if (Object.keys(updates).length) {
      await supabaseAdmin.from('session_packs').update(updates).eq('id', id);
    }
    return NextResponse.json({ ok: true });
  }

  const { data: pack } = await supabaseAdmin
    .from('session_packs')
    .select('sessions_used, sessions_total')
    .eq('id', id)
    .single();

  if (!pack) return NextResponse.json({ ok: false });

  if (action === 'use' && pack.sessions_used < pack.sessions_total) {
    await supabaseAdmin.from('session_packs').update({ sessions_used: pack.sessions_used + 1 }).eq('id', id);
  } else if (action === 'add') {
    await supabaseAdmin.from('session_packs').update({ sessions_total: pack.sessions_total + 1 }).eq('id', id);
  }

  return NextResponse.json({ ok: true });
}

// Create a new pack (cash customer)
export async function POST(req: NextRequest) {
  const { name, email, program_name, sessions_total, player_name, player_age, player_level, phone } = await req.json();
  if (!name || !email || !program_name || !sessions_total) {
    return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
  }

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 3);

  await supabaseAdmin.from('session_packs').insert({
    email: email.toLowerCase(),
    name,
    program_id: 'cash',
    program_name,
    sessions_total: parseInt(sessions_total),
    sessions_used: 0,
    expires_at: expiresAt.toISOString(),
    player_name: player_name || null,
    player_age: player_age || null,
    player_level: player_level || null,
    phone: phone || null,
  });

  // Invite the customer so they can set a password and log in
  await supabaseAdmin.auth.admin.inviteUserByEmail(email.toLowerCase(), {
    data: { name },
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/my-sessions`,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}

// Delete a pack
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await supabaseAdmin.from('session_packs').delete().eq('id', id);
  return NextResponse.json({ ok: true });
}
