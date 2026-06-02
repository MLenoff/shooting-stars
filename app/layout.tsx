import type { Metadata } from 'next';
import './globals.css';
import NavBar from './NavBar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shooting Stars Indoor Soccer — Davie, FL',
  description: 'Premier indoor soccer facility in Davie, FL. Programs for all ages, birthday parties, individual training, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', backgroundColor: '#f7f8fa' }}>

        {/* WhatsApp bar */}
        <a
          href="https://api.whatsapp.com/message/BJABSIIAFSBEG1?autoload=1&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 24px', textDecoration: 'none' }}
        >
          <img src="/whatsapp.svg" alt="WhatsApp" style={{ height: '20px', width: 'auto' }} />
          <span style={{ color: 'white', fontSize: '13px', fontWeight: '700' }}>Chat with us on WhatsApp</span>
        </a>

        <NavBar />

        <main style={{ flex: 1 }}>{children}</main>

        <footer style={{ backgroundColor: '#0d1b2e', color: 'white', padding: '56px 24px 32px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>

              {/* Brand */}
              <div>
                <div style={{ fontWeight: '900', fontSize: '18px', letterSpacing: '0.5px', marginBottom: '8px' }}>SHOOTING STARS</div>
                <div style={{ color: '#29ABE2', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Indoor Soccer · Davie, FL</div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: '1.7' }}>Premier indoor soccer facility serving youth and adult players in South Florida.</p>
              </div>

              {/* Quick links */}
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Quick Links</div>
                {[
                  { label: 'Programs', href: '/book' },
                  { label: 'Events', href: '/events' },
                  { label: 'Micro School', href: '/micro-school' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                ].map(l => (
                  <div key={l.href} style={{ marginBottom: '10px' }}>
                    <Link href={l.href} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>{l.label}</Link>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Hours</div>
                {[
                  { day: 'Mon – Fri', hours: '1:30PM – 11:00PM' },
                  { day: 'Saturday', hours: '9:00AM – 8:00PM' },
                  { day: 'Sunday', hours: '11:30AM – 8:00PM' },
                ].map(h => (
                  <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '8px', fontSize: '13px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{h.day}</span>
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>{h.hours}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Contact</div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: '1.7', marginBottom: '12px' }}>10376 W State Rd 84<br />Davie, FL 33324</p>
                <a href="tel:9549003292" style={{ display: 'block', color: '#29ABE2', fontSize: '15px', fontWeight: '700', textDecoration: 'none', marginBottom: '6px' }}>(954) 900-3292</a>
                <a href="mailto:admin@shootingstarsindoorsoccer.com" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textDecoration: 'none' }}>admin@shootingstarsindoorsoccer.com</a>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <a href="https://www.instagram.com/shootingstarsindoorsoccer" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>Instagram</a>
                  <a href="https://api.whatsapp.com/message/BJABSIIAFSBEG1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>WhatsApp</a>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>© 2026 Shooting Stars Indoor Soccer. All rights reserved.</p>
              <Link href="/book" style={{ backgroundColor: '#29ABE2', color: 'white', padding: '10px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>Book Now</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
