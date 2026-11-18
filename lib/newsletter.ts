import { getSupabaseAdmin } from './supabase';
import { emailShell, sendEmail } from './email';
import { getDictionary } from './i18n/dictionaries';
import { isLocale, localizedHref, type Locale } from './i18n/config';
import { siteUrl } from './site-url';
import { fmtDateTime, tl, type Training } from './trainings';

/**
 * Newsletter – tabuľka km_gym_newsletter (iba service role zapisuje).
 * Double opt‑in: prihlásenie → potvrdzovací e‑mail s tokenom → confirmed_at.
 * Každý e‑mail má odkaz na odhlásenie (token).
 */
export type Subscriber = { id: string; email: string; locale: string; token: string; source: string | null; confirmed_at: string | null; unsubscribed_at: string | null; created_at: string };

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(raw: unknown): string | null {
  const e = String(raw ?? '').trim().toLowerCase();
  return EMAIL_RE.test(e) && e.length <= 254 ? e : null;
}

function statusUrl(locale: Locale, status: string) {
  return `${siteUrl()}${localizedHref(locale, 'newsletter')}?status=${status}`;
}
export function unsubscribeUrl(token: string) {
  return `${siteUrl()}/api/newsletter/unsubscribe?token=${token}`;
}
function confirmUrl(token: string) {
  return `${siteUrl()}/api/newsletter/confirm?token=${token}`;
}

/** Prihlásenie na odber: vráti 'sent' (poslaný potvrdzovací e‑mail), 'already' (už potvrdený) alebo 'error'. */
export async function subscribe(email: string, locale: Locale, source: string): Promise<'sent' | 'already' | 'error'> {
  const admin = getSupabaseAdmin();
  if (!admin) return 'error';
  const { data: existing } = await admin.from('km_gym_newsletter').select('*').eq('email', email).maybeSingle();
  let sub = existing as Subscriber | null;
  if (sub?.confirmed_at && !sub.unsubscribed_at) return 'already';
  if (sub) {
    // Odhlásený alebo nepotvrdený – nový token, znova potvrdiť.
    const { data } = await admin
      .from('km_gym_newsletter')
      .update({ token: crypto.randomUUID(), locale, source, unsubscribed_at: null, confirmed_at: null, updated_at: new Date().toISOString() })
      .eq('id', sub.id)
      .select('*')
      .single();
    sub = data as Subscriber | null;
  } else {
    const { data } = await admin.from('km_gym_newsletter').insert({ email, locale, source }).select('*').single();
    sub = data as Subscriber | null;
  }
  if (!sub) return 'error';
  const d = getDictionary(locale).newsletter.email;
  const html = emailShell(d.confirmTitle, `<p style="line-height:1.6">${d.confirmBody}</p>`, { label: d.confirmCta, url: confirmUrl(sub.token) });
  const ok = await sendEmail(email, d.confirmSubject, html);
  return ok ? 'sent' : 'error';
}

export async function confirmByToken(token: string): Promise<{ ok: boolean; locale: Locale; redirect: string }> {
  const admin = getSupabaseAdmin();
  const bad = { ok: false, locale: 'sk' as Locale, redirect: statusUrl('sk', 'invalid') };
  if (!admin || !/^[0-9a-f-]{36}$/i.test(token)) return bad;
  const { data } = await admin.from('km_gym_newsletter').select('*').eq('token', token).maybeSingle();
  const sub = data as Subscriber | null;
  if (!sub) return bad;
  const locale: Locale = isLocale(sub.locale) ? sub.locale : 'sk';
  if (!sub.confirmed_at || sub.unsubscribed_at) {
    await admin.from('km_gym_newsletter').update({ confirmed_at: new Date().toISOString(), unsubscribed_at: null, updated_at: new Date().toISOString() }).eq('id', sub.id);
  }
  return { ok: true, locale, redirect: statusUrl(locale, 'confirmed') };
}

