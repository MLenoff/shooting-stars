import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { programs } from '@/lib/programs';

export async function GET() {
  const { data } = await supabaseAdmin.from('program_settings').select('*');
  const overrides = new Map((data || []).map((r: Record<string, unknown>) => [r.id as string, r]));

  const all = programs.map(p => {
    const ov = overrides.get(p.id) as Record<string, unknown> | undefined;
    return {
      id: p.id,
      name: (ov?.name as string) ?? p.name,
      price: (ov?.price as number) ?? p.price,
      dates: (ov?.dates as string) ?? p.dates ?? '',
      times: (ov?.times as string) ?? p.times ?? '',
      description: (ov?.description as string) ?? p.description,
      age_group: (ov?.age_group as string) ?? p.ageGroup ?? '',
      active: (ov?.active as boolean) ?? p.active,
      flyer: (ov?.flyer as string) ?? p.flyer ?? '',
      registration_closed: (ov?.registration_closed as boolean | null) ?? null,
      registration_closed_default: p.registrationClosed ?? false,
      session_groups: p.sessionGroups ?? null,
      sessions_override: (ov?.sessions_override as string[] | null) ?? null,
    };
  });

  return NextResponse.json({ programs: all });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const allowed = ['name', 'price', 'dates', 'times', 'description', 'age_group', 'active', 'flyer', 'registration_closed', 'sessions_override'];
  const upsertData: Record<string, unknown> = { id, updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) upsertData[key] = body[key];
  }

  const { error } = await supabaseAdmin.from('program_settings').upsert(upsertData);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
