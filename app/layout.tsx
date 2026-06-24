import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shooting Stars Indoor Soccer — Davie, FL',
  description: 'Premier indoor soccer facility in Davie, FL. Programs for all ages, birthday parties, individual training, and more.',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', backgroundColor: '#f7f8fa' }}>

        {/* Minimal header */}
        <header style={{ background: 'linear-gradient(135deg, #0d1b2e 0%, #1a2744 100%)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/book" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src="/logo.avif" alt="Shooting Stars" style={{ height: '48px', width: 'auto' }} />
          </Link>
          <Link href="/my-sessions" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '600', textDecoration: 'none', padding: '8px 18px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}>
            Session Pack Login
          </Link>
        </header>

        <main style={{ flex: 1 }}>{children}</main>

        {/* WhatsApp floating widget */}
        <a
          href="https://api.whatsapp.com/message/BJABSIIAFSBEG1?autoload=1&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
            backgroundColor: '#25D366', borderRadius: '50px',
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '16px 26px 16px 20px', textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          }}
        >
          {/* WhatsApp phone icon (inline SVG so it always renders) */}
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span style={{ color: 'white', fontSize: '16px', fontWeight: '700', whiteSpace: 'nowrap' }}>Chat with us</span>
        </a>

      </body>
    </html>
  );
}
