'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SHIRTS = [
  { id: 'dri-fit-apparel', name: 'Dri-Fit Shirt', description: 'Available in blue, black, and pink.', price: 20.80 },
  { id: 'cotton-apparel', name: 'Cotton Shirt', description: 'Available in blue.', price: 10.40 },
];

function QuantitySelector({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button onClick={() => onChange(Math.max(0, value - 1))} style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '8px 0 0 8px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', color: '#333' }}>−</button>
      <div style={{ width: '56px', height: '40px', border: '2px solid #e0e0e0', borderLeft: 'none', borderRight: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: '#1a1a1a' }}>{value}</div>
      <button onClick={() => onChange(value + 1)} style={{ width: '40px', height: '40px', backgroundColor: '#29ABE2', border: 'none', borderRadius: '0 8px 8px 0', fontSize: '18px', fontWeight: '700', cursor: 'pointer', color: 'white' }}>+</button>
    </div>
  );
}

export default function ApparelPage() {
  const [quantities, setQuantities] = useState<Record<string, number>>({ 'dri-fit-apparel': 0, 'cotton-apparel': 0 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const total = SHIRTS.reduce((sum, s) => sum + (quantities[s.id] || 0) * s.price, 0);
  const hasItems = total > 0;

  async function handleCheckout() {
    setLoading(true);
    const items = SHIRTS.filter(s => quantities[s.id] > 0);
    const programName = items.map(s => `${s.name} x${quantities[s.id]}`).join(', ');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        programId: items.length === 1 ? items[0].id : 'dri-fit-apparel',
        programName,
        programType: 'apparel',
        price: total,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      }),
    });
    const data = await res.json();
    if (data.checkoutUrl) {
      router.push(data.checkoutUrl);
    } else {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>

      <section style={{ background: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 100%)', padding: '64px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #29ABE2, #0093c4)' }} />
        <Link href="/book" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', display: 'inline-block', marginBottom: '20px', textDecoration: 'none' }}>
          ← Back to Programs
        </Link>
        <p style={{ color: '#29ABE2', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Shooting Stars</p>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', marginBottom: '16px', lineHeight: '1.1' }}>Apparel</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>Official Shooting Stars apparel. Should be worn at all times.</p>
      </section>

      <section style={{ maxWidth: '560px', margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {SHIRTS.map(shirt => (
            <div key={shirt.id} style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#1a1a1a', marginBottom: '4px' }}>{shirt.name}</h2>
                <p style={{ fontSize: '13px', color: '#777' }}>{shirt.description}</p>
                <p style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a1a', marginTop: '8px' }}>${shirt.price.toFixed(2)}</p>
              </div>
              <QuantitySelector value={quantities[shirt.id] || 0} onChange={n => setQuantities(prev => ({ ...prev, [shirt.id]: n }))} />
            </div>
          ))}

          {hasItems && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '16px', color: '#555' }}>Total</span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a' }}>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{ width: '100%', backgroundColor: loading ? '#aaa' : '#29ABE2', color: 'white', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Redirecting...' : `Buy Now — $${total.toFixed(2)}`}
              </button>
              <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '10px' }}>Price includes 4% service charge</p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
