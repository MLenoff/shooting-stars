export default function SuccessPage() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: '480px', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', backgroundColor: '#29ABE2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>
          ✓
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', marginBottom: '12px' }}>You're registered!</h1>
        <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6', marginBottom: '8px' }}>
          Your payment was successful and your spot is confirmed.
        </p>
        <p style={{ fontSize: '14px', color: '#777', marginBottom: '32px' }}>
          A confirmation email is on its way to you. If you have questions, call us at 954-900-3292.
        </p>
        <a href="/" style={{ backgroundColor: '#29ABE2', color: 'white', padding: '14px 32px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', display: 'inline-block' }}>
          Back to Programs
        </a>
      </div>
    </div>
  );
}
