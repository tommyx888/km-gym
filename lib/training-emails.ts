import { emailShell, sendEmail } from './email';
import { buildIcs, calendarLinks, fmtDateTime, tl, type Training, type TrainingCounts } from './trainings';
import { getDictionary } from './i18n/dictionaries';
import { localizedHref, type Locale } from './i18n/config';
import { siteUrl } from './site-url';

type Kind = 'confirmed' | 'waitlist' | 'promoted' | 'reminder' | 'cancelled';

function trainingUrl(t: Training, locale: Locale) {
  return `${siteUrl()}${localizedHref(locale, 'trainings', t.slug)}`;
}

function factsTable(t: Training, locale: Locale) {
  const d = getDictionary(locale).trainings.email;
  const rows = [
    [d.when, fmtDateTime(t.starts_at, locale)],
    [d.where, t.location || 'KM GYM, Kuchyňa 214'],
  ];
  return `<table style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#8a8f98;font-size:12px;text-transform:uppercase;letter-spacing:.15em">${k}</td><td style="padding:6px 0;color:#fff">${v}</td></tr>`)
    .join('')}</table>`;
}

/** Blok „Pridať do kalendára“ – Google / Outlook odkazy + poznámka o .ics prílohe. */
function calendarBlock(t: Training, locale: Locale, url: string) {
  const d = getDictionary(locale).trainings.email;
  const links = calendarLinks(t, locale, url);
  const btn = (label: string, href: string) =>
    `<a href="${href}" style="display:inline-block;border:1px solid #3a3d44;color:#fff;text-decoration:none;padding:10px 16px;font-size:12px;letter-spacing:.15em;text-transform:uppercase;margin:0 8px 8px 0">${label}</a>`;
  return `<div style="margin-top:24px;padding-top:20px;border-top:1px solid #2a2d33">
<p style="margin:0 0 12px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#8a8f98">${d.addToCalendar}</p>
${btn(d.calendarGoogle, links.google)}${btn(d.calendarOutlook, links.outlook)}
<p style="margin:8px 0 0;font-size:12px;color:#8a8f98;line-height:1.6">${d.calendarIcs}</p>
</div>`;
}

/** Jeden e‑mail o tréningu pre jedného člena. */
export async function sendTrainingEmail(kind: Kind, to: string, t: Training, locale: Locale): Promise<boolean> {
  const d = getDictionary(locale).trainings.email;
  const title = tl(t, 'title', locale);
  const url = trainingUrl(t, locale);
  const details = tl(t, 'details', locale);
  const extra = details ? `<p style="margin-top:16px;line-height:1.6;color:#c9ccd1;white-space:pre-line">${details}</p>` : '';
  const note = t.pricing === 'paid' && t.payment_note ? `<p style="margin-top:12px;line-height:1.6;color:#c9ccd1">${t.payment_note}</p>` : '';

  const subjects: Record<Kind, string> = {
    confirmed: d.confirmedSubject, waitlist: d.waitlistSubject, promoted: d.promotedSubject, reminder: d.reminderSubject, cancelled: d.cancelledSubject,
  };
  const titles: Record<Kind, string> = { confirmed: d.confirmedTitle, waitlist: d.waitlistTitle, promoted: d.promotedTitle, reminder: d.reminderTitle, cancelled: d.cancelledTitle };
  const intro =
    kind === 'waitlist' ? `<p style="line-height:1.6">${d.waitlistBody}</p>` : kind === 'cancelled' ? `<p style="line-height:1.6">${d.cancelledBody}</p>` : '';
  const withCalendar = kind === 'confirmed' || kind === 'promoted' || kind === 'reminder';
  const cancelInfo = withCalendar ? `<p style="margin-top:16px;font-size:13px;color:#8a8f98;line-height:1.6">${d.cancelInfo.replace('{h}', String(t.cancel_deadline_hours))}</p>` : '';

  const html = emailShell(
    titles[kind],
    `<p style="font-size:20px;color:#fff;margin:0 0 12px">${title}</p>${intro}${factsTable(t, locale)}${kind !== 'cancelled' ? extra + note : ''}${cancelInfo}${withCalendar ? calendarBlock(t, locale, url) : ''}`,
    kind !== 'cancelled' ? { label: d.open, url } : undefined,
  );
  const attachments = withCalendar
    ? [{ filename: 'km-gym-trening.ics', content: Buffer.from(buildIcs(t, locale, url)).toString('base64'), contentType: 'text/calendar' }]
    : undefined;
  return sendEmail(to, subjects[kind].replace('{title}', title), html, attachments);
}

export type Registrant = { name: string; email: string };

/** E‑mail zadávateľovi tréningu (tomu, kto ho vytvoril): niekto sa prihlásil / odhlásil. */
export async function sendCreatorNotice(
  event: 'signup' | 'cancel',
  to: string,
  t: Training,
  who: Registrant,
  status: 'confirmed' | 'waitlist' | null,
  counts: TrainingCounts | null,
  locale: Locale,
): Promise<boolean> {
  const d = getDictionary(locale).trainings.email;
  const title = tl(t, 'title', locale);
  const adminUrl = `${siteUrl()}${localizedHref(locale, 'admin')}/treningy/${t.id}`;
  const fill = (s: string) =>
    s
      .replace('{name}', who.name || '—')
      .replace('{email}', who.email)
      .replace('{status}', status === 'waitlist' ? d.statusWaitlist : d.statusConfirmed);
  const body = event === 'signup' ? fill(d.creatorBody) : fill(d.creatorCancelBody);
  const countsLine = counts
    ? `<p style="margin:12px 0 0;font-size:13px;color:#8a8f98">${d.creatorCounts.replace('{n}', String(counts.confirmed)).replace('{max}', String(t.capacity)).replace('{w}', String(counts.waitlist))}</p>`
    : '';
  const html = emailShell(
    event === 'signup' ? d.creatorTitle : d.creatorCancelTitle,
    `<p style="font-size:20px;color:#fff;margin:0 0 12px">${title}</p><p style="line-height:1.6">${body}</p>${factsTable(t, locale)}${countsLine}`,
    { label: d.manage, url: adminUrl },
  );
  const subject = (event === 'signup' ? d.creatorSubject : d.creatorCancelSubject).replace('{title}', title);
  return sendEmail(to, subject, html);
}
