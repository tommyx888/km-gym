import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import NewsletterForm from '@/components/NewsletterForm';
import { isLocale, localizedHref, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ status?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: t.newsletter.title, description: t.newsletter.lead, robots: { index: false, follow: true } };
}

export default async function NewsletterPage({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  const { status } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);
  const n = t.newsletter;
  const statusMsg = status === 'confirmed' ? n.status.confirmed : status === 'unsubscribed' ? n.status.unsubscribed : status === 'invalid' ? n.status.invalid : null;

  return (
    <>
      <PageHero eyebrow={n.eyebrow} title={n.title} lead={n.lead} />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8">
          <Reveal>
            {statusMsg ? (
              <div className="max-w-xl border hairline bg-ink-900 p-8">
                <p className={`text-lg ${status === 'invalid' ? 'text-crimson-500' : 'text-white'}`}>{statusMsg}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={localizedHref(locale, 'trainings')} className="btn btn-primary">
                    {n.trainings}
                  </Link>
                  <Link href={localizedHref(locale, 'home')} className="btn btn-ghost">
                    {n.home}
                  </Link>
                </div>
                {status === 'unsubscribed' && <NewsletterForm locale={locale} t={n} source="page" />}
              </div>
            ) : (
              <NewsletterForm locale={locale} t={n} source="page" />
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
