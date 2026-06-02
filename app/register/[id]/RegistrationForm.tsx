'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/lib/programs';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  smsConsent: boolean;
  // Waiver
  playerFirstName: string;
  playerLastName: string;
  playerDob: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  waiverPhone: string;
  waiverEmail: string;
  waiverDate: string;
  agreeToWaiver: boolean;
  // Minor section
  isUnder18: boolean;
  minorName: string;
  guardianSignature: string;
  guardianPrintName: string;
  guardianDate: string;
  // Terms & child info
  agreeToTerms: boolean;
  childName: string;
  childDob: string;
  accommodations: string;
  shirtSize: string;
}

const initialForm: FormData = {
  firstName: '', lastName: '', phone: '', email: '', smsConsent: false,
  playerFirstName: '', playerLastName: '', playerDob: '', address: '', city: '', state: '', zip: '',
  waiverPhone: '', waiverEmail: '', waiverDate: new Date().toISOString().substring(0, 10), agreeToWaiver: false,
  isUnder18: false, minorName: '', guardianSignature: '', guardianPrintName: '', guardianDate: '',
  agreeToTerms: false, childName: '', childDob: '', accommodations: '', shirtSize: '',
};

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').substring(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidCity(city: string): boolean {
  return /^[a-zA-Z\s'-]+$/.test(city);
}

function isValidState(state: string): boolean {
  return /^[A-Z]{2}$/.test(state);
}

function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

