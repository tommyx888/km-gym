import { NextRequest, NextResponse } from 'next/server';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { normalizeEmail, subscribe } from '@/lib/newsletter';

/** POST { email, locale, source, website? } – prihlásenie na newsletter (double opt‑in). `website` je honeypot – musí byť prázdny. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  if (body?.website) return NextResponse.json({ status: 'sent' }); // bot – tvárime sa, že OK
  const email = normalizeEmail(body?.email);
  if (!email) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const locale: Locale = isLocale(body?.locale) ? body.locale : 'sk';
  const source = String(body?.source ?? 'web').slice(0, 40);
  const status = await subscribe(email, locale, source);
  if (status === 'error') return NextResponse.json({ error: 'generic' }, { status: 500 });
  return NextResponse.json({ status });
}
