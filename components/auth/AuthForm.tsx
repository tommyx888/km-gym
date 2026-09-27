'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { localizedHref, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

type Mode = 'login' | 'register' | 'forgot' | 'newPassword';

interface Props {
  mode: Mode;
  locale: Locale;
  t: Dictionary['auth'];
}

/** Jeden komponent pre prihlásenie, registráciu, zabudnuté heslo a nové heslo (Supabase Auth). */
export default function AuthForm({ mode, locale, t }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(
    params.get('error') === 'link' ? { kind: 'err', text: t.errors.link } : null,
  );

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const callback = `${origin}/auth/callback?locale=${locale}`;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '').trim().toLowerCase();
    const password = String(fd.get('password') ?? '');

    try {
      if (mode === 'register') {
        const password2 = String(fd.get('password2') ?? '');
        if (password.length < 8) throw new Error(t.errors.passwordShort);
        if (password !== password2) throw new Error(t.errors.passwordMismatch);
        if (!fd.get('consent')) throw new Error(t.errors.consent);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: callback,
            data: { full_name: String(fd.get('full_name') ?? '').trim(), phone: String(fd.get('phone') ?? '').trim(), locale },
          },
        });
        if (error) throw error;
        // Supabase pri existujúcom e-maile vráti user bez identities (ochrana pred enumeráciou)
        if (data.user && data.user.identities?.length === 0) throw new Error(t.errors.emailExists);
        setMsg({ kind: 'ok', text: t.registerSuccess });
        e.currentTarget.reset();
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const next = params.get('next');
        router.replace(next && next.startsWith('/') ? next : localizedHref(locale, 'members'));
        router.refresh();
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${callback}&type=recovery` });
        if (error) throw error;
        setMsg({ kind: 'ok', text: t.forgotSuccess });
      } else if (mode === 'newPassword') {
        const password2 = String(fd.get('password2') ?? '');
        if (password.length < 8) throw new Error(t.errors.passwordShort);
        if (password !== password2) throw new Error(t.errors.passwordMismatch);
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMsg({ kind: 'ok', text: t.newPasswordSuccess });
        setTimeout(() => {
          router.replace(localizedHref(locale, 'members'));
          router.refresh();
        }, 1200);
      }
    } catch (err) {
      const m = err instanceof Error ? err.message : String(err);
      setMsg({ kind: 'err', text: mapError(m, t) });
    } finally {
      setBusy(false);
    }
  };

  const field = (id: string, label: string, type: string, extra: Record<string, unknown> = {}) => (
    <div>
      <label htmlFor={id} className="label">
        <span>{label}</span>
        <span className="text-crimson-500">{t.required}</span>
      </label>
      <input id={id} name={id} type={type} className="field" required {...extra} />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {mode === 'register' && field('full_name', t.fullName, 'text', { autoComplete: 'name', placeholder: 'Ján Novák' })}
      {mode !== 'newPassword' && field('email', t.email, 'email', { autoComplete: 'email', placeholder: 'jan@email.sk' })}
      {mode === 'register' && (
        <div>
          <label htmlFor="phone" className="label">
            <span>{t.phone}</span>
            <span>{t.optional}</span>
          </label>
          <input id="phone" name="phone" type="tel" className="field" autoComplete="tel" placeholder="0903 …" />
        </div>
      )}
      {(mode === 'login' || mode === 'register' || mode === 'newPassword') &&
        field('password', mode === 'newPassword' ? t.newPassword : t.password, 'password', {
          autoComplete: mode === 'login' ? 'current-password' : 'new-password',
          minLength: 8,
        })}
      {(mode === 'register' || mode === 'newPassword') &&
        field('password2', t.passwordRepeat, 'password', { autoComplete: 'new-password', minLength: 8 })}
      {mode === 'register' && (
        <label className="flex cursor-pointer items-start gap-3 text-sm text-mist">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4 shrink-0 accent-[#c8102e]" />
          <span>{t.consent}</span>
        </label>
      )}

      <button type="submit" disabled={busy} className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? t.working : t.submit[mode]}
      </button>

      <div aria-live="polite">
        {msg && (
          <div className={`border p-4 text-sm ${msg.kind === 'ok' ? 'border-white/20 bg-white/5 text-white' : 'border-crimson-600/60 bg-crimson-600/10 text-crimson-500'}`}>
            {msg.text}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t hairline pt-5 text-[0.72rem] uppercase tracking-[0.2em]">
        {mode === 'login' && (
          <>
            <Link href={localizedHref(locale, 'forgot')} className="nav-link !text-[0.7rem]">{t.links.forgot}</Link>
            <Link href={localizedHref(locale, 'register')} className="nav-link !text-[0.7rem]">{t.links.register}</Link>
          </>
        )}
        {mode !== 'login' && (
          <Link href={localizedHref(locale, 'login')} className="nav-link !text-[0.7rem]">{t.links.login}</Link>
        )}
      </div>
    </form>
  );
}

function mapError(m: string, t: Dictionary['auth']): string {
  const s = m.toLowerCase();
  if (s.includes('invalid login credentials')) return t.errors.invalid;
  if (s.includes('email not confirmed')) return t.errors.notConfirmed;
  if (s.includes('already registered') || s.includes('already exists')) return t.errors.emailExists;
  if (s.includes('rate limit') || s.includes('too many')) return t.errors.rateLimit;
  if (s.includes('password') && s.includes('at least')) return t.errors.passwordShort;
  if (s.includes('auth session missing')) return t.errors.link;
  return m;
}
