'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, localizedHref, routes, type Locale, type RouteKey } from '@/lib/i18n/config';

/** Prepínač SK | EN – zachová aktuálnu stránku (prekladá slug). */
export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const first = pathname.replace(new RegExp(`^/${locale}/?`), '').split('/')[0] ?? '';

  let key: RouteKey = 'home';
  for (const k of Object.keys(routes) as RouteKey[]) {
    if (first && Object.values(routes[k]).includes(first as never)) {
      key = k;
      break;
    }
  }

  return (
    <div className="flex items-center gap-2 text-[0.7rem] tracking-[0.25em] uppercase" aria-label="Language">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className="h-3 w-px bg-ink-600" aria-hidden="true" />}
          <Link
            href={localizedHref(l, key)}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? 'true' : undefined}
            className={`transition-colors ${l === locale ? 'text-white' : 'text-ink-500 hover:text-mist'}`}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}
