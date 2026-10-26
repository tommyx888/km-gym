import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import PrintButton from '@/components/PrintButton';
import PlaceholderNote, { clean } from '@/components/PlaceholderNote';
import { isLocale, legalDocs, legalKeyFromSlug, localizedHref, locales, type LegalKey, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getLegal } from '@/lib/legal';
import { site } from '@/lib/site';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    (Object.keys(legalDocs) as LegalKey[]).map((key) => ({ locale, slug: legalDocs[key].sk })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  const key = legalKeyFromSlug(slug);
  return { title: { absolute: `${key ? t.legal.docs[key] : t.legal.metaTitle} — ${site.name}` }, robots: { index: false } };
}

/** Text s [DOPLNIŤ …] → text + červený štítok (ako inde na webe). */
function Text({ text, label }: { text: string; label: string }) {
  if (!text.includes('[DOPLNIŤ')) return <>{text}</>;
  return (
    <>
      {clean(text)}
      <PlaceholderNote text={text} label={label} />
    </>
  );
}

export default async function LegalPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const key = legalKeyFromSlug(slug);
  if (!key) notFound();
  const t = getDictionary(locale);
  const doc = getLegal(locale)[key];
  const o = site.operator;
  const effective = new Date(site.legal.effectiveDate).toLocaleDateString(locale === 'sk' ? 'sk-SK' : 'en-GB');

  return (
    <>
      <PageHero eyebrow={t.legal.eyebrow} title={doc.title} lead={doc.lead} />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <article className="legal-doc max-w-3xl">
                {doc.sections.map((s, i) => (
                  <section key={i} className="mb-10">
                    <h2 className="font-display text-[1.7rem] leading-none text-white md:text-[2rem]">{s.h}</h2>
                    {s.p?.map((p, j) => (
                      <p key={j} className="mt-4 leading-relaxed text-mist">
                        <Text text={p} label={t.common.placeholderBadge} />
                      </p>
                    ))}
                    {s.ul && (
                      <ul className="mt-4 space-y-2 leading-relaxed text-mist">
                        {s.ul.map((li, j) => (
                          <li key={j} className="flex gap-3">
                            <span className="mt-[0.7em] h-px w-4 shrink-0 bg-crimson-600" aria-hidden="true" />
                            <span>
                              <Text text={li} label={t.common.placeholderBadge} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.dl && (
                      <dl className="mt-4 divide-y hairline border-y hairline">
                        {s.dl.map(([dt, dd], j) => (
                          <div key={j} className="grid grid-cols-1 gap-2 py-4 md:grid-cols-12 md:gap-6">
                            <dt className="text-[0.72rem] uppercase tracking-[0.2em] text-white md:col-span-4">{dt}</dt>
                            <dd className="text-sm leading-relaxed text-mist md:col-span-8">
                              <Text text={dd} label={t.common.placeholderBadge} />
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </section>
                ))}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t hairline pt-6 text-sm text-ink-500 print:hidden">
                  <span>
                    {t.legal.effective}: {effective}
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {key === 'withdrawal' && (
                      <a href="/dokumenty/formular-odstupenie-od-zmluvy.pdf" download className="btn btn-ghost !px-5 !py-2 !text-[0.65rem]">
                        PDF
                      </a>
                    )}
                    <PrintButton label={t.legal.print} />
                  </div>
                </div>
                <p className="mt-4 text-xs text-ink-500 print:hidden">{t.legal.lawyerNote}</p>
              </article>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-4 print:hidden">
              <div className="border hairline p-7">
                <p className="eyebrow">{t.legal.operatorTitle}</p>
                <p className="font-display mt-5 text-[1.6rem] leading-none text-white">{o.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  {o.street}
                  <br />
                  {o.zip} {o.city}, {o.country}
                  <br />
                  IČO: {o.ico}
                  <br />
                  DIČ: {o.dic}
                  <br />
                  IČ DPH: {o.icdph}
                </p>
                <ul className="mt-6 space-y-2 border-t hairline pt-5 text-sm">
                  {(Object.keys(legalDocs) as LegalKey[]).map((k) => (
                    <li key={k}>
                      <Link href={localizedHref(locale, 'legal', legalDocs[k][locale])} className={`nav-link !text-[0.72rem] ${k === key ? '!text-white' : ''}`}>
                        {t.legal.docs[k]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
