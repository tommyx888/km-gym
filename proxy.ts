import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale, locales, routes, toInternalPath } from '@/lib/i18n/config';
import { updateSession } from '@/lib/supabase/proxy';

const LOCALE_COOKIE = 'km_locale';

function detectLocale(request: NextRequest): string {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;

  const header = request.headers.get('accept-language') ?? '';
  const preferred = header
    .split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase().slice(0, 2));
  for (const lang of preferred) {
    if (isLocale(lang)) return lang;
  }
  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Súbory, API a interné cesty nechávame tak.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return;
  }

  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  if (isLocale(maybeLocale)) {
    // Lokalizované EN slugy (/en/pricing) prepíšeme na interné priečinky (/en/cennik).
    const internal = toInternalPath(maybeLocale, pathname);
    const internalPath = internal ?? pathname;
    const base = internal
      ? NextResponse.rewrite(new URL(internal + request.nextUrl.search, request.url))
      : NextResponse.next();

    // Supabase session (obnova cookies) + ochrana členskej zóny
    const { response, user } = await updateSession(request, base);
    const isMembers = internalPath.startsWith(`/${maybeLocale}/${routes.members.sk}`);
    const isAuthPage = [routes.login, routes.register].some((r) => internalPath.startsWith(`/${maybeLocale}/${r.sk}`));
    if (isMembers && !user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${maybeLocale}/${routes.login[maybeLocale]}`;
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    if (isAuthPage && user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${maybeLocale}/${routes.members[maybeLocale]}`;
      url.search = '';
      return NextResponse.redirect(url);
    }
    response.cookies.set(LOCALE_COOKIE, maybeLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // Bez locale → presmerovanie podľa cookie / Accept-Language.
  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|auth|.*\\..*).*)'],
};

// Pre istotu exportujeme aj zoznam (užitočné pri ladení).
export { locales };
