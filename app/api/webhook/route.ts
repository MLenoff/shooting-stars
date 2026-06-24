import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.text();

  // Verify Square webhook signature
  const signature = req.headers.get('x-square-hmacsha256-signature');
  const sigKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || '';
  const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`;

  if (sigKey && signature) {
    const expected = createHmac('sha256', sigKey)
      .update(webhookUrl + body)
      .digest('base64');
    if (signature !== expected) {
      console.error('Square webhook: invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  const event = JSON.parse(body);

  if (event.type === 'payment.completed') {
    const payment = event.data?.object?.payment;
    const orderId = payment?.order_id;

    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    const isSandbox = process.env.SQUARE_ENVIRONMENT === 'sandbox';
    const squareBaseUrl = isSandbox
      ? 'https://connect.squareupsandbox.com'
      : 'https://connect.squareup.com';

    // Fetch the order to read the booking metadata embedded at checkout
    const orderRes = await fetch(`${squareBaseUrl}/v2/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Square-Version': '2024-01-18',
      },
    });

    if (!orderRes.ok) {
      console.error('Square webhook: failed to fetch order', orderId);
      return NextResponse.json({ received: true });
    }

    const orderData = await orderRes.json();
    const metadata = orderData.order?.metadata || {};

    const {
      programId,
      programName,
      customerName,
      customerEmail,
      selectedDate,
      selectedTimeSlot,
      selectedSessions: sessionsStr,
    } = metadata;

    if (!programId || !customerName) {
      return NextResponse.json({ received: true });
    }

    const selectedSessions = sessionsStr ? JSON.parse(sessionsStr) : [];

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        programId,
        programName,
        customerName,
        customerEmail,
        date: selectedDate,
        slot: selectedTimeSlot,
        selectedSessions,
      }),
    });
  }

  return NextResponse.json({ received: true });
}