export async function unsubscribeByToken(token: string): Promise<{ ok: boolean; redirect: string }> {
  const admin = getSupabaseAdmin();
  if (!admin || !/^[0-9a-f-]{36}$/i.test(token)) return { ok: false, redirect: statusUrl('sk', 'invalid') };
  const { data } = await admin.from('km_gym_newsletter').select('id, locale, unsubscribed_at').eq('token', token).maybeSingle();
  if (!data) return { ok: false, redirect: statusUrl('sk', 'invalid') };
  const locale: Locale = isLocale(data.locale) ? data.locale : 'sk';
  if (!data.unsubscribed_at) await admin.from('km_gym_newsletter').update({ unsubscribed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', data.id);
  return { ok: true, redirect: statusUrl(locale, 'unsubscribed') };
}

export async function listConfirmed(): Promise<Subscriber[]> {
  const admin = getSupabaseAdmin();
  if (!admin) return [];
  const { data } = await admin.from('km_gym_newsletter').select('*').not('confirmed_at', 'is', null).is('unsubscribed_at', null).order('created_at');
  return (data ?? []) as Subscriber[];
}

/** Pošle e‑mail všetkým potvrdeným odberateľom. build(locale, unsubscribeUrl) → { subject, html }. Vracia počet odoslaných. */
export async function sendToSubscribers(build: (locale: Locale, unsubUrl: string) => { subject: string; html: string }, only?: Subscriber[]): Promise<number> {
  const subs = only ?? (await listConfirmed());
  let sent = 0;
  // Resend: sekvenčne po jednom (jednoduché, bez limitov batch API); pri stovkách odberateľov prejsť na /emails/batch.
  for (const s of subs) {
    const locale: Locale = isLocale(s.locale) ? s.locale : 'sk';
    const { subject, html } = build(locale, unsubscribeUrl(s.token));
    if (await sendEmail(s.email, subject, html)) sent++;
  }
  return sent;
}

export function unsubscribeFooter(locale: Locale, unsubUrl: string) {
  const d = getDictionary(locale).newsletter.email;
  return `<p style="margin-top:24px;font-size:12px;color:#8a8f98"><a href="${unsubUrl}" style="color:#8a8f98">${d.unsubscribe}</a></p>`;
}

/** Automatický e‑mail „Nový tréning“ – volá sa pri zverejnení tréningu (raz; stráži newsletter_sent_at). */
export async function sendNewTrainingNewsletter(t: Training): Promise<number> {
  const admin = getSupabaseAdmin();
  if (!admin) return 0;
  const sent = await sendToSubscribers((locale, unsub) => {
    const d = getDictionary(locale).newsletter.email;
    const e = getDictionary(locale).trainings.email;
    const title = tl(t, 'title', locale);
    const url = `${siteUrl()}${localizedHref(locale, 'trainings', t.slug)}`;
    const desc = tl(t, 'description', locale);
    const rows = [
      [e.when, fmtDateTime(t.starts_at, locale)],
      [e.where, t.location || 'KM GYM, Kuchyňa 214'],
    ]
      .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#8a8f98;font-size:12px;text-transform:uppercase;letter-spacing:.15em">${k}</td><td style="padding:6px 0;color:#fff">${v}</td></tr>`)
      .join('');
    const img = t.image_url ? `<img src="${t.image_url}" alt="" style="display:block;width:100%;max-width:560px;height:auto;margin:0 0 20px" />` : '';
    const html = emailShell(
      d.newTrainingTitle,
      `${img}<p style="font-size:20px;color:#fff;margin:0 0 12px">${title}</p>${desc ? `<p style="line-height:1.6">${desc}</p>` : ''}<table style="border-collapse:collapse">${rows}</table><p style="margin-top:16px;line-height:1.6;color:#c9ccd1">${d.newTrainingBody}</p>${unsubscribeFooter(locale, unsub)}`,
      { label: d.newTrainingCta, url },
    );
    return { subject: d.newTrainingSubject.replace('{title}', title), html };
  });
  await admin.from('km_gym_trainings').update({ newsletter_sent_at: new Date().toISOString() }).eq('id', t.id);
  return sent;
}

/** Ručná správa z adminu („dôležité info“). text = odseky oddelené prázdnym riadkom. */
export function buildBroadcast(subject: string, text: string, cta: { label: string; url: string } | null) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="line-height:1.7;margin:0 0 14px">${escapeHtml(p).replace(/\n/g, '<br />')}</p>`)
    .join('');
  return (locale: Locale, unsub: string) => ({ subject, html: emailShell(escapeHtml(subject), paragraphs + unsubscribeFooter(locale, unsub), cta ?? undefined) });
}

export function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
