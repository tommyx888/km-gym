import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import TrainingCard from '@/components/trainings/TrainingCard';
import { createClient } from '@/lib/supabase/server';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { TRAINING_COLS, type Training, type TrainingCounts } from '@/lib/trainings';

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: t.trainings.metaTitle }, description: t.trainings.metaDescription };
}

export default async function TrainingsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);
  const supabase = await createClient();
  const now = new Date().toISOString();
  const [{ data: upcoming }, { data: past }, { data: counts }] = await Promise.all([
    supabase.from('km_gym_trainings').select(TRAINING_COLS).eq('status', 'published').gte('starts_at', now).order('starts_at').limit(60),
    supabase.from('km_gym_trainings').select(TRAINING_COLS).neq('status', 'draft').lt('starts_at', now).order('starts_at', { ascending: false }).limit(6),
    supabase.from('km_gym_training_counts').select('*'),
  ]);
  const countMap = new Map((counts as TrainingCounts[] | null)?.map((c) => [c.training_id, c]));

  return (
    <>
      <PageHero eyebrow={t.trainings.eyebrow} title={t.trainings.title} lead={t.trainings.lead} />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8">
          {upcoming && upcoming.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {(upcoming as Training[]).map((tr, i) => (
                <Reveal key={tr.id} delay={i * 60}>
                  <TrainingCard t={tr} d={t.trainings} locale={locale} counts={countMap.get(tr.id)} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <p className="max-w-xl text-lg text-mist">{t.trainings.none}</p>
            </Reveal>
          )}

          {past && past.length > 0 && (
            <div className="mt-20">
              <p className="eyebrow">{t.trainings.past}</p>
              <div className="mt-6 grid grid-cols-1 gap-6 opacity-60 md:grid-cols-2 xl:grid-cols-3">
                {(past as Training[]).map((tr) => (
                  <TrainingCard key={tr.id} t={tr} d={t.trainings} locale={locale} counts={countMap.get(tr.id)} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
