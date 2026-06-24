import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const email = new URL(req.url).searchParams.get('email');
  if (!email) return NextResponse.json({ packs: [] });

  const { data } = await supabaseAdmin
    .from('session_packs')
    .select('*')
    .eq('email', email.toLowerCase())
    .order('created_at', { ascending: false });

  return NextResponse.json({ packs: data || [] });
}
