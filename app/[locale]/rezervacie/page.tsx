import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import ReservationSection from '@/components/ReservationSection';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: t.reservations.metaTitle }, description: t.reservations.metaDescription };
}

export default async function ReservationsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);

  return (
    <>
      <PageHero eyebrow={t.reservations.eyebrow} title={t.reservations.title} lead={t.reservations.lead} />

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="relative border hairline bg-ink-800 p-7 md:p-10">
                <span className="absolute left-0 top-0 h-full w-[3px] bg-crimson-600" aria-hidden="true" />
                <h2 className="font-display mb-8 text-[2rem] leading-none text-white">{t.reservations.formTitle}</h2>
                <ReservationSection labels={t.reservations.form} locale={locale} />
              </div>
            </Reveal>

            <div className="space-y-6 lg:col-span-5">
              <Reveal delay={120}>
                <div className="border hairline bg-ink-950 p-7 md:p-9">
                  <p className="eyebrow">{t.reservations.infoTitle}</p>
                  <ul className="mt-6 space-y-4">
                    {t.reservations.info.map((line, i) => (
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
                  <p className="eyebrow">{t.reservations.directTitle}</p>
                  <div className="mt-6 flex flex-col gap-3">
                    <a href={site.contact.phoneHref} className="btn btn-ghost justify-between">
                      {t.reservations.call}
                      <span className="tabular normal-case tracking-normal text-mist">{site.contact.phone}</span>
                    </a>
                    <a href={`mailto:${site.contact.email}`} className="btn btn-ghost justify-between">
                      {t.reservations.write}
                      <span className="normal-case tracking-normal text-mist">{site.contact.email}</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
