import { getProgramsFromSheet } from '@/lib/programs-sheet';
import Link from 'next/link';
import FlyerImage from '../FlyerImage';

const typeLabel: Record<string, string> = {
  'one-on-one': '1-on-1',
  'rental': 'Rental',
  'group': 'Group',
  'party': 'Party',
};

export default async function HomePage() {
  const programs = await getProgramsFromSheet();

  // Filter out grouped items — parties, training packs, apparel, summer training handled separately
  const excludedIds = ['training-10pack', 'training-20pack', 'dri-fit-apparel', 'summer-training-academy'];
  const mainPrograms = programs.filter(p => p.type !== 'party' && !excludedIds.includes(p.id));
  const hasParties = programs.some(p => p.type === 'party');
  const hasTrainingPackages = programs.some(p => p.id === 'training-10pack' || p.id === 'training-20pack');
  const hasSummerTraining = programs.some(p => p.id === 'summer-training-academy');
  const summerTraining = programs.find(p => p.id === 'summer-training-academy');
  const apparel = programs.find(p => p.id === 'dri-fit-apparel');

  return (
    <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 100%)',
        padding: '64px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #29ABE2, #0093c4)' }} />
        <p style={{ color: '#29ABE2', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Davie, Florida
        </p>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '16px', lineHeight: '1.1' }}>
          Register for a Program
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>
          Pick your program below and book your spot securely online.
        </p>
      </section>

      {/* Programs Grid */}
      <section style={{ maxWidth: '1140px', margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>

          {mainPrograms.map(program => (
            <div key={program.id} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
            }}>
              {program.flyer ? (
                <FlyerImage src={program.flyer} alt={program.name} />
              ) : (
                <div style={{
                  background: 'linear-gradient(135deg, #29ABE2 0%, #0093c4 100%)',
                  padding: '28px 24px',
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}>
                    {typeLabel[program.type] || program.type}
                  </span>
                  <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', lineHeight: '1.25', marginBottom: '6px' }}>
                    {program.name}
                  </h2>
                  {program.ageGroup && (
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600' }}>{program.ageGroup}</span>
                  )}
                </div>
              )}

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {program.flyer && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#1a1a1a' }}>{program.name}</h2>
                    <span style={{ backgroundColor: '#e8f7fd', color: '#29ABE2', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {typeLabel[program.type] || program.type}
                    </span>
                  </div>
                )}

                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', flex: 1 }}>{program.description}</p>

                <div style={{ backgroundColor: '#f7f8fa', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                    <span style={{ color: '#999', minWidth: '44px' }}>Dates</span>
                    <span style={{ color: '#333', fontWeight: '600' }}>{program.dates}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                    <span style={{ color: '#999', minWidth: '44px' }}>Times</span>
                    <span style={{ color: '#333', fontWeight: '600' }}>{program.times}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a' }}>
                      {program.price === 0 ? 'Contact us' : `$${program.price.toFixed(2)}`}
                    </span>
                    {program.price > 0 && (
                      <p style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Price includes 4% service charge</p>
                    )}
                    {program.spotsAvailable && (
                      <p style={{ fontSize: '12px', color: '#e05c2a', fontWeight: '600', marginTop: '2px' }}>
                        {program.spotsAvailable} spots left
                      </p>
                    )}
                  </div>
                  <Link href={program.contactUrl || `/register/${program.id}`} target={program.contactUrl ? '_blank' : undefined} rel={program.contactUrl ? 'noopener noreferrer' : undefined} style={{
                    backgroundColor: program.contactUrl ? '#25D366' : '#29ABE2',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '14px',
                    textDecoration: 'none',
                    letterSpacing: '0.3px',
                  }}>
                    {program.contactUrl ? 'More Info' : 'Book Now'}
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Training Packages card */}
          {hasTrainingPackages && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
              <FlyerImage src="/individual.avif" alt="Individual Training" />
              <div style={{ background: 'linear-gradient(135deg, #29ABE2 0%, #0093c4 100%)', padding: '18px 24px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>1-on-1</span>
                <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', lineHeight: '1.25' }}>Individual Training Packages</h2>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600' }}>Single · 10-Pack · 20-Pack</span>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', flex: 1 }}>
                  1-on-1 sessions with a Shooting Stars trainer. Save more with multi-session packages. Indoor shoes only, no cleats.
                </p>
                <div style={{ backgroundColor: '#f7f8fa', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                    <span style={{ color: '#999', minWidth: '44px' }}>Days</span>
                    <span style={{ color: '#333', fontWeight: '600' }}>Monday–Friday</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                    <span style={{ color: '#999', minWidth: '44px' }}>From</span>
                    <span style={{ color: '#333', fontWeight: '600' }}>$72.80 per session</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a' }}>$72.80+</span>
                    <p style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Price includes 4% service charge</p>
                  </div>
                  <Link href="/register/individual-training-packages" style={{ backgroundColor: '#29ABE2', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                    View Packages
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Apparel card */}
          {apparel && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)', padding: '28px 24px', position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="/logo.avif" alt="Shooting Stars" style={{ height: '64px', width: 'auto', flexShrink: 0 }} />
                <div>
                  <span style={{ display: 'inline-block', marginBottom: '6px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Apparel</span>
                  <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', lineHeight: '1.25', marginBottom: '4px' }}>Shooting Stars Apparel</h2>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '600' }}>Official Dri-Fit Shirt</span>
                </div>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', flex: 1 }}>
                  Official Shooting Stars dri-fit apparel. Should be worn at all times.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a' }}>$20.80</span>
                    <p style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Price includes 4% service charge</p>
                  </div>
                  <Link href="/register/apparel" style={{ backgroundColor: '#1a1a2e', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Summer Training Academy card */}
          {hasSummerTraining && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
              <FlyerImage src="/training.avif" alt="Summer Training Academy" />
              <div style={{ background: 'linear-gradient(135deg, #29ABE2 0%, #0093c4 100%)', padding: '18px 24px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Group</span>
                <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', lineHeight: '1.25', marginBottom: '4px' }}>Shooting Stars Academy Summer Training</h2>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: '600' }}>June 8 – August 6, 2026 · Ages U5–U12</span>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  Intensive summer training for players ages 4–12. Choose your age group and pick your sessions.
                </p>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>U6 &amp; Under (U5, U6) — Tue &amp; Thu 5:30–6:30PM</li>
                  <li style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>U7–U9 (U7, U8, U9) — Mon &amp; Wed 6:30–7:30PM</li>
                  <li style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>U10 &amp; Up (U10, U11, U12) — Mon &amp; Wed 6:30–7:30PM</li>
                </ul>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a' }}>$20/session</span>
                    <p style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Price includes 4% service charge</p>
                  </div>
                  <Link href="/register/summer-training-academy" style={{ backgroundColor: '#29ABE2', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Birthday Parties card */}
          {hasParties && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
              <FlyerImage src="/birthday.avif" alt="Birthday Parties" />
              <div style={{ background: 'linear-gradient(135deg, #f9a825 0%, #f57f17 100%)', padding: '18px 24px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Party</span>
                <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', lineHeight: '1.25', marginBottom: '4px' }}>Birthday Parties</h2>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: '600' }}>Fridays, Saturdays &amp; Sundays</span>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  Celebrate your birthday at Shooting Stars! Choose Silver (2 hrs) or Gold (3 hrs). More than 20 kids? $12 per child.
                </p>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>Silver Package (2 hrs) — 12–2PM, 4–6PM, or 6:30–8:30PM</li>
                  <li style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>Gold Package (3 hrs) — 12–3PM (Sat &amp; Sun), 4–7PM, or 6:30–9:30PM</li>
                </ul>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a' }}>$485+</span>
                    <p style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>$156.50 deposit · Price includes 4% service charge</p>
                  </div>
                  <Link href="/register/birthday-parties" style={{ backgroundColor: '#f57f17', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                    View Packages
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
