import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { buildBroadcast, listConfirmed, sendToSubscribers, type Subscriber } from '@/lib/newsletter';
import { isLocale } from '@/lib/i18n/config';

/**
 * Admin newsletter.
 * POST   { subject, text, ctaLabel?, ctaUrl?, test? } → odošle všetkým potvrdeným (test: len adminovi)
 * DELETE { id }                                       → odstráni odberateľa
 */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  const { data: me } = await supabase.from('km_gym_profiles').select('is_admin, locale').eq('id', user.id).maybeSingle();
  if (!me?.is_admin) return { error: NextResponse.json({ error: 'forbidden' }, { status: 403 }) };
  return { user, locale: isLocale(me.locale) ? me.locale : 'sk' };
}

export async function POST(request: NextRequest) {
  const ctx = await requireAdmin();
  if ('error' in ctx) return ctx.error;
  const body = await request.json().catch(() => ({}));
  const subject = String(body?.subject ?? '').trim().slice(0, 150);
  const text = String(body?.text ?? '').trim().slice(0, 10_000);
  if (!subject || !text) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  const ctaLabel = String(body?.ctaLabel ?? '').trim().slice(0, 60);
  const ctaUrl = String(body?.ctaUrl ?? '').trim();
  const cta = ctaLabel && /^https?:\/\//.test(ctaUrl) ? { label: ctaLabel, url: ctaUrl } : null;
  const build = buildBroadcast(subject, text, cta);

  if (body?.test) {
    if (!ctx.user.email) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    const fake: Subscriber = { id: 'test', email: ctx.user.email, locale: ctx.locale, token: '00000000-0000-0000-0000-000000000000', source: 'test', confirmed_at: null, unsubscribed_at: null, created_at: '' };
    const sent = await sendToSubscribers(build, [fake]);
    return NextResponse.json({ sent, test: true });
  }
  const subs = await listConfirmed();
  const sent = await sendToSubscribers(build, subs);
  return NextResponse.json({ sent, total: subs.length });
}

export async function DELETE(request: NextRequest) {
  const ctx = await requireAdmin();
  if ('error' in ctx) return ctx.error;
  const body = await request.json().catch(() => ({}));
  const id = String(body?.id ?? '');
  const admin = getSupabaseAdmin();
  if (!admin || !/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  const { error } = await admin.from('km_gym_newsletter').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
