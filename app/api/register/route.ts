import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { program, form } = await req.json();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: program.name,
            description: `${program.dates} | ${program.times}`,
          },
          unit_amount: Math.round(program.price * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: form.email,
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&program=${program.id}`,
    cancel_url: `${baseUrl}/register/${program.id}`,
    metadata: {
      programId: program.id,
      programName: program.name,
      programType: program.type,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
      guardianName: form.guardianName,
      childName: form.childName,
      childDob: form.childDob,
      shirtSize: form.shirtSize,
      accommodations: form.accommodations || '',
    },
  });

  return NextResponse.json({ checkoutUrl: session.url });
}
