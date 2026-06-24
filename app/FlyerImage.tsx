'use client';

import { useState } from 'react';

export default function FlyerImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => setOpen(true)}>
        <img src={src} alt={alt} style={{ width: '100%', height: '420px', objectFit: 'contain', display: 'block', backgroundColor: '#f7f8fa' }} />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          backgroundColor: 'rgba(0,0,0,0.55)',
          color: 'white',
          fontSize: '11px',
          fontWeight: '700',
          padding: '4px 10px',
          borderRadius: '20px',
          letterSpacing: '0.5px',
        }}>
          View flyer
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.88)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '32px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '4px',
            }}
          >
            ×
          </button>
          <img
            src={src}
            alt={alt}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              cursor: 'default',
            }}
          />
        </div>
      )}
    </>
  );
}
