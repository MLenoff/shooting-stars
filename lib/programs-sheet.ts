import type { Program } from './programs';
import { supabaseAdmin } from './supabase';

export async function getProgramsFromSheet(): Promise<Program[]> {
  const { programs: localPrograms } = await import('./programs');
  const local = localPrograms.filter(p => p.active);

  try {
    const { data } = await supabaseAdmin
      .from('program_settings')
      .select('*');

    if (!data || data.length === 0) return local;

    const overrides = new Map(data.map((r: Record<string, unknown>) => [r.id as string, r]));

    return local
      .map(p => {
        const ov = overrides.get(p.id);
        if (!ov) return p;
        return {
          ...p,
          ...(ov.name != null ? { name: ov.name as string } : {}),
          ...(ov.price != null ? { price: ov.price as number } : {}),
          ...(ov.dates != null ? { dates: ov.dates as string } : {}),
          ...(ov.times != null ? { times: ov.times as string } : {}),
          ...(ov.description != null ? { description: ov.description as string } : {}),
          ...(ov.age_group != null ? { ageGroup: ov.age_group as string } : {}),
          ...(ov.active != null ? { active: ov.active as boolean } : {}),
          ...(ov.flyer != null ? { flyer: ov.flyer as string } : {}),
        };
      })
      .filter(p => p.active);
  } catch {
    return local;
  }
}
