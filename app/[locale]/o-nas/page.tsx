import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import ReservineButton from '@/components/ReservineButton';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

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
  const o = site.operator;

  return (
    <>
      <PageHero eyebrow={t.about.eyebrow} title={t.about.title} lead={t.about.lead} />

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow">{t.about.story.title}</p>
              <div className="font-display mt-8 text-[7rem] leading-none text-ink-700 md:text-[10rem]" aria-hidden="true">
                24/7
              </div>
            </Reveal>
            <div className="space-y-6 text-lg leading-relaxed text-mist lg:col-span-7 lg:col-start-6">
              <Reveal>
                <p className="text-white">{t.about.story.p1}</p>
              </Reveal>
              <Reveal delay={120}>
                <p>{t.about.story.p2}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

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

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow">{t.about.operatorTitle}</p>
              <p className="font-display mt-6 text-[2.4rem] leading-none text-white">{o.name}</p>
              <p className="mt-4 leading-relaxed text-mist">
                {o.street}, {o.zip} {o.city}, {o.country}
                <br />
                IČO: {o.ico} · DIČ: {o.dic} · IČ DPH: {o.icdph}
              </p>
            </Reveal>
            <Reveal delay={150} className="lg:col-span-5 lg:text-right">
              <ReservineButton text={t.nav.cta} />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
