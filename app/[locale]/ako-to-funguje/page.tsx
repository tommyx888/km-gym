import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import ReservineButton from '@/components/ReservineButton';
import PlaceholderNote, { clean } from '@/components/PlaceholderNote';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: t.howItWorks.metaTitle }, description: t.howItWorks.metaDescription };
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.howItWorks.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: clean(f.a) },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <PageHero eyebrow={t.howItWorks.eyebrow} title={t.howItWorks.title} />

      {/* Kroky */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 md:px-8">
          <ol className="grid grid-cols-1 gap-px bg-ink-700 md:grid-cols-2 xl:grid-cols-4">
            {t.howItWorks.steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 120} as="li" className="h-full">
                <div className="relative flex h-full flex-col bg-ink-900 p-8 md:p-10">
                  <span className="font-display text-[5rem] leading-none text-ink-700">{s.n}</span>
                  <h2 className="font-display mt-6 text-[2rem] leading-[0.95] text-white">{s.title}</h2>
                  <p className="mt-4 leading-relaxed text-mist">
                    {clean(s.text)}
                    <PlaceholderNote text={s.text} label={t.common.placeholderBadge} />
                  </p>
                  {i < t.howItWorks.steps.length - 1 && (
                    <span className="absolute right-6 top-10 hidden text-crimson-500 xl:block" aria-hidden="true">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={300} className="mt-12">
            <ReservineButton text={t.howItWorks.cta} />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t hairline bg-ink-950 py-20 grain md:py-28">
        <div className="container relative z-10 mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <h2 className="font-display text-[3rem] leading-[0.92] text-white md:text-[4rem]">{t.howItWorks.faqTitle}</h2>
            </Reveal>
            <div className="lg:col-span-8">
              {t.howItWorks.faq.map((item, i) => (
                <Reveal key={item.q} delay={i * 80}>
                  <details className="group border-b hairline py-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg text-white [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <span className="relative flex h-6 w-6 shrink-0 items-center justify-center border hairline">
                        <span className="h-px w-3 bg-white" />
                        <span className="absolute h-3 w-px bg-white transition-transform duration-500 group-open:rotate-90 group-open:opacity-0" />
                      </span>
                    </summary>
                    <p className="mt-4 max-w-2xl leading-relaxed text-mist">
                      {clean(item.a)}
                      <PlaceholderNote text={item.a} label={t.common.placeholderBadge} />
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
