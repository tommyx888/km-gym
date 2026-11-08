import { emailShell, sendEmail } from './email';
import { buildIcs, fmtDateTime, tl, type Training } from './trainings';
import { getDictionary } from './i18n/dictionaries';
import { localizedHref, type Locale } from './i18n/config';
import { siteUrl } from './site-url';

type Kind = 'confirmed' | 'waitlist' | 'promoted' | 'reminder' | 'cancelled';

function trainingUrl(t: Training, locale: Locale) {
  return `${siteUrl()}${localizedHref(locale, 'trainings', t.slug)}`;
}

/** Jeden e‑mail o tréningu pre jedného člena. */
export async function sendTrainingEmail(kind: Kind, to: string, t: Training, locale: Locale): Promise<boolean> {
  const d = getDictionary(locale).trainings.email;
  const title = tl(t, 'title', locale);
  const url = trainingUrl(t, locale);
  const rows = [
    [d.when, fmtDateTime(t.starts_at, locale)],
    [d.where, t.location || 'KM GYM, Kuchyňa 214'],
  ];
  const details = tl(t, 'details', locale);
  const table = rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#8a8f98;font-size:12px;text-transform:uppercase;letter-spacing:.15em">${k}</td><td style="padding:6px 0;color:#fff">${v}</td></tr>`).join('');
  const extra = details ? `<p style="margin-top:16px;line-height:1.6;color:#c9ccd1;white-space:pre-line">${details}</p>` : '';

  const subjects: Record<Kind, string> = {
    confirmed: d.confirmedSubject, waitlist: d.waitlistSubject, promoted: d.promotedSubject, reminder: d.reminderSubject, cancelled: d.cancelledSubject,
  };
  const titles: Record<Kind, string> = { confirmed: d.confirmedTitle, waitlist: d.waitlistTitle, promoted: d.promotedTitle, reminder: d.reminderTitle, cancelled: d.cancelledTitle };
  const intro =
    kind === 'waitlist' ? `<p style="line-height:1.6">${d.waitlistBody}</p>` : kind === 'cancelled' ? `<p style="line-height:1.6">${d.cancelledBody}</p>` : '';
  const cancelInfo = kind === 'confirmed' || kind === 'promoted' || kind === 'reminder' ? `<p style="margin-top:16px;font-size:13px;color:#8a8f98;line-height:1.6">${d.cancelInfo.replace('{h}', String(t.cancel_deadline_hours))}</p>` : '';

  const html = emailShell(
    titles[kind],
    `<p style="font-size:20px;color:#fff;margin:0 0 12px">${title}</p>${intro}<table style="border-collapse:collapse">${table}</table>${kind !== 'cancelled' ? extra : ''}${cancelInfo}`,
    kind !== 'cancelled' ? { label: d.open, url } : undefined,
  );
  const attachments =
    kind === 'confirmed' || kind === 'promoted'
      ? [{ filename: 'km-gym-trening.ics', content: Buffer.from(buildIcs(t, locale, url)).toString('base64'), contentType: 'text/calendar' }]
      : undefined;
  return sendEmail(to, subjects[kind].replace('{title}', title), html, attachments);
}
