import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase klienti.
 * - `supabase`      – verejný (publishable/anon) kľúč. RLS dovoľuje iba INSERT do km_gym_reservations.
 * - `supabaseAdmin` – service-role kľúč, LEN NA SERVERI (API routy). Používa sa na čítanie rezervácií.
 *
 * Env (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL=
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=        (publishable key sb_publishable_… alebo legacy anon)
 *   SUPABASE_SERVICE_ROLE_KEY=            (voliteľné – potrebné pre GET /api/reservations)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key || !process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const RESERVATIONS_TABLE = 'km_gym_reservations';

export type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  time: string;
  locale: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};
