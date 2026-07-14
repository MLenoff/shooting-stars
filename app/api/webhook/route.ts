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

  if (
    (event.type === 'payment.updated' || event.type === 'payment.created') &&
    event.data?.object?.payment?.status === 'COMPLETED'
  ) {
    const payment = event.data?.object?.payment;
    const orderId = payment?.order_id;

    if (orderId) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
    }
  }

  return NextResponse.json({ received: true });
}
