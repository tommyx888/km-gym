# KM GYM – Tréningy a akcie (admin modul)

## Čo to robí
- **Admin → Tréningy** (`/sk/admin/treningy`): vytvorenie tréningu (názov SK/EN, popis, podrobnosti, tréner, miesto, dátum a čas
  v slovenskom čase, trvanie, kapacita, fotka, platba, len pre členov, uzávierka odhlásenia, stav), voliteľne **séria** (každý
  týždeň × N). Pri existujúcom tréningu: zoznam prihlásených + čakacia listina (meno, e‑mail, telefón), **prezenčka**
  (Prišiel/la · Neprišiel/la – po začiatku), odhlásenie osoby (miesto dostane prvý z listiny), kopírovanie e‑mailov,
  **duplikovať** (o týždeň neskôr ako koncept), **zrušiť** (e‑mail všetkým), odkaz na verejnú stránku a **plagát**.
- **Verejne**: `/sk/treningy` (zoznam + prebehnuté), `/sk/treningy/<slug>` (detail, počty, prihlásenie, kalendár .ics,
  zdieľanie, JSON‑LD Event pre Google), `/sk/treningy/<slug>/plagat` (A4 s QR kódom – Vytlačiť / PDF). Úvodná stránka
  zobrazuje 3 najbližšie tréningy (sekcia sa skryje, keď žiadne nie sú). EN: `/en/trainings/...`.
- **Člen**: prihlásenie jedným klikom (bez účtu → login/registrácia a návrat späť), kapacita → čakacia listina, odhlásenie
  do uzávierky, „Moje tréningy“ v členskej zóne (najbližšie + história).
- **Platba**: zadarmo / v cene členstva / platený (cena + odkaz napr. na Reservine + poznámka). Web platbu nerieši.
- **E‑maily** (Resend): potvrdenie (s .ics), čakacia listina, uvoľnené miesto, zrušenie, pripomienka deň vopred
  (Vercel Cron 16:00 UTC → `/api/cron/training-reminders`, okno 18–42 h pred začiatkom, raz na tréning).

## Databáza
`km_gym_trainings`, `km_gym_training_signups`, view `km_gym_training_counts` (verejné počty bez mien), funkcie
`km_gym_training_signup` (atomická kapacita), `km_gym_training_cancel` (povýšenie z listiny), `km_gym_training_attendance`.
Storage bucket `km-gym-trainings` (verejné čítanie, zápis admin). RLS: zverejnené tréningy číta každý, koncepty len admin;
prihlášky vidí člen svoje, admin všetky; zápisy len cez funkcie.

## Env (Vercel)
- `SUPABASE_SERVICE_ROLE_KEY` – e‑maily povýšeným/zrušeným (čítanie e‑mailov profilov) a cron.
- `RESEND_API_KEY`, `EMAIL_FROM="KM GYM <info@kmgym.sk>"` – bez nich sa e‑maily neposielajú (všetko ostatné funguje).
- `NEXT_PUBLIC_SITE_URL=https://kmgym.sk` – odkazy v e‑mailoch a QR kód na plagáte.
- `CRON_SECRET` – ľubovoľný dlhý reťazec; Vercel ho posiela cronu automaticky.

## Postup pre Tomasa
1. Admin → Tréningy → Nový tréning → vyplň, nahraj fotku, Stav = Zverejnený → Vytvoriť.
2. Otvor „Plagát“ → Vytlačiť / uložiť ako PDF → vylep v gyme. QR vedie na stránku tréningu.
3. Pred tréningom: zoznam prihlásených (telefóny), po začiatku odklikaj prezenčku.
4. Zrušenie: tlačidlo „Zrušiť tréning“ – všetkým príde e‑mail.
