import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { createClient } from '@/lib/supabase/server';
import { isLocale, localizedHref, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { fmtDate, fmtTime, TRAINING_COLS, type Training, type TrainingCounts } from '@/lib/trainings';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: `${t.admin.trainings.title} — ${t.admin.eyebrow} — KM GYM` }, robots: { index: false, follow: false } };
}

export default async function AdminTrainingsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);
  const a = t.admin.trainings;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(localizedHref(locale, 'login'));
  const { data: me } = await supabase.from('km_gym_profiles').select('is_admin').eq('id', user.id).maybeSingle();
  if (!me?.is_admin) redirect(localizedHref(locale, 'members'));

  const now = new Date().toISOString();
  const [{ data: upcoming }, { data: past }, { data: counts }] = await Promise.all([
    supabase.from('km_gym_trainings').select(TRAINING_COLS).gte('starts_at', now).order('starts_at').limit(100),
    supabase.from('km_gym_trainings').select(TRAINING_COLS).lt('starts_at', now).order('starts_at', { ascending: false }).limit(30),
    supabase.from('km_gym_training_counts').select('*'),
  ]);
  const cm = new Map((counts as TrainingCounts[] | null)?.map((c) => [c.training_id, c]));
  const base = localizedHref(locale, 'admin');

  const list = (rows: Training[]) => (
    <ul className="divide-y hairline border hairline">
      {rows.map((tr) => {
        const c = cm.get(tr.id);
        return (
          <li key={tr.id}>
            <Link href={`${base}/treningy/${tr.id}`} className="flex flex-col gap-2 p-5 transition-colors hover:bg-ink-900 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-crimson-500">
                  {fmtDate(tr.starts_at, locale, { weekday: 'short' })} · {fmtTime(tr.starts_at, locale)}
                  {tr.series_id && <span className="ml-2 text-ink-500">· {a.series}</span>}
                </p>
                <p className="font-display mt-1 text-[1.5rem] leading-none text-white">{tr.title}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-[0.68rem] uppercase tracking-[0.2em]">
                <span className="text-mist">{a.counts.replace('{n}', String(c?.confirmed ?? 0)).replace('{max}', String(tr.capacity)).replace('{w}', String(c?.waitlist ?? 0))}</span>
                <span className={tr.status === 'published' ? 'text-white' : tr.status === 'cancelled' ? 'text-crimson-500' : 'text-ink-500'}>{a.status[tr.status]}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <PageHero eyebrow={t.admin.eyebrow} title={a.title} />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href={base} className="nav-link !text-[0.7rem]">
                ← {t.admin.title}
              </Link>
              <Link href={`${base}/treningy/novy`} className="btn btn-primary">
                {a.new}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow mt-12">{a.upcoming}</p>
            <div className="mt-5">{upcoming && upcoming.length ? list(upcoming as Training[]) : <p className="text-mist">{a.none}</p>}</div>
          </Reveal>
          {past && past.length > 0 && (
            <Reveal delay={120}>
              <p className="eyebrow mt-14">{a.past}</p>
              <div className="mt-5 opacity-70">
                list(past as Training[])
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
