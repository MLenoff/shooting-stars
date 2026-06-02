import { getProgramsFromSheet } from '@/lib/programs-sheet';
import { notFound } from 'next/navigation';
import RegistrationForm from './RegistrationForm';

export default async function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const programs = await getProgramsFromSheet();
  const program = programs.find(p => p.id === id);
  if (!program) return notFound();

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Program summary card */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#29ABE2', padding: '20px 24px' }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600', display: 'inline-block', marginBottom: '10px' }}>← Back to Programs</a>
            <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '800', lineHeight: '1.3' }}>{program.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: '6px' }}>
              {program.dates} | {program.times}
            </p>
          </div>
          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#777' }}>{program.description}</p>
              {program.ageGroup && <p style={{ fontSize: '13px', color: '#29ABE2', fontWeight: '600', marginTop: '4px' }}>{program.ageGroup}</p>}
            </div>
            <div style={{ textAlign: 'right', marginLeft: '16px', flexShrink: 0 }}>
              <p style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a' }}>
                {program.pricePerSession ? `$${program.pricePerSession}/session` : program.price === 0 ? 'TBD' : `$${program.price.toFixed(2)}`}
              </p>
              {program.deposit && program.price !== program.deposit && (
                <p style={{ fontSize: '12px', color: '#777' }}>${program.deposit.toFixed(2)} deposit</p>
              )}
            </div>
          </div>
        </div>

        {/* Session schedule for group programs */}
        {program.sessions && program.sessions.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Session Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {program.sessions.map((s, i) => (
                <p key={i} style={{ fontSize: '14px', color: '#555', borderBottom: '1px solid #f5f5f5', paddingBottom: '6px' }}>{s}</p>
              ))}
            </div>
          </div>
        )}

        {/* Registration form */}
        <RegistrationForm program={program} />
      </div>
    </div>
  );
}
