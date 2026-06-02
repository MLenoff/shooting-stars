import Link from 'next/link';

const hours = [
  { day: 'Monday – Friday', time: '1:30PM – 11:00PM' },
  { day: 'Saturday', time: '9:00AM – 8:00PM' },
  { day: 'Sunday', time: '11:30AM – 8:00PM' },
];

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: '#f7f8fa' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #1a2744 100%)', padding: '80px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #29ABE2, #0093c4)' }} />
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', display: 'inline-block', marginBottom: '20px', textDecoration: 'none' }}>← Back to Home</Link>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', marginBottom: '16px', letterSpacing: '-0.5px' }}>Contact Us</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.7' }}>
          Questions about programs, availability, or events? We're happy to help.
        </p>
      </section>

      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>

        {/* Contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Phone */}
          <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <p style={{ color: '#aaa', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Phone</p>
            <a href="tel:9549003292" style={{ color: '#29ABE2', fontSize: '22px', fontWeight: '900', textDecoration: 'none' }}>(954) 900-3292</a>
          </div>

          {/* Email */}
          <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <p style={{ color: '#aaa', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Email</p>
            <a href="mailto:admin@shootingstarsindoorsoccer.com" style={{ color: '#29ABE2', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>admin@shootingstarsindoorsoccer.com</a>
          </div>

          {/* WhatsApp */}
          <a
            href="https://api.whatsapp.com/message/BJABSIIAFSBEG1?autoload=1&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: '#25D366', borderRadius: '14px', padding: '24px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(37,211,102,0.2)' }}
          >
            <img src="/whatsapp.svg" alt="WhatsApp" style={{ height: '32px' }} />
            <div>
              <div style={{ color: 'white', fontWeight: '800', fontSize: '15px' }}>Chat on WhatsApp</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginTop: '2px' }}>Fastest way to reach us</div>
            </div>
          </a>

          {/* Hours */}
          <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <p style={{ color: '#aaa', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Hours</p>
            {hours.map(h => (
              <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>{h.day}</span>
                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '700' }}>{h.time}</span>
              </div>
            ))}
          </div>

          {/* Address */}
          <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <p style={{ color: '#aaa', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Address</p>
            <p style={{ color: '#333', fontSize: '15px', fontWeight: '600', lineHeight: '1.6', marginBottom: '16px' }}>10376 W State Rd 84<br />Davie, FL 33324</p>
            <a
              href="https://maps.google.com/?q=10376+W+State+Rd+84+Davie+FL+33324"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', backgroundColor: '#0d1b2e', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}
            >
              Get Directions
            </a>
          </div>
        </div>

        {/* Map + Google Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Map embed */}
          <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', flex: '1', minHeight: '320px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3584.5!2d-80.2!3d26.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9a2e8b3d3b3b3%3A0x0!2sShooting+Stars+Indoor+Soccer!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', minHeight: '320px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shooting Stars Indoor Soccer location"
            />
          </div>

          {/* Google Reviews */}
          <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '12px' }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#f9a825', fontSize: '22px' }}>★</span>)}
            </div>
            <p style={{ fontWeight: '900', fontSize: '18px', color: '#0d1b2e', marginBottom: '4px' }}>250+ Google Reviews</p>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>See what families are saying</p>
            <a
              href="https://www.google.com/maps/search/Shooting+Stars+Indoor+Soccer+Davie+FL"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '2px solid #e0e0e0', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', color: '#333' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Read Our Reviews
            </a>
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section style={{ backgroundColor: '#0d1b2e', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '900', marginBottom: '12px' }}>Ready to Register?</h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', marginBottom: '32px' }}>Browse programs and book your spot online in minutes.</p>
        <Link href="/book" style={{ backgroundColor: '#29ABE2', color: 'white', padding: '14px 36px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}>
          Book a Program
        </Link>
      </section>
    </div>
  );
}
