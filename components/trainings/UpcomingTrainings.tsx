import Link from 'next/link';
import Reveal from '@/components/Reveal';
import TrainingCard from './TrainingCard';
import { createClient } from '@/lib/supabase/server';
import { localizedHref, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { TRAINING_COLS, type Training, type TrainingCounts } from '@/lib/trainings';

/** Sekcia „Čo sa chystá“ na úvodnej stránke – zobrazí sa len keď existujú zverejnené tréningy. */
export default async function UpcomingTrainings({ locale, t }: { locale: Locale; t: Dictionary['trainings'] }) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data } = await supabase.from('km_gym_trainings').select(TRAINING_COLS).eq('status', 'published').gte('starts_at', now).order('starts_at').limit(3);
  const rows = (data ?? []) as Training[];
  if (rows.length === 0) return null;
  const { data: counts } = await supabase.from('km_gym_training_counts').select('*').in('training_id', rows.map((r) => r.id));
  const cm = new Map((counts as TrainingCounts[] | null)?.map((c) => [c.training_id, c]));

  return (
    <section className="border-t hairline py-24 md:py-32">
      <div className="container mx-auto px-5 md:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{t.eyebrow}</p>
              <h2 className="font-display mt-6 text-[3rem] leading-[0.92] text-white md:text-[4.4rem]">{t.homeTitle}</h2>
            </div>
            <Link href={localizedHref(locale, 'trainings')} className="btn btn-ghost">
              {t.homeAll}
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {rows.map((tr, i) => (
            <Reveal key={tr.id} delay={i * 80}>
              <TrainingCard t={tr} d={t} locale={locale} counts={cm.get(tr.id)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