// Birthday party date picker component
function DatePicker({ program, onSelect }: { program: Program; onSelect: (date: string) => void }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/availability?programId=${program.id}&month=${monthKey}`)
      .then(r => r.json())
      .then(d => setBookedDates(d.bookedDates || []))
      .catch(() => setBookedDates([]))
      .finally(() => setLoading(false));
  }, [monthKey, program.id]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const dayNumMap: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
  };
  const availableDayNums = (program.availableDays || []).map(d => dayNumMap[d]);

  function isAvailable(day: number) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (date < today) return false;
    if (!availableDayNums.includes(date.getDay())) return false;
    const dateStr = date.toISOString().substring(0, 10);
    return !bookedDates.includes(dateStr);
  }

  function getDateStr(day: number) {
    return `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function formatDateStr(dateStr: string) {
    const [y, m, d] = dateStr.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} style={{ background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>←</button>
        <span style={{ fontWeight: '700', fontSize: '15px' }}>{monthName}</span>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} style={{ background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>→</button>
      </div>

      {loading && <p style={{ textAlign: 'center', fontSize: '13px', color: '#aaa' }}>Checking availability...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ fontSize: '11px', fontWeight: '700', color: '#aaa', paddingBottom: '6px' }}>{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = getDateStr(day);
          const available = isAvailable(day);
          const isSelected = selected === dateStr;
          return (
            <button
              key={day}
              disabled={!available}
              onClick={() => {
                setSelected(dateStr);
                onSelect(dateStr);
              }}
              style={{
                padding: '8px 4px',
                borderRadius: '6px',
                fontSize: '13px',
                border: isSelected ? '2px solid #29ABE2' : '1px solid transparent',
                backgroundColor: isSelected ? '#e8f7fd' : available ? 'white' : '#f5f5f5',
                color: available ? '#1a1a1a' : '#ccc',
                cursor: available ? 'pointer' : 'not-allowed',
                fontWeight: isSelected ? '700' : '400',
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selected && (
        <div style={{ marginTop: '12px', backgroundColor: '#e8f7fd', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#29ABE2' }}>Selected: {formatDateStr(selected)}</p>
        </div>
      )}
    </div>
  );
}

export default function RegistrationForm({ program }: { program: Program }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const el = document.getElementById('static-program-price');
    if (!el) return;
    el.style.display = selectedSessions.length > 0 ? 'none' : '';
  }, [selectedSessions]);

  const isKidsProgram = !program.adultOnly;
  const isParty = program.type === 'party';
  const hasTimeSlots = !!(program.timeSlots?.length);
  const hasSessionGroups = !!(program.sessionGroups?.length);
  const totalSteps = (isParty || hasTimeSlots || hasSessionGroups) ? 4 : 3;

  const dynamicPrice = hasSessionGroups && program.pricePerSession
    ? program.pricePerSession * selectedSessions.length
    : (program.deposit ?? program.price);

  // For individual training: Tue & Thu only have the 4:30 slot
  const isIndividualTraining = ['individual-training', 'training-10pack', 'training-20pack'].includes(program.id);
  const availableTimeSlots = (() => {
    if (!isIndividualTraining || !selectedDate || !program.timeSlots) return program.timeSlots || [];
    const day = new Date(selectedDate + 'T12:00:00').getDay(); // 2=Tue, 4=Thu
    if (day === 2 || day === 4) return program.timeSlots.filter(s => s.startsWith('4:30'));
    return program.timeSlots;
  })();
  const showShirtSize = ['autism-kicks', 'summer-camp-2026', 'twinkle-little-stars', 'summer-training-academy'].includes(program.id);

  function update(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program, form, selectedDate, selectedTimeSlot, selectedSessions }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '15px', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px', fontWeight: '600', color: '#333',
    display: 'block', marginBottom: '6px',
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: '0',
  };

  const step1Title = isKidsProgram
    ? 'Your Information (Parent or Guardian if registering a child under 18)'
    : 'Your Information';

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '28px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            backgroundColor: i + 1 <= step ? '#29ABE2' : '#e0e0e0',
          }} />
        ))}
      </div>

      {/* STEP 1 — Your Information */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '700', lineHeight: '1.4' }}>{step1Title}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>First name <span style={{ color: 'red' }}>*</span></label>
              <input style={inputStyle} value={form.firstName} onChange={e => update('firstName', e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Last name <span style={{ color: 'red' }}>*</span></label>
              <input style={inputStyle} value={form.lastName} onChange={e => update('lastName', e.target.value)} />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Phone <span style={{ color: 'red' }}>*</span></label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
              <span style={{ padding: '10px 12px', backgroundColor: '#f5f5f5', borderRight: '1px solid #ddd', fontSize: '14px', color: '#555', whiteSpace: 'nowrap' }}>🇺🇸 +1</span>
              <input
                style={{ ...inputStyle, border: 'none', borderRadius: 0 }}
                type="tel"
                placeholder="(954) 000-0000"
                value={form.phone}
                onChange={e => update('phone', formatPhone(e.target.value))}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Email <span style={{ color: 'red' }}>*</span></label>
            <input style={inputStyle} type="email" value={form.email} onChange={e => update('email', e.target.value)} />
          </div>

          <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', fontSize: '13px', color: '#555', lineHeight: '1.6', backgroundColor: '#f9f9f9', padding: '14px', borderRadius: '8px' }}>
            <input type="checkbox" checked={form.smsConsent} onChange={e => update('smsConsent', e.target.checked)} style={{ marginTop: '2px', width: '16px', height: '16px', flexShrink: 0 }} />
            <span>By checking, you accept our Terms of Service, acknowledge that you have read and understood our Privacy Policy and consent to receive SMS communications about your appointments and waitlist availability from Shooting Stars Indoor Soccer. Message frequency may vary. Message and data rates may apply. Reply HELP for help or STOP to opt-out.</span>
          </label>

          <button
            onClick={() => {
              if (!form.firstName || !form.lastName || !form.phone || !form.email) {
                setError('Please fill in all required fields.'); return;
              }
              if (!isValidEmail(form.email)) {
                setError('Please enter a valid email address.'); return;
              }
              if (!form.smsConsent) {
                setError('You must agree to the terms and SMS consent to continue.'); return;
              }
              setError('');
              setStep(2);
            }}
            style={{ backgroundColor: '#29ABE2', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer', width: '100%' }}
          >
            Continue
          </button>
          {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
        </div>
      )}

      {/* STEP 2 — Session Group Picker (summer training academy) */}
      {step === 2 && hasSessionGroups && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Select Your Group & Sessions</h2>

          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '12px' }}>Choose your age group <span style={{ color: 'red' }}>*</span></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {program.sessionGroups?.map(group => (
                <button
                  key={group.label}
                  onClick={() => {
                    setSelectedGroup(group.label);
                    setSelectedSessions([...group.sessions]);
                  }}
                  style={{
                    padding: '14px 18px', borderRadius: '10px', textAlign: 'left',
                    border: selectedGroup === group.label ? '2px solid #29ABE2' : '2px solid #e0e0e0',
                    backgroundColor: selectedGroup === group.label ? '#e8f7fd' : 'white',
                    color: selectedGroup === group.label ? '#0093c4' : '#333',
                    fontWeight: selectedGroup === group.label ? '700' : '500',
                    fontSize: '15px', cursor: 'pointer',
                  }}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>

          {selectedGroup && (() => {
            const group = program.sessionGroups?.find(g => g.label === selectedGroup);
            const allSessions = group?.sessions || [];
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                    Select sessions to attend <span style={{ color: 'red' }}>*</span>
                  </p>
                  <button
                    onClick={() => setSelectedSessions(selectedSessions.length === allSessions.length ? [] : [...allSessions])}
                    style={{ fontSize: '13px', color: '#29ABE2', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                  >
                    {selectedSessions.length === allSessions.length ? 'Deselect all' : 'Select all'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '12px' }}>
                  {allSessions.map(session => (
                    <label key={session} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#333' }}>
                      <input
                        type="checkbox"
                        checked={selectedSessions.includes(session)}
                        onChange={e => {
                          if (e.target.checked) setSelectedSessions(prev => [...prev, session]);
                          else setSelectedSessions(prev => prev.filter(s => s !== session));
                        }}
                        style={{ width: '16px', height: '16px', flexShrink: 0 }}
                      />
                      {session}
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: '12px', backgroundColor: '#e8f7fd', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#555' }}>{selectedSessions.length} of {allSessions.length} sessions selected</span>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#0093c4' }}>${(selectedSessions.length * (program.pricePerSession || 0)).toFixed(2)}</span>
                </div>
              </div>
            );
          })()}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, backgroundColor: '#f0f0f0', color: '#333', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}>Back</button>
            <button
              onClick={() => {
                if (!selectedGroup) { setError('Please select an age group.'); return; }
                if (selectedSessions.length === 0) { setError('Please select at least one session.'); return; }
                setError('');
                setStep(3);
              }}
              style={{ flex: 2, backgroundColor: '#29ABE2', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}
            >
              Continue
            </button>
          </div>
          {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
        </div>
      )}

      {/* STEP 2 — Session Picker (elite group training / programs with time slots) */}
      {step === 2 && hasTimeSlots && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Select Your Class</h2>

          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '12px' }}>Choose a time slot <span style={{ color: 'red' }}>*</span></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {availableTimeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    border: selectedTimeSlot === slot ? '2px solid #29ABE2' : '2px solid #e0e0e0',
                    backgroundColor: selectedTimeSlot === slot ? '#e8f7fd' : 'white',
                    color: selectedTimeSlot === slot ? '#0093c4' : '#333',
                    fontWeight: selectedTimeSlot === slot ? '700' : '500',
                    fontSize: '15px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Choose a date <span style={{ color: 'red' }}>*</span></p>
            <p style={{ fontSize: '13px', color: '#777', marginBottom: '12px' }}>Monday through Friday only. Grayed-out dates are already booked.</p>
            <DatePicker program={program} onSelect={(date) => {
              setSelectedDate(date);
              // Clear time slot if it's no longer valid for the new day
              if (isIndividualTraining && selectedTimeSlot) {
                const day = new Date(date + 'T12:00:00').getDay();
                if ((day === 2 || day === 4) && !selectedTimeSlot.startsWith('4:30')) {
                  setSelectedTimeSlot('');
                }
              }
            }} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, backgroundColor: '#f0f0f0', color: '#333', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}>Back</button>
            <button
              onClick={() => {
                if (!selectedTimeSlot) { setError('Please select a time slot.'); return; }
                if (!selectedDate) { setError('Please select a date.'); return; }
                setError('');
                setStep(3);
              }}
              style={{ flex: 2, backgroundColor: '#29ABE2', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}
            >
              Continue
            </button>
          </div>
          {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
        </div>
      )}

      {/* STEP 2 — Date Picker (birthday parties without time slots — legacy fallback) */}
      {step === 2 && isParty && !hasTimeSlots && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Select Your Date</h2>
          <p style={{ fontSize: '13px', color: '#777' }}>Available days are highlighted. Grayed-out dates are unavailable or already booked.</p>
          <DatePicker program={program} onSelect={setSelectedDate} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, backgroundColor: '#f0f0f0', color: '#333', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}>Back</button>
            <button
              onClick={() => {
                if (!selectedDate) { setError('Please select a date.'); return; }
                setError('');
                setStep(3);
              }}
              style={{ flex: 2, backgroundColor: '#29ABE2', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}
            >
              Continue
            </button>
          </div>
          {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
        </div>
      )}

      {/* STEP 2 (non-party/no-slots/no-groups) or STEP 3 (party, time slots, or session groups) — Waiver */}
      {((step === 2 && !isParty && !hasTimeSlots && !hasSessionGroups) || (step === 3 && (isParty || hasTimeSlots || hasSessionGroups))) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Release & Waiver</h2>

          {/* Full waiver text */}
          <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', fontSize: '12px', color: '#555', lineHeight: '1.8', maxHeight: '280px', overflowY: 'auto' }}>
            <p style={{ marginBottom: '8px' }}>In consideration of participating in the sport of soccer, and for other good and valuable consideration, I hereby agree to release and discharge from liability Shooting Stars Indoor Soccer Center/Facility and its owners, directors, officers, employees, agents, volunteers, and all other persons or entities acting for them (hereinafter collectively referred to as "Releasees"), on behalf of myself and my children, parents, heirs, assigns, personal representative and estate, and also agree as follows:</p>
            <p style={{ marginBottom: '8px' }}><strong>1.</strong> I acknowledge that the sport of soccer involves known and unanticipated risks which could result in physical or emotional injury, paralysis or permanent disability, death, and property damage. Risks include, but are not limited to, broken bones, torn ligaments, bruises, and other bodily injuries caused by contact with soccer balls, other participants, structures like goals, or spectators or other obstacles on the sidelines, or caused by uneven ground; medical conditions resulting from physical activity; and damaged clothing or other property.</p>
            <p style={{ marginBottom: '8px' }}><strong>2.</strong> I expressly accept and assume all of the risks inherent in this activity or that might have been caused by the Releasees. My participation in this activity is purely voluntary and I elect to participate despite the risks. In addition, if at any time I believe that event conditions are unsafe or that I am unable to participate due to physical or medical conditions, then I will immediately discontinue participation.</p>
            <p style={{ marginBottom: '8px' }}><strong>3.</strong> I hereby voluntarily release, forever discharge, and agree to indemnify and hold harmless Releasees from any and all claims, demands, or causes of action which are in any way connected with my participation in this activity, or my use of their equipment or facilities, arising. This release does not apply to claims arising from intentional conduct.</p>
            <p style={{ marginBottom: '8px' }}><strong>4.</strong> I represent that I have adequate insurance to cover any injury or damage I may suffer or cause while participating in this activity, or else I agree to bear the costs of such injury or damage myself.</p>
            <p style={{ marginBottom: '8px' }}><strong>5.</strong> In the event that I file a lawsuit, I agree to do so solely in the state where the facility is located, and I further agree that the substantive law of that state shall apply.</p>
            <p style={{ marginBottom: '8px' }}><strong>6.</strong> I agree that if any portion of this agreement is found to be void or unenforceable, the remaining portions shall remain in full force and effect.</p>
            <p><strong>7.</strong> I hereby give permission for images of my child, captured during play in this facility through video, photo and digital camera, to be used solely for the purposes of Shooting Stars Indoor Soccer Center/Facility promotional material and publications, and waive any rights of compensation and ownership thereto.</p>
          </div>

          <p style={{ fontSize: '13px', fontWeight: '700', color: '#333' }}>By signing this document, I agree that if I am hurt or my property is damaged during my participation in this activity, then I may be found by a court of law to have waived my right to maintain a lawsuit against the parties being released on the basis of any claim for negligence.</p>

          <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.7' }}>I have had sufficient time to read this entire document and, should I choose to do so, consult with legal counsel prior to signing. Also, I understand that this activity might not be made available to me or that the cost to engage in this activity would be significantly greater if I were to choose not to sign this release, and agree that the opportunity to participate at the stated cost in return for the execution of this release is a reasonable bargain.</p>

          <p style={{ fontSize: '13px', fontWeight: '700', color: '#333' }}>I have read and understood this document and I agree to be bound by its terms.</p>

          {/* Signature + Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'end' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Signature (type your full name) <span style={{ color: 'red' }}>*</span></label>
              <input
                style={{ ...inputStyle, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '18px', color: '#1a1a1a', borderBottom: '2px solid #333', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, padding: '8px 4px', backgroundColor: '#fafafa' }}
                placeholder="Sign here"
                value={form.guardianSignature}
                onChange={e => update('guardianSignature', e.target.value)}
              />
              {form.guardianSignature && (
                <p style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>Signed digitally by: {form.guardianSignature}</p>
              )}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Date</label>
              <div style={{ ...inputStyle, backgroundColor: '#f5f5f5', color: '#555' }}>
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Player info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Player First Name <span style={{ color: 'red' }}>*</span></label>
              <input style={inputStyle} value={form.playerFirstName} onChange={e => update('playerFirstName', e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Player Last Name <span style={{ color: 'red' }}>*</span></label>
              <input style={inputStyle} value={form.playerLastName} onChange={e => update('playerLastName', e.target.value)} />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Player Date of Birth <span style={{ color: 'red' }}>*</span></label>
            <input style={inputStyle} type="date" value={form.playerDob} onChange={e => update('playerDob', e.target.value)} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Address <span style={{ color: 'red' }}>*</span></label>
            <input style={inputStyle} value={form.address} onChange={e => update('address', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>City <span style={{ color: 'red' }}>*</span></label>
              <input
                style={inputStyle}
                value={form.city}
                onChange={e => {
                  const val = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
                  update('city', val);
                }}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>State <span style={{ color: 'red' }}>*</span></label>
              <input
                style={inputStyle}
                maxLength={2}
                placeholder="FL"
                value={form.state}
                onChange={e => update('state', e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>ZIP <span style={{ color: 'red' }}>*</span></label>
              <input
                style={inputStyle}
                maxLength={5}
                placeholder="33324"
                value={form.zip}
                onChange={e => update('zip', e.target.value.replace(/\D/g, '').substring(0, 5))}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Telephone <span style={{ color: 'red' }}>*</span></label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
              <span style={{ padding: '10px 12px', backgroundColor: '#f5f5f5', borderRight: '1px solid #ddd', fontSize: '14px', color: '#555', whiteSpace: 'nowrap' }}>🇺🇸 +1</span>
              <input
                style={{ ...inputStyle, border: 'none', borderRadius: 0 }}
                type="tel"
                placeholder="(954) 000-0000"
                value={form.waiverPhone}
                onChange={e => update('waiverPhone', formatPhone(e.target.value))}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Email <span style={{ color: 'red' }}>*</span></label>
            <input style={inputStyle} type="email" value={form.waiverEmail} onChange={e => update('waiverEmail', e.target.value)} />
          </div>


          <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', fontSize: '14px', color: '#333' }}>
            <input type="checkbox" checked={form.agreeToWaiver} onChange={e => update('agreeToWaiver', e.target.checked)} style={{ marginTop: '2px', width: '16px', height: '16px', flexShrink: 0 }} />
            <span>I have read and understood this document and I agree to be bound by its terms. <span style={{ color: 'red' }}>*</span></span>
          </label>

          {/* Minor / Parent Guardian section */}
          <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '20px' }}>
            <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>
              <input type="checkbox" checked={form.isUnder18} onChange={e => update('isUnder18', e.target.checked)} style={{ width: '16px', height: '16px' }} />
              This registration is for a participant under the age of 18
            </label>

            {form.isUnder18 && (
              <div style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#333' }}>PARENT OR GUARDIAN ADDITIONAL AGREEMENT</p>
                <p style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>
                  In consideration of <strong>{form.playerFirstName} {form.playerLastName}</strong> being permitted to participate in this activity, I further agree to indemnify and hold harmless Releasees from any claims alleging negligence which are brought by or on behalf of the minor or are in any way connected with such participation by the minor.
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setStep((isParty || hasTimeSlots || hasSessionGroups) ? 2 : 1)} style={{ flex: 1, backgroundColor: '#f0f0f0', color: '#333', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}>Back</button>
            <button
              onClick={() => {
                if (!form.guardianSignature) { setError('Please sign the waiver.'); return; }
                if (!form.playerFirstName || !form.playerLastName) { setError('Please enter the player\'s first and last name.'); return; }
                if (!form.playerDob) { setError('Please enter a valid player date of birth. Make sure the date is correct (e.g. April has only 30 days).'); return; }
                if (!form.address) { setError('Please enter your address.'); return; }
                if (!form.city || !form.state || !form.zip) { setError('Please enter your city, state, and ZIP.'); return; }
                if (!isValidCity(form.city)) { setError('City must contain letters only.'); return; }
                if (!isValidState(form.state)) { setError('State must be 2 letters (e.g. FL).'); return; }
                if (!isValidZip(form.zip)) { setError('ZIP must be 5 digits.'); return; }
                if (!form.waiverPhone) { setError('Please enter your telephone number.'); return; }
                if (!form.waiverEmail) { setError('Please enter your email address.'); return; }
                if (!isValidEmail(form.waiverEmail)) { setError('Please enter a valid email address.'); return; }
                if (!form.agreeToWaiver) { setError('You must agree to the waiver to continue.'); return; }
                setError('');
                setStep((isParty || hasTimeSlots || hasSessionGroups) ? 4 : 3);
              }}
              style={{ flex: 2, backgroundColor: '#29ABE2', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}
            >
              Continue
            </button>
          </div>
          {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
        </div>
      )}

      {/* STEP 3 (non-party/no-slots/no-groups) or STEP 4 (party, time slots, or session groups) — Terms & Child Info */}
      {((step === 3 && !isParty && !hasTimeSlots && !hasSessionGroups) || (step === 4 && (isParty || hasTimeSlots || hasSessionGroups))) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Terms & Conditions</h2>

          <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#555', lineHeight: '1.7' }}>
            <p><strong>No shows will forfeit their full amount paid.</strong></p>
            <p style={{ marginTop: '8px' }}>By checking the box below, I agree to release Shooting Stars Indoor Soccer from any liability or injury while participating in our classes.</p>
          </div>

          <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', fontSize: '14px', color: '#333' }}>
            <input type="checkbox" checked={form.agreeToTerms} onChange={e => update('agreeToTerms', e.target.checked)} style={{ marginTop: '2px', width: '16px', height: '16px', flexShrink: 0 }} />
            I have read and agree to the terms above <span style={{ color: 'red' }}>*</span>
          </label>

          <div style={fieldStyle}>
            <label style={labelStyle}>Child's name <span style={{ color: 'red' }}>*</span></label>
            <input style={{ ...inputStyle, backgroundColor: '#f5f5f5' }} value={`${form.playerFirstName} ${form.playerLastName}`.trim() || form.childName} onChange={e => update('childName', e.target.value)} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Child's date of birth <span style={{ color: 'red' }}>*</span></label>
            <input style={{ ...inputStyle, backgroundColor: '#f5f5f5' }} type="date" value={form.playerDob || form.childDob} onChange={e => update('childDob', e.target.value)} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Does the child need any accommodations?</label>
            <input style={inputStyle} placeholder="Optional" value={form.accommodations} onChange={e => update('accommodations', e.target.value)} />
          </div>

          {showShirtSize && (
            <div style={fieldStyle}>
              <label style={labelStyle}>Child's shirt size</label>
              <select style={inputStyle} value={form.shirtSize} onChange={e => update('shirtSize', e.target.value)}>
                <option value="">Select size</option>
                <option>YXS (Youth Extra Small)</option>
                <option>YS (Youth Small)</option>
                <option>YM (Youth Medium)</option>
                <option>YL (Youth Large)</option>
                <option>S (Adult Small)</option>
                <option>M (Adult Medium)</option>
                <option>L (Adult Large)</option>
                <option>XL (Adult XL)</option>
              </select>
            </div>
          )}

          <div style={{ backgroundColor: '#f7f8fa', borderRadius: '10px', padding: '14px 16px', fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
            <strong style={{ color: '#333' }}>Note:</strong> Prices include a 4% service charge.
            {isParty && (
              <span> Once your deposit is paid, our team will call you to confirm your party details.</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setStep((isParty || hasTimeSlots || hasSessionGroups) ? 3 : 2)} style={{ flex: 1, backgroundColor: '#f0f0f0', color: '#333', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}>Back</button>
            <button
              onClick={() => {
                const effectiveChildName = `${form.playerFirstName} ${form.playerLastName}`.trim() || form.childName;
                const effectiveChildDob = form.playerDob || form.childDob;
                if (!form.agreeToTerms || !effectiveChildName || !effectiveChildDob) {
                  setError('Please fill in all required fields and agree to the terms.'); return;
                }
                setError('');
                handleSubmit();
              }}
              disabled={loading}
              style={{ flex: 2, backgroundColor: loading ? '#aaa' : '#29ABE2', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Processing...' : `Continue to Payment — $${dynamicPrice.toFixed(2)}`}
            </button>
          </div>
          {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}
