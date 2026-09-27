import type { Metadata } from 'next';
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
  return { title: { absolute: t.tracker.metaTitle }, description: t.tracker.metaDescription };
}

export default async function TrackerPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);
  const live = Boolean(site.tracker.url);

  return (
    <>
      <PageHero eyebrow={t.tracker.eyebrow} title={t.tracker.title} lead={t.tracker.lead} />

      {/* CTA blok */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8">
          <Reveal>
            <div className="relative overflow-hidden border hairline bg-ink-950 p-8 grain md:p-12">
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-crimson-700/25 blur-[100px]" aria-hidden="true" />
              <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-8">
                  <span className="inline-block bg-crimson-600 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-[#fff]">{t.tracker.membersOnly}</span>
                  <h2 className="font-display mt-5 text-[2.6rem] leading-[0.95] text-white md:text-[3.6rem]">KM GYM · openGym</h2>
                  {!live && (
                    <p className="mt-4 max-w-xl text-mist">
                      {clean(t.tracker.comingSoon)}
                      <PlaceholderNote text={t.tracker.comingSoon} label={t.common.placeholderBadge} />
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-3 lg:col-span-4">
                  {live ? (
                    <a href={site.tracker.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      {t.tracker.cta}
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
                    </a>
                  ) : (
                    <span className="btn btn-ghost cursor-default opacity-60">{t.tracker.cta}</span>
                  )}
                  <ReservineButton text={t.nav.cta} variant="ghost" target="membership" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Funkcie */}
      <section className="border-t hairline bg-ink-950 py-20 grain md:py-28">
        <div className="container relative z-10 mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-px bg-ink-700 md:grid-cols-2 lg:grid-cols-3">
            {t.tracker.features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 100} className="h-full">
                <div className="group relative flex h-full flex-col bg-ink-950 p-7 md:p-8">
                  <span className="font-display text-[0.9rem] tracking-[0.2em] text-crimson-500">0{i + 1}</span>
                  <h3 className="font-display mt-8 text-[1.9rem] leading-[0.95] text-white">{f.title}</h3>
                  <p className="mt-4 flex-grow text-[0.95rem] leading-relaxed text-mist">{f.text}</p>
                  <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-crimson-600 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-x-100" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ako začať */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-[3rem] leading-[0.92] text-white md:text-[4rem]">{t.tracker.howTitle}</h2>
          </Reveal>
          <ol className="mt-12 grid grid-cols-1 gap-px bg-ink-700 md:grid-cols-2 xl:grid-cols-4">
            {t.tracker.how.map((s, i) => (
              <Reveal key={s.n} delay={i * 100} as="li" className="h-full">
                <div className="flex h-full flex-col bg-ink-900 p-8">
                  <span className="font-display text-[4rem] leading-none text-ink-700">{s.n}</span>
                  <h3 className="font-display mt-5 text-[1.8rem] leading-[0.95] text-white">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-mist">
                    {clean(s.text)}
                    <PlaceholderNote text={s.text} label={t.common.placeholderBadge} />
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={200} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="border hairline p-7">
              <p className="eyebrow">{t.tracker.importTitle}</p>
              <p className="mt-4 text-mist">{t.tracker.importText}</p>
            </div>
            <div className="border hairline p-7">
              <p className="text-sm leading-relaxed text-ink-500">
                {t.tracker.openSource}{' '}
                <a href={site.tracker.repo} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-600 underline-offset-4 hover:text-mist">
                  GitHub
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
