import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import TrainingForm from '@/components/admin/TrainingForm';
import TrainingActions from '@/components/admin/TrainingActions';
import TrainingSignups, { type SignupRow } from '@/components/admin/TrainingSignups';
import { createClient } from '@/lib/supabase/server';
import { isLocale, localizedHref, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { TRAINING_COLS, type SignupStatus, type Training } from '@/lib/trainings';

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: `${id === 'novy' ? t.admin.trainings.new : t.admin.trainings.edit} — KM GYM` }, robots: { index: false, follow: false } };
}

export default async function AdminTrainingPage({ params }: Props) {
  const { locale: raw, id } = await params;
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
  const base = localizedHref(locale, 'admin');

  let training: Training | null = null;
  let signups: SignupRow[] = [];
  if (id !== 'novy') {
    const { data } = await supabase.from('km_gym_trainings').select(TRAINING_COLS).eq('id', id).maybeSingle();
    if (!data) notFound();
    training = data as Training;
    const { data: s } = await supabase.from('km_gym_training_signups').select('id, user_id, status, created_at').eq('training_id', id).neq('status', 'cancelled').order('created_at');
    const ids = (s ?? []).map((r) => r.user_id);
    const { data: profiles } = ids.length ? await supabase.from('km_gym_profiles').select('id, full_name, email, phone').in('id', ids) : { data: [] };
    const pm = new Map((profiles ?? []).map((p) => [p.id, p]));
    signups = (s ?? []).map((r) => {
      const p = pm.get(r.user_id);
      return { id: r.id, user_id: r.user_id, status: r.status as SignupStatus, created_at: r.created_at, name: p?.full_name || p?.email || r.user_id.slice(0, 8), email: p?.email ?? null, phone: p?.phone ?? null };
    });
  }

  return (
    <>
      <PageHero eyebrow={t.admin.eyebrow} title={training ? training.title : a.new} />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href={`${base}/treningy`} className="nav-link !text-[0.7rem]">
                ← {a.back}
              </Link>
              {training && <TrainingActions locale={locale} t={a} training={training} />}
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <Reveal delay={80} className="lg:col-span-7">
              <div className="border hairline p-7 md:p-8">
                <TrainingForm locale={locale} t={a} training={training} />
              </div>
            </Reveal>
            {training && (
              <Reveal delay={140} className="lg:col-span-5">
                <div className="border hairline p-7 md:p-8">
                  <TrainingSignups t={a} trainingId={training.id} rows={signups} started={new Date(training.starts_at) <= new Date()} />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
