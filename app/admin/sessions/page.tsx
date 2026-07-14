'use client';

import { useState, useEffect } from 'react';

interface Pack {
  id: string;
  email: string;
  name: string;
  program_name: string;
  sessions_total: number;
  sessions_used: number;
  purchase_date: string;
  player_name?: string;
  player_age?: string;
  player_level?: string;
  phone?: string;
}

interface SessionGroup {
  label: string;
  sessions: string[];
}

interface ProgramRow {
  id: string;
  name: string;
  price: number;
  dates: string;
  times: string;
  description: string;
  age_group: string;
  active: boolean;
  flyer: string;
  registration_closed: boolean | null;
  registration_closed_default: boolean;
  session_groups: SessionGroup[] | null;
  sessions_override: string[] | null;
}

const ADMIN_PASSWORD = 'ShootingStars2026!';

export default function AdminSessionsPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [tab, setTab] = useState<'sessions' | 'programs'>('sessions');

  // Sessions state
  const [packs, setPacks] = useState<Pack[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editTotal, setEditTotal] = useState('');
  const [editUsed, setEditUsed] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newProgram, setNewProgram] = useState('');
  const [newPlayerDob, setNewPlayerDob] = useState('');
  const [newSessions, setNewSessions] = useState('10');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAge, setNewPlayerAge] = useState('');
  const [newPlayerLevel, setNewPlayerLevel] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Programs state
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [progLoading, setProgLoading] = useState(false);
  const [editProgId, setEditProgId] = useState<string | null>(null);
  const [editProg, setEditProg] = useState<Partial<ProgramRow>>({});
  const [progMsg, setProgMsg] = useState('');

  useEffect(() => {
    if (authed) {
      loadPacks();
      loadPrograms();
    }
  }, [authed]);

  async function loadPacks() {
    setLoading(true);
    const res = await fetch('/api/admin/sessions');
    const data = await res.json();
    setPacks(data.packs || []);
    setLoading(false);
  }

  async function loadPrograms() {
    setProgLoading(true);
    const res = await fetch('/api/admin/programs');
    const data = await res.json();
    setPrograms(data.programs || []);
    setProgLoading(false);
  }

  async function markUsed(id: string) {
    await fetch('/api/admin/sessions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'use' }) });
    setMsg('Session marked used.');
    loadPacks();
  }

  async function addSession(id: string) {
    await fetch('/api/admin/sessions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'add' }) });
    setMsg('Session added.');
    loadPacks();
  }

  async function saveEdit(id: string) {
    const updates: Record<string, number> = {};
    if (editTotal !== '') updates.sessions_total = parseInt(editTotal);
    if (editUsed !== '') updates.sessions_used = parseInt(editUsed);
    await fetch('/api/admin/sessions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'set', ...updates }) });
    setMsg('Sessions updated.');
    setEditId(null);
    setEditTotal('');
    setEditUsed('');
    loadPacks();
  }

  async function addCashCustomer() {
    if (!newName || !newEmail || !newProgram || !newSessions) return;
    await fetch('/api/admin/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, email: newEmail, program_name: newProgram, sessions_total: newSessions, player_name: newPlayerName, player_age: newPlayerAge, player_dob: newPlayerDob, player_level: newPlayerLevel, phone: newPhone }),
    });
    setMsg(`${newName} added. A login invite was sent to ${newEmail}.`);
    setShowAdd(false);
    setNewName(''); setNewEmail(''); setNewProgram(''); setNewSessions('10');
    setNewPlayerName(''); setNewPlayerAge(''); setNewPlayerDob(''); setNewPlayerLevel(''); setNewPhone('');
    loadPacks();
  }

  async function deletePack(id: string) {
    if (!confirm('Delete this pack? This cannot be undone.')) return;
    await fetch('/api/admin/sessions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setMsg('Pack deleted.');
    loadPacks();
  }

  async function saveProgram(id: string) {
    const allSessions = (editProg.session_groups ?? []).flatMap(g => g.sessions);
    const currentOverride = editProg.sessions_override;
    const sessionsOverride = (currentOverride && currentOverride.length < allSessions.length) ? currentOverride : null;

    await fetch('/api/admin/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name: editProg.name,
        price: editProg.price,
        dates: editProg.dates,
        times: editProg.times,
        description: editProg.description,
        age_group: editProg.age_group,
        active: editProg.active,
        flyer: editProg.flyer,
        registration_closed: editProg.registration_closed ?? null,
        sessions_override: sessionsOverride ?? null,
      }),
    });
    setProgMsg('Program updated.');
    setEditProgId(null);
    setEditProg({});
    loadPrograms();
  }

  async function toggleActive(prog: ProgramRow) {
    await fetch('/api/admin/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: prog.id, active: !prog.active }),
    });
    setProgMsg(`${prog.name} ${prog.active ? 'hidden' : 'shown'}.`);
    loadPrograms();
  }

  async function toggleRegistrationClosed(prog: ProgramRow) {
    const isClosed = prog.registration_closed === true || (prog.registration_closed === null && prog.registration_closed_default);
    const newValue = isClosed ? null : true;
    await fetch('/api/admin/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: prog.id, registration_closed: newValue }),
    });
    setProgMsg(newValue ? `${prog.name} marked as Full.` : `${prog.name} reopened.`);
    loadPrograms();
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f8fa' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '320px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>Admin Login</h2>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (pw === ADMIN_PASSWORD ? setAuthed(true) : alert('Wrong password'))}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box' }}
          />
          <button
            onClick={() => pw === ADMIN_PASSWORD ? setAuthed(true) : alert('Wrong password')}
            style={{ width: '100%', backgroundColor: '#29ABE2', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  const filtered = packs.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = { padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', width: '100%', boxSizing: 'border-box' as const };

  return (
    <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {(['sessions', 'programs'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setMsg(''); setProgMsg(''); }}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: tab === t ? '#29ABE2' : 'white',
                color: tab === t ? 'white' : '#666',
                boxShadow: tab === t ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
                textTransform: 'capitalize',
              }}
            >
              {t === 'sessions' ? 'Session Packs' : 'Programs'}
            </button>
          ))}
        </div>

        {/* Sessions tab */}
        {tab === 'sessions' && (
          <>
            <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px' }}>Session Packs</h1>
            <p style={{ color: '#777', fontSize: '14px', marginBottom: '24px' }}>Manage customer session balances.</p>

            {msg && (
              <div style={{ backgroundColor: '#e8f7fd', border: '1px solid #29ABE2', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#0093c4' }}>
                {msg}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setShowAdd(s => !s)}
                style={{ backgroundColor: '#29ABE2', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
              >
                + Add Cash Customer
              </button>
              {showAdd && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginTop: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#777', margin: '0 0 4px' }}>PARENT / GUARDIAN</p>
                  <input placeholder="Parent full name *" value={newName} onChange={e => setNewName(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
                  <input placeholder="Email address *" value={newEmail} onChange={e => setNewEmail(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
                  <input placeholder="Phone number" value={newPhone} onChange={e => setNewPhone(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#777', margin: '8px 0 4px' }}>PLAYER</p>
                  <input placeholder="Player full name" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
                  <input placeholder="Player age" value={newPlayerAge} onChange={e => setNewPlayerAge(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
                  <div>
                    <label style={{ fontSize: '12px', color: '#777', display: 'block', marginBottom: '4px' }}>Date of birth</label>
                    <input type="date" value={newPlayerDob} onChange={e => setNewPlayerDob(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <select value={newPlayerLevel} onChange={e => setNewPlayerLevel(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', color: newPlayerLevel ? '#1a1a1a' : '#999' }}>
                    <option value="">Player level</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#777', margin: '8px 0 4px' }}>PROGRAM</p>
                  <select value={newProgram} onChange={e => setNewProgram(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', color: newProgram ? '#1a1a1a' : '#999' }}>
                    <option value="">Select program *</option>
                    <option>1-on-1 Training — 10 Session Package</option>
                    <option>1-on-1 Training — 20 Session Package</option>
                    <option>Group Training — 10 Session Package</option>
                    <option>Group Training — 20 Session Package</option>
                  </select>
                  <input type="number" placeholder="Number of sessions *" value={newSessions} onChange={e => setNewSessions(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <button onClick={addCashCustomer} style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Save & Send Invite</button>
                    <button onClick={() => setShowAdd(false)} style={{ backgroundColor: '#f0f0f0', color: '#666', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', marginBottom: '20px', boxSizing: 'border-box' }}
            />

            {loading ? (
              <p style={{ color: '#aaa', textAlign: 'center' }}>Loading...</p>
            ) : filtered.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center' }}>No packs found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.map(pack => {
                  const remaining = pack.sessions_total - pack.sessions_used;
                  return (
                    <div key={pack.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <p style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '2px' }}>{pack.name}</p>
                        <p style={{ fontSize: '13px', color: '#777' }}>{pack.email}</p>
                        {pack.phone && <p style={{ fontSize: '12px', color: '#777' }}>{pack.phone}</p>}
                        <p style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{pack.program_name}</p>
                        {(pack.player_name || pack.player_age || pack.player_level) && (
                          <p style={{ fontSize: '12px', color: '#29ABE2', marginTop: '4px' }}>
                            Player: {[pack.player_name, pack.player_age ? `age ${pack.player_age}` : '', pack.player_level].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: 'center', minWidth: '80px' }}>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: remaining > 0 ? '#29ABE2' : '#ccc', lineHeight: '1' }}>{remaining}</div>
                        <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>of {pack.sessions_total} left</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => markUsed(pack.id)} disabled={remaining <= 0} style={{ padding: '8px 16px', backgroundColor: remaining > 0 ? '#1a1a1a' : '#f0f0f0', color: remaining > 0 ? 'white' : '#bbb', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: remaining > 0 ? 'pointer' : 'not-allowed' }}>Mark Used</button>
                        <button onClick={() => addSession(pack.id)} style={{ padding: '8px 16px', backgroundColor: '#e8f7fd', color: '#0093c4', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>+ Add</button>
                        <button onClick={() => { setEditId(editId === pack.id ? null : pack.id); setEditTotal(String(pack.sessions_total)); setEditUsed(String(pack.sessions_used)); }} style={{ padding: '8px 16px', backgroundColor: '#f5f0ff', color: '#7c3aed', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => deletePack(pack.id)} style={{ padding: '8px 16px', backgroundColor: '#fff0f0', color: '#e53e3e', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Delete</button>
                      </div>
                      {editId === pack.id && (
                        <div style={{ width: '100%', marginTop: '12px', backgroundColor: '#f5f0ff', borderRadius: '8px', padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed' }}>Total sessions:</label>
                            <input type="number" value={editTotal} onChange={e => setEditTotal(e.target.value)} style={{ width: '70px', padding: '6px 8px', border: '1px solid #c4b5fd', borderRadius: '6px', fontSize: '14px', fontWeight: '700' }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed' }}>Sessions used:</label>
                            <input type="number" value={editUsed} onChange={e => setEditUsed(e.target.value)} style={{ width: '70px', padding: '6px 8px', border: '1px solid #c4b5fd', borderRadius: '6px', fontSize: '14px', fontWeight: '700' }} />
                          </div>
                          <button onClick={() => saveEdit(pack.id)} style={{ padding: '7px 18px', backgroundColor: '#7c3aed', color: 'white', borderRadius: '6px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Save</button>
                          <button onClick={() => setEditId(null)} style={{ padding: '7px 14px', backgroundColor: 'white', color: '#999', borderRadius: '6px', border: '1px solid #ddd', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Programs tab */}
        {tab === 'programs' && (
          <>
            <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px' }}>Programs</h1>
            <p style={{ color: '#777', fontSize: '14px', marginBottom: '24px' }}>Edit program details shown on the booking page. Changes go live immediately.</p>

            {progMsg && (
              <div style={{ backgroundColor: '#e8f7fd', border: '1px solid #29ABE2', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#0093c4' }}>
                {progMsg}
              </div>
            )}

            {progLoading ? (
              <p style={{ color: '#aaa', textAlign: 'center' }}>Loading...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {programs.map(prog => (
                  <div key={prog.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', opacity: prog.active ? 1 : 0.55 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '2px' }}>{prog.name}</p>
                        <p style={{ fontSize: '12px', color: '#aaa', fontFamily: 'monospace' }}>{prog.id}</p>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', color: '#555' }}><strong>${prog.price}</strong></span>
                          {prog.age_group && <span style={{ fontSize: '13px', color: '#888' }}>{prog.age_group}</span>}
                          {prog.dates && <span style={{ fontSize: '13px', color: '#888' }}>{prog.dates}</span>}
                        </div>
                        {prog.times && <p style={{ fontSize: '12px', color: '#aaa', marginTop: '3px' }}>{prog.times}</p>}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {(() => {
                          const isClosed = prog.registration_closed === true || (prog.registration_closed === null && prog.registration_closed_default);
                          return (
                            <button
                              onClick={() => toggleRegistrationClosed(prog)}
                              style={{ padding: '7px 14px', backgroundColor: isClosed ? '#fff0f0' : '#f5f5f5', color: isClosed ? '#e53e3e' : '#aaa', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                            >
                              {isClosed ? 'Full' : 'Open'}
                            </button>
                          );
                        })()}
                        <button
                          onClick={() => toggleActive(prog)}
                          style={{ padding: '7px 14px', backgroundColor: prog.active ? '#f0fdf4' : '#fff0f0', color: prog.active ? '#16a34a' : '#e53e3e', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                        >
                          {prog.active ? 'Visible' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => {
                            setEditProgId(editProgId === prog.id ? null : prog.id);
                            const allSessions = (prog.session_groups ?? []).flatMap(g => g.sessions);
                            setEditProg({
                              name: prog.name, price: prog.price, dates: prog.dates, times: prog.times,
                              description: prog.description, age_group: prog.age_group, active: prog.active, flyer: prog.flyer,
                              registration_closed: prog.registration_closed,
                              registration_closed_default: prog.registration_closed_default,
                              session_groups: prog.session_groups,
                              sessions_override: prog.sessions_override ?? (allSessions.length > 0 ? allSessions : null),
                            });
                          }}
                          style={{ padding: '7px 14px', backgroundColor: '#f5f0ff', color: '#7c3aed', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    {editProgId === prog.id && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Program Name</label>
                            <input value={editProg.name ?? ''} onChange={e => setEditProg(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
                          </div>
                          <div>
                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Price ($)</label>
                            <input type="number" value={editProg.price ?? ''} onChange={e => setEditProg(p => ({ ...p, price: parseFloat(e.target.value) }))} style={inputStyle} />
                          </div>
                          <div>
                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Age Group</label>
                            <input value={editProg.age_group ?? ''} onChange={e => setEditProg(p => ({ ...p, age_group: e.target.value }))} style={inputStyle} placeholder="e.g. Ages 4-12" />
                          </div>
                          <div>
                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Dates</label>
                            <input value={editProg.dates ?? ''} onChange={e => setEditProg(p => ({ ...p, dates: e.target.value }))} style={inputStyle} placeholder="e.g. June 26 – August 8" />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Times</label>
                          <input value={editProg.times ?? ''} onChange={e => setEditProg(p => ({ ...p, times: e.target.value }))} style={inputStyle} placeholder="e.g. Saturdays 9:10AM–9:55AM" />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Description</label>
                          <textarea value={editProg.description ?? ''} onChange={e => setEditProg(p => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Flyer Image URL</label>
                          <input value={editProg.flyer ?? ''} onChange={e => setEditProg(p => ({ ...p, flyer: e.target.value }))} style={inputStyle} placeholder="Paste an image link (Google Drive, Dropbox, etc.)" />
                          {editProg.flyer && (
                            <img src={editProg.flyer} alt="Flyer preview" style={{ marginTop: '8px', maxHeight: '120px', borderRadius: '6px', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
                          )}
                        </div>
                        {(editProg.session_groups?.length ?? 0) > 0 && (() => {
                          const allSessions = (editProg.session_groups ?? []).flatMap(g => g.sessions);
                          const enabledSessions = editProg.sessions_override ?? allSessions;
                          return (
                            <div>
                              <label style={{ fontSize: '11px', fontWeight: '700', color: '#999', textTransform: 'uppercase' as const, display: 'block', marginBottom: '8px' }}>
                                Available Sessions / Weeks
                              </label>
                              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                                {allSessions.map(session => (
                                  <label key={session} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#333' }}>
                                    <input
                                      type="checkbox"
                                      checked={enabledSessions.includes(session)}
                                      onChange={e => {
                                        const current = editProg.sessions_override ?? allSessions;
                                        const updated = e.target.checked
                                          ? [...current.filter(s => s !== session), session]
                                          : current.filter(s => s !== session);
                                        setEditProg(p => ({ ...p, sessions_override: updated.length === allSessions.length ? null : updated }));
                                      }}
                                    />
                                    {session}
                                  </label>
                                ))}
                              </div>
                              {editProg.sessions_override && (
                                <button
                                  onClick={() => setEditProg(p => ({ ...p, sessions_override: null }))}
                                  style={{ marginTop: '8px', fontSize: '12px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                  Reset (enable all)
                                </button>
                              )}
                            </div>
                          );
                        })()}
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => saveProgram(prog.id)} style={{ padding: '9px 20px', backgroundColor: '#29ABE2', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Save Changes</button>
                          <button onClick={() => { setEditProgId(null); setEditProg({}); }} style={{ padding: '9px 16px', backgroundColor: '#f0f0f0', color: '#666', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
