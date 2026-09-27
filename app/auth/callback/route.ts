import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isLocale, localizedHref, routes } from '@/lib/i18n/config';

/**
 * Cieľ odkazov z e-mailov (potvrdenie registrácie, reset hesla, magic link).
 * Supabase pošle ?code=… (PKCE) → vymeníme za session a presmerujeme.
 *   type=recovery → stránka na nové heslo; inak → členská zóna (alebo ?next=).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const rawLocale = searchParams.get('locale') ?? request.cookies.get('km_locale')?.value ?? 'sk';
  const locale = isLocale(rawLocale) ? rawLocale : 'sk';
  const next = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (type === 'recovery') return NextResponse.redirect(`${origin}${localizedHref(locale, 'newPassword')}`);
      if (next && next.startsWith('/')) return NextResponse.redirect(`${origin}${next}`);
      return NextResponse.redirect(`${origin}${localizedHref(locale, 'members')}?welcome=1`);
    }
  }
  // Neplatný / expirovaný odkaz
  return NextResponse.redirect(`${origin}/${locale}/${routes.login[locale]}?error=link`);
}
