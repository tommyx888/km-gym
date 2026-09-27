import type { Metadata } from 'next';
import GoogleMap from '@/components/GoogleMap';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import ReservineButton from '@/components/ReservineButton';
import PlaceholderNote, { clean } from '@/components/PlaceholderNote';
import { isLocale, type Locale } from '@/lib/i18n/config';
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
  const o = site.operator;

  const rows: { label: string; value: string; href?: string; note?: string; placeholder?: boolean }[] = [
    { label: t.contact.phone, value: site.contact.phone, href: site.contact.phoneHref },
    site.contact.email
      ? { label: t.contact.email, value: site.contact.email, href: `mailto:${site.contact.email}` }
      : { label: t.contact.email, value: '—', placeholder: true },
    { label: t.contact.address, value: `${a.street}, ${a.zip} ${a.city}` },
    { label: t.contact.hours, value: t.contact.hoursAlways, note: t.contact.hoursNote },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ExerciseGym',
    name: site.name,
    telephone: '+421903246453',
    ...(site.contact.email ? { email: site.contact.email } : {}),
    url: site.domain,
    foundingDate: String(site.foundedYear),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    address: { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.city, postalCode: a.zip, addressCountry: 'SK' },
    parentOrganization: {
      '@type': 'Organization',
      name: o.name,
      vatID: o.icdph,
      address: { '@type': 'PostalAddress', streetAddress: o.street, addressLocality: o.city, postalCode: o.zip, addressCountry: 'SK' },
    },
    ...(site.social.instagram || site.social.facebook ? { sameAs: [site.social.instagram, site.social.facebook].filter(Boolean) } : {}),
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
                          <span className="font-display text-[2rem] leading-none text-white md:text-[2.4rem]">
                            {row.value}
                            {row.placeholder && <PlaceholderNote text="[DOPLNIŤ]" label={t.common.placeholderBadge} />}
                          </span>
                        )}
                        {row.note && <p className="mt-2 text-sm text-mist">{row.note}</p>}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>

              <Reveal delay={400} className="mt-8">
                <p className="eyebrow">
                  {t.contact.social}
                  {!site.social.instagram && !site.social.facebook && <PlaceholderNote text="[DOPLNIŤ]" label={t.common.placeholderBadge} />}
                </p>
                <div className="mt-4 flex gap-3">
                  {site.social.instagram && (
                    <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Instagram</a>
                  )}
                  {site.social.facebook && (
                    <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Facebook</a>
                  )}
                </div>
              </Reveal>

              <Reveal delay={480} className="mt-10 border hairline p-6">
                <p className="eyebrow">{t.contact.operatorTitle}</p>
                <p className="mt-4 text-white">{o.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-mist">
                  {o.street}, {o.zip} {o.city}
                  <br />
                  IČO: {o.ico} · DIČ: {o.dic} · IČ DPH: {o.icdph}
                </p>
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
            <ReservineButton text={t.nav.cta} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
