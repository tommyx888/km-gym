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

Všetky fakty sú na jednom mieste: **`lib/site.ts`** (telefón, e-mail, adresa, prevádzkovateľ, ceny, sociálne siete, 360° video, fotky galérie). Chýba: e-mail, Instagram, Facebook, doména, video, fotky.
Texty webu sú v **`lib/i18n/dictionaries.ts`** (SK aj EN). Texty s `[DOPLNIŤ …]` sa na webe zobrazia so štítkom „Doplniť“ – po prepísaní štítok sám zmizne.
Fotky galérie: nahraď `public/images/placeholder-*.svg` a uprav `site.gallery` v `lib/site.ts`. 360° video: `site.heroVideo`.
Logo: `components/Logo.tsx` (dočasný monogram v štýle „Hanko“).

## Členská zóna (Supabase Auth)

Registrácia, prihlásenie, reset hesla, profil, oznamy, tréningové plány, pozývací kód do denníka. Nastavenie Supabase + Resend: **`docs/supabase-auth-setup.md`**, e-mailové šablóny v `docs/email-templates/`. Routy: `/sk/prihlasenie`, `/sk/registracia`, `/sk/zabudnute-heslo`, `/sk/nove-heslo`, `/sk/clenska-zona` (+ EN ekvivalenty), `/auth/callback`, `/auth/signout`.

## Štruktúra

- `proxy.ts` – detekcia jazyka, redirect `/` → `/sk|/en`, prepis EN slugov (`/en/pricing` → interný `/en/cennik`)
- `app/[locale]/…` – stránky (home, o-nas, vybavenie, cennik, ako-to-funguje, clenstvo, kontakt, dokumenty/[slug])
- `app/api/reservations` – POST (prihláška za člena / vstup; anon kľúč + RLS), GET (service-role)
- `lib/i18n/config.ts` – locales, lokalizované slugy, `localizedHref()`
- `components/` – Header, Footer, Logo, Reveal (scroll animácie), Counter, Marquee, Gallery, MembershipForm, GoogleMap, ThemeToggle
- `supabase/schema.sql` – tabuľka `km_gym_reservations` (už aplikovaná v projekte `mqrpjdgrrkkdbdkrbdgg`)

## Dizajn

Tmavá téma je predvolená (značková), prepínač v hlavičke prepne na svetlú; voľba sa ukladá do `localStorage` (`km_theme`). Tokeny svetlej témy sú v `app/globals.css` pod `html[data-theme="light"]`, logo má svetlú variantu v `public/logo/*-light.png`.

Farby: antracit `#131518` / `#0B0C0E`, červená `#C8102E`, biela. Nadpisy Bebas Neue, text Inter (self-hostované v `app/fonts`).
Animácie rešpektujú `prefers-reduced-motion`.
