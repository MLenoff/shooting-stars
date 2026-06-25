'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const REVIEWS = [
  { quote: "The perfect birthday spot for our son's 2nd birthday! Everything was perfect from the decorations to the help we had from Mackenzie and Lourdes. We will definitely be doing more parties and classes there!", name: "Steven Bonnen" },
  { quote: "We had the BEST experience hosting my son's 7th birthday party at Shooting Stars. From start to finish, everything was incredibly well organized and stress free. The facility was clean, well run, and the party flowed perfectly.", name: "Yesenia Ramirez" },
  { quote: "They are THE BEST! We hosted my son's 4th birthday party here and they made everything seamless. The coaches were great and played with the kids. I couldn't recommend them more!", name: "Carly M" },
  { quote: "We love Shooting Stars! We have had two birthday parties here and they were so much fun. The coaches take care of everything and make everything run smoothly. We will be back!", name: "Tina Macey" },
  { quote: "Shooting Stars Indoor Soccer is an awesome spot. Great facility with well-maintained fields and a fun, competitive atmosphere. Staff is friendly and everything is organized well. Definitely recommend!", name: "Juan" },
  { quote: "Shooting Stars is the place to grow as a soccer player and person. Coach Mel and the coaching staff push players to reach their potential in a fun and safe environment. I highly recommend this spot to anyone trying to get better in soccer.", name: "Ashley Oswald" },
  { quote: "5 stars isn't enough for Shooting Stars! My son had an absolute blast. The staff was incredibly attentive and made sure every child felt welcome. The room was decorated before our arrival and they took care of cleaning afterwards. Talk about a stress free experience!", name: "Maria Andreina Gonzalez" },
];

function ReviewRotator() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % REVIEWS.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const review = REVIEWS[idx];
  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #e4e8ee', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px' }}>
      <p style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', margin: '0 0 14px' }}>What families are saying</p>
      <div style={{ transition: 'opacity 0.4s ease', opacity: visible ? 1 : 0, minHeight: '80px' }}>
        <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.6', margin: '0 0 8px' }}>&ldquo;{review.quote}&rdquo;</p>
        <p style={{ fontSize: '12px', color: '#bbb', margin: 0 }}>— {review.name}</p>
      </div>
      <div style={{ display: 'flex', gap: '6px', marginTop: '14px' }}>
        {REVIEWS.map((_, i) => (
          <div key={i} onClick={() => { setVisible(false); setTimeout(() => { setIdx(i); setVisible(true); }, 400); }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: i === idx ? '#29ABE2' : '#e0e0e0', cursor: 'pointer', transition: 'background-color 0.3s' }} />
        ))}
      </div>
      <a href="https://www.shootingstarsindoorsoccer.com/testimonials-reviews" target="_blank" rel="noopener noreferrer"
        style={{ display: 'inline-block', marginTop: '12px', fontSize: '13px', color: '#29ABE2', fontWeight: '600', textDecoration: 'none' }}>
        Read more reviews →
      </a>
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const calledRef = useRef(false);

  const programId = searchParams.get('program') || '';
  const programName = searchParams.get('programName') || '';
  const date = searchParams.get('date') || '';
  const slot = searchParams.get('slot') || '';
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';
  const orderId = searchParams.get('orderId') || '';

  useEffect(() => {
    if (calledRef.current) return;
    if (!programId || !name || !orderId) return;
    calledRef.current = true;

    fetch('/api/create-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        programId,
        programName: programName || programId,
        customerName: name,
        customerEmail: email,
        date,
        slot,
        orderId,
      }),
    }).catch(() => {});
  }, [programId, programName, date, slot, name, email, orderId]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f9fc', padding: '48px 24px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '72px', height: '72px', backgroundColor: '#29ABE2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>
            ✓
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#1a1a1a', marginBottom: '8px' }}>You're in!</h1>
          {name && (
            <p style={{ fontSize: '16px', color: '#555', margin: '0 0 4px' }}>
              Welcome to the Shooting Stars family, {name.split(' ')[0]}.
            </p>
          )}
          <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>
            Your spot is confirmed. We can't wait to see you on the field.
          </p>
        </div>

        {/* Receipt card */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e4e8ee', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', margin: '0 0 14px' }}>Registration Summary</p>
          {programName && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', color: '#444', fontWeight: '600' }}>{programName}</span>
              <span style={{ fontSize: '12px', color: '#29ABE2', fontWeight: '700' }}>Confirmed</span>
            </div>
          )}
          {date && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '6px' }}>
              <span>Date</span><span>{date}</span>
            </div>
          )}
          {slot && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '6px' }}>
              <span>Time</span><span>{slot}</span>
            </div>
          )}
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f0f0f0', fontSize: '13px', color: '#888' }}>
            A confirmation email is on its way to you. Questions? Call us at <strong style={{ color: '#555' }}>954-900-3292</strong>.
          </div>
        </div>

        {/* Testimonials */}
        <ReviewRotator />
          <a
            href="https://www.shootingstarsindoorsoccer.com/testimonials-reviews"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: '14px', fontSize: '13px', color: '#29ABE2', fontWeight: '600', textDecoration: 'none' }}
          >
            Read more reviews →
          </a>
        </div>

        {/* Social + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a
            href="https://www.instagram.com/shootingstarsindoorsoccer"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#fff', border: '1.5px solid #e4e8ee', color: '#444', padding: '13px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}
          >
            📸 Follow us on Instagram
          </a>
          <a
            href="/"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#29ABE2', color: 'white', padding: '14px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}
          >
            Back to Programs
          </a>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#777' }}>Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
