import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Counter from '@/components/Counter';
import Marquee from '@/components/Marquee';
import PlaceholderNote, { clean } from '@/components/PlaceholderNote';
import { isLocale, localizedHref, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);

  return (
    <div className="bg-ink-900">
      {/* ------------------------------------------------------------ HERO */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink-950 grain">
        {/* pozadie */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] rounded-full bg-crimson-700/25 blur-[160px] animate-breathe" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:96px_96px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink-900 to-transparent" />
          {/* obrovský vodoznak KM */}
          <div className="font-display absolute -right-8 top-24 select-none text-[42vw] leading-none text-white/[0.03] md:top-10">
            KM
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-5 pb-14 pt-40 md:px-8 md:pb-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="animate-rise flex flex-wrap items-center gap-4">
                <p className="eyebrow">{t.hero.eyebrow}</p>
                <span className="inline-flex items-center gap-2 border hairline px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-mist">
                  <span className="h-1.5 w-1.5 rounded-full bg-crimson-600" />
                  {t.hero.open247}
                </span>
              </div>

              <h1 className="font-display mt-8 text-[5.2rem] leading-[0.86] text-white sm:text-[7rem] md:text-[9rem] lg:text-[11rem]">
                <span className="animate-clip block">{t.hero.titleA}</span>
                <span className="animate-clip block text-crimson-600 [animation-delay:150ms]">{t.hero.titleB}</span>
              </h1>

              <p className="animate-rise mt-10 max-w-xl text-xl leading-relaxed text-white [animation-delay:350ms] md:text-2xl">
                {t.hero.lead}
              </p>
              <p className="animate-rise mt-4 max-w-lg leading-relaxed text-mist [animation-delay:450ms]">
                {clean(t.hero.sub)}
                <PlaceholderNote text={t.hero.sub} label={t.common.placeholderBadge} />
              </p>

              <div className="animate-rise mt-10 flex flex-col gap-4 sm:flex-row [animation-delay:550ms]">
                <Link href={localizedHref(locale, 'reservations')} className="btn btn-primary">
                  {t.hero.primary}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href={localizedHref(locale, 'pricing')} className="btn btn-ghost">
                  {t.hero.secondary}
                </Link>
              </div>
            </div>

            {/* štatistiky */}
            <div className="animate-rise lg:col-span-4 [animation-delay:650ms]">
              <dl className="grid grid-cols-2 border hairline">
                <div className="border-b border-r hairline p-6">
                  <dd className="font-display text-[2.8rem] leading-none text-white">{t.hero.stats.accessValue}</dd>
                  <dt className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-mist">{t.hero.stats.access}</dt>
                </div>
                <div className="border-b hairline p-6">
                  <dd className="font-display text-[2.8rem] leading-none text-white">
                    <Counter value={site.stats.areaM2} />
                  </dd>
                  <dt className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-mist">{t.hero.stats.area}</dt>
                </div>
                <div className="border-r hairline p-6">
                  <dd className="font-display text-[2.8rem] leading-none text-white">
                    <Counter value={site.stats.machines} suffix="+" />
                  </dd>
                  <dt className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-mist">{t.hero.stats.machines}</dt>
                </div>
                <div className="p-6">
                  <dd className="font-display text-[2.8rem] leading-none text-crimson-500">
                    <Counter value={site.stats.members} suffix="+" />
                  </dd>
                  <dt className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-mist">{t.hero.stats.members}</dt>
                </div>
              </dl>
            </div>
          </div>

          {/* scroll hint */}
          <div className="mt-14 hidden items-center gap-4 text-[0.65rem] uppercase tracking-[0.3em] text-ink-500 md:flex" aria-hidden="true">
            <span className="block h-12 w-px overflow-hidden bg-ink-700">
              <span className="block h-full w-full bg-crimson-600 animate-scroll-hint" />
            </span>
            {t.hero.scroll}
          </div>
        </div>
      </section>

      <Marquee items={t.marquee} />

      {/* --------------------------------------------------------- PILLARS */}
      <section className="relative py-24 md:py-36">
        <div className="container mx-auto px-5 md:px-8">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t.pillars.eyebrow}</p>
            <h2 className="font-display mt-6 text-[3rem] leading-[0.92] text-white md:text-[4.8rem]">
              <span className="line-reveal">{t.pillars.title}</span>
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-px bg-ink-700 md:grid-cols-3">
            {t.pillars.items.map((item, i) => (
              <Reveal key={item.n} delay={i * 120} className="h-full">
                <Link
                  href={localizedHref(locale, item.link)}
                  className="group relative flex h-full flex-col bg-ink-900 p-8 transition-colors duration-500 hover:bg-ink-800 md:p-10"
                >
                  <span className="font-display text-[0.95rem] tracking-[0.2em] text-crimson-500">{item.n}</span>
                  <h3 className="font-display mt-10 text-[2.2rem] leading-[0.95] text-white md:text-[2.6rem]">
                    {item.title}
                  </h3>
                  <p className="mt-5 flex-grow leading-relaxed text-mist">{item.text}</p>
                  <span className="mt-10 inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.25em] text-white">
                    {item.linkLabel}
                    <span className="block h-px w-8 bg-crimson-600 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:w-14" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-crimson-600 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-x-100" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- MANIFESTO */}
      <section className="relative overflow-hidden border-y hairline bg-ink-950 py-28 grain md:py-40">
        <div className="pointer-events-none absolute -left-40 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-crimson-700/15 blur-[160px]" aria-hidden="true" />
        <div className="container relative z-10 mx-auto px-5 md:px-8">
          <Reveal>
            <p className="eyebrow">{t.manifesto.eyebrow}</p>
          </Reveal>
          <div className="mt-10 max-w-5xl">
            {t.manifesto.lines.map((line, i) => (
              <Reveal key={i} delay={i * 180}>
                <p
                  className={`font-display text-[2.6rem] leading-[1] md:text-[4.6rem] ${
                    i === t.manifesto.lines.length - 1 ? 'text-crimson-500' : 'text-white'
                  }`}
                >
                  {line}
                </p>
              </Reveal>
            ))}
            <Reveal delay={600}>
              <p className="mt-10 text-sm uppercase tracking-[0.3em] text-mist">{t.manifesto.signature}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ TOUR */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-5">
              <p className="eyebrow">{t.tour.eyebrow}</p>
              <h2 className="font-display mt-6 text-[3rem] leading-[0.92] text-white md:text-[4.4rem]">{t.tour.title}</h2>
              <p className="mt-6 leading-relaxed text-mist">
                {clean(t.tour.text)}
                <PlaceholderNote text={t.tour.text} label={t.common.placeholderBadge} />
              </p>
            </Reveal>
            <Reveal delay={150} className="lg:col-span-7">
              <div className="group relative aspect-video overflow-hidden border hairline bg-ink-950">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,16,46,0.25),transparent_60%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6">
                  <span className="flex h-20 w-20 items-center justify-center border border-white/30 transition-all duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-110 group-hover:border-crimson-500">
                    <svg className="ml-1 h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-[0.3em] text-mist">{t.tour.placeholder}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="relative overflow-hidden bg-crimson-600 py-24 text-[#fff] md:py-32">
        <div className="font-display pointer-events-none absolute -bottom-16 -left-4 select-none text-[30vw] leading-none text-[#fff]/10" aria-hidden="true">
          KM
        </div>
        <div className="container relative z-10 mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <h2 className="font-display text-[3.6rem] leading-[0.9] md:text-[6.5rem]">{t.cta.title}</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#fff]/85">{t.cta.text}</p>
            </Reveal>
            <Reveal delay={150} className="flex flex-col gap-4 sm:flex-row lg:col-span-4 lg:justify-end">
              <Link href={localizedHref(locale, 'reservations')} className="btn !bg-[#fff] !text-[#0b0c0e] !border-[#fff] btn-light">
                {t.cta.primary}
              </Link>
              <Link href={localizedHref(locale, 'contact')} className="btn btn-ghost !text-[#fff] !border-[#fff]/40 hover:!border-[#fff] hover:!text-[#0b0c0e]">
                {t.cta.secondary}
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
