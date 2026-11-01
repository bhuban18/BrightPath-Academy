import type { Handler, HandlerEvent } from '@netlify/functions';

interface NotificationPayload {
  registration: {
    id: string;
    student_name: string;
    email: string;
    phone: string;
    course: string;
    batch_preference: string;
    message?: string;
    created_at: string;
  };
}

export const handler: Handler = async (event: HandlerEvent) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body: NotificationPayload = JSON.parse(event.body || '{}');
    const { registration } = body;

    if (!registration || !registration.student_name || !registration.course) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required registration data' }),
      };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admissions@brightpathacademy.edu.in';
    const senderEmail = process.env.SENDER_EMAIL || 'BrightPath Academy <onboarding@resend.dev>';

    // If Resend API key is not configured, log and return graceful info
    if (!resendApiKey || resendApiKey.startsWith('re_123456')) {
      console.log('Notice: RESEND_API_KEY is not configured yet. Email notification skipped.');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'skipped',
          message: 'RESEND_API_KEY is not set in Netlify environment variables. Registration was still saved to database.',
        }),
      };
    }

    // Prepare HTML Email Template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f1e36; margin: 0; padding: 24px; }
          .card { background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background-color: #0f1e36; color: #ffffff; padding: 24px; }
          .badge { background-color: #ff6b35; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; text-transform: uppercase; display: inline-block; margin-bottom: 8px; }
          .content { padding: 24px; line-height: 1.6; }
          .field-row { margin-bottom: 14px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
          .field-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; }
          .field-value { font-size: 15px; color: #0f1e36; font-weight: 500; margin-top: 2px; }
          .cta-btn { display: inline-block; background-color: #0f1e36; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px; margin-right: 8px; }
          .cta-whatsapp { display: inline-block; background-color: #10b981; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px; }
          .footer { background-color: #f8fafc; padding: 16px 24px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="badge">New Admission Registration</span>
            <h1 style="margin: 0; font-size: 22px;">New Student Registered Online</h1>
            <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">Received on ${new Date(registration.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</p>
          </div>
          <div class="content">
            <div class="field-row">
              <div class="field-label">Student Name</div>
              <div class="field-value">${registration.student_name}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Target Course</div>
              <div class="field-value" style="color: #ff6b35; font-weight: bold;">${registration.course}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Preferred Timing</div>
              <div class="field-value">${registration.batch_preference}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Phone Number</div>
              <div class="field-value">
                <a href="tel:${registration.phone}" style="color: #0f1e36; text-decoration: none;">+91 ${registration.phone}</a>
              </div>
            </div>
            <div class="field-row">
              <div class="field-label">Email Address</div>
              <div class="field-value">
                <a href="mailto:${registration.email}" style="color: #0f1e36; text-decoration: none;">${registration.email}</a>
              </div>
            </div>
            ${registration.message ? `
            <div class="field-row" style="border-bottom: none;">
              <div class="field-label">Student Goals / Notes</div>
              <div class="field-value" style="background-color: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-style: italic;">
                "${registration.message}"
              </div>
            </div>
            ` : ''}

            <div style="margin-top: 20px;">
              <a href="tel:${registration.phone}" class="cta-btn">Call Student Now</a>
              <a href="https://wa.me/91${registration.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(registration.student_name)},%20thank%20you%20for%20registering%20at%20BrightPath%20Academy." class="cta-whatsapp">WhatsApp Student</a>
            </div>
          </div>
          <div class="footer">
            BrightPath Academy Admissions Management System · Record ID: ${registration.id}
          </div>
        </div>
      </body>
      </html>
    `;

    // Call Resend REST API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [adminEmail],
        subject: `[BrightPath] New Registration: ${registration.student_name} (${registration.course})`,
        html: emailHtml,
      }),
    });

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API returned error:', resendResult);
      return {
        statusCode: 200, // Return 200 so frontend knows DB succeeded
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'email_failed',
          error: resendResult.message || 'Email delivery failed, but registration is saved.',
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'success',
        id: resendResult.id,
      }),
    };
  } catch (error: any) {
    console.error('Notification function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};
