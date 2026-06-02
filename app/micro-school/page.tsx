import Link from 'next/link';
import FlyerImage from '../FlyerImage';

const schedule = [
  { time: '9:00 – 9:30 AM', activity: 'Morning Games & Movement Activities' },
  { time: '9:30 – 10:30 AM', activity: 'Academic Work Session 1' },
  { time: '10:40 – 11:00 AM', activity: 'Morning Snack' },
  { time: '11:00 – 12:30 PM', activity: 'Academic Work Session 2' },
  { time: '12:15 – 12:45 PM', activity: 'Lunch & Recess' },
  { time: '12:45 – 1:00 PM', activity: 'Learn About a Female Leader' },
  { time: '1:00 – 2:00 PM', activity: 'Technical Soccer Training' },
  { time: '2:00 – 2:30 PM', activity: 'Scrimmages & Skill Games' },
  { time: '2:30 – 4:00 PM', activity: 'Pick-Up (end of school day)' },
];

const pillars = [
  { icon: '📚', label: 'Academic Excellence', desc: 'Personalized academic sessions in a small-group environment.' },
  { icon: '⚽', label: 'Elite Soccer Development', desc: 'Daily technical training with certified coaches.' },
  { icon: '🌟', label: 'Grow, Learn & Thrive', desc: 'Leadership development and female role model spotlights every week.' },
];

export default function MicroSchoolPage() {
  return (
    <div style={{ backgroundColor: '#f7f8fa' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #1a2744 100%)', padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #29ABE2, #9c27b0)' }} />
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', display: 'inline-block', marginBottom: '20px', textDecoration: 'none' }}>← Back to Home</Link>
        <p style={{ color: '#29ABE2', fontSize: '12px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Now Enrolling</p>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: '900', marginBottom: '16px', letterSpacing: '-0.5px', lineHeight: '1.1' }}>Girls Only<br />Micro School</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', maxWidth: '560px', margin: '0 auto 32px', lineHeight: '1.7' }}>
          A girls-only micro school providing personalized academics, leadership development, and athletic training in a supportive small-group environment.
        </p>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 20px' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>No Challenge, No Change</span>
        </div>
      </section>

      {/* Flyer */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 0' }}>
        <FlyerImage src="/microschool.avif" alt="Girls Only Micro School" />
      </section>

      {/* Pillars */}
      <section style={{ backgroundColor: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
          {pillars.map(p => (
            <div key={p.label} style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{p.icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0d1b2e', marginBottom: '10px' }}>{p.label}</h3>
              <p style={{ color: '#777', fontSize: '14px', lineHeight: '1.6' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900', color: '#0d1b2e', marginBottom: '20px' }}>About the Program</h2>
        <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
          The Girls Only Micro School runs Monday through Thursday with a full academic and athletic program. Fridays are dedicated to hands-on enrichment — soccer, art, STEM, science, leadership activities, and once-a-month field trips.
        </p>
        <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.8' }}>
          Classes are kept small to ensure every student gets the individual attention they deserve — both in the classroom and on the field. This is a program built for girls who want to grow as students, athletes, and leaders.
        </p>
      </section>

      {/* Schedule */}
      <section style={{ backgroundColor: '#0d1b2e', padding: '64px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <p style={{ color: '#29ABE2', fontSize: '12px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Monday – Thursday</p>
            <h2 style={{ color: 'white', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900' }}>Daily Schedule</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {schedule.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', padding: '16px 20px', backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)', borderRadius: '8px', alignItems: 'center' }}>
                <span style={{ color: '#29ABE2', fontSize: '13px', fontWeight: '700', minWidth: '140px', flexShrink: 0 }}>{item.time}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '500' }}>{item.activity}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px', backgroundColor: 'rgba(41,171,226,0.1)', border: '1px solid rgba(41,171,226,0.2)', borderRadius: '10px', padding: '16px 20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.6' }}>
              <strong style={{ color: '#29ABE2' }}>Fridays:</strong> Hands-on Enrichment Day — Soccer, art, STEM, science, leadership, and once-a-month field trips.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: 'white' }}>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900', color: '#0d1b2e', marginBottom: '12px' }}>Ready to Enroll?</h2>
        <p style={{ color: '#777', fontSize: '15px', marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px', lineHeight: '1.7' }}>
          Reach out via WhatsApp to learn more about enrollment, tuition, and available spots.
        </p>
        <a
          href="https://api.whatsapp.com/message/BJABSIIAFSBEG1?autoload=1&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: '#25D366', color: 'white', padding: '14px 36px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
        >
          <img src="/whatsapp.svg" alt="" style={{ height: '20px' }} />
          Message Us on WhatsApp
        </a>
      </section>
    </div>
  );
}
