import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import ReservineButton from '@/components/ReservineButton';
import ProfileForm from '@/components/auth/ProfileForm';
import { createClient } from '@/lib/supabase/server';
import { isLocale, localizedHref, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ welcome?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: `${t.members.title} — KM GYM` }, robots: { index: false } };
}

export default async function MembersPage({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  const { welcome } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(localizedHref(locale, 'login'));

  const [{ data: profile }, { data: announcements }, { data: plans }] = await Promise.all([
    supabase.from('km_gym_profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('km_gym_announcements').select('*').order('pinned', { ascending: false }).order('published_at', { ascending: false }).limit(10),
    supabase.from('km_gym_plans').select('*').order('sort_order').order('created_at', { ascending: false }),
  ]);

  const name = profile?.full_name || user.email?.split('@')[0] || '';
  const status = (profile?.membership_status ?? 'none') as 'none' | 'active' | 'expired';
  const fmt = (d: string) => new Date(d).toLocaleDateString(locale === 'sk' ? 'sk-SK' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <PageHero eyebrow={t.members.eyebrow} title={`${t.members.hello} ${name}.`} lead={welcome ? t.members.welcomeLead : t.members.lead} />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Ľavý stĺpec: členstvo + denník */}
            <div className="space-y-6 lg:col-span-5">
              <Reveal>
                <div className="border hairline bg-ink-950 p-7 grain md:p-8">
                  <p className="eyebrow">{t.members.membership}</p>
                  <div className="relative z-10 mt-5 flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${status === 'active' ? 'bg-crimson-500' : 'bg-ink-600'}`} />
                    <span className="font-display text-[1.9rem] leading-none text-white">{t.members.status[status]}</span>
                  </div>
                  {profile?.membership_until && status === 'active' && (
                    <p className="relative z-10 mt-2 text-sm text-mist">
                      {t.members.until} {fmt(profile.membership_until)}
                    </p>
                  )}
                  <p className="relative z-10 mt-4 text-sm leading-relaxed text-mist">{t.members.membershipNote}</p>
                  <div className="relative z-10 mt-6 flex flex-col gap-3">
                    <ReservineButton text={t.members.book} />
                    <ReservineButton text={t.members.buy} variant="ghost" target="membership" />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="border hairline p-7 md:p-8">
                  <p className="eyebrow">{t.members.tracker}</p>
                  {profile?.tracker_invite_code ? (
                    <>
                      <p className="mt-4 text-sm text-mist">{t.members.trackerCode}</p>
                      <p className="font-display mt-2 select-all text-[2.4rem] leading-none tracking-[0.15em] text-crimson-500">{profile.tracker_invite_code}</p>
                      {site.tracker.url ? (
                        <a href={site.tracker.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5 w-full">
                          {t.tracker.cta}
                        </a>
                      ) : null}
                    </>
                  ) : (
                    <p className="mt-4 text-sm leading-relaxed text-mist">{t.members.trackerPending}</p>
                  )}
                  <Link href={localizedHref(locale, 'tracker')} className="nav-link mt-5 inline-block !text-[0.7rem]">
                    {t.members.trackerMore}
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="border hairline p-7 md:p-8">
                  <p className="eyebrow">{t.members.profile}</p>
                  <ProfileForm
                    locale={locale}
                    t={t.members.profileForm}
                    initial={{ full_name: profile?.full_name ?? '', phone: profile?.phone ?? '' }}
                    email={user.email ?? ''}
                  />
                </div>
              </Reveal>
            </div>

            {/* Pravý stĺpec: oznamy + plány */}
            <div className="space-y-6 lg:col-span-7">
              <Reveal delay={80}>
                <div className="border hairline p-7 md:p-8">
                  <p className="eyebrow">{t.members.announcements}</p>
                  {announcements && announcements.length > 0 ? (
                    <ul className="mt-6 divide-y hairline">
                      {announcements.map((a) => (
                        <li key={a.id} className="py-5 first:pt-0 last:pb-0">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-display text-[1.5rem] leading-none text-white">{locale === 'en' && a.title_en ? a.title_en : a.title}</h3>
                            {a.pinned && <span className="shrink-0 border border-crimson-600/60 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-crimson-500">{t.members.pinned}</span>}
                          </div>
                          <p className="mt-2 text-[0.72rem] uppercase tracking-[0.2em] text-ink-500">{fmt(a.published_at)}</p>
                          <p className="mt-3 whitespace-pre-line leading-relaxed text-mist">{locale === 'en' && a.body_en ? a.body_en : a.body}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-mist">{t.members.noAnnouncements}</p>
                  )}
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="border hairline p-7 md:p-8">
                  <p className="eyebrow">{t.members.plans}</p>
                  {plans && plans.length > 0 ? (
                    <ul className="mt-6 grid grid-cols-1 gap-px bg-ink-700 sm:grid-cols-2">
                      {plans.map((p) => (
                        <li key={p.id} className="flex flex-col bg-ink-900 p-5">
                          <span className="text-[0.65rem] uppercase tracking-[0.25em] text-crimson-500">
                            {t.members.levels[p.level as keyof typeof t.members.levels]} · {t.members.zones[p.zone as keyof typeof t.members.zones]}
                          </span>
                          <h3 className="font-display mt-3 text-[1.5rem] leading-none text-white">{locale === 'en' && p.title_en ? p.title_en : p.title}</h3>
                          {(p.description || p.description_en) && (
                            <p className="mt-2 flex-grow text-sm leading-relaxed text-mist">{locale === 'en' && p.description_en ? p.description_en : p.description}</p>
                          )}
                          <div className="mt-4 flex flex-wrap gap-2">
                            {p.file_url && (
                              <a href={p.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-4 !py-2 !text-[0.65rem]">
                                PDF
                              </a>
                            )}
                            {p.tracker_plan_url && (
                              <a href={p.tracker_plan_url} download className="btn btn-ghost !px-4 !py-2 !text-[0.65rem]">
                                {t.members.planFile}
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-mist">{t.members.noPlans}</p>
                  )}
                </div>
              </Reveal>

              <Reveal delay={240}>
                <form action="/auth/signout" method="post" className="flex justify-end">
                  <button type="submit" className="nav-link !text-[0.7rem]">
                    {t.auth.signOut}
                  </button>
                </form>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
