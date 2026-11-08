import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isLocale, localizedHref, type Locale } from '@/lib/i18n/config';
import { buildIcs, TRAINING_COLS, type Training } from '@/lib/trainings';
import { siteUrl } from '@/lib/site-url';

/** GET ?slug=&locale= → .ics súbor (Pridať do kalendára). */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug') ?? '';
  const l = request.nextUrl.searchParams.get('locale');
  const locale: Locale = isLocale(l ?? undefined) ? (l as Locale) : 'sk';
  const supabase = await createClient();
  const { data } = await supabase.from('km_gym_trainings').select(TRAINING_COLS).eq('slug', slug).neq('status', 'draft').maybeSingle();
  if (!data) return new NextResponse('not found', { status: 404 });
  const t = data as Training;
  const ics = buildIcs(t, locale, `${siteUrl()}${localizedHref(locale, 'trainings', t.slug)}`);
  return new NextResponse(ics, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="km-gym-${t.slug}.ics"` } });
}
