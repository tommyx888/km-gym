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
  gallery: { sk: 'galeria', en: 'gallery' },
  pricing: { sk: 'cennik', en: 'pricing' },
  reservations: { sk: 'rezervacie', en: 'reservations' },
  contact: { sk: 'kontakt', en: 'contact' },
} as const;

export type RouteKey = keyof typeof routes;

/** Interný (SK) názov priečinka pre danú routu. */
export const internalSlug: Record<RouteKey, string> = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.sk]),
) as Record<RouteKey, string>;

export function localizedHref(locale: Locale, key: RouteKey): string {
  const slug = routes[key][locale];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

/** Pre EN: mapa lokalizovaný slug → interný slug (na rewrite v proxy). */
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

/** Nájde RouteKey podľa interného pathname (bez locale), na prepínanie jazyka. */
export function routeKeyFromInternalPath(pathWithoutLocale: string): RouteKey {
  const first = pathWithoutLocale.replace(/^\//, '').split('/')[0] ?? '';
  for (const key of Object.keys(routes) as RouteKey[]) {
    if (routes[key].sk === first) return key;
  }
  return 'home';
}
