'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TrainingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
  perSession: string;
}

interface TrainingCardProps {
  title: string;
  subtitle: string;
  tag: string;
  flyer: string;
  days: string;
  fromPrice: string;
  options: TrainingOption[];
}

export default function TrainingCard({ title, subtitle, tag, flyer, days, fromPrice, options }: TrainingCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
      {/* Flyer */}
      <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setExpanded(e => !e)}>
        <img src={flyer} alt={title} style={{ width: '100%', height: '320px', objectFit: 'cover', objectPosition: 'top', display: 'block', backgroundColor: '#f7f8fa' }} />
      </div>

      {/* Header */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{ background: 'linear-gradient(135deg, #29ABE2 0%, #0093c4 100%)', padding: '18px 24px', position: 'relative', cursor: 'pointer', userSelect: 'none' }}
      >
        <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>{tag}</span>
        <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', lineHeight: '1.25', marginRight: '60px' }}>{title}</h2>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600' }}>{subtitle}</span>
      </div>

      {/* Collapsed state */}
      {!expanded && (
        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', flex: 1 }}>{tag === '1-on-1' ? '1-on-1 sessions with a Shooting Stars trainer. Save more with multi-session packages. Indoor shoes only, no cleats.' : 'High-level group training for players of all levels. Save more with multi-session packages.'}</p>
          <div style={{ backgroundColor: '#f7f8fa', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: '#999', minWidth: '44px' }}>Days</span>
              <span style={{ color: '#333', fontWeight: '600' }}>{days}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: '#999', minWidth: '44px' }}>From</span>
              <span style={{ color: '#333', fontWeight: '600' }}>{fromPrice}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a' }}>{options[0]?.price ? `$${options[0].price.toFixed(2)}+` : ''}</span>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Price includes 4% service charge</p>
            </div>
            <button
              onClick={() => setExpanded(true)}
              style={{ backgroundColor: '#29ABE2', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer' }}
            >
              View Packages
            </button>
          </div>
        </div>
      )}

      {/* Expanded state */}
      {expanded && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {options.map(opt => (
            <div key={opt.id} style={{ backgroundColor: opt.badge ? '#f0f9ff' : '#f7f8fa', borderRadius: '12px', padding: '18px 20px', border: opt.badge ? '2px solid #29ABE2' : '2px solid transparent', position: 'relative' }}>
              {opt.badge && (
                <div style={{ position: 'absolute', top: 0, right: '16px', backgroundColor: '#29ABE2', color: 'white', fontSize: '10px', fontWeight: '800', padding: '3px 10px', borderRadius: '0 0 8px 8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{opt.badge}</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', fontWeight: '800', color: '#1a1a1a', marginBottom: '2px' }}>{opt.name}</p>
                  <p style={{ fontSize: '12px', color: '#29ABE2', fontWeight: '600' }}>{opt.perSession}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a1a', marginBottom: '8px' }}>${opt.price.toFixed(2)}</p>
                  <Link href={`/register/${opt.id}`} style={{ backgroundColor: '#29ABE2', color: 'white', padding: '9px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', display: 'inline-block' }}>Book Now</Link>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setExpanded(false)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '13px', cursor: 'pointer', padding: '4px' }}>
            Collapse
          </button>
        </div>
      )}
    </div>
  );
}
