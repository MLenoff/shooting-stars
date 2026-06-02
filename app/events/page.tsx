import Link from 'next/link';

export default function EventsPage() {
  return (
    <div style={{ backgroundColor: '#f7f8fa' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #1a1200 0%, #3d2b00 100%)', padding: '80px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #f9a825, #f57f17)' }} />
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', display: 'inline-block', marginBottom: '20px', textDecoration: 'none' }}>← Back to Home</Link>
        <p style={{ color: '#f9a825', fontSize: '12px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>More Than Soccer</p>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', marginBottom: '16px', letterSpacing: '-0.5px' }}>Special Events</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>
          From birthday parties to corporate team-building, our facility is the perfect venue for any event.
        </p>
      </section>

      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px', display: 'flex', flexDirection: 'column', gap: '48px' }}>

        {/* Birthday Parties */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexWrap: 'wrap' }}>
          <img src="/birthday.avif" alt="Birthday Parties" style={{ width: '100%', maxWidth: '360px', objectFit: 'cover', minHeight: '240px' }} />
          <div style={{ padding: '40px', flex: 1, minWidth: '280px' }}>
            <span style={{ backgroundColor: '#fff3e0', color: '#f57f17', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Birthday Parties</span>
            <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0d1b2e', margin: '16px 0 12px' }}>Celebrate at Shooting Stars</h2>
            <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
              Reserve the field, invite your friends, and get ready to have fun! We offer Silver and Gold packages on Fridays, Saturdays, and Sundays.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
              {[
                'High-quality indoor turf arena',
                'Personal party events coordinator',
                'Packages include food and beverages',
                'Large party room with tables, chairs, and TV',
                'Personalized request options available',
                'More than 20 kids? $12 per additional child',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#444' }}>
                  <span style={{ color: '#f57f17', fontWeight: '700', flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register/birthday-parties" style={{ backgroundColor: '#f57f17', color: 'white', padding: '13px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
              View Packages &amp; Book
            </Link>
          </div>
        </div>

        {/* Parents Night Out */}
        <div style={{ backgroundColor: '#0d1b2e', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ background: 'linear-gradient(135deg, #29ABE2 0%, #0093c4 100%)', width: '100%', maxWidth: '360px', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>🌙</div>
              <div style={{ color: 'white', fontWeight: '900', fontSize: '18px' }}>Parents Night Out</div>
            </div>
          </div>
          <div style={{ padding: '40px', flex: 1, minWidth: '280px' }}>
            <span style={{ backgroundColor: 'rgba(41,171,226,0.15)', color: '#29ABE2', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Parents Night Out</span>
            <h2 style={{ fontSize: '26px', fontWeight: '900', color: 'white', margin: '16px 0 12px' }}>You Deserve a Night Off</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: '1.7', marginBottom: '16px' }}>
              Drop them off. Sit back. Relax. Just remember to pick them up.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
              We offer Parents Night Out — a win-win evening for families. Drop off your kids at Shooting Stars, where they'll play games, watch movies, and more. Once you've had a chance to unwind, come pick them up and hear about all the fun they've had.
            </p>
            <Link href="/contact" style={{ backgroundColor: '#29ABE2', color: 'white', padding: '13px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
              Contact Us for Details
            </Link>
          </div>
        </div>

        {/* Corporate Events */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a2744 0%, #0d1b2e 100%)', width: '100%', maxWidth: '360px', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>🤝</div>
              <div style={{ color: 'white', fontWeight: '900', fontSize: '18px' }}>Corporate Events</div>
            </div>
          </div>
          <div style={{ padding: '40px', flex: 1, minWidth: '280px' }}>
            <span style={{ backgroundColor: '#e8eaf6', color: '#1a2744', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Corporate</span>
            <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0d1b2e', margin: '16px 0 12px' }}>Team Building Done Right</h2>
            <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.7', marginBottom: '16px' }}>
              Corporate events like recreational activities and team-building exercises bring your organization together and build unity.
            </p>
            <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
              Our indoor soccer field is the perfect location for these activities, with the added benefit of being fully air-conditioned — no South Florida heat to worry about.
            </p>
            <Link href="/contact" style={{ backgroundColor: '#1a2744', color: 'white', padding: '13px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
              Inquire Now
            </Link>
          </div>
        </div>

        {/* Customize Your Event */}
        <div style={{ background: 'linear-gradient(135deg, #29ABE2 0%, #0093c4 100%)', borderRadius: '16px', padding: '48px', textAlign: 'center', boxShadow: '0 4px 24px rgba(41,171,226,0.3)' }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900', marginBottom: '16px' }}>Customize Your Event</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 32px' }}>
            Shooting Stars Indoor Soccer is the perfect spot to host your team, tournament, or private event. Contact us and we'll build an experience tailored to your group.
          </p>
          <Link href="/contact" style={{ backgroundColor: 'white', color: '#0093c4', padding: '14px 36px', borderRadius: '10px', fontWeight: '800', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
