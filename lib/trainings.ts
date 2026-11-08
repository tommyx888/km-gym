import type { Locale } from './i18n/config';

export type TrainingStatus = 'draft' | 'published' | 'cancelled';
export type TrainingPricing = 'free' | 'included' | 'paid';
export type SignupStatus = 'confirmed' | 'waitlist' | 'cancelled' | 'attended' | 'no_show';

export type Training = {
  id: string;
  slug: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  details: string | null;
  details_en: string | null;
  trainer: string | null;
  location: string | null;
  starts_at: string;
  duration_min: number;
  capacity: number;
  image_url: string | null;
  pricing: TrainingPricing;
  price_cents: number | null;
  payment_url: string | null;
  payment_note: string | null;
  members_only: boolean;
  cancel_deadline_hours: number;
  status: TrainingStatus;
  series_id: string | null;
  reminder_sent_at: string | null;
  created_at: string;
};

export type TrainingCounts = { training_id: string; confirmed: number; waitlist: number };

export const TRAINING_COLS =
  'id, slug, title, title_en, description, description_en, details, details_en, trainer, location, starts_at, duration_min, capacity, image_url, pricing, price_cents, payment_url, payment_note, members_only, cancel_deadline_hours, status, series_id, reminder_sent_at, created_at';

/** Lokalizované pole (EN s fallbackom na SK). */
export function tl(t: Training, field: 'title' | 'description' | 'details', locale: Locale): string {
  const en = t[`${field}_en` as const];
  return (locale === 'en' && en) || t[field] || '';
}

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

const TZ = 'Europe/Bratislava';
export function fmtDate(iso: string, locale: Locale, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString(locale === 'sk' ? 'sk-SK' : 'en-GB', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', ...opts });
}
export function fmtTime(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleTimeString(locale === 'sk' ? 'sk-SK' : 'en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
}
export function fmtDateTime(iso: string, locale: Locale): string {
  return `${fmtDate(iso, locale)} · ${fmtTime(iso, locale)}`;
}
export function endsAt(t: Pick<Training, 'starts_at' | 'duration_min'>): Date {
  return new Date(new Date(t.starts_at).getTime() + t.duration_min * 60_000);
}
export function plural(forms: { one: string; few: string; other: string }, n: number): string {
  const f = n === 1 ? forms.one : n >= 2 && n <= 4 ? forms.few : forms.other;
  return f.replace('{n}', String(n));
}
export function cancelDeadline(t: Pick<Training, 'starts_at' | 'cancel_deadline_hours'>): Date {
  return new Date(new Date(t.starts_at).getTime() - t.cancel_deadline_hours * 3_600_000);
}

/** iCalendar súbor pre „Pridať do kalendára“ a e‑mailovú prílohu. */
export function buildIcs(t: Training, locale: Locale, url: string): string {
  const dt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (m) => `\\${m}`);
  const start = new Date(t.starts_at);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KM GYM//Trainings//SK',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:kmgym-training-${t.id}`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(start)}`,
    `DTEND:${dt(endsAt(t))}`,
    `SUMMARY:${esc(`KM GYM – ${tl(t, 'title', locale)}`)}`,
    `DESCRIPTION:${esc(`${tl(t, 'description', locale)}\n${url}`)}`,
    `LOCATION:${esc(t.location || 'KM GYM, Kuchyňa 214')}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
