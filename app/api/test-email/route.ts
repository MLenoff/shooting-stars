import { NextResponse } from 'next/server';

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
  if (!data.access_token) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function sendEmail(to: string, subject: string, html: string) {
  const token = await getGraphToken();
  const sender = process.env.SMTP_USER!;
  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${sender}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: 'HTML', content: html },
        toRecipients: [{ emailAddress: { address: to } }],
        from: { emailAddress: { name: 'Shooting Stars Indoor Soccer', address: sender } },
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Send failed: ${err}`);
  }
}

export async function GET() {
  try {
    // Confirmation email to customer
    await sendEmail(
      'meety19@gmail.com',
      'Your registration is confirmed — Shooting Stars Indoor Soccer',
      `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px">
        <img src="${process.env.NEXT_PUBLIC_BASE_URL}/logo.png" alt="Shooting Stars" style="height:48px;margin-bottom:24px" />
        <h2 style="font-size:22px;font-weight:800;color:#1a1a1a;margin-bottom:8px">You're registered!</h2>
        <p style="color:#555;font-size:15px;line-height:1.6">This is a test confirmation email from Shooting Stars Indoor Soccer.</p>
        <div style="background:#f7f8fa;border-radius:10px;padding:20px;margin:24px 0">
          <p style="margin:0 0 8px;font-size:14px;color:#555"><strong>Program:</strong> Test Program</p>
          <p style="margin:0 0 8px;font-size:14px;color:#555"><strong>Date:</strong> July 1, 2026</p>
          <p style="margin:0;font-size:14px;color:#555"><strong>Time:</strong> 7:30PM - 8:30PM</p>
        </div>
        <p style="color:#555;font-size:14px">Questions? Call us at <strong>954-900-3292</strong> or reply to this email.</p>
        <p style="color:#555;font-size:14px">See you on the field!</p>
        <p style="color:#555;font-size:14px">Shooting Stars Indoor Soccer<br/>954-900-3292</p>
      </div>`,
    );

    // Notification to staff
    await sendEmail(
      process.env.NOTIFICATION_EMAIL || 'shootingstarsindoorsoccer@gmail.com',
      'TEST — New Registration: Test Customer',
      `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px">
        <h2 style="font-size:20px;font-weight:800;color:#1a1a1a">New Registration (TEST)</h2>
        <p><strong>Name:</strong> Test Customer</p>
        <p><strong>Email:</strong> meety19@gmail.com</p>
        <p><strong>Phone:</strong> 555-555-5555</p>
        <p><strong>Program:</strong> Test Program</p>
        <p><strong>Date:</strong> July 1, 2026</p>
        <p><strong>Time:</strong> 7:30PM - 8:30PM</p>
      </div>`,
    );

    return NextResponse.json({ ok: true, message: 'Both emails sent successfully.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
