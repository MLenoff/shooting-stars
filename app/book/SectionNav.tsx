'use client';

const links = [
  { label: 'Youth Programs', href: '#youth', color: '#29ABE2', bg: '#e8f7fd' },
  { label: 'Training', href: '#training', color: '#0093c4', bg: '#e0f3fa' },
  { label: 'Adults & Rentals', href: '#adults', color: '#444', bg: '#f0f0f0' },
  { label: 'Parties & More', href: '#parties', color: '#f57f17', bg: '#fff3e0' },
];

export default function SectionNav() {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'white', borderBottom: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '12px 24px', display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {links.map(({ label, href, color, bg }) => (
          <a
            key={href}
            href={href}
            style={{ display: 'inline-block', padding: '10px 20px', fontSize: '14px', fontWeight: '700', color, backgroundColor: bg, textDecoration: 'none', whiteSpace: 'nowrap', borderRadius: '24px', border: `2px solid transparent`, transition: 'border-color 0.15s' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = color)}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'transparent')}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
