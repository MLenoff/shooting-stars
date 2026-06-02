'use client';

const links = [
  { label: 'Youth Programs', href: '#youth', color: '#29ABE2' },
  { label: 'Training', href: '#training', color: '#0093c4' },
  { label: 'Adults & Rentals', href: '#adults', color: '#555' },
  { label: 'Parties & More', href: '#parties', color: '#f57f17' },
];

export default function SectionNav() {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'white', borderBottom: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {links.map(({ label, href, color }) => (
          <a
            key={href}
            href={href}
            style={{ display: 'inline-block', padding: '14px 18px', fontSize: '13px', fontWeight: '700', color, textDecoration: 'none', whiteSpace: 'nowrap', borderBottom: '3px solid transparent', transition: 'border-color 0.15s' }}
            onMouseOver={e => (e.currentTarget.style.borderBottomColor = color)}
            onMouseOut={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
