'use client';
import { useState } from 'react';
import Link from 'next/link';
import HeaderLogo from './HeaderLogo';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Programs', href: '/book' },
  { label: 'Events', href: '/events' },
  { label: 'Micro School', href: '/micro-school' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{
      background: 'linear-gradient(135deg, #0d1b2e 0%, #1a2744 100%)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <HeaderLogo />
          <div>
            <div style={{ color: 'white', fontWeight: '900', fontSize: '18px', letterSpacing: '0.5px', lineHeight: '1.1' }}>SHOOTING STARS</div>
            <div style={{ color: '#29ABE2', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>Indoor Soccer</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', letterSpacing: '0.3px' }}>
              {l.label}
            </Link>
          ))}
          <Link href="/book" style={{ marginLeft: '8px', backgroundColor: '#29ABE2', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', letterSpacing: '0.3px' }}>
            Book Now
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="mobile-menu-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'white', fontSize: '22px', lineHeight: 1 }}
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="mobile-nav" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0d1b2e', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', fontWeight: '600', padding: '12px 0', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {l.label}
            </Link>
          ))}
          <Link href="/book" onClick={() => setOpen(false)} style={{ marginTop: '12px', backgroundColor: '#29ABE2', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', textDecoration: 'none', textAlign: 'center' }}>
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
