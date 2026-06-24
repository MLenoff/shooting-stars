import { NextRequest, NextResponse } from 'next/server';
import { createBookingEvent } from '@/lib/calendar';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getGraphToken(): Promise<string> {
  const res = await fetch(`https://login.microsoftonline.com/${process.env.GRAPH_TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.GRAPH_CLIENT_ID!,
      client_secret: process.env.GRAPH_CLIENT_SECRET!,
      scope: 'https://graph.microsoft.com/.default',
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function sendEmail({ to, subject, html, fromName }: { to: string; subject: string; html: string; fromName: string }) {
  const token = await getGraphToken();
  const sender = process.env.SMTP_USER!;
  await fetch(`https://graph.microsoft.com/v1.0/users/${sender}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: 'HTML', content: html },
        toRecipients: [{ emailAddress: { address: to } }],
        from: { emailAddress: { name: fromName, address: sender } },
      },
    }),
  });
}


const PACK_SESSIONS: Record<string, number> = {
  'training-10pack': 10,
  'training-20pack': 20,
  'group-training-10pack': 10,
  'group-training-20pack': 20,
};

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

async function verifySquareOrder(orderId: string): Promise<{ ok: boolean; metadata?: Record<string, string> }> {
  const isSandbox = process.env.SQUARE_ENVIRONMENT === 'sandbox';
  const squareBaseUrl = isSandbox
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';

  const res = await fetch(`${squareBaseUrl}/v2/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      'Square-Version': '2024-01-18',
    },
  });
  if (!res.ok) return { ok: false };
  const data = await res.json();
  const state = data.order?.state;
  return {
    ok: state === 'COMPLETED' || state === 'OPEN',
    metadata: data.order?.metadata || {},
  };
}

export async function POST(req: NextRequest) {
  const { programName, programId, customerName, customerEmail, date, slot, orderId } = await req.json();

  if (!programName || !programId || !customerName) {
    return NextResponse.json({ ok: false, error: 'Missing required fields' });
  }

  // Verify payment with Square before processing anything
  let orderMetadata: Record<string, string> = {};
  if (orderId) {
    const { ok: paid, metadata } = await verifySquareOrder(orderId);
    if (!paid) {
      console.error('create-booking: order not completed', orderId);
      return NextResponse.json({ ok: false, error: 'Payment not verified' }, { status: 400 });
    }
    orderMetadata = metadata || {};
  }

  // If this is a session pack, create a Supabase record + auth account
  const sessionsTotal = PACK_SESSIONS[programId];
  if (sessionsTotal && customerEmail) {
    const purchaseDate = new Date();
    const expiresAt = new Date(purchaseDate);
    expiresAt.setMonth(expiresAt.getMonth() + 3);

    await supabaseAdmin.from('session_packs').insert({
      email: customerEmail.toLowerCase(),
      name: customerName,
      program_id: programId,
      program_name: programName,
      sessions_total: sessionsTotal,
      sessions_used: 0,
      expires_at: expiresAt.toISOString(),
    });

    // Create Supabase auth account (sends invite email with set-password link)
    await supabaseAdmin.auth.admin.inviteUserByEmail(customerEmail, {
      data: { name: customerName },
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/my-sessions`,
    }).catch(() => {}); // ignore if account already exists
  }

  // Create calendar event if date and slot provided
  if (date && slot) {
    try {
      await createBookingEvent({ programName, programId, customerName, date, slot, customerEmail, customerPhone: orderMetadata.phone, playerDetails: orderMetadata.playerDetails, playerLevel: orderMetadata.playerLevel });
    } catch (err) {
      console.error('Calendar error:', err);
    }
  }

  // Send confirmation email
  if (customerEmail) {
    const hasDateSlot = date && slot;
    const isPack = !!sessionsTotal;

    const dateSlotLine = hasDateSlot
      ? `<p><strong>Date:</strong> ${formatDate(date)}</p><p><strong>Time:</strong> ${slot}</p>`
      : '';

    const packLine = isPack
      ? `<p>Your ${sessionsTotal}-session pack is ready. View your balance at <a href="${process.env.NEXT_PUBLIC_BASE_URL}/my-sessions">your session balance page</a>.</p>
         <p style="color: #555;">Please note that cancellations must be made at least 24 hours in advance. Sessions canceled or missed without notice will be counted as used. Your pack is valid for 3 months from the date of purchase.</p>`
      : '';

    await sendEmail({
      to: customerEmail,
      subject: `You're registered! ${programName}`,
      fromName: 'Shooting Stars Indoor Soccer',
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #0d0d0d; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #29ABE2; margin: 0; font-size: 22px;">Shooting Stars Indoor Soccer</h1>
          </div>
          <div style="padding: 32px; background: white; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="font-size: 20px; margin-bottom: 8px;">You're registered, ${customerName.split(' ')[0]}!</h2>
            <p style="color: #555;">Your payment was received and your spot is confirmed.</p>
            <div style="background: #f7f8fa; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <p style="margin: 0 0 8px;"><strong>Program:</strong> ${programName}</p>
              ${dateSlotLine}
            </div>
            ${packLine}
            <p style="color: #555;">If you have any questions, call us at <strong>954-900-3292</strong> or reply to this email.</p>
            <p style="color: #555;">See you on the field!</p>
            <p style="color: #aaa; font-size: 12px; margin-top: 32px;">Shooting Stars Indoor Soccer<br>10376 W State Rd 84, Davie FL 33324</p>
          </div>
        </div>
      `,
    });

    // Send notification to staff
    const m = orderMetadata;
    const addressLine = [m.address, m.city, m.state, m.zip].filter(Boolean).join(', ');
    await sendEmail({
      to: process.env.NOTIFICATION_EMAIL!,
      subject: `New registration: ${programName}`,
      fromName: 'Shooting Stars Bookings',
      html: `
        <div style="font-family: sans-serif; font-size: 14px; color: #1a1a1a; max-width: 520px;">
          <h2 style="margin-bottom: 16px;">New Registration</h2>
          <p><strong>Program:</strong> ${programName}</p>
          ${hasDateSlot ? `<p><strong>Date:</strong> ${formatDate(date)}</p><p><strong>Time:</strong> ${slot}</p>` : ''}
          ${isPack ? `<p><strong>Pack:</strong> ${sessionsTotal} sessions</p>` : ''}
          <hr style="margin: 16px 0;" />
          <p><strong>Parent/Guardian:</strong> ${customerName}</p>
          ${m.phone ? `<p><strong>Phone:</strong> ${m.phone}</p>` : ''}
          ${customerEmail ? `<p><strong>Email:</strong> ${customerEmail}</p>` : ''}
          ${addressLine ? `<p><strong>Address:</strong> ${addressLine}</p>` : ''}
          ${m.dob ? `<p><strong>Parent DOB:</strong> ${m.dob}</p>` : ''}
          ${m.playerDetails ? `<p><strong>Player:</strong> ${m.playerDetails}</p>` : ''}
          ${m.playerLevel ? `<p><strong>Level:</strong> ${m.playerLevel}</p>` : ''}
          ${m.shirtSize ? `<p><strong>Shirt Size:</strong> ${m.shirtSize}</p>` : ''}
          ${m.accommodations ? `<p><strong>Accommodations:</strong> ${m.accommodations}</p>` : ''}
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true });
}
