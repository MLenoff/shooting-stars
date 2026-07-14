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
        let sessionGroups = p.sessionGroups;
        if (ov.sessions_override != null && p.sessionGroups) {
          const enabled = ov.sessions_override as string[];
          sessionGroups = p.sessionGroups
            .map(g => ({ ...g, sessions: g.sessions.filter(s => enabled.includes(s)) }))
            .filter(g => g.sessions.length > 0);
        }

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
          ...(ov.registration_closed != null ? { registrationClosed: ov.registration_closed as boolean } : {}),
          sessionGroups,
        };
      })
      .filter(p => p.active);
  } catch {
    return local;
  }
}
