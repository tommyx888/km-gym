import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import PlaceholderNote, { clean } from '@/components/PlaceholderNote';
import { isLocale, localizedHref, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: t.about.metaTitle }, description: t.about.metaDescription };
}

export default async function AboutPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);

  return (
    <>
      <PageHero eyebrow={t.about.eyebrow} title={t.about.title} lead={clean(t.about.lead)} />

      {/* Príbeh */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow">{t.about.story.title}</p>
              <div className="font-display mt-8 text-[7rem] leading-none text-ink-700 md:text-[10rem]" aria-hidden="true">
                KM
              </div>
            </Reveal>
            <div className="space-y-6 text-lg leading-relaxed text-mist lg:col-span-7 lg:col-start-6">
              <Reveal>
                <p className="text-white">
                  {clean(t.about.story.p1)}
                  <PlaceholderNote text={t.about.story.p1} label={t.common.placeholderBadge} />
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p>
                  {clean(t.about.story.p2)}
                  <PlaceholderNote text={t.about.story.p2} label={t.common.placeholderBadge} />
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Hodnoty */}
      <section className="border-y hairline bg-ink-950 py-20 grain md:py-32">
        <div className="container relative z-10 mx-auto px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-[3rem] leading-[0.92] text-white md:text-[4.6rem]">
              <span className="line-reveal">{t.about.values.title}</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-px bg-ink-700 md:grid-cols-2">
            {t.about.values.items.map((v, i) => (
              <Reveal key={v.n} delay={i * 100}>
                <div className="flex h-full gap-6 bg-ink-950 p-8 md:p-10">
                  <span className="font-display text-[0.95rem] tracking-[0.2em] text-crimson-500">{v.n}</span>
                  <div>
                    <h3 className="font-display text-[1.9rem] leading-none text-white">{v.title}</h3>
                    <p className="mt-4 leading-relaxed text-mist">{v.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pre koho */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-[3rem] leading-[0.92] text-white md:text-[4.6rem]">{t.about.forWhom.title}</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {t.about.forWhom.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <div className="card h-full p-8 md:p-10">
                  <h3 className="font-display text-[2.4rem] leading-none text-white">{item.title}</h3>
                  <p className="mt-5 leading-relaxed text-mist">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200} className="mt-14">
            <Link href={localizedHref(locale, 'reservations')} className="btn btn-primary">
              {t.cta.primary}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
