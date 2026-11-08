import Link from 'next/link';
import { localizedHref, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { fmtDate, fmtTime, type SignupStatus } from '@/lib/trainings';

export type MySignup = { status: SignupStatus; training: { slug: string; title: string; title_en: string | null; starts_at: string; status: string } };

export default function MyTrainings({ locale, t, rows, now }: { locale: Locale; t: Dictionary['trainings']; rows: MySignup[]; now: number }) {
  const upcoming = rows.filter((r) => new Date(r.training.starts_at).getTime() >= now && r.status !== 'cancelled');
  const history = rows.filter((r) => new Date(r.training.starts_at).getTime() < now && r.status !== 'cancelled').slice(0, 8);
  const item = (r: MySignup, key: number) => (
    <li key={key} className="flex items-center justify-between gap-3 py-3">
      <Link href={localizedHref(locale, 'trainings', r.training.slug)} className="min-w-0">
        <p className="truncate text-white">{(locale === 'en' && r.training.title_en) || r.training.title}</p>
        <p className="text-xs text-mist">
          {fmtDate(r.training.starts_at, locale, { weekday: 'short' })} · {fmtTime(r.training.starts_at, locale)}
        </p>
      </Link>
      <span className={`shrink-0 text-[0.62rem] uppercase tracking-[0.2em] ${r.status === 'confirmed' || r.status === 'attended' ? 'text-crimson-500' : r.training.status === 'cancelled' ? 'text-crimson-500' : 'text-ink-500'}`}>
        {r.training.status === 'cancelled' ? t.cancelled : t.my.status[r.status]}
      </span>
    </li>
  );
  return (
    <div className="border hairline p-7 md:p-8">
      <p className="eyebrow">{t.my.title}</p>
      {upcoming.length === 0 && history.length === 0 ? (
        <>
          <p className="mt-4 text-sm text-mist">{t.my.none}</p>
          <Link href={localizedHref(locale, 'trainings')} className="btn btn-ghost mt-5 !px-5 !py-3 !text-[0.65rem]">
            {t.my.browse}
          </Link>
        </>
      ) : (
        <>
          {upcoming.length > 0 && (
            <>
              <h3 className="mt-5 text-[0.65rem] uppercase tracking-[0.25em] text-ink-500">{t.my.upcoming}</h3>
              <ul className="mt-2 divide-y hairline">{upcoming.map(item)}</ul>
            </>
          )}
          {history.length > 0 && (
            <>
              <h3 className="mt-6 text-[0.65rem] uppercase tracking-[0.25em] text-ink-500">{t.my.history}</h3>
              <ul className="mt-2 divide-y hairline opacity-70">{history.map(item)}</ul>
            </>
          )}
          <Link href={localizedHref(locale, 'trainings')} className="nav-link mt-5 inline-block !text-[0.7rem]">
            {t.my.browse}
          </Link>
        </>
      )}
    </div>
  );
}
