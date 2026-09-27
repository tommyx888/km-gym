import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import ReservineButton from '@/components/ReservineButton';
import MembershipForm from '@/components/MembershipForm';
import PlaceholderNote, { clean } from '@/components/PlaceholderNote';
import { isLocale, localizedHref, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ plan?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: t.membership.metaTitle }, description: t.membership.metaDescription };
}

export default async function BookingPage({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  const { plan } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);
  const reservineReady = Boolean(site.reservine.partner && site.reservine.scriptSrc);

  return (
    <>
      <PageHero eyebrow={t.membership.eyebrow} title={t.membership.title} lead={t.membership.lead} />

      {/* Reservine */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="relative overflow-hidden border hairline bg-ink-950 p-8 grain md:p-12">
                <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-crimson-700/25 blur-[100px]" aria-hidden="true" />
                <div className="relative z-10">
                  <p className="eyebrow">{t.membership.reservineTitle}</p>
                  <ol className="mt-8 grid grid-cols-2 gap-px bg-ink-700 sm:grid-cols-4">
                    {t.howItWorks.steps.map((s) => (
                      <li key={s.n} className="bg-ink-950 p-4">
                        <span className="font-display text-[0.8rem] tracking-[0.2em] text-crimson-500">{s.n}</span>
                        <p className="font-display mt-2 text-[1.3rem] leading-none text-white">{s.title}</p>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-8 max-w-xl leading-relaxed text-mist">{t.membership.reservineText}</p>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <ReservineButton text={t.membership.reservineCta} />
                    <Link href={localizedHref(locale, 'howItWorks')} className="btn btn-ghost">
                      {t.nav.howItWorks}
                    </Link>
                  </div>
                  {!reservineReady && (
                    <p className="mt-5 text-sm text-ink-500">
                      {clean(t.membership.reservineNote)}
                      <PlaceholderNote text={t.membership.reservineNote} label={t.common.placeholderBadge} />
                    </p>
                  )}
                </div>
              </div>
            </Reveal>

            <div className="space-y-6 lg:col-span-5">
              <Reveal delay={120}>
                <div className="border hairline p-7 md:p-9">
                  <p className="eyebrow">{t.membership.infoTitle}</p>
                  <ul className="mt-6 space-y-4">
                    {t.membership.info.map((line, i) => (
                      <li key={i} className="flex gap-4 text-mist">
                        <span className="font-display mt-0.5 text-[0.85rem] tracking-[0.2em] text-crimson-500">0{i + 1}</span>
                        <span className="leading-relaxed">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={220}>
                <div className="border hairline p-7 md:p-9">
                  <p className="eyebrow">{t.membership.directTitle}</p>
                  <div className="mt-6 flex flex-col gap-3">
                    <a href={site.contact.phoneHref} className="btn btn-ghost justify-between">
                      {t.membership.call}
                      <span className="tabular normal-case tracking-normal text-mist">{site.contact.phone}</span>
                    </a>
                    {site.contact.email && (
                      <a href={`mailto:${site.contact.email}`} className="btn btn-ghost justify-between">
                        {t.membership.write}
                        <span className="normal-case tracking-normal text-mist">{site.contact.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Kontaktný formulár (otázka / záujem) – Supabase */}
      <section className="border-t hairline bg-ink-950 py-20 grain md:py-28">
        <div className="container relative z-10 mx-auto px-5 md:px-8">
          <Reveal className="mx-auto max-w-3xl">
            <div className="relative border hairline bg-ink-800 p-7 md:p-10">
              <span className="absolute left-0 top-0 h-full w-[3px] bg-crimson-600" aria-hidden="true" />
              <h2 className="font-display mb-8 text-[2rem] leading-none text-white">{t.membership.formTitle}</h2>
              <MembershipForm labels={t.membership.form} pricing={t.pricing} locale={locale} defaultPlan={plan} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
