import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import PlaceholderNote, { clean } from '@/components/PlaceholderNote';
import { isLocale, legalDocs, legalKeyFromSlug, localizedHref, locales, type LegalKey, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
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

export default async function LegalPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const key = legalKeyFromSlug(slug);
  if (!key) notFound();
  const t = getDictionary(locale);
  const o = site.operator;

  const intro = key === 'cookies' ? t.legal.cookiesText : key === 'privacy' ? t.legal.privacyIntro : null;

  return (
    <>
      <PageHero eyebrow={t.legal.eyebrow} title={t.legal.docs[key]} />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <div className="space-y-6 text-lg leading-relaxed text-mist">
                {intro && <p className="text-white">{intro}</p>}
                <p>
                  {clean(t.legal.placeholder)}
                  <PlaceholderNote text={t.legal.placeholder} label={t.common.placeholderBadge} />
                </p>
                <p className="text-sm text-ink-500">
                  {t.legal.updated}: {new Date().toLocaleDateString(locale === 'sk' ? 'sk-SK' : 'en-GB')}
                </p>
              </div>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-4">
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
