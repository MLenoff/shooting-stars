import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy singleton — only initialized when first used, not at build time
let _client: SupabaseClient | null = null;

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_client) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !serviceKey) throw new Error('Supabase env vars not set');
      _client = createClient(url, serviceKey);
    }
    return (_client as unknown as Record<string | symbol, unknown>)[prop];
  },
});
