'use client';

import { useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

let _supabase: SupabaseClient | null = null;
const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    if (!_supabase) {
      _supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }
    return (_supabase as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase puts the access token in the URL hash after redirect
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (accessToken && refreshToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      }
    }
    setReady(true);
  }, []);

  async function handleReset() {
    if (!password || password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setError('');
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError('Could not update password. Please request a new reset link.');
      setLoading(false);
      return;
    }
    setDone(true);
    setLoading(false);
    setTimeout(() => router.push('/my-sessions'), 2500);
  }

  return (
    <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>
      <section style={{
        background: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 100%)',
        padding: '64px 24px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #29ABE2, #0093c4)' }} />
        <p style={{ color: '#29ABE2', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Session Tracking</p>
        <h1 style={{ color: 'white', fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: '900', marginBottom: '12px' }}>Reset Password</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>Set a new password for your account.</p>
      </section>

      <section style={{ maxWidth: '400px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
          {done ? (
            <p style={{ color: '#29ABE2', fontSize: '15px', textAlign: 'center', fontWeight: '600' }}>
              Password updated. Redirecting you to login...
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  placeholder="Repeat your password"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }}
                />
              </div>
              {error && <p style={{ color: 'red', fontSize: '13px', margin: 0 }}>{error}</p>}
              <button
                onClick={handleReset}
                disabled={loading || !ready}
                style={{ backgroundColor: '#29ABE2', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
