-- KM Gym – schéma rezervácií. Aplikované ako migrácia "km_gym_reservations"
-- v Supabase projekte mqrpjdgrrkkdbdkrbdgg (6. 9. 2026). Tu len ako referencia.
CREATE TABLE IF NOT EXISTS public.km_gym_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (char_length(email) <= 200),
  phone TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  locale TEXT NOT NULL DEFAULT 'sk' CHECK (locale IN ('sk', 'en')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_km_gym_reservations_date ON public.km_gym_reservations(date);
CREATE INDEX IF NOT EXISTS idx_km_gym_reservations_created ON public.km_gym_reservations(created_at DESC);

ALTER TABLE public.km_gym_reservations ENABLE ROW LEVEL SECURITY;

-- Verejnosť môže iba vkladať; čítanie len cez service-role kľúč na serveri.
CREATE POLICY "km_gym_public_insert" ON public.km_gym_reservations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
