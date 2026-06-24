import { getProgramsFromSheet } from '@/lib/programs-sheet';
import Link from 'next/link';

export default async function GroupTrainingPackagesPage() {
  const programs = await getProgramsFromSheet();
  const dropIn = programs.find(p => p.id === 'elite-group-training');
  const packages = [
    dropIn,
    programs.find(p => p.id === 'group-training-10pack'),
    programs.find(p => p.id === 'group-training-20pack'),
  ].filter(Boolean);

  const perSession: Record<string, string> = {
    'elite-group-training': '$46.80 / session',
    'group-training-10pack': '$41.60 / session',
    'group-training-20pack': '$36.40 / session',
  };

  const highlight: Record<string, string | undefined> = {
    'elite-group-training': undefined,
    'group-training-10pack': 'Most Popular',
    'group-training-20pack': 'Best Value',
  };

  return (
    <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>

      <section style={{
        background: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 100%)',
        padding: '64px 24px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #29ABE2, #0093c4)' }} />
        <Link href="/book" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', display: 'inline-block', marginBottom: '20px', textDecoration: 'none' }}>
          ← Back to Programs
        </Link>
        <p style={{ color: '#29ABE2', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Group Training</p>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', marginBottom: '16px', lineHeight: '1.1' }}>
          Choose Your Package
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', maxWidth: '480px', margin: '0 auto' }}>
          High-level group training sessions. Must cancel 24 hours in advance or forfeit session.
        </p>
      </section>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {packages.map(pkg => {
            if (!pkg) return null;
            const badge = highlight[pkg.id];
            return (
              <div key={pkg.id} style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: badge ? '0 4px 24px rgba(41,171,226,0.15)' : '0 4px 20px rgba(0,0,0,0.07)',
                border: badge ? '2px solid #29ABE2' : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                padding: '28px 32px',
                gap: '24px',
                position: 'relative',
              }}>
                {badge && (
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '24px',
                    backgroundColor: '#29ABE2',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '4px 12px',
                    borderRadius: '0 0 8px 8px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}>
                    {badge}
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a', marginBottom: '6px' }}>{pkg.name}</h2>
                  <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.5' }}>{pkg.description}</p>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', lineHeight: '1' }}>
                    ${pkg.price.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#29ABE2', fontWeight: '600', marginTop: '4px' }}>
                    {perSession[pkg.id]}
                  </div>
                  <Link href={`/register/${pkg.id}`} style={{
                    display: 'inline-block',
                    marginTop: '14px',
                    backgroundColor: '#29ABE2',
                    color: 'white',
                    padding: '11px 24px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '14px',
                    textDecoration: 'none',
                  }}>
                    Book Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
