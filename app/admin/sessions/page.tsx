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

const ADMIN_PASSWORD = 'ShootingStars2026!';

export default function AdminSessionsPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
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
  const [newSessions, setNewSessions] = useState('10');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAge, setNewPlayerAge] = useState('');
  const [newPlayerLevel, setNewPlayerLevel] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    if (authed) loadPacks();
  }, [authed]);

  async function loadPacks() {
    setLoading(true);
    const res = await fetch('/api/admin/sessions');
    const data = await res.json();
    setPacks(data.packs || []);
    setLoading(false);
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
      body: JSON.stringify({ name: newName, email: newEmail, program_name: newProgram, sessions_total: newSessions, player_name: newPlayerName, player_age: newPlayerAge, player_level: newPlayerLevel, phone: newPhone }),
    });
    setMsg(`${newName} added. A login invite was sent to ${newEmail}.`);
    setShowAdd(false);
    setNewName(''); setNewEmail(''); setNewProgram(''); setNewSessions('10');
    setNewPlayerName(''); setNewPlayerAge(''); setNewPlayerLevel(''); setNewPhone('');
    loadPacks();
  }

  async function deletePack(id: string) {
    if (!confirm('Delete this pack? This cannot be undone.')) return;
    await fetch('/api/admin/sessions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setMsg('Pack deleted.');
    loadPacks();
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

  return (
    <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
              <select value={newPlayerLevel} onChange={e => setNewPlayerLevel(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', color: newPlayerLevel ? '#1a1a1a' : '#999' }}>
                <option value="">Player level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <p style={{ fontSize: '13px', fontWeight: '700', color: '#777', margin: '8px 0 4px' }}>PROGRAM</p>
              <input placeholder="Program name *" value={newProgram} onChange={e => setNewProgram(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
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
                    <button
                      onClick={() => markUsed(pack.id)}
                      disabled={remaining <= 0}
                      style={{ padding: '8px 16px', backgroundColor: remaining > 0 ? '#1a1a1a' : '#f0f0f0', color: remaining > 0 ? 'white' : '#bbb', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: remaining > 0 ? 'pointer' : 'not-allowed' }}
                    >
                      Mark Used
                    </button>
                    <button
                      onClick={() => addSession(pack.id)}
                      style={{ padding: '8px 16px', backgroundColor: '#e8f7fd', color: '#0093c4', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                    >
                      + Add
                    </button>
                    <button
                      onClick={() => { setEditId(editId === pack.id ? null : pack.id); setEditTotal(String(pack.sessions_total)); setEditUsed(String(pack.sessions_used)); }}
                      style={{ padding: '8px 16px', backgroundColor: '#f5f0ff', color: '#7c3aed', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePack(pack.id)}
                      style={{ padding: '8px 16px', backgroundColor: '#fff0f0', color: '#e53e3e', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
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
      </div>
    </div>
  );
}
