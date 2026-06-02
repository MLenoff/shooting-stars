import Link from 'next/link';

const coaches = [
  {
    name: 'Melony Poviones',
    title: 'Owner & Youth Technical Director',
    initials: 'MP',
    color: '#29ABE2',
    bio: 'St. Thomas University graduate with a Major in Psychology and Minor in Sports Psychology. FC Prime Girls Youth Technical Director and ECNL Technical Trainer. Former U.S.A Footvolley Olympian and WPSL Professional Women\'s League Selection.',
    credentials: [
      'FYSA E Licensed Coach',
      'Futsal Level 1 Certified Coach',
      'Former U.S.A Footvolley Olympian (2018)',
      '2014 WPSL Professional Women\'s League — Houston Aces',
      '2013 NAIA All American',
      '2013 St. Thomas University Golden Bob-Cat Award — Best Female Athlete',
      '2013 Ranked 2nd Nationally — 26 Goals, 10 Assists',
      'FHSAA Soccer State Champions (2009-10)',
      'Broward County Player of the Year (2009-10)',
    ],
  },
  {
    name: 'Coach Tom',
    title: 'Senior Coach',
    initials: 'CT',
    color: '#0093c4',
    quote: '"If your actions inspire others to dream more, do more and become more — you are a leader." — John Quincy Adams',
    bio: 'A Hall of Fame inductee with one of the most decorated careers in South Florida soccer history. Drafted by the Milwaukee Wave of the Major Indoor Soccer League, Coach Tom brings decades of elite-level experience to every session.',
    credentials: [
      '2014 UNC-Greensboro Athletics Hall of Fame Inductee',
      '1985 NCAA DIII National Champions — UNC-Greensboro',
      '1985 North Carolina State Invitational Indoor Tournament MVP',
      '1988 Milwaukee Wave — Major Indoor Soccer League (drafted)',
      '1988 Miami Sharks — American Soccer League',
      '1981 North Miami Beach Sr. High All-American',
      '1981 Miami Herald All-Dade County Soccer Team',
      '1985 NJCAA All American Miami Dade South',
    ],
  },
  {
    name: 'Coach Jason',
    title: 'Head Coach',
    initials: 'CJ',
    color: '#1a2744',
    bio: 'US National Coaching License holder and current Head Coach of Nova Southeastern University Men\'s Club Soccer. Back-to-back NSU award winner dedicated to developing technically sound, confident players.',
    credentials: [
      'US National Coaching License',
      'NSU Men\'s Club Soccer — Head Coach',
      '2022 NSU Fighting Sharks Award — Coach of the Year',
      '2022 NSU Men\'s Club Soccer Team of the Year',
      'FC Richmond Youth Travel Soccer Coach (u14-18)',
      'James River High School Boys Varsity Soccer — Assistant Coach',
      'Former D3AA Rugby Player at Virginia Tech',
    ],
  },
  {
    name: 'Coach Diego',
    title: 'Coach',
    initials: 'CD',
    color: '#f57f17',
    bio: 'A passionate coach and University of South Florida student who brings years of playing experience with Weston FC, Schulz Academy, and Boca Raton Juniors Soccer Club. Coach Diego\'s goal is to create a fun, challenging environment where every player grows on and off the field.',
    credentials: [
      'University of South Florida — current student',
      'Played for Weston FC, Schulz Academy, Boca Raton Juniors',
      'Dedicated to youth development and mentorship',
    ],
  },
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#f7f8fa' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #1a2744 100%)', padding: '80px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #29ABE2, #0093c4)' }} />
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', display: 'inline-block', marginBottom: '20px', textDecoration: 'none' }}>← Back to Home</Link>
        <p style={{ color: '#29ABE2', fontSize: '12px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Our Team</p>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', marginBottom: '16px', letterSpacing: '-0.5px' }}>About Shooting Stars</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
          A team of elite coaches dedicated to developing players of all levels in a supportive, inclusive environment.
        </p>
      </section>

      {/* About blurb */}
      <section style={{ backgroundColor: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900', color: '#0d1b2e', marginBottom: '24px' }}>More Than a Soccer Facility</h2>
          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
            Shooting Stars Indoor Soccer is loved by a group of inclusive and competitive people dedicated to creating joy and igniting meaningful relationships through our common passion for the beautiful game of soccer. At our core, we believe in family, community, sacrifice, and hard work.
          </p>
          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.8' }}>
            Integrity and honesty drive our desire to build strong relationships and serve our community. Our air-conditioned indoor facility means year-round training regardless of South Florida weather.
          </p>
        </div>
      </section>

      {/* Coaches */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ color: '#29ABE2', fontSize: '12px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>World-Class Coaching</p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: '#0d1b2e' }}>Meet Our Coaches</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {coaches.map(coach => (
            <div key={coach.name} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div style={{ width: '200px', minHeight: '200px', background: `linear-gradient(135deg, ${coach.color} 0%, ${coach.color}cc 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'white', fontSize: '48px', fontWeight: '900', letterSpacing: '-2px' }}>{coach.initials}</span>
              </div>
              {/* Content */}
              <div style={{ padding: '32px', flex: 1, minWidth: '280px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#0d1b2e', marginBottom: '4px' }}>{coach.name}</h3>
                  <span style={{ backgroundColor: `${coach.color}18`, color: coach.color, fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>{coach.title}</span>
                </div>
                {coach.quote && (
                  <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '16px', borderLeft: `3px solid ${coach.color}`, paddingLeft: '12px' }}>{coach.quote}</p>
                )}
                <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>{coach.bio}</p>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '800', color: '#aaa', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>Credentials</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {coach.credentials.map(c => (
                      <li key={c} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#555' }}>
                        <span style={{ color: coach.color, fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>✓</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#0d1b2e', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900', marginBottom: '12px' }}>Train With the Best</h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', marginBottom: '32px' }}>Book a session today and experience the Shooting Stars difference.</p>
        <Link href="/book" style={{ backgroundColor: '#29ABE2', color: 'white', padding: '14px 36px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}>
          Book a Program
        </Link>
      </section>
    </div>
  );
}
