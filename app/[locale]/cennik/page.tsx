import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import PlaceholderNote, { clean } from '@/components/PlaceholderNote';
import ReservineButton from '@/components/ReservineButton';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: t.pricing.metaTitle }, description: t.pricing.metaDescription };
}

function Check() {
  return (
    <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-crimson-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d="M2.5 8.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

export default async function PricingPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);
  const cur = site.pricing.currency;

  return (
    <>
      <PageHero eyebrow={t.pricing.eyebrow} title={t.pricing.title} lead={t.pricing.lead} />

      {/* Členstvá */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 md:px-8">
          <Reveal>
            <h2 className="eyebrow">{t.pricing.membershipsTitle}</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {site.pricing.plans.map((plan, i) => {
              const d = t.pricing.plans[plan.key];
              return (
                <Reveal key={plan.key} delay={i * 80} className={`h-full ${plan.featured ? 'md:col-span-2 xl:col-span-1' : ''}`}>
                  <div className={`relative flex h-full flex-col p-7 md:p-8 ${plan.featured ? 'bg-white text-ink-950' : 'card text-white'}`}>
                    {plan.featured && (
                      <span className="mb-5 inline-block self-start bg-crimson-600 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-[#fff]">
                        {t.pricing.mostPopular}
                      </span>
                    )}
                    <h3 className={`font-display text-[1.7rem] leading-none ${plan.featured ? 'text-ink-950' : 'text-white'}`}>{d.title}</h3>
                    <div className="mt-7 flex items-baseline gap-2">
                      <span className={`font-display tabular text-[4rem] leading-none ${plan.featured ? 'text-crimson-600' : 'text-white'}`}>{plan.price}</span>
                      <span className={`font-display text-[1.6rem] ${plan.featured ? 'text-ink-950' : 'text-mist'}`}>{cur}</span>
                    </div>
                    <p className={`mt-1 text-[0.68rem] uppercase tracking-[0.25em] ${plan.featured ? 'text-ink-500' : 'text-mist'}`}>{d.period}</p>
                    <p className={`mt-6 flex-grow border-t pt-6 text-[0.95rem] leading-relaxed ${plan.featured ? 'border-ink-950/10 text-ink-800' : 'hairline text-mist'}`}>{d.note}</p>
                    <ReservineButton text={t.pricing.cta} variant={plan.featured ? 'primary' : 'ghost'} className="mt-8 w-full" />
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Čo je v cene */}
          <Reveal delay={200} className="mt-10">
            <ul className="grid grid-cols-1 gap-3 border hairline p-6 text-[0.95rem] text-mist sm:grid-cols-2 lg:grid-cols-4">
              {t.pricing.included.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Vstupy */}
      <section className="border-t hairline bg-ink-950 py-20 grain md:py-28">
        <div className="container relative z-10 mx-auto px-5 md:px-8">
          <Reveal>
            <h2 className="eyebrow">{t.pricing.passesTitle}</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {site.pricing.passes.map((pass, i) => {
              const d = t.pricing.passes[pass.key];
              return (
                <Reveal key={pass.key} delay={i * 100}>
                  <div className="card flex flex-col gap-6 p-7 md:flex-row md:items-center md:justify-between md:p-8">
                    <div>
                      <h3 className="font-display text-[1.9rem] leading-none text-white">{d.title}</h3>
                      <p className="mt-3 text-mist">{d.note}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display tabular text-[3.2rem] leading-none text-white">{pass.price}</span>
                        <span className="font-display text-[1.4rem] text-mist">{cur}</span>
                      </div>
                      <ReservineButton text={t.pricing.passCta} variant="ghost" className="!px-5 !py-3" />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={200}>
            <p className="mt-8 text-sm text-ink-500">
              {clean(t.pricing.note)}
              <PlaceholderNote text={t.pricing.note} label={t.common.placeholderBadge} />
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
