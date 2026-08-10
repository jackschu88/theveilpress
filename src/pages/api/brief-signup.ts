import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const THANK_YOU_URL = 'https://www.theveilpress.com/brief/thank-you';
const CHAPTER_URL = 'https://www.theveilpress.com/brief/chapter-one';

function redirectToThankYou() {
  return new Response(null, {
    status: 302,
    headers: { Location: THANK_YOU_URL },
  });
}

function autoresponseHtml(): string {
  return `
    <div style="background:#0c0e14;padding:32px 16px;font-family:Georgia,serif;">
      <div style="max-width:480px;margin:0 auto;background:#14161f;border:1px solid #2a2d3a;border-radius:8px;padding:32px;">
        <p style="color:#c4a574;letter-spacing:0.08em;text-transform:uppercase;font-size:12px;margin:0 0 12px;">The Veil Press</p>
        <h1 style="color:#f2ede3;font-size:22px;margin:0 0 16px;">Here's your first chapter</h1>
        <p style="color:#b9bcc9;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Thanks for signing up. Volume Zero and Part I of <em>The Veil of the Square Mile</em> are
          ready for you now &mdash; no further steps.
        </p>
        <p style="margin:0 0 24px;">
          <a href="${CHAPTER_URL}" style="display:inline-block;background:#c4a574;color:#0c0e14;text-decoration:none;padding:12px 24px;border-radius:4px;font-weight:600;font-size:15px;">
            Read the first chapter →
          </a>
        </p>
        <p style="color:#7c7f8c;font-size:13px;line-height:1.5;margin:0;">
          No spam, no resale, unsubscribe anytime. &mdash; The Veil Press
        </p>
      </div>
    </div>
  `.trim();
}

export const POST: APIRoute = async ({ request }) => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return redirectToThankYou();
  }

  const email = String(data.get('email') || '').trim();
  const gotcha = String(data.get('_gotcha') || '').trim();
  const source = String(data.get('source') || 'unknown').trim();

  // Honeypot tripped — pretend success, do nothing.
  if (gotcha || !email) {
    return redirectToThankYou();
  }

  const formAction = import.meta.env.PUBLIC_BRIEF_FORM_ACTION;
  const resendKey = import.meta.env.RESEND_API_KEY;
  const resendFrom = import.meta.env.RESEND_FROM || 'The Veil Press <onboarding@resend.dev>';

  // Forward to Formspree so the existing owner-notification flow keeps working.
  if (typeof formAction === 'string' && formAction.trim()) {
    try {
      await fetch(formAction, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          source,
          _subject: 'The Veil Press Brief',
        }),
      });
    } catch {
      // Non-fatal — don't block the submitter on the owner-notification path.
    }
  }

  // Send the submitter their chapter, if Resend is configured.
  if (typeof resendKey === 'string' && resendKey.trim()) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: resendFrom,
        to: email,
        subject: 'Your free chapter — The Veil of the Square Mile',
        html: autoresponseHtml(),
      });
    } catch {
      // Non-fatal — the thank-you page still delivers the chapter on-page.
    }
  }

  return redirectToThankYou();
};
