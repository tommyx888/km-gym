import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { TRAINING_COLS, type Training, type TrainingCounts } from '@/lib/trainings';
import { sendCreatorNotice, sendTrainingEmail } from '@/lib/training-emails';
import { site } from '@/lib/site';

/** POST { trainingId, action: 'signup' | 'cancel', locale } – prihlásenie / odhlásenie prihláseného člena. */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const trainingId = String(body?.trainingId ?? '');
  const action = body?.action === 'cancel' ? 'cancel' : 'signup';
  const locale: Locale = isLocale(body?.locale) ? body.locale : 'sk';
  if (!/^[0-9a-f-]{36}$/i.test(trainingId)) return NextResponse.json({ error: 'not_available' }, { status: 400 });

  const { data: training } = await supabase.from('km_gym_trainings').select(TRAINING_COLS).eq('id', trainingId).maybeSingle();
  if (!training) return NextResponse.json({ error: 'not_available' }, { status: 404 });
  const tr = training as Training;

  if (action === 'signup') {
    const { data, error } = await supabase.rpc('km_gym_training_signup', { p_training: trainingId });
    if (error) return NextResponse.json({ error: mapErr(error.message) }, { status: 400 });
    const status = String(data);
    if (user.email && (status === 'confirmed' || status === 'waitlist')) {
      await sendTrainingEmail(status, user.email, tr, locale);
      await notifyCreator('signup', tr, user.id, user.email, status);
    }
    return NextResponse.json({ status });
  }

  const { data: promoted, error } = await supabase.rpc('km_gym_training_cancel', { p_training: trainingId });
  if (error) return NextResponse.json({ error: mapErr(error.message) }, { status: 400 });
  if (promoted) await notifyPromoted(String(promoted), tr);
  if (user.email) await notifyCreator('cancel', tr, user.id, user.email, null);
  return NextResponse.json({ status: 'cancelled' });
}

function mapErr(message: string): string {
  for (const k of ['unauthorized', 'not_available', 'already_started', 'members_only', 'deadline_passed', 'forbidden']) if (message.includes(k)) return k;
  return 'generic';
}

/** Povýšený z čakacej listiny dostane e‑mail (e‑mail a jazyk z profilu – cez service role). */
export async function notifyPromoted(userId: string, tr: Training) {
  const admin = getSupabaseAdmin();
  if (!admin) return;
  const { data: p } = await admin.from('km_gym_profiles').select('email, locale').eq('id', userId).maybeSingle();
  if (p?.email) await sendTrainingEmail('promoted', p.email, tr, isLocale(p.locale) ? p.locale : 'sk');
}

/**
 * Zadávateľ tréningu (created_by) dostane e‑mail o prihlásení / odhlásení – ak má tréning zapnuté notify_creator.
 * Bez created_by (alebo bez e‑mailu v profile) ide správa na kontaktný e‑mail gymu.
 */
async function notifyCreator(event: 'signup' | 'cancel', tr: Training, userId: string, userEmail: string, status: 'confirmed' | 'waitlist' | null) {
  if (!tr.notify_creator) return;
  const admin = getSupabaseAdmin();
  if (!admin) return;
  const [{ data: me }, { data: creator }, { data: counts }] = await Promise.all([
    admin.from('km_gym_profiles').select('full_name').eq('id', userId).maybeSingle(),
    tr.created_by ? admin.from('km_gym_profiles').select('email, locale').eq('id', tr.created_by).maybeSingle() : Promise.resolve({ data: null }),
    admin.from('km_gym_training_counts').select('*').eq('training_id', tr.id).maybeSingle(),
  ]);
  const to = creator?.email || site.contact.email;
  if (!to) return;
  const locale: Locale = isLocale(creator?.locale) ? creator.locale : 'sk';
  await sendCreatorNotice(event, to, tr, { name: me?.full_name ?? '', email: userEmail }, status, (counts as TrainingCounts | null) ?? null, locale);
}
