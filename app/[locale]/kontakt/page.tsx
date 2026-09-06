import type { Metadata } from 'next';
import Link from 'next/link';
import GoogleMap from '@/components/GoogleMap';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import PlaceholderNote, { clean } from '@/components/PlaceholderNote';
import { isLocale, localizedHref, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: t.contact.metaTitle }, description: t.contact.metaDescription };
}

export default async function ContactPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);
  const a = site.contact.address;

  const rows = [
    { label: t.contact.phone, value: site.contact.phone, href: site.contact.phoneHref },
    { label: t.contact.email, value: site.contact.email, href: `mailto:${site.contact.email}` },
    { label: t.contact.address, value: `${a.street}, ${a.zip} ${a.city}` },
    {
      label: t.contact.hours,
      value: site.hours.mode === 'always' ? t.contact.hoursAlways : site.hours.schedule.map((s) => `${s.days} ${s.time}`).join(' · '),
      note: t.contact.hoursNote,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ExerciseGym',
    name: site.name,
    telephone: site.contact.phone,
    email: site.contact.email,
    url: site.domain,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      postalCode: a.zip,
      addressCountry: 'SK',
    },
    sameAs: [site.social.instagram, site.social.facebook],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow={t.contact.eyebrow} title={t.contact.title} lead={t.contact.lead} />

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <dl>
                {rows.map((row, i) => (
                  <Reveal key={row.label} delay={i * 80}>
                    <div className="border-b hairline py-6 first:border-t">
                      <dt className="eyebrow">{row.label}</dt>
                      <dd className="mt-3">
                        {row.href ? (
                          <a href={row.href} className="font-display text-[2rem] leading-none text-white transition-colors hover:text-crimson-500 md:text-[2.4rem] break-all">
                            {row.value}
                          </a>
                        ) : (
                          <span className="font-display text-[2rem] leading-none text-white md:text-[2.4rem]">{row.value}</span>
                        )}
                        {row.note && <p className="mt-2 text-sm text-mist">{row.note}</p>}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>

              <Reveal delay={400} className="mt-8">
                <p className="eyebrow">{t.contact.social}</p>
                <div className="mt-4 flex gap-3">
                  <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    Instagram
                  </a>
                  <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    Facebook
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={150}>
                <p className="eyebrow mb-5">{t.contact.findUs}</p>
                <GoogleMap query={a.mapQuery} title={`${site.name} – ${t.contact.address}`} />
                <p className="mt-4 text-sm text-mist">
                  {clean(t.contact.mapNote)}
                  <PlaceholderNote text={t.contact.mapNote} label={t.common.placeholderBadge} />
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t hairline bg-ink-950 py-20 grain md:py-28">
        <div className="container relative z-10 mx-auto px-5 md:px-8">
          <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-[3rem] leading-[0.92] text-white md:text-[4.4rem]">{t.contact.questionsTitle}</h2>
              <p className="mt-4 max-w-lg text-mist">{t.contact.questionsText}</p>
            </div>
            <Link href={localizedHref(locale, 'reservations')} className="btn btn-primary">
              {t.nav.cta}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
