export const locales = ['sk', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'sk';

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/**
 * Interné routy (priečinky v app/[locale]) → lokalizované URL slugy.
 * proxy.ts prepisuje /en/pricing → /en/cennik, komponenty používajú localizedHref().
 */
export const routes = {
  home: { sk: '', en: '' },
  about: { sk: 'o-nas', en: 'about' },
  equipment: { sk: 'vybavenie', en: 'equipment' },
  pricing: { sk: 'cennik', en: 'pricing' },
  howItWorks: { sk: 'ako-to-funguje', en: 'how-it-works' },
  membership: { sk: 'clenstvo', en: 'membership' },
  contact: { sk: 'kontakt', en: 'contact' },
  tracker: { sk: 'dennik', en: 'tracker' },
  members: { sk: 'clenska-zona', en: 'members' },
  login: { sk: 'prihlasenie', en: 'login' },
  register: { sk: 'registracia', en: 'register' },
  forgot: { sk: 'zabudnute-heslo', en: 'forgot-password' },
  newPassword: { sk: 'nove-heslo', en: 'new-password' },
  legal: { sk: 'dokumenty', en: 'legal' },
} as const;

export type RouteKey = keyof typeof routes;

export function localizedHref(locale: Locale, key: RouteKey, sub?: string): string {
  const slug = routes[key][locale];
  const base = slug ? `/${locale}/${slug}` : `/${locale}`;
  return sub ? `${base}/${sub}` : base;
}

/** Pre EN: lokalizovaný slug → interný (SK) slug, na rewrite v proxy. */
export function toInternalPath(locale: Locale, pathname: string): string | null {
  if (locale === defaultLocale) return null;
  const rest = pathname.replace(new RegExp(`^/${locale}/?`), '');
  const [first, ...tail] = rest.split('/');
  for (const key of Object.keys(routes) as RouteKey[]) {
    if (routes[key][locale] === first && first !== '') {
      const internal = routes[key].sk;
      return `/${locale}/${[internal, ...tail].filter(Boolean).join('/')}`;
    }
  }
  return null;
}

/** Právne dokumenty – slug podľa jazyka. */
export const legalDocs = {
  terms: { sk: 'obchodne-podmienky', en: 'terms' },
  privacy: { sk: 'ochrana-osobnych-udajov', en: 'privacy' },
  cookies: { sk: 'cookies', en: 'cookies' },
  complaints: { sk: 'reklamacny-poriadok', en: 'complaints' },
} as const;
export type LegalKey = keyof typeof legalDocs;

export function legalKeyFromSlug(slug: string): LegalKey | null {
  for (const key of Object.keys(legalDocs) as LegalKey[]) {
    if (Object.values(legalDocs[key]).includes(slug as never)) return key;
  }
  return null;
}
