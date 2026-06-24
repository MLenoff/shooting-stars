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
    };
  });

  return NextResponse.json({ programs: all });
}

export async function POST(req: NextRequest) {
  const { id, name, price, dates, times, description, age_group, active } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabaseAdmin
    .from('program_settings')
    .upsert({ id, name, price, dates, times, description, age_group, active, updated_at: new Date().toISOString() });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
