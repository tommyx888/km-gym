import type { Metadata } from 'next';
import Link from 'next/link';
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
  const p = site.pricing;

  const plans = [
    {
      key: 'monthly',
      price: p.monthly,
      period: t.pricing.perMonth,
      data: t.pricing.plans.monthly,
      featured: true,
      href: localizedHref(locale, 'contact'),
    },
    p.yearly > 0 && {
      key: 'yearly',
      price: p.yearly,
      period: t.pricing.perYear,
      data: t.pricing.plans.yearly,
      featured: false,
      href: localizedHref(locale, 'contact'),
    },
    {
      key: 'single',
      price: p.single,
      period: t.pricing.perEntry,
      data: t.pricing.plans.single,
      featured: false,
      href: localizedHref(locale, 'reservations'),
    },
    p.personalTraining > 0 && {
      key: 'pt',
      price: p.personalTraining,
      period: t.pricing.perSession,
      data: t.pricing.plans.pt,
      featured: false,
      href: localizedHref(locale, 'contact'),
    },
  ].filter(Boolean) as Array<{
    key: string;
    price: number;
    period: string;
    data: { title: string; features: readonly string[]; cta: string };
    featured: boolean;
    href: string;
  }>;

  return (
    <>
      <PageHero eyebrow={t.pricing.eyebrow} title={t.pricing.title} lead={t.pricing.lead} />

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 md:px-8">
          <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${plans.length >= 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
            {plans.map((plan, i) => (
              <Reveal key={plan.key} delay={i * 100} className="h-full">
                <div
                  className={`relative flex h-full flex-col p-8 md:p-9 ${
                    plan.featured
                      ? 'bg-white text-ink-950'
                      : 'card text-white'
                  }`}
                >
                  {plan.featured && (
                    <span className="mb-5 inline-block self-start bg-crimson-600 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-white">
                      {t.pricing.mostPopular}
                    </span>
                  )}
                  <h2 className={`font-display text-[1.9rem] leading-none ${plan.featured ? 'text-ink-950' : 'text-white'}`}>
                    {plan.data.title}
                  </h2>
                  <div className="mt-8 flex items-baseline gap-2">
                    <span className={`font-display tabular text-[4.6rem] leading-none ${plan.featured ? 'text-crimson-600' : 'text-white'}`}>
                      {plan.price}
                    </span>
                    <span className={`font-display text-[1.8rem] ${plan.featured ? 'text-ink-950' : 'text-mist'}`}>{p.currency}</span>
                  </div>
                  <p className={`mt-1 text-[0.7rem] uppercase tracking-[0.25em] ${plan.featured ? 'text-ink-500' : 'text-mist'}`}>
                    {plan.period}
                  </p>
                  <ul className={`mt-8 flex-grow space-y-3 border-t pt-8 text-[0.95rem] ${plan.featured ? 'border-ink-950/10 text-ink-800' : 'hairline text-mist'}`}>
                    {plan.data.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <Check />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href} className={`btn mt-10 w-full ${plan.featured ? 'btn-primary' : 'btn-ghost'}`}>
                    {plan.data.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="mt-8 text-sm text-ink-500">
              {clean(t.pricing.note)}
              <PlaceholderNote text={t.pricing.note} label={t.common.placeholderBadge} />
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t hairline bg-ink-950 py-20 grain md:py-28">
        <div className="container relative z-10 mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <h2 className="font-display text-[3rem] leading-[0.92] text-white md:text-[4rem]">{t.pricing.faqTitle}</h2>
            </Reveal>
            <div className="lg:col-span-8">
              {t.pricing.faq.map((item, i) => (
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
