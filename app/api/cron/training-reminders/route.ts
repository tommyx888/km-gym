import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isLocale } from '@/lib/i18n/config';
import { TRAINING_COLS, type Training } from '@/lib/trainings';
import { sendTrainingEmail } from '@/lib/training-emails';

export const dynamic = 'force-dynamic';

/**
 * Vercel Cron (vercel.json) – raz denne. Pošle pripomienku prihláseným na tréningy,
 * ktoré začínajú o 18–42 hodín a ešte pripomienku nemali. Chránené CRON_SECRET.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });

  const from = new Date(Date.now() + 18 * 3_600_000).toISOString();
  const to = new Date(Date.now() + 42 * 3_600_000).toISOString();
  const { data: trainings } = await admin.from('km_gym_trainings').select(TRAINING_COLS).eq('status', 'published').is('reminder_sent_at', null).gte('starts_at', from).lte('starts_at', to);
  let sent = 0;
  for (const tr of (trainings ?? []) as Training[]) {
    const { data: signups } = await admin.from('km_gym_training_signups').select('user_id').eq('training_id', tr.id).eq('status', 'confirmed');
    const ids = (signups ?? []).map((s) => s.user_id);
    if (ids.length) {
      const { data: profiles } = await admin.from('km_gym_profiles').select('email, locale').in('id', ids);
      for (const p of profiles ?? []) if (p.email && (await sendTrainingEmail('reminder', p.email, tr, isLocale(p.locale) ? p.locale : 'sk'))) sent++;
    }
    await admin.from('km_gym_trainings').update({ reminder_sent_at: new Date().toISOString() }).eq('id', tr.id);
  }
  return NextResponse.json({ trainings: trainings?.length ?? 0, sent });
}
