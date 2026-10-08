import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import MembersAdmin, { type MemberRow } from '@/components/admin/MembersAdmin';
import { createClient } from '@/lib/supabase/server';
import { isLocale, localizedHref, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: `${t.admin.title} — ${t.admin.eyebrow} — KM GYM` }, robots: { index: false, follow: false } };
}

export default async function AdminPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(localizedHref(locale, 'login'));

  const { data: me } = await supabase.from('km_gym_profiles').select('is_admin').eq('id', user.id).maybeSingle();
  if (!me?.is_admin) redirect(localizedHref(locale, 'members'));

  // RLS: admin vidí všetky profily (km_gym_is_admin()).
  const { data } = await supabase
    .from('km_gym_profiles')
    .select('id, email, full_name, phone, locale, membership_status, membership_until, tracker_invite_code, is_admin, created_at')
    .order('created_at', { ascending: false });
  const members = (data ?? []) as MemberRow[];

  const trackerUrl: string = site.tracker.url;
  const trackerAdminUrl = trackerUrl ? `${trackerUrl.replace(/\/$/, '')}/admin` : '';

  const stats = {
    total: members.length,
    active: members.filter((m) => m.membership_status === 'active').length,
    tracker: members.filter((m) => Boolean(m.tracker_invite_code)).length,
    admins: members.filter((m) => m.is_admin).length,
  };

  return (
    <>
      <PageHero eyebrow={t.admin.eyebrow} title={t.admin.title} lead={t.admin.lead} />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8">
          <Reveal>
            <div className="grid grid-cols-2 gap-px bg-ink-700 lg:grid-cols-4">
              {(['total', 'active', 'tracker', 'admins'] as const).map((k) => (
                <div key={k} className="bg-ink-900 p-6">
                  <p className="font-display text-[3rem] leading-none text-white">{stats[k]}</p>
                  <p className="mt-2 text-[0.68rem] uppercase tracking-[0.25em] text-mist">{t.admin.stats[k]}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal delay={80}>
                <MembersAdmin locale={locale} t={t.admin} members={members} currentUserId={user.id} trackerAdminUrl={trackerAdminUrl} />
              </Reveal>
            </div>
            <aside className="lg:col-span-4">
              <Reveal delay={160}>
                <div className="border hairline bg-ink-950 p-7 grain md:p-8">
                  <p className="eyebrow">{t.admin.howTo.title}</p>
                  <ol className="relative z-10 mt-6 space-y-5">
                    {t.admin.howTo.steps.map((s, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="font-display shrink-0 text-[1.6rem] leading-none text-crimson-500">0{i + 1}</span>
                        <p className="text-sm leading-relaxed text-mist">{s}</p>
                      </li>
                    ))}
                  </ol>
                  <Link href={localizedHref(locale, 'members')} className="nav-link relative z-10 mt-8 inline-block !text-[0.7rem]">
                    ← {t.admin.backToMembers}
                  </Link>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
