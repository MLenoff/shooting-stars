import Link from 'next/link';
import { getProgramsFromSheet } from '@/lib/programs-sheet';
import FlyerImage from './FlyerImage';

const stats = [
  { value: '250+', label: 'Google Reviews' },
  { value: 'Year-Round', label: 'Programs' },
  { value: 'Davie, FL', label: 'South Florida' },
];

const events = [
  { title: 'Birthday Parties', desc: 'Celebrate at Shooting Stars! Silver & Gold packages with a personal party coordinator, turf arena, large party room, and more.', href: '/events', color: '#f57f17' },
  { title: 'Parents Night Out', desc: 'Drop off your kids, enjoy your evening. They play games and watch movies while you get a night to yourselves.', href: '/events', color: '#29ABE2' },
  { title: 'Corporate Events', desc: 'Team building and recreational activities in our air-conditioned indoor facility. Perfect for any group size.', href: '/events', color: '#1a2744' },
];

const typeLabel: Record<string, string> = {
  'one-on-one': '1-on-1', 'rental': 'Rental', 'group': 'Group', 'party': 'Party',
};

export default async function HomePage() {
  const allPrograms = await getProgramsFromSheet();
  const excludedIds = ['training-10pack', 'training-20pack', 'dri-fit-apparel', 'birthday-silver', 'birthday-gold'];
  const mainPrograms = allPrograms.filter(p => !excludedIds.includes(p.id) && p.type !== 'party');
  const hasParties = allPrograms.some(p => p.id === 'birthday-silver' || p.id === 'birthday-gold');
  const hasTraining = allPrograms.some(p => p.id === 'training-10pack' || p.id === 'training-20pack');
  const apparel = allPrograms.find(p => p.id === 'dri-fit-apparel');

  return (
    <div style={{ backgroundColor: '#f7f8fa' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #0a0f1e 0%, #0d1b2e 50%, #1a2744 100%)',
        padding: 'clamp(64px, 10vw, 120px) 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #29ABE2, #0093c4)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 60% 50%, rgba(41,171,226,0.08) 0%, transparent 70%)' }} />

        <div style={{ position: 'relative', maxWidth: '760px', margin: '0 auto' }}>
          <p style={{ color: '#29ABE2', fontSize: '12px', fontWeight: '800', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px' }}>
            Davie, Florida
          </p>
          <h1 style={{ color: 'white', fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: '900', lineHeight: '1.05', letterSpacing: '-1px', marginBottom: '24px' }}>
            Premier Indoor<br />Soccer Facility
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: '1.7', maxWidth: '520px', margin: '0 auto 40px' }}>
            Year-round programs for youth and adults. Train indoors regardless of the weather, with world-class coaching in a welcoming community.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/book" style={{ backgroundColor: '#29ABE2', color: 'white', padding: '16px 36px', borderRadius: '10px', fontWeight: '800', fontSize: '15px', textDecoration: 'none', letterSpacing: '0.3px' }}>
              Book a Program
            </Link>
            <Link href="/contact" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '16px 36px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ backgroundColor: '#29ABE2' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '28px 24px', display: 'flex', justifyContent: 'center', gap: 'clamp(32px, 6vw, 80px)', flexWrap: 'wrap' }}>
          {stats.map(s => (
            <div key={s.value} style={{ textAlign: 'center' }}>
              <div style={{ color: 'white', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: '900', lineHeight: '1' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section style={{ maxWidth: '1140px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ color: '#29ABE2', fontSize: '12px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>What We Offer</p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: '#0d1b2e', letterSpacing: '-0.5px' }}>Our Programs</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {mainPrograms.map(p => (
            <div key={p.id} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
              {p.flyer ? (
                <FlyerImage src={p.flyer} alt={p.name} />
              ) : (
                <div style={{ background: 'linear-gradient(135deg, #29ABE2 0%, #0093c4 100%)', padding: '28px 24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>{typeLabel[p.type] || p.type}</span>
                  <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '800' }}>{p.name}</h3>
                  {p.ageGroup && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{p.ageGroup}</span>}
                </div>
              )}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {p.flyer && <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0d1b2e' }}>{p.name}</h3>}
                <p style={{ fontSize: '13px', color: '#777', lineHeight: '1.6', flex: 1 }}>{p.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div>
                    <span style={{ fontSize: '20px', fontWeight: '900', color: '#0d1b2e' }}>{p.price === 0 ? 'Contact us' : `$${p.price.toFixed(2)}`}</span>
                    {p.price > 0 && <p style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Includes 4% service charge</p>}
                  </div>
                  <Link href={p.contactUrl || `/register/${p.id}`} target={p.contactUrl ? '_blank' : undefined} rel={p.contactUrl ? 'noopener noreferrer' : undefined} style={{ backgroundColor: p.contactUrl ? '#25D366' : '#29ABE2', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>
                    {p.contactUrl ? 'More Info' : 'Book Now'}
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Training packages card */}
          {hasTraining && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
              <FlyerImage src="/individual.avif" alt="Individual Training" />
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0d1b2e' }}>Individual Training Packages</h3>
                <p style={{ fontSize: '13px', color: '#777', lineHeight: '1.6', flex: 1 }}>Single session, 10-pack, or 20-pack. Save more with multi-session packages.</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div><span style={{ fontSize: '20px', fontWeight: '900', color: '#0d1b2e' }}>$72.80+</span><p style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Includes 4% service charge</p></div>
                  <Link href="/register/individual-training-packages" style={{ backgroundColor: '#29ABE2', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>View Packages</Link>
                </div>
              </div>
            </div>
          )}

          {/* Apparel card */}
          {apparel && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: 'linear-gradient(135deg, #1a2744 0%, #2d3e60 100%)', padding: '28px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="/logo.avif" alt="Shooting Stars" style={{ height: '56px', width: 'auto' }} />
                <div><span style={{ color: 'white', fontSize: '18px', fontWeight: '800' }}>Shooting Stars Apparel</span><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' }}>Official Dri-Fit Shirt</p></div>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '13px', color: '#777', lineHeight: '1.6', flex: 1 }}>{apparel.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div><span style={{ fontSize: '20px', fontWeight: '900', color: '#0d1b2e' }}>$20.80</span><p style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Includes 4% service charge</p></div>
                  <Link href="/register/apparel" style={{ backgroundColor: '#1a2744', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>Buy Now</Link>
                </div>
              </div>
            </div>
          )}

          {/* Birthday parties card */}
          {hasParties && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(245,127,23,0.12)', border: '2px solid #f9a825', display: 'flex', flexDirection: 'column' }}>
              <FlyerImage src="/birthday.avif" alt="Birthday Parties" />
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0d1b2e' }}>Birthday Parties</h3>
                <p style={{ fontSize: '13px', color: '#777', lineHeight: '1.6', flex: 1 }}>Silver & Gold packages. Fridays, Saturdays & Sundays.</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div><span style={{ fontSize: '20px', fontWeight: '900', color: '#0d1b2e' }}>$485+</span><p style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Includes 4% service charge</p></div>
                  <Link href="/register/birthday-parties" style={{ backgroundColor: '#f57f17', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>View Packages</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Events */}
      <section style={{ backgroundColor: '#0d1b2e', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ color: '#29ABE2', fontSize: '12px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>More Than Soccer</p>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: 'white', letterSpacing: '-0.5px' }}>Special Events</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {events.map(e => (
              <Link key={e.title} href={e.href} style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: e.color }} />
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>{e.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.7', flex: 1 }}>{e.desc}</p>
                <span style={{ color: e.color, fontSize: '13px', fontWeight: '700' }}>Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section style={{ backgroundColor: 'white', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '16px' }}>
            {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#f9a825', fontSize: '28px' }}>★</span>)}
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900', color: '#0d1b2e', marginBottom: '12px' }}>Over 250 Five-Star Reviews</h2>
          <p style={{ color: '#777', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' }}>
            Families across South Florida trust Shooting Stars. Read what parents and players are saying on Google.
          </p>
          <a
            href="https://www.google.com/maps/search/Shooting+Stars+Indoor+Soccer+Davie+FL"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#f7f8fa', border: '2px solid #e0e0e0', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', color: '#333' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Read Our Google Reviews
          </a>
        </div>
      </section>

      {/* About snippet */}
      <section style={{ backgroundColor: '#f7f8fa', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#29ABE2', fontSize: '12px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Our Story</p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '900', color: '#0d1b2e', marginBottom: '20px', lineHeight: '1.2' }}>More Than a Facility</h2>
            <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
              Shooting Stars Indoor Soccer was founded on the belief that every player deserves world-class coaching in a supportive, inclusive environment.
            </p>
            <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.8', marginBottom: '32px' }}>
              Our coaches bring professional and collegiate experience to every session, helping players at every level reach their full potential both on and off the field.
            </p>
            <Link href="/about" style={{ backgroundColor: '#29ABE2', color: 'white', padding: '14px 32px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
              Meet Our Coaches
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <img src="/training.avif" alt="Training" style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '1' }} />
            <img src="/elite-group.avif" alt="Elite Training" style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '1', marginTop: '24px' }} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: 'linear-gradient(135deg, #29ABE2 0%, #0093c4 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', marginBottom: '16px', letterSpacing: '-0.5px' }}>Ready to Get Started?</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
          Browse our programs and reserve your spot online in minutes.
        </p>
        <Link href="/book" style={{ backgroundColor: 'white', color: '#0093c4', padding: '16px 40px', borderRadius: '10px', fontWeight: '900', fontSize: '16px', textDecoration: 'none' }}>
          Book a Program Today
        </Link>
      </section>

    </div>
  );
}
