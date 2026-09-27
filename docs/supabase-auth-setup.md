# Supabase Auth + Resend — nastavenie pre KM GYM (členská zóna)

Projekt: https://supabase.com/dashboard/project/mqrpjdgrrkkdbdkrbdgg
Kód je hotový (registrácia, prihlásenie, reset hesla, členská zóna). Tento návod je len klikanie v dashboardoch – ~15 min.

## 1. Resend (odosielanie e-mailov)
1. resend.com → **Domains → Add domain** → `kmgym.sk` (alebo tvoja doména). Región: EU (Ireland).
2. Resend ukáže DNS záznamy (DKIM `resend._domainkey`, SPF/MX pre `send.` subdoménu, voliteľne DMARC).
   Pridaj ich u registrátora domény, počkaj na **Verified** (5–30 min).
3. **API Keys → Create** → názov `supabase-auth`, permission *Sending access*, doména `kmgym.sk`. Kľúč si skopíruj (uvidíš ho len raz). **Nikam ho neposielaj**, ide len do Supabase.
4. Odosielacia adresa: `info@kmgym.sk` (alebo `noreply@kmgym.sk`). Nemusí to byť reálna schránka – ale ak chceš odpovede, nastav v Resend *Reply-To* alebo použi existujúcu.

## 2. Supabase → Authentication → SMTP Settings (Custom SMTP: ON)
| Pole | Hodnota |
|---|---|
| Sender email | `info@kmgym.sk` |
| Sender name | `KM GYM` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | *(Resend API key)* |
| Minimum interval between emails | `60` s (ochrana pred spamom) |

Po uložení: **Rate limits** (Authentication → Rate Limits) → *Email sent per hour* zvýš z 2 na napr. 30 – s vlastným SMTP to Supabase dovolí.

## 3. Supabase → Authentication → URL Configuration
| Pole | Hodnota |
|---|---|
| Site URL | `https://kmgym.sk` (produkčná doména webu) |
| Redirect URLs | `https://kmgym.sk/auth/callback`, `https://kmgym.sk/**`, `http://localhost:3000/auth/callback`, `http://localhost:3000/**` |

Ak web pobeží na Vercel preview, pridaj aj `https://*.vercel.app/auth/callback`.

## 4. Supabase → Authentication → Providers → Email
- **Enable Email provider**: ON
- **Confirm email**: ON (člen musí potvrdiť e-mail – chráni pred preklepmi a spamom)
- **Secure email change**: ON
- **Minimum password length**: 8
- **Prevent use of leaked passwords**: ON (HaveIBeenPwned, zadarmo)
- Ostatné (Magic link, OTP) môžu ostať zapnuté, web ich zatiaľ nepoužíva.

## 5. Supabase → Authentication → Email Templates
Do každej šablóny vlož obsah zo súboru v `docs/email-templates/` (Subject + Body/HTML):

| Šablóna v Supabase | Subject | Súbor |
|---|---|---|
| Confirm signup | `KM GYM – potvrď svoj e-mail` | `confirm-signup.html` |
| Reset password | `KM GYM – nové heslo` | `reset-password.html` |
| Magic Link | `KM GYM – prihlásenie` | `magic-link.html` |
| Change Email Address | `KM GYM – potvrď zmenu e-mailu` | `change-email.html` |
| Invite user | `KM GYM – pozvánka do členskej zóny` | `invite.html` |

Šablóny používajú `{{ .ConfirmationURL }}` – Supabase ho nasmeruje na náš `/auth/callback`, ktorý spraví výmenu kódu za session a presmeruje do členskej zóny (alebo na „Nové heslo“ pri resete).

## 6. Test
1. `npm run dev` → `http://localhost:3000/sk/registracia` → zaregistruj svoj e-mail.
2. Mal by prísť e-mail od `KM GYM <info@kmgym.sk>` (v Resend → Emails vidíš log a prípadnú chybu).
3. Klikni → skončíš v `/sk/clenska-zona?welcome=1`.
4. Odhlás sa → „Zabudnuté heslo“ → e-mail → nastav nové → prihlás sa.

## 7. Správa členov (zatiaľ cez Supabase dashboard → Table Editor)
- **`km_gym_profiles`**: pri každom členovi nastav `membership_status` (`active` / `expired`), `membership_until` a `tracker_invite_code` (kód z openGym admina). Člen to hneď vidí v členskej zóne. Sebe nastav `is_admin = true`.
- **`km_gym_announcements`**: oznamy. `members_only=false` → zobrazí sa aj verejne (pripravené na neskoršie použitie na úvode), `pinned=true` → „Dôležité“ hore. `title_en/body_en` voliteľné.
- **`km_gym_plans`**: tréningové plány – nahraj PDF do Storage (bucket `km-gym-plans`, public) a vlož URL do `file_url`; súbor plánu pre denník do `tracker_plan_url`.
- Používatelia: Authentication → Users (zmazať, resetnúť heslo, pozvať cez „Invite user“).

## Bezpečnosť (už v kóde)
- RLS: člen číta/edituje len svoj profil a nemôže si sám zmeniť status členstva, kód ani admin flag. Oznamy a plány číta len prihlásený. Admin (is_admin) má plný prístup cez RLS.
- Session v httpOnly cookies (`@supabase/ssr`), obnova v `proxy.ts`; členská zóna je chránená na serveri.
- Registrácia neprezradí, či e-mail existuje (Supabase enumeration protection) – web to zachytí a ukáže správnu hlášku.
