import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Poster from '@/components/trainings/Poster';
import { createClient } from '@/lib/supabase/server';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { TRAINING_COLS, type Training } from '@/lib/trainings';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Plagát A4 na tlač – hlavička/päta webu sa v tlači skryjú (print CSS .poster-page). */
export default async function PosterPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const supabase = await createClient();
  const { data } = await supabase.from('km_gym_trainings').select(TRAINING_COLS).eq('slug', slug).neq('status', 'draft').maybeSingle();
  if (!data) notFound();
  return <Poster t={data as Training} locale={locale} />;
}
