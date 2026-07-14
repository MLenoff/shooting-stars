import { getProgramsFromSheet } from '@/lib/programs-sheet';
import Link from 'next/link';

const silverIncludes = [
  '1 field (2 hours) · Up to 20 kids',
  '1 Coach + Party Room Attendant',
  'Exclusive Party Room',
  '2 large cheese pizzas & two 2-liter sodas',
  'Birthday banner, soccer tablecloth, 20 plates, 20 cups, napkins & utensils',
  'Add a second field for $80/hour (includes 2nd coach, subject to availability)',
];

const goldIncludes = [
  '1 field (3 hours) · Up to 20 kids',
  '1 Field Attendant',
  'Exclusive Party Room',
  '2 large cheese pizzas & two 2-liter sodas',
  'Birthday banner, soccer tablecloth, 20 plates, 20 cups, napkins & utensils',
  'Add a second field for $80/hour (includes 2nd coach, subject to availability)',
];

function PolicyBox({ accentColor }: { accentColor: string }) {
  return (
    <div style={{ border: `1px solid ${accentColor}33`, borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', backgroundColor: '#fafafa' }}>
      <p style={{ fontSize: '12px', fontWeight: '700', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Booking Policy</p>
      <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <li style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>A deposit of <strong>$150.00</strong> is required to secure your date. Remaining balance is due at the time of your event.</li>
        <li style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>A <strong>20% gratuity</strong> will be added for party staff.</li>
        <li style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>After you reach your limit of 20 kids, <strong>$12 per child will apply.</strong></li>
        <li style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>Packages <strong>may not be changed within 5 days</strong> of the party. Shooting Stars will not refund or exchange your deposit after that date.</li>
        <li style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>All requests must be made in writing.</li>
        <li style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>Additional plates, cups, or silverware will not be provided and must be brought by the host.</li>
      </ul>
    </div>
  );
}

export default async function BirthdayPartiesPage() {
  const programs = await getProgramsFromSheet();
  const silver = programs.find(p => p.id === 'birthday-silver');
  const gold = programs.find(p => p.id === 'birthday-gold');

  return (
    <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #1a1200 0%, #3d2b00 100%)',
        padding: '64px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #f9a825, #f57f17)' }} />
        <Link href="/book" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px', textDecoration: 'none' }}>
          ← Back to Programs
        </Link>
        <p style={{ color: '#f9a825', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Shooting Stars
        </p>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '16px', lineHeight: '1.1' }}>
          Birthday Party Packages
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
          Fridays, Saturdays &amp; Sundays. A deposit holds your date.
        </p>
      </section>

      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '56px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Silver */}
        {silver && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
            border: '2px solid #bdbdbd',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {silver.flyer && (
              <img src={silver.flyer} alt="Silver Birthday Party" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ display: 'inline-block', backgroundColor: '#f0f0f0', color: '#757575', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Silver Package</span>
                  <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a1a' }}>Silver Birthday Party — 2 Hours</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', lineHeight: '1' }}>$485</div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '3px' }}>$156.50 deposit required · A 4% service charge will apply to the total</div>
                </div>
              </div>

              {/* Time slots */}
              <div style={{ backgroundColor: '#f7f8fa', borderRadius: '10px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#555', marginBottom: '4px' }}>Available time slots</div>
                {[
                  { label: '12:00PM - 2:00PM', note: 'Sat & Sun only' },
                  { label: '4:00PM - 6:00PM', note: 'Sat & Sun only' },
                  { label: '6:30PM - 8:30PM', note: 'Fri only' },
                ].map(slot => (
                  <div key={slot.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#bdbdbd', flexShrink: 0 }} />
                    {slot.label}
                    <span style={{ fontSize: '12px', color: '#999' }}>({slot.note})</span>
                  </div>
                ))}
              </div>

              {/* What's included */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>What&apos;s included</p>
                <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {silverIncludes.map((item, i) => (
                    <li key={i} style={{ fontSize: '14px', color: '#444', lineHeight: '1.5' }}>{item}</li>
                  ))}
                </ul>
              </div>

              <PolicyBox accentColor="#757575" />

              <a href="https://www.shootingstarsindoorsoccer.com/soccer-camp-booking" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block',
                backgroundColor: '#757575',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '15px',
                textDecoration: 'none',
              }}>
                Book Silver Package
              </a>
            </div>
          </div>
        )}

        {/* Gold */}
        {gold && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(245,127,23,0.15)',
            border: '2px solid #f9a825',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {gold.flyer && (
              <img src={gold.flyer} alt="Gold Birthday Party" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ display: 'inline-block', backgroundColor: '#fff8e1', color: '#f57f17', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>★ Gold Package</span>
                  <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a1a' }}>Gold Birthday Party — 3 Hours</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', lineHeight: '1' }}>$585</div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '3px' }}>$156.50 deposit required · A 4% service charge will apply to the total</div>
                </div>
              </div>

              {/* Time slots */}
              <div style={{ backgroundColor: '#fff8e1', borderRadius: '10px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#f57f17', marginBottom: '4px' }}>Available time slots</div>
                {[
                  { label: '12:00PM - 3:00PM', note: 'Sat & Sun only' },
                  { label: '4:00PM - 7:00PM', note: 'Sat & Sun only' },
                  { label: '6:30PM - 9:30PM', note: 'Fri only' },
                ].map(slot => (
                  <div key={slot.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f9a825', flexShrink: 0 }} />
                    {slot.label}
                    <span style={{ fontSize: '12px', color: '#999' }}>({slot.note})</span>
                  </div>
                ))}
              </div>

              {/* What's included */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>What&apos;s included</p>
                <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {goldIncludes.map((item, i) => (
                    <li key={i} style={{ fontSize: '14px', color: '#444', lineHeight: '1.5' }}>{item}</li>
                  ))}
                </ul>
              </div>

              <PolicyBox accentColor="#f57f17" />

              <a href="https://www.shootingstarsindoorsoccer.com/soccer-camp-booking" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block',
                backgroundColor: '#f57f17',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '15px',
                textDecoration: 'none',
              }}>
                Book Gold Package
              </a>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a1a', marginBottom: '20px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                q: 'Can I bring outside food?',
                a: 'There is a $75 outside food fee for any outside catering. You are welcome to bring your own cake, waters, drinks, and one small platter at no charge. We also have food options available through Shooting Stars to make it easy.',
              },
              {
                q: 'How much is the deposit?',
                a: 'A deposit of $156.50 is required to secure your date. The remaining balance is due at the time of your event.',
              },
              {
                q: 'Is gratuity included?',
                a: 'A 20% gratuity will be added for party staff.',
              },
              {
                q: 'What if we have more than 20 kids?',
                a: 'No problem! Additional children are $12 per child.',
              },
              {
                q: 'Can I add a second field?',
                a: 'Yes, subject to availability. A second field is $80/hour and includes a second coach.',
              },
              {
                q: 'Can I change my package after booking?',
                a: 'Package changes must be made more than 5 days before your party. Packages cannot be changed within 5 days of the event, and deposits are non-refundable after that point.',
              },
              {
                q: 'How do I make changes or special requests?',
                a: 'All requests must be made in writing. Reach out to us via WhatsApp or call us at 954-900-3292.',
              },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                <p style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a1a', marginBottom: '8px' }}>{item.q}</p>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
