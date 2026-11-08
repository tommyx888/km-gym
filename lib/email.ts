/** Transakčné e-maily cez Resend REST API. Bez RESEND_API_KEY sa nič neposiela (vráti false). */
export type Attachment = { filename: string; content: string; contentType?: string }; // content = base64

export async function sendEmail(to: string | string[], subject: string, html: string, attachments?: Attachment[]): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'KM GYM <info@kmgym.sk>';
  if (!key) {
    console.warn('[email] RESEND_API_KEY chýba – e-mail neodoslaný:', subject);
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, html, attachments: attachments?.map((a) => ({ filename: a.filename, content: a.content, content_type: a.contentType })) }),
    });
    if (!res.ok) console.error('[email] resend', res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error('[email] send failed', e);
    return false;
  }
}

export function emailShell(title: string, body: string, cta?: { label: string; url: string }): string {
  return `<!doctype html><html><body style="margin:0;background:#131518;font-family:Inter,Arial,sans-serif;color:#e6e6e6">
<div style="max-width:560px;margin:0 auto;padding:40px 24px">
<p style="font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#C8102E;margin:0 0 16px">KM GYM</p>
<h1 style="font-size:28px;line-height:1.1;margin:0 0 20px;color:#fff">${title}</h1>
${body}
${cta ? `<p style="margin:28px 0"><a href="${cta.url}" style="display:inline-block;background:#C8102E;color:#fff;text-decoration:none;padding:14px 24px;font-size:13px;letter-spacing:.2em;text-transform:uppercase">${cta.label}</a></p>` : ''}
<p style="margin-top:32px;font-size:12px;color:#8a8f98">KM GYM · Kuchyňa 214, 900 52 Kuchyňa · +421 903 246 453</p>
</div></body></html>`;
}
