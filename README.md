# KM Gym — web

Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase · TypeScript. Rebranding pôvodného Grif Gym webu.

## Spustenie

```bash
npm install
npm run dev        # http://localhost:3000  → presmeruje na /sk alebo /en
npm run build && npm start
```

`.env.local` je pripravený (Supabase URL + publishable key). `SUPABASE_SERVICE_ROLE_KEY` doplň
zo Supabase dashboardu, ak chceš čítať rezervácie cez `GET /api/reservations`.

## Čo doplniť (placeholdery)

Všetky fakty sú na jednom mieste: **`lib/site.ts`** (telefón, e-mail, adresa, ceny, hodiny, štatistiky, sociálne siete, rok založenia).
Texty webu sú v **`lib/i18n/dictionaries.ts`** (SK aj EN). Texty s `[PLACEHOLDER …]` sa na webe zobrazia so štítkom „Doplniť“ – po prepísaní štítok sám zmizne.
Fotky galérie: nahraď `public/images/placeholder-*.svg` a uprav zoznam v `app/[locale]/galeria/page.tsx`.
Logo: `components/Logo.tsx` (dočasný monogram v štýle „Hanko“).

## Štruktúra

- `proxy.ts` – detekcia jazyka, redirect `/` → `/sk|/en`, prepis EN slugov (`/en/pricing` → interný `/en/cennik`)
- `app/[locale]/…` – stránky (home, o-nas, galeria, cennik, rezervacie, kontakt)
- `app/api/reservations` – POST (vloženie rezervácie cez anon kľúč, RLS), GET (service-role)
- `lib/i18n/config.ts` – locales, lokalizované slugy, `localizedHref()`
- `components/` – Header, Footer, Logo, Reveal (scroll animácie), Counter, Marquee, Gallery, ReservationForm, GoogleMap
- `supabase/schema.sql` – tabuľka `km_gym_reservations` (už aplikovaná v projekte `mqrpjdgrrkkdbdkrbdgg`)

## Dizajn

Farby: antracit `#131518` / `#0B0C0E`, červená `#C8102E`, biela. Nadpisy Bebas Neue, text Inter (self-hostované v `app/fonts`).
Animácie rešpektujú `prefers-reduced-motion`.
