import Image from 'next/image';
import Link from 'next/link';
import { localizedHref, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { fmtDate, fmtTime, plural, tl, type Training } from '@/lib/trainings';

/** Karta tréningu v tvare lístka: fotka + obsah, perforácia so zárezmi, útržok s dátumom a voľnými miestami. */
export default function TrainingCard({ t, d, locale, counts, compact = false }: { t: Training; d: Dictionary['trainings']; locale: Locale; counts?: { confirmed: number; waitlist: number }; compact?: boolean }) {
  const free = Math.max(0, t.capacity - (counts?.confirmed ?? 0));
  const past = new Date(t.starts_at) < new Date();
  const start = new Date(t.starts_at);
  const day = start.toLocaleDateString(locale === 'sk' ? 'sk-SK' : 'en-GB', { timeZone: 'Europe/Bratislava', day: '2-digit' });
  const month = start.toLocaleDateString(locale === 'sk' ? 'sk-SK' : 'en-GB', { timeZone: 'Europe/Bratislava', month: 'short' }).replace('.', '');
  const edge = 'border hairline transition-colors group-hover:border-crimson-600/60';
  return (
    <Link href={localizedHref(locale, 'trainings', t.slug)} className="ticket group block">
      <div className={`${edge} border-b-0 bg-ink-900`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
          {t.image_url ? (
            <Image src={t.image_url} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          ) : (
            <div className="font-display absolute inset-0 flex items-center justify-center text-[5rem] text-white/5">KM</div>
          )}
          <div className="absolute left-4 top-4 flex flex-col items-center bg-ink-950/90 px-3 py-2 text-white">
            <span className="font-display text-[1.9rem] leading-none">{day}</span>
            <span className="text-[0.6rem] uppercase tracking-[0.25em] text-mist">{month}</span>
          </div>
          {t.status === 'cancelled' && <span className="absolute right-4 top-4 bg-crimson-700 px-2 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-white">{d.cancelled}</span>}
        </div>
        <div className="p-5">
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-crimson-500">
            {fmtTime(t.starts_at, locale)} · {t.duration_min} {d.minutes}
            {t.trainer ? ` · ${t.trainer}` : ''}
          </p>
          <h3 className="font-display mt-2 text-[1.7rem] leading-none text-white">{tl(t, 'title', locale)}</h3>
          {!compact && tl(t, 'description', locale) && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-mist">{tl(t, 'description', locale)}</p>}
        </div>
      </div>

      {/* perforácia so zárezmi + útržok */}
      <div className="ticket-perf" aria-hidden="true" />
      <div className={`${edge} border-t-0 bg-ink-900 px-5 py-3`}>
        <div className="flex items-center justify-between text-[0.68rem] uppercase tracking-[0.2em]">
          <span className="text-mist">{fmtDate(t.starts_at, locale, { weekday: 'short' })}</span>
          {t.status === 'published' && !past && <span className={free > 0 ? 'text-white' : 'text-crimson-500'}>{free > 0 ? plural(d.spots, free) : d.full}</span>}
          {past && <span className="text-ink-500">{d.past}</span>}
        </div>
      </div>
    </Link>
  );
}
