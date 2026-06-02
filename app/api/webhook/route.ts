import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata || {};

    // 1. Send notification email to Shooting Stars
    await resend.emails.send({
      from: 'Shooting Stars Bookings <noreply@shootingstarsindoorsoccer.com>',
      to: process.env.NOTIFICATION_EMAIL!,
      subject: `New Registration: ${meta.programName}`,
      html: `
        <h2>New Registration</h2>
        <p><strong>Program:</strong> ${meta.programName}</p>
        <p><strong>Name:</strong> ${meta.firstName} ${meta.lastName}</p>
        <p><strong>Email:</strong> ${meta.email}</p>
        <p><strong>Phone:</strong> ${meta.phone}</p>
        <p><strong>Child:</strong> ${meta.childName} (DOB: ${meta.childDob})</p>
        <p><strong>Shirt size:</strong> ${meta.shirtSize}</p>
        <p><strong>Accommodations:</strong> ${meta.accommodations || 'None'}</p>
        <p><strong>Guardian:</strong> ${meta.guardianName}</p>
        <p><strong>Amount paid:</strong> $${((session.amount_total || 0) / 100).toFixed(2)}</p>
      `,
    });

    // 2. Send confirmation email to registrant
    await resend.emails.send({
      from: 'Shooting Stars Indoor Soccer <noreply@shootingstarsindoorsoccer.com>',
      to: meta.email,
      subject: `You're registered! ${meta.programName}`,
      html: `
        <h2>You're registered!</h2>
        <p>Hi ${meta.firstName},</p>
        <p>Thank you for registering for <strong>${meta.programName}</strong>. Your payment of <strong>$${((session.amount_total || 0) / 100).toFixed(2)}</strong> has been received.</p>
        <p>If you have any questions, call us at 954-900-3292 or email questions@shootingstarsindoorsoccer.com.</p>
        <p>See you on the field!</p>
        <p>Shooting Stars Indoor Soccer<br>10376 W State Rd 84, Davie FL 33324</p>
      `,
    });

    // 3. Add to Google Sheet (group) or Google Calendar (1-on-1 / rental / party)
    if (meta.programType === 'group') {
      await addToSheet(meta, session);
    } else {
      await addToCalendar(meta);
    }
  }

  return NextResponse.json({ received: true });
}

async function addToSheet(meta: Record<string, string>, session: Stripe.Checkout.Session) {
  // Google Sheets integration — requires GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID
  try {
    const { google } = await import('googleapis');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Registrations!A:N',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          new Date().toLocaleDateString('en-US'),
          meta.programName,
          meta.firstName,
          meta.lastName,
          meta.email,
          meta.phone,
          meta.childName,
          meta.childDob,
          meta.shirtSize,
          meta.accommodations || '',
          meta.guardianName,
          `$${((session.amount_total || 0) / 100).toFixed(2)}`,
        ]],
      },
    });
  } catch (err) {
    console.error('Google Sheets error:', err);
  }
}

async function addToCalendar(meta: Record<string, string>) {
  // Google Calendar integration — for 1-on-1 and rentals
  try {
    const { google } = await import('googleapis');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    const calendar = google.calendar({ version: 'v3', auth });
    const now = new Date();
    const start = new Date(now.getTime() + 24 * 60 * 60 * 1000); // placeholder: tomorrow
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `${meta.programName} — ${meta.firstName} ${meta.lastName}`,
        description: `Registrant: ${meta.firstName} ${meta.lastName}\nEmail: ${meta.email}\nPhone: ${meta.phone}\nChild: ${meta.childName}`,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      },
    });
  } catch (err) {
    console.error('Google Calendar error:', err);
  }
}
