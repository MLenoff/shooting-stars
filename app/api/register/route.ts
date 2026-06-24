import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
  const { program, form, selectedDate, selectedTimeSlot, selectedSessions, promoApplied } = await req.json();

  const basePrice = (program.pricePerSession && selectedSessions?.length)
    ? program.pricePerSession * selectedSessions.length
    : program.price;
  const additionalPlayers = program.type === 'rental' && form.playerCount > 10 ? form.playerCount - 10 : 0;
  const price = basePrice + (form.needsShirt ? 20.80 : 0) + (additionalPlayers * 10.40);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Promo code: skip Square entirely and go straight to success
  if (promoApplied) {
    const redirectUrl = `${baseUrl}/success?program=${encodeURIComponent(program.id)}&programName=${encodeURIComponent(program.name)}&date=${encodeURIComponent(selectedDate || '')}&slot=${encodeURIComponent(selectedTimeSlot || '')}&name=${encodeURIComponent(`${form.firstName} ${form.lastName}`)}&email=${encodeURIComponent(form.email || '')}`;
    return NextResponse.json({ checkoutUrl: redirectUrl });
  }

  const amountCents = Math.round(price * 100);
  const isSandbox = process.env.SQUARE_ENVIRONMENT === 'sandbox';
  const squareBaseUrl = isSandbox
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';

  // Square allows max 10 metadata fields — combine related fields
  const fullAddress = [form.address, form.city, form.state, form.zip].filter(Boolean).join(', ');
  const dateSlot = [selectedDate, selectedTimeSlot].filter(Boolean).join(' | ');
  const playerName = [form.playerFirstName, form.playerLastName].filter(Boolean).join(' ');
  // Combine player details into one field to stay under 10-field limit
  const playerDetails = [
    playerName,
    form.playerDob ? `DOB: ${form.playerDob}` : '',
    form.playerAge ? `Age: ${form.playerAge}` : '',
  ].filter(Boolean).join(' | ');

  const metadata: Record<string, string> = {
    programId: program.id,
    programName: program.name,
    customerName: `${form.firstName} ${form.lastName}`,
  };
  if (form.email) metadata.customerEmail = form.email;
  if (form.phone) metadata.phone = form.phone;
  if (fullAddress) metadata.address = fullAddress;
  if (playerDetails) metadata.playerDetails = playerDetails;
  if (form.playerLevel) metadata.playerLevel = form.playerLevel;
  if (form.shirtSize) metadata.shirtSize = form.shirtSize;
  if (form.accommodations) metadata.accommodations = form.accommodations;
  if (dateSlot) metadata.dateSlot = dateSlot;
  if (selectedSessions?.length) metadata.selectedSessions = selectedSessions.join(', ');

  const redirectUrl = `${baseUrl}/success?program=${encodeURIComponent(program.id)}&programName=${encodeURIComponent(program.name)}&date=${encodeURIComponent(selectedDate || '')}&slot=${encodeURIComponent(selectedTimeSlot || '')}&name=${encodeURIComponent(`${form.firstName} ${form.lastName}`)}&email=${encodeURIComponent(form.email || '')}`;

  const body: Record<string, unknown> = {
    idempotency_key: randomUUID(),
    order: {
      location_id: process.env.SQUARE_LOCATION_ID,
      line_items: [
        {
          name: program.name,
          quantity: '1',
          base_price_money: {
            amount: amountCents,
            currency: 'USD',
          },
        },
        ...(form.needsShirt ? [{
          name: `Shooting Stars Dri-Fit Shirt (${form.shirtSizeAddon || 'size TBD'})`,
          quantity: '1',
          base_price_money: { amount: 2080, currency: 'USD' },
        }] : []),
        ...(additionalPlayers > 0 ? [{
          name: `Additional Players (${additionalPlayers} × $10.40)`,
          quantity: '1',
          base_price_money: { amount: Math.round(additionalPlayers * 10.40 * 100), currency: 'USD' },
        }] : []),
        ...(program.id === 'summer-camp-2026' ? [{
          name: 'Summer Camp Registration Fee (non-refundable, includes 2 shirts)',
          quantity: '1',
          base_price_money: {
            amount: 5200,
            currency: 'USD',
          },
        }] : []),
      ],
      metadata,
    },
    checkout_options: {
      redirect_url: redirectUrl,
    },
  };

  if (form.email) {
    body.pre_populated_data = { buyer_email: form.email };
  }

  console.log('Square req — location_id:', process.env.SQUARE_LOCATION_ID, 'amount:', amountCents, 'env:', process.env.SQUARE_ENVIRONMENT);

  const response = await fetch(`${squareBaseUrl}/v2/online-checkout/payment-links`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Square-Version': '2024-01-18',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Square error:', JSON.stringify(data));
    return NextResponse.json({ error: data.errors?.[0]?.detail || 'Payment error', squareErrors: data.errors }, { status: 500 });
  }

  return NextResponse.json({ checkoutUrl: data.payment_link.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Register route error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
