import { Suspense } from 'react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import AuthForm from './AuthForm';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

type Mode = 'login' | 'register' | 'forgot' | 'newPassword';

export default function AuthPage({ mode, locale, t }: { mode: Mode; locale: Locale; t: Dictionary['auth'] }) {
  const copy = t.pages[mode];
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={copy.title} lead={copy.lead} />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8">
          <Reveal className="mx-auto max-w-lg">
            <div className="relative border hairline bg-ink-800 p-7 md:p-10">
              <span className="absolute left-0 top-0 h-full w-[3px] bg-crimson-600" aria-hidden="true" />
              <Suspense>
                <AuthForm mode={mode} locale={locale} t={t} />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
