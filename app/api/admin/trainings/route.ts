import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isLocale } from '@/lib/i18n/config';
import { slugify, TRAINING_COLS, type Training } from '@/lib/trainings';
import { sendTrainingEmail } from '@/lib/training-emails';

/**
 * Admin API tréningov.
 * POST   { data, repeatWeeks? }            → vytvorí tréning (alebo sériu: repeatWeeks × každý týždeň)
 * PATCH  { id, data }                       → úprava
 * PUT    { id, action: 'cancel'|'duplicate'|'remove_signup'|'attendance', ... } → akcie
 */
const FIELDS = ['title', 'title_en', 'description', 'description_en', 'details', 'details_en', 'trainer', 'location', 'starts_at', 'duration_min', 'capacity', 'image_url', 'pricing', 'price_cents', 'payment_url', 'payment_note', 'members_only', 'cancel_deadline_hours', 'status'] as const;

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  const { data: me } = await supabase.from('km_gym_profiles').select('is_admin').eq('id', user.id).maybeSingle();
  if (!me?.is_admin) return { error: NextResponse.json({ error: 'forbidden' }, { status: 403 }) };
  return { supabase, user };
}

function clean(input: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const k of FIELDS) {
    if (!(k in input)) continue;
    let v = input[k];
    if (typeof v === 'string') v = v.trim() || null;
    if (k === 'duration_min' || k === 'capacity' || k === 'cancel_deadline_hours') v = v == null ? null : Number(v);
    if (k === 'price_cents') v = v == null || v === '' ? null : Math.round(Number(v));
    if (k === 'members_only') v = Boolean(v);
    out[k] = v;
  }
  if (out.pricing !== 'paid') {
    out.price_cents = null;
  }
  return out;
}

async function uniqueSlug(supabase: Awaited<ReturnType<typeof createClient>>, title: string, startsAt: string, exceptId?: string) {
  const d = new Date(startsAt);
  const base = `${slugify(title) || 'trening'}-${d.toISOString().slice(0, 10)}`;
  let slug = base;
  for (let i = 2; i < 50; i++) {
    const { data } = await supabase.from('km_gym_trainings').select('id').eq('slug', slug).maybeSingle();
    if (!data || data.id === exceptId) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

export async function POST(request: NextRequest) {
  const ctx = await requireAdmin();
  if ('error' in ctx) return ctx.error;
  const body = await request.json().catch(() => ({}));
  const data = clean(body?.data ?? {});
  if (!data.title || !data.starts_at || !data.capacity) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  const repeat = Math.min(52, Math.max(1, Number(body?.repeatWeeks ?? 1) || 1));
  const seriesId = repeat > 1 ? crypto.randomUUID() : null;
  const rows = [];
  for (let i = 0; i < repeat; i++) {
    const starts = new Date(new Date(String(data.starts_at)).getTime() + i * 7 * 86_400_000).toISOString();
    rows.push({ ...data, starts_at: starts, slug: await uniqueSlug(ctx.supabase, String(data.title), starts), series_id: seriesId, created_by: ctx.user.id });
  }
  const { data: created, error } = await ctx.supabase.from('km_gym_trainings').insert(rows).select(TRAINING_COLS);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ trainings: created });
}

export async function PATCH(request: NextRequest) {
  const ctx = await requireAdmin();
  if ('error' in ctx) return ctx.error;
  const body = await request.json().catch(() => ({}));
  const id = String(body?.id ?? '');
  const data = clean(body?.data ?? {});
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  if (data.title && data.starts_at) data.slug = await uniqueSlug(ctx.supabase, String(data.title), String(data.starts_at), id);
  const { data: updated, error } = await ctx.supabase.from('km_gym_trainings').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select(TRAINING_COLS).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ training: updated });
}

export async function PUT(request: NextRequest) {
  const ctx = await requireAdmin();
  if ('error' in ctx) return ctx.error;
  const body = await request.json().catch(() => ({}));
  const id = String(body?.id ?? '');
  const action = String(body?.action ?? '');
  const locale = isLocale(body?.locale) ? body.locale : 'sk';
  const admin = getSupabaseAdmin();

  if (action === 'cancel') {
    const { data: tr, error } = await ctx.supabase.from('km_gym_trainings').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', id).select(TRAINING_COLS).single();
    if (error || !tr) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    let notified = 0;
    if (admin) {
      const { data: signups } = await admin.from('km_gym_training_signups').select('user_id, status').eq('training_id', id).in('status', ['confirmed', 'waitlist']);
      const ids = (signups ?? []).map((s) => s.user_id);
      if (ids.length) {
        const { data: profiles } = await admin.from('km_gym_profiles').select('email, locale').in('id', ids);
        for (const p of profiles ?? []) if (p.email) {
          await sendTrainingEmail('cancelled', p.email, tr as Training, isLocale(p.locale) ? p.locale : locale);
          notified++;
        }
      }
    }
    return NextResponse.json({ training: tr, notified });
  }

  if (action === 'duplicate') {
    const { data: src } = await ctx.supabase.from('km_gym_trainings').select(TRAINING_COLS).eq('id', id).single();
    if (!src) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    const s = src as Training;
    const starts = new Date(new Date(s.starts_at).getTime() + 7 * 86_400_000).toISOString();
    const { data: created, error } = await ctx.supabase
      .from('km_gym_trainings')
      .insert({
        title: s.title, title_en: s.title_en, description: s.description, description_en: s.description_en, details: s.details, details_en: s.details_en,
        trainer: s.trainer, location: s.location, starts_at: starts, duration_min: s.duration_min, capacity: s.capacity, image_url: s.image_url,
        pricing: s.pricing, price_cents: s.price_cents, payment_url: s.payment_url, payment_note: s.payment_note, members_only: s.members_only,
        cancel_deadline_hours: s.cancel_deadline_hours, status: 'draft', slug: await uniqueSlug(ctx.supabase, s.title, starts), created_by: ctx.user.id,
      })
      .select(TRAINING_COLS)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ training: created });
  }

  if (action === 'remove_signup') {
    const userId = String(body?.userId ?? '');
    const { data: promoted, error } = await ctx.supabase.rpc('km_gym_training_cancel', { p_training: id, p_user: userId });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (promoted && admin) {
      const { data: tr } = await admin.from('km_gym_trainings').select(TRAINING_COLS).eq('id', id).single();
      const { data: p } = await admin.from('km_gym_profiles').select('email, locale').eq('id', String(promoted)).maybeSingle();
      if (tr && p?.email) await sendTrainingEmail('promoted', p.email, tr as Training, isLocale(p.locale) ? p.locale : 'sk');
    }
    return NextResponse.json({ ok: true });
  }

  if (action === 'attendance') {
    const { error } = await ctx.supabase.rpc('km_gym_training_attendance', { p_signup: String(body?.signupId ?? ''), p_status: String(body?.status ?? '') });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'bad_action' }, { status: 400 });
}
