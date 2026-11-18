import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import NewsletterAdmin, { type SubscriberRow } from '@/components/admin/NewsletterAdmin';
import { createClient } from '@/lib/supabase/server';
import { isLocale, localizedHref, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: `${t.admin.newsletter.title} — ${t.admin.eyebrow} — KM GYM` }, robots: { index: false, follow: false } };
}

export default async function AdminNewsletterPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);
  const a = t.admin.newsletter;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(localizedHref(locale, 'login'));
  const { data: me } = await supabase.from('km_gym_profiles').select('is_admin').eq('id', user.id).maybeSingle();
  if (!me?.is_admin) redirect(localizedHref(locale, 'members'));

  // RLS: admin číta cez politiku km_gym_newsletter_admin.
  const { data } = await supabase.from('km_gym_newsletter').select('id, email, locale, source, confirmed_at, unsubscribed_at, created_at').order('created_at', { ascending: false });
  const rows = (data ?? []) as SubscriberRow[];

  return (
    <>
      <PageHero eyebrow={t.admin.eyebrow} title={a.title} lead={a.lead} />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8">
          <Reveal>
            <div className="mb-8 flex flex-wrap gap-3">
              <Link href={localizedHref(locale, 'admin')} className="btn btn-ghost !px-4 !py-2 !text-[0.65rem]">
                ← {t.admin.title}
              </Link>
              <Link href={`${localizedHref(locale, 'admin')}/treningy`} className="btn btn-ghost !px-4 !py-2 !text-[0.65rem]">
                {t.admin.trainings.link}
              </Link>
            </div>
            <NewsletterAdmin t={a} rows={rows} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
