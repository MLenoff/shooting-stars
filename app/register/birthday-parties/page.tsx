import { getProgramsFromSheet } from '@/lib/programs-sheet';
import Link from 'next/link';

export default async function BirthdayPartiesPage() {
  const programs = await getProgramsFromSheet();
  const silver = programs.find(p => p.id === 'birthday-silver');
  const gold = programs.find(p => p.id === 'birthday-gold');

  return (
    <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #1a1200 0%, #3d2b00 100%)',
        padding: '64px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #f9a825, #f57f17)' }} />
        <Link href="/book" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px', textDecoration: 'none' }}>
          ← Back to Programs
        </Link>
        <p style={{ color: '#f9a825', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Shooting Stars
        </p>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '16px', lineHeight: '1.1' }}>
          Birthday Party Packages
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
          Fridays, Saturdays &amp; Sundays. A deposit holds your date. More than 20 kids? $12 per child.
        </p>
      </section>

      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '56px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Silver */}
        {silver && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
            border: '2px solid #bdbdbd',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {silver.flyer && (
              <img src={silver.flyer} alt="Silver Birthday Party" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ display: 'inline-block', backgroundColor: '#f0f0f0', color: '#757575', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Silver Package</span>
                  <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a1a' }}>Silver Birthday Party</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', lineHeight: '1' }}>$485</div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '3px' }}>$156.50 deposit · Price includes 4% service charge</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f7f8fa', borderRadius: '10px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#555', marginBottom: '4px' }}>Available time slots</div>
                {['12:00PM - 2:00PM', '4:00PM - 6:00PM', '6:30PM - 8:30PM'].map(slot => (
                  <div key={slot} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#bdbdbd', flexShrink: 0 }} />
                    {slot}
                  </div>
                ))}
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>Fridays, Saturdays &amp; Sundays</div>
              </div>

              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>{silver.description}</p>

              <Link href="/register/birthday-silver" style={{
                display: 'inline-block',
                backgroundColor: '#757575',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '15px',
                textDecoration: 'none',
              }}>
                Book Silver Package
              </Link>
            </div>
          </div>
        )}

        {/* Gold */}
        {gold && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(245,127,23,0.15)',
            border: '2px solid #f9a825',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {gold.flyer && (
              <img src={gold.flyer} alt="Gold Birthday Party" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ display: 'inline-block', backgroundColor: '#fff8e1', color: '#f57f17', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>★ Gold Package</span>
                  <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a1a' }}>Gold Birthday Party</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', lineHeight: '1' }}>$585</div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '3px' }}>$156.50 deposit · Price includes 4% service charge</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff8e1', borderRadius: '10px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#f57f17', marginBottom: '4px' }}>Available time slots</div>
                {[
                  { label: '12:00PM - 3:00PM', note: 'Sat & Sun only' },
                  { label: '4:00PM - 7:00PM', note: 'Fri, Sat & Sun' },
                  { label: '6:30PM - 9:30PM', note: 'Fri, Sat & Sun' },
                ].map(slot => (
                  <div key={slot.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f9a825', flexShrink: 0 }} />
                    {slot.label}
                    <span style={{ fontSize: '12px', color: '#999' }}>({slot.note})</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>{gold.description}</p>

              <Link href="/register/birthday-gold" style={{
                display: 'inline-block',
                backgroundColor: '#f57f17',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '15px',
                textDecoration: 'none',
              }}>
                Book Gold Package
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
