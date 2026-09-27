import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isLocale } from '@/lib/i18n/config';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const raw = request.cookies.get('km_locale')?.value ?? 'sk';
  const locale = isLocale(raw) ? raw : 'sk';
  return NextResponse.redirect(`${request.nextUrl.origin}/${locale}`, { status: 303 });
}
