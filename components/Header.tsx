'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { localizedHref, routes, type Locale, type RouteKey } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

const NAV: RouteKey[] = ['home', 'about', 'gallery', 'pricing', 'reservations', 'contact'];

export default function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    // zmena routy → zavrieť mobilné menu (pattern odporúčaný Reactom namiesto effectu)
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (key: RouteKey) => {
    const href = localizedHref(locale, key);
    if (key === 'home') return pathname === href || pathname === `/${locale}/`;
    // pathname môže byť lokalizovaný (/en/pricing) alebo interný (/en/cennik)
    const slugs = Object.values(routes[key]);
    return slugs.some((s) => s && pathname.startsWith(`/${locale}/${s}`));
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid || open ? 'header-solid' : ''}`}
    >
      <nav className="container mx-auto flex items-center justify-between px-5 py-4 md:px-8 md:py-5">
        <Logo href={localizedHref(locale, 'home')} priority />

        {/* Desktop */}
        <div className="hidden items-center gap-8 lg:flex">
          {NAV.map((key) => (
            <Link
              key={key}
              href={localizedHref(locale, key)}
              className="nav-link"
              aria-current={isActive(key) ? 'page' : undefined}
            >
              {t.nav[key]}
            </Link>
          ))}
          <LanguageSwitcher locale={locale} />
          <Link href={localizedHref(locale, 'reservations')} className="btn btn-primary !py-3 !px-6">
            {t.nav.cta}
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <LanguageSwitcher locale={locale} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
            className="relative flex h-11 w-11 items-center justify-center border hairline"
          >
            <span
              className={`absolute h-px w-5 bg-white transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] ${
                open ? 'rotate-45' : '-translate-y-1.5'
              }`}
            />
            <span
              className={`absolute h-px w-5 bg-white transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
                open ? '-rotate-45' : 'translate-y-1.5'
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden fixed inset-x-0 top-[76px] bottom-0 z-40 bg-ink-950 transition-all duration-600 [transition-timing-function:var(--ease-out-expo)] ${
          open ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-3'
        }`}
        aria-hidden={!open}
      >
        <div className="container mx-auto flex h-full flex-col px-5 pt-8 pb-10">
          <ul className="flex flex-col">
            {NAV.map((key, i) => (
              <li
                key={key}
                className="border-b hairline"
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }}
              >
                <Link
                  href={localizedHref(locale, key)}
                  className={`font-display flex items-center justify-between py-5 text-[2.4rem] ${
                    isActive(key) ? 'text-crimson-500' : 'text-white'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {t.nav[key]}
                  <span className="text-xs tracking-[0.3em] text-ink-500">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={localizedHref(locale, 'reservations')}
            className="btn btn-primary mt-auto w-full"
            onClick={() => setOpen(false)}
          >
            {t.nav.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
