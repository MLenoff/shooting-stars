import { getProgramsFromSheet } from '@/lib/programs-sheet';
import Link from 'next/link';
import FlyerImage from '../FlyerImage';
import TrainingCard from './TrainingCard';

const typeLabel: Record<string, string> = {
  'one-on-one': '1-on-1',
  'rental': 'Rental',
  'group': 'Group',
  'party': 'Party',
};

function SectionHeader({ title, subtitle, color = '#29ABE2' }: { title: string; subtitle: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid #e8e8e8' }}>
      <div style={{ width: '4px', height: '40px', borderRadius: '2px', backgroundColor: color, flexShrink: 0 }} />
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a1a', margin: 0, letterSpacing: '-0.3px' }}>{title}</h2>
        <p style={{ fontSize: '13px', color: '#999', margin: '3px 0 0', fontWeight: '500' }}>{subtitle}</p>
      </div>
    </div>
  );
}

function ProgramCard({ program }: { program: Awaited<ReturnType<typeof getProgramsFromSheet>>[number] }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
      {program.flyer ? (
        <FlyerImage src={program.flyer} alt={program.name} />
      ) : (
        <div style={{ background: 'linear-gradient(135deg, #29ABE2 0%, #0093c4 100%)', padding: '28px 24px', position: 'relative' }}>
          <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {typeLabel[program.type] || program.type}
          </span>
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', lineHeight: '1.25', marginBottom: '6px' }}>{program.name}</h2>
          {program.ageGroup && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600' }}>{program.ageGroup}</span>}
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
              {program.sessionGroups?.length ? `$${program.pricePerSession}/week` : program.price === 0 ? 'Contact us' : `$${program.price.toFixed(2)}`}
            </span>
            {program.price > 0 && <p style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Price includes 4% service charge</p>}
            {program.spotsAvailable && <p style={{ fontSize: '12px', color: '#e05c2a', fontWeight: '600', marginTop: '2px' }}>{program.spotsAvailable} spots left</p>}
          </div>
          <Link
            href={program.contactUrl || `/register/${program.id}`}
            target={program.contactUrl ? '_blank' : undefined}
            rel={program.contactUrl ? 'noopener noreferrer' : undefined}
            style={{ backgroundColor: program.contactUrl ? '#25D366' : '#29ABE2', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', letterSpacing: '0.3px' }}
          >
            {program.contactUrl ? 'More Info' : 'Book Now'}
          </Link>
        </div>
      </div>
    </div>
  );
}

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' } as const;
const sectionStyle = { marginBottom: '64px' } as const;

export default async function HomePage() {
  const programs = await getProgramsFromSheet();

  const youthIds = ['twinkle-stars', 'little-stars', 'autism-kicks', 'summer-camp-2026'];
  const microSchool = programs.find(p => p.id === 'girls-only-micro-school');
  const hasTrainingPackages = programs.some(p => p.id === 'training-10pack');
  const hasGroupPackages = programs.some(p => p.id === 'group-training-10pack' || p.id === 'group-training-20pack');
  const hasSummerTraining = programs.some(p => p.id === 'summer-training-academy');
  const hasParties = programs.some(p => p.type === 'party');
  const apparel = programs.find(p => p.id === 'dri-fit-apparel');
  const adultPrograms = programs.filter(p => p.id === 'adult-open-play');
  const youthPrograms = programs.filter(p => youthIds.includes(p.id));

  return (
    <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 100%)', padding: '64px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
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

      <section style={{ maxWidth: '1140px', margin: '0 auto', padding: '56px 24px' }}>

        {/* 1. Birthday Parties */}
        {hasParties && (
          <div id="parties" style={sectionStyle}>
            <SectionHeader title="Birthday Parties" subtitle="Silver and Gold packages · Fridays, Saturdays & Sundays" color="#f57f17" />
            <div style={gridStyle}>
              <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
                <FlyerImage src="/birthday.avif" alt="Birthday Parties" />
                <div style={{ background: 'linear-gradient(135deg, #f9a825 0%, #f57f17 100%)', padding: '18px 24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Party</span>
                  <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', lineHeight: '1.25', marginBottom: '4px' }}>Birthday Parties</h2>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: '600' }}>Fridays, Saturdays &amp; Sundays</span>
                </div>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                    Celebrate your birthday at Shooting Stars! Choose Silver (2 hrs) or Gold (3 hrs).
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>Silver Package (2 hrs) — $485</li>
                    <li style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>Gold Package (3 hrs) — $585</li>
                  </ul>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a1a' }}>$156.50 to secure your date</span>
                    </div>
                    <Link href="/register/birthday-parties" style={{ backgroundColor: '#f57f17', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                      View Packages
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Elite Training */}
        {(hasTrainingPackages || hasGroupPackages) && (
          <div id="training" style={sectionStyle}>
            <SectionHeader title="Elite Training" subtitle="Group classes and 1-on-1 sessions for all skill levels" color="#0093c4" />
            <div style={gridStyle}>
              {hasGroupPackages && (
                <TrainingCard
                  title="Elite Group Training Packages"
                  subtitle="Drop-In · 10-Pack · 20-Pack"
                  tag="Group"
                  flyer="/elite-group.avif"
                  days="Monday–Friday"
                  fromPrice="$46.80 per session"
                  options={[
                    { id: 'elite-group-training', name: 'Elite Group Training', description: 'Single drop-in group session. Up to 8 players per session.', price: 46.80, perSession: '$46.80 / session' },
                    { id: 'group-training-10pack', name: '10 Session Package', description: 'Speed, Agility, First Touch, Dribbling, and Tactical play.', price: 416.00, badge: 'Most Popular', perSession: '$41.60 / session' },
                    { id: 'group-training-20pack', name: '20 Session Package', description: 'Best value for serious players. Same full training program.', price: 728.00, badge: 'Best Value', perSession: '$36.40 / session' },
                  ]}
                />
              )}
              {hasTrainingPackages && (
                <TrainingCard
                  title="Individual Training Packages"
                  subtitle="Single · 10-Pack"
                  tag="1-on-1"
                  flyer="/individual.avif"
                  days="Monday–Friday"
                  fromPrice="$78.00 per session"
                  options={[
                    { id: 'individual-training', name: '1-on-1 Individual Training', description: 'Single session with a Shooting Stars trainer.', price: 78.00, perSession: '$78.00 / session' },
                    { id: 'training-10pack', name: '10 Session Package', description: 'Speed, Agility, First Touch, Dribbling, Passing, Tactical, Receiving, and Shooting.', price: 728.00, badge: 'Best Value', perSession: '$72.80 / session' },
                  ]}
                />
              )}
            </div>
          </div>
        )}

        {/* 3. Youth Programs */}
        {youthPrograms.length > 0 && (
          <div id="youth" style={sectionStyle}>
            <SectionHeader title="Youth Programs" subtitle="Classes and camps for players ages 2–15" color="#29ABE2" />
            <div style={gridStyle}>
              {youthPrograms.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </div>
        )}

        {/* 4. Academy */}
        {hasSummerTraining && (
          <div id="academy" style={sectionStyle}>
            <SectionHeader title="Academy" subtitle="Intensive seasonal training programs" color="#29ABE2" />
            <div style={gridStyle}>
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
                      <span style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a' }}>$360.00</span>
                      <p style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Price includes 4% service charge</p>
                    </div>
                    <Link href="/register/summer-training-academy" style={{ backgroundColor: '#29ABE2', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Field Rentals */}
        {adultPrograms.length > 0 && (
          <div id="rentals" style={sectionStyle}>
            <SectionHeader title="Field Rentals" subtitle="Open play and field rentals for adults 18 and up" color="#555" />
            <div style={gridStyle}>
              {adultPrograms.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </div>
        )}

        {/* 6. Apparel */}
        {apparel && (
          <div id="apparel" style={sectionStyle}>
            <SectionHeader title="Apparel" subtitle="Official Shooting Stars gear" color="#1a1a2e" />
            <div style={gridStyle}>
              <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)', padding: '28px 24px', position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src="/logo.avif" alt="Shooting Stars" style={{ height: '64px', width: 'auto', flexShrink: 0 }} />
                  <div>
                    <span style={{ display: 'inline-block', marginBottom: '6px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Apparel</span>
                    <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', lineHeight: '1.25', marginBottom: '4px' }}>Shooting Stars Apparel</h2>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '600' }}>Dri-Fit &amp; Cotton Shirts</span>
                  </div>
                </div>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', flex: 1 }}>
                    Official Shooting Stars dri-fit apparel. Should be worn at all times.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a' }}>$20.80</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#999', marginLeft: '6px' }}>/ $10.40</span>
                      <p style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Dri-fit / Cotton · Price includes 4% service charge</p>
                    </div>
                    <Link href="/register/apparel" style={{ backgroundColor: '#1a1a2e', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. Micro School */}
        {microSchool && (
          <div id="microschool" style={sectionStyle}>
            <SectionHeader title="Girls Only Micro School" subtitle="Academic excellence meets elite soccer development" color="#29ABE2" />
            <div style={gridStyle}>
              <ProgramCard program={microSchool} />
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
