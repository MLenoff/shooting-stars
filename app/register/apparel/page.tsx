'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PRICE_PER_ITEM = 20.80;

export default function ApparelPage() {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const total = (quantity * PRICE_PER_ITEM).toFixed(2);

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        programId: 'dri-fit-apparel',
        programName: `Shooting Stars Dri-Fit Apparel (x${quantity})`,
        programType: 'apparel',
        price: quantity * PRICE_PER_ITEM,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        quantity,
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

      <section style={{
        background: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 100%)',
        padding: '64px 24px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #29ABE2, #0093c4)' }} />
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', display: 'inline-block', marginBottom: '20px', textDecoration: 'none' }}>
          ← Back to Programs
        </Link>
        <p style={{ color: '#29ABE2', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Shooting Stars</p>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', marginBottom: '16px', lineHeight: '1.1' }}>
          Dri-Fit Apparel
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>
          Official Shooting Stars apparel. Should be worn at all times.
        </p>
      </section>

      <section style={{ maxWidth: '560px', margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', padding: '36px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>Shooting Stars Dri-Fit Apparel</h2>
              <p style={{ fontSize: '14px', color: '#777', marginTop: '4px' }}>$20.80 per item</p>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a' }}>${PRICE_PER_ITEM.toFixed(2)}</div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '10px' }}>
              How many?
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{
                  width: '48px', height: '48px',
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  borderRadius: '10px 0 0 10px',
                  fontSize: '20px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  color: '#333',
                }}
              >
                −
              </button>
              <div style={{
                width: '80px', height: '48px',
                border: '2px solid #e0e0e0',
                borderLeft: 'none', borderRight: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: '800', color: '#1a1a1a',
              }}>
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(q => q + 1)}
                style={{
                  width: '48px', height: '48px',
                  backgroundColor: '#29ABE2',
                  border: 'none',
                  borderRadius: '0 10px 10px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', color: '#555' }}>{quantity} × $20.80</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a' }}>${total}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#aaa' : '#29ABE2',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: '800',
              fontSize: '16px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Redirecting...' : `Buy Now — $${total}`}
          </button>
        </div>
      </section>
    </div>
  );
}
