'use client';

import { useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

const PROGRAM_CONFIG: Record<string, { days: string[]; slots: string[] }> = {
  'training-10pack': { days: ['tuesday', 'thursday', 'friday'], slots: ['4:30PM - 5:25PM'] },
  'training-20pack': { days: ['tuesday', 'thursday', 'friday'], slots: ['4:30PM - 5:25PM'] },
  'group-training-10pack': { days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], slots: ['4:30PM - 5:25PM', '5:30PM - 6:25PM'] },
  'group-training-20pack': { days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], slots: ['4:30PM - 5:25PM', '5:30PM - 6:25PM'] },
};

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

interface Pack {
  id: string;
  program_id: string;
  program_name: string;
  sessions_total: number;
  sessions_used: number;
  purchase_date: string;
  expires_at: string | null;
}

function CalendarPicker({ availableDays, selectedSlot, selectedDate, onSelect }: {
  availableDays: string[];
  selectedSlot: string;
  selectedDate: string;
  onSelect: (date: string) => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]>>({});

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  useEffect(() => {
    fetch(`/api/availability?month=${monthKey}`)
      .then(r => r.json())
      .then(d => setSlotsByDate(d.slotsByDate || {}))
      .catch(() => {});
  }, [monthKey]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function formatDate(d: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  function isAvailable(d: number) {
    const date = new Date(year, month, d);
    const dayName = DAY_NAMES[date.getDay()];
    const isPast = date <= new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (isPast || !availableDays.includes(dayName)) return false;
    const dateStr = formatDate(d);
    const bookedSlots = slotsByDate[dateStr] || [];
    const slotStart = selectedSlot.split(' - ')[0].trim();
    return !bookedSlots.some((b: string) => b.split(' - ')[0].trim() === slotStart);
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button
          onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }}
          style={{ background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', fontSize: '16px' }}
        >‹</button>
        <span style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a1a' }}>{monthName}</span>
        <button
          onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }}
          style={{ background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', fontSize: '16px' }}
        >›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} style={{ fontSize: '11px', fontWeight: '700', color: '#aaa', padding: '4px 0' }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const dateStr = formatDate(d);
          const available = isAvailable(d);
          const selected = dateStr === selectedDate;
          return (
            <button key={i} disabled={!available} onClick={() => onSelect(dateStr)}
              style={{
                padding: '8px 2px', border: 'none', borderRadius: '6px',
                cursor: available ? 'pointer' : 'default', fontSize: '13px',
                fontWeight: selected ? '700' : '400',
                backgroundColor: selected ? '#29ABE2' : available ? '#f0f9ff' : 'transparent',
                color: selected ? 'white' : available ? '#1a1a1a' : '#ccc',
              }}>
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MySessionsPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [packs, setPacks] = useState<Pack[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Booking state
  const [bookingPackId, setBookingPackId] = useState<string | null>(null);
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookedPackId, setBookedPackId] = useState<string | null>(null);

  async function handleLogin() {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError('Invalid email or password.'); return; }
      const loggedEmail = data.user.email || email;
      setLoggedIn(true);
      setUserEmail(loggedEmail);
      setUserName(data.user.user_metadata?.name || '');
      const res = await fetch(`/api/my-sessions?email=${encodeURIComponent(loggedEmail)}`);
      const json = await res.json();
      setPacks(json.packs || []);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!forgotEmail) { setError('Please enter your email address.'); return; }
    setForgotLoading(true);
    setError('');
    await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setForgotSent(true);
    setForgotLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setPacks(null);
    setEmail('');
    setPassword('');
    setBookingPackId(null);
  }

  function startBooking(pack: Pack) {
    const config = PROGRAM_CONFIG[pack.program_id];
    setBookingPackId(pack.id);
    setBookingSlot(config?.slots[0] || '');
    setBookingDate('');
    setBookingError('');
    setBookedPackId(null);
  }

  async function confirmBooking(pack: Pack) {
    if (!bookingDate || !bookingSlot) {
      setBookingError('Please select a date and time slot.');
      return;
    }
    setBookingLoading(true);
    setBookingError('');
    try {
      // Check if slot is still available
      // 12-hour advance notice check
      const slotMatch = bookingSlot.match(/(\d+):(\d+)(AM|PM)/i);
      if (slotMatch) {
        let hour = parseInt(slotMatch[1]);
        const min = parseInt(slotMatch[2]);
        const ap = slotMatch[3].toUpperCase();
        if (ap === 'PM' && hour !== 12) hour += 12;
        if (ap === 'AM' && hour === 12) hour = 0;
        const slotDate = new Date(`${bookingDate}T${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}:00`);
        if ((slotDate.getTime() - Date.now()) < 12 * 60 * 60 * 1000) {
          setBookingError('Bookings must be made at least 12 hours in advance.');
          setBookingLoading(false);
          return;
        }
      }

      const avRes = await fetch(`/api/availability?date=${bookingDate}`);
      const avData = await avRes.json();
      const slotStart = bookingSlot.split(' - ')[0].trim();
      const isSlotTaken = avData.bookedSlots?.some((b: string) => b.split(' - ')[0].trim() === slotStart);
      if (isSlotTaken) {
        setBookingError('That time slot is already booked. Please pick another date.');
        setBookingLoading(false);
        return;
      }

      const res = await fetch('/api/book-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packId: pack.id,
          customerEmail: userEmail,
          customerName: userName || userEmail,
          programId: pack.program_id,
          programName: pack.program_name,
          date: bookingDate,
          slot: bookingSlot,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setBookingError(data.error || 'Something went wrong.');
        return;
      }

      // Update local pack sessions_used
      setPacks(prev => prev?.map(p =>
        p.id === pack.id ? { ...p, sessions_used: p.sessions_used + 1 } : p
      ) || null);

      setBookedPackId(pack.id);
      setBookingPackId(null);
    } catch {
      setBookingError('Something went wrong. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  }

  function formatDateDisplay(dateStr: string) {
    const [y, m, d] = dateStr.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
  }

  if (loggedIn && packs !== null) {
    return (
      <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>
        <section style={{
          background: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 100%)',
          padding: '48px 24px', textAlign: 'center', position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #29ABE2, #0093c4)' }} />
          <p style={{ color: '#29ABE2', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>Session Tracking</p>
          <h1 style={{ color: 'white', fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: '900', marginBottom: '8px' }}>My Sessions</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '16px' }}>{userEmail}</p>
          <button onClick={handleLogout} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Log out</button>
        </section>

        <section style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px' }}>
          {packs.length === 0 ? (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
              <p style={{ color: '#555', fontSize: '15px' }}>No session packs found for this account.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {packs.map(pack => {
                const remaining = pack.sessions_total - pack.sessions_used;
                const pct = Math.round((remaining / pack.sessions_total) * 100);
                const now = new Date();
                const expiresAt = pack.expires_at ? new Date(pack.expires_at) : null;
                const isExpired = expiresAt ? expiresAt < now : false;
                const daysUntilExpiry = expiresAt ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
                const expiryWarning = !isExpired && daysUntilExpiry !== null && daysUntilExpiry <= 30;
                const config = PROGRAM_CONFIG[pack.program_id];
                const canBook = !isExpired && remaining > 0 && !!config;
                const isBookingThis = bookingPackId === pack.id;
                const justBooked = bookedPackId === pack.id;

                return (
                  <div key={pack.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', opacity: isExpired ? 0.6 : 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a1a', marginBottom: '4px' }}>{pack.program_name}</h3>
                    <p style={{ fontSize: '12px', color: '#aaa', marginBottom: expiresAt ? '4px' : '16px' }}>
                      Purchased {new Date(pack.purchase_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    {expiresAt && (
                      <p style={{ fontSize: '12px', marginBottom: '16px', color: isExpired ? '#e53e3e' : expiryWarning ? '#d97706' : '#aaa', fontWeight: (isExpired || expiryWarning) ? '600' : '400' }}>
                        {isExpired
                          ? 'Pack expired — unused sessions forfeited'
                          : `Expires ${expiresAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}${expiryWarning ? ` (${daysUntilExpiry} days left)` : ''}`}
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '14px', color: '#555' }}>{remaining} of {pack.sessions_total} sessions remaining</span>
                      <span style={{ fontSize: '24px', fontWeight: '900', color: isExpired ? '#ccc' : remaining > 0 ? '#29ABE2' : '#ccc' }}>{remaining}</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: isExpired ? '#e53e3e' : remaining > 0 ? '#29ABE2' : '#ccc', borderRadius: '4px' }} />
                    </div>

                    {justBooked && (
                      <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px', marginBottom: '12px', textAlign: 'center' }}>
                        <p style={{ color: '#16a34a', fontWeight: '700', fontSize: '14px', margin: 0 }}>Session booked!</p>
                        <p style={{ color: '#16a34a', fontSize: '13px', margin: '4px 0 0' }}>You'll receive a confirmation shortly.</p>
                      </div>
                    )}

                    {canBook && !isBookingThis && !justBooked && (
                      <button onClick={() => startBooking(pack)}
                        style={{ width: '100%', backgroundColor: '#29ABE2', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                        Book a Session
                      </button>
                    )}

                    {isBookingThis && config && (
                      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', marginTop: '4px' }}>
                        <p style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a1a', marginBottom: '12px' }}>Pick a time slot</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '4px' }}>
                          {config.slots.map(slot => (
                            <label key={slot} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px 12px', border: `2px solid ${bookingSlot === slot ? '#29ABE2' : '#eee'}`, borderRadius: '8px', backgroundColor: bookingSlot === slot ? '#f0f9ff' : 'white' }}>
                              <input type="radio" name={`slot-${pack.id}`} value={slot} checked={bookingSlot === slot} onChange={() => { setBookingSlot(slot); setBookingDate(''); }}
                                style={{ accentColor: '#29ABE2' }} />
                              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{slot}</span>
                            </label>
                          ))}
                        </div>

                        <p style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a1a', marginTop: '16px', marginBottom: '4px' }}>Pick a date</p>
                        <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 4px' }}>
                          Available: {config.days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                        </p>

                        <CalendarPicker
                          availableDays={config.days}
                          selectedSlot={bookingSlot}
                          selectedDate={bookingDate}
                          onSelect={setBookingDate}
                        />

                        {bookingDate && (
                          <div style={{ marginTop: '16px', backgroundColor: '#f7f8fa', borderRadius: '8px', padding: '12px' }}>
                            <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
                              <strong>{formatDateDisplay(bookingDate)}</strong> at <strong>{bookingSlot}</strong>
                            </p>
                          </div>
                        )}

                        {bookingError && (
                          <p style={{ color: '#e53e3e', fontSize: '13px', marginTop: '8px' }}>{bookingError}</p>
                        )}

                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                          <button onClick={() => setBookingPackId(null)}
                            style={{ flex: 1, backgroundColor: 'white', color: '#555', padding: '12px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', border: '1px solid #ddd', cursor: 'pointer' }}>
                            Cancel
                          </button>
                          <button onClick={() => confirmBooking(pack)} disabled={bookingLoading || !bookingDate}
                            style={{ flex: 2, backgroundColor: bookingDate ? '#29ABE2' : '#ccc', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: bookingDate ? 'pointer' : 'not-allowed', opacity: bookingLoading ? 0.7 : 1 }}>
                            {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>
      <section style={{
        background: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 100%)',
        padding: '64px 24px', textAlign: 'center', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #29ABE2, #0093c4)' }} />
        <p style={{ color: '#29ABE2', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Session Tracking</p>
        <h1 style={{ color: 'white', fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: '900', marginBottom: '12px' }}>My Sessions</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>When you purchase a session pack, an account is created for you automatically. Check your email to set your password, then log in here to track and book your sessions.</p>
      </section>

      <section style={{ maxWidth: '400px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="••••••••"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }} />
            </div>
            {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
            <button onClick={handleLogin} disabled={loading}
              style={{ backgroundColor: '#29ABE2', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            <button onClick={() => { setShowForgot(true); setError(''); setForgotSent(false); }}
              style={{ background: 'none', border: 'none', color: '#29ABE2', fontSize: '13px', cursor: 'pointer', textAlign: 'center', padding: '0' }}>
              Forgot password?
            </button>
          </div>
        </div>

        {showForgot && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginTop: '16px' }}>
            {forgotSent ? (
              <p style={{ color: '#29ABE2', fontSize: '14px', textAlign: 'center', margin: 0 }}>Check your email for a password reset link.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>Enter your email and we'll send a reset link.</p>
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="you@example.com"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }} />
                {error && <p style={{ color: 'red', fontSize: '13px', margin: 0 }}>{error}</p>}
                <button onClick={handleForgotPassword} disabled={forgotLoading}
                  style={{ backgroundColor: '#29ABE2', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: forgotLoading ? 'not-allowed' : 'pointer', opacity: forgotLoading ? 0.7 : 1 }}>
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button onClick={() => setShowForgot(false)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
