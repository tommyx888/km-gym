'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { SignupStatus } from '@/lib/trainings';
import { playRip } from '@/lib/rip-sound';

interface Props {
  locale: Locale;
  t: Dictionary['trainings'];
  trainingId: string;
  title: string;
  when: string;
  signedIn: boolean;
  loginHref: string;
  myStatus: SignupStatus | null;
  free: number;
  canCancel: boolean;
  cancelHours: number;
  phone: string;
  disabled: boolean; // zrušený / prebehol
  icsHref: string;
}

/**
 * Panel prihlásenia ako lístok: horná časť = tréning, dolná = útržok s perforáciou.
 * Tlačidlo je v útržku; po úspešnom prihlásení sa útržok „odtrhne“ (CSS animácia + krátky zvuk).
 */
export default function SignupPanel({ locale, t, trainingId, title, when, signedIn, loginHref, myStatus, free, canCancel, cancelHours, phone, disabled, icsHref }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // optimistický stav po kliku – server potvrdí cez router.refresh()
  const [local, setLocal] = useState<{ status: SignupStatus | null; tearing: boolean } | null>(null);

  const status: SignupStatus | null = local ? local.status : myStatus;
  const active = Boolean(status && status !== 'cancelled');
  const torn = active;
  const tearing = Boolean(local?.tearing);

  const call = async (action: 'signup' | 'cancel') => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch('/api/trainings/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trainingId, action, locale }) });
      const json = await res.json();
      if (!res.ok) {
        setErr((t.errors as Record<string, string>)[json.error] ?? t.errors.generic);
        return;
      }
      if (action === 'signup') {
        setLocal({ status: json.status === 'waitlist' ? 'waitlist' : 'confirmed', tearing: true });
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) playRip();
      } else {
        setLocal({ status: 'cancelled', tearing: false });
        setMsg(t.cancelledOk);
      }
      router.refresh();
    } catch {
      setErr(t.errors.generic);
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  const stubText = status === 'waitlist' ? t.youWaitlist : status === 'attended' ? t.youAttended : t.youConfirmed;
  const stubTone = status === 'waitlist' ? 'bg-ink-800 text-white' : 'bg-crimson-600 text-[#fff]';

  return (
    <div className="ticket">
      {/* Horná časť lístka */}
      <div className="relative border hairline border-b-0 bg-ink-950 p-7 grain md:p-8">
        <div className="relative z-10">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-crimson-500">{t.ticket}</p>
          <p className="font-display mt-3 text-[1.9rem] leading-none text-white">{title}</p>
          <p className="mt-2 text-sm text-mist">{when}</p>

          {disabled ? null : !signedIn ? (
            <Link href={loginHref} className="btn btn-primary mt-6 w-full">
              {t.signupLogin}
            </Link>
          ) : null}

          {msg && <p className="mt-4 text-sm text-white" aria-live="polite">{msg}</p>}
          {err && <p className="mt-4 text-sm text-crimson-500" aria-live="polite">{err}</p>}

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t hairline pt-5">
            <a href={icsHref} download className="nav-link !text-[0.7rem]">
              {t.calendar}
            </a>
            <button type="button" onClick={share} className="nav-link !text-[0.7rem]">
              {copied ? t.copied : t.share}
            </button>
          </div>
        </div>
      </div>

      {/* Perforácia so zárezmi */}
      <div className="ticket-perf" aria-hidden="true" />

      {/* Útržok */}
      {!disabled && signedIn && (
        torn ? (
          <div className={`ticket-stub ${stubTone} px-7 pb-6 pt-7 md:px-8 ${tearing ? 'ticket-stub--tearing' : 'ticket-stub--torn'}`} aria-live="polite">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] opacity-80">{t.ticketStub}</p>
            <p className="font-display mt-2 text-[1.6rem] leading-none">{stubText}</p>
            {status !== 'attended' && status !== 'no_show' && (
              canCancel ? (
                <button type="button" onClick={() => call('cancel')} disabled={busy} className="mt-4 text-[0.68rem] uppercase tracking-[0.2em] underline underline-offset-4 opacity-80 transition-opacity hover:opacity-100 disabled:opacity-50">
                  {busy ? t.working : t.cancelSignup}
                </button>
              ) : (
                <p className="mt-3 text-xs opacity-80">{t.cancelClosed.replace('{phone}', phone)}</p>
              )
            )}
          </div>
        ) : (
          <div className="border hairline border-t-0 bg-ink-950 px-7 pb-7 pt-6 md:px-8">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-ink-500">{t.ticketStub}</p>
            <button type="button" onClick={() => call('signup')} disabled={busy} className="btn btn-primary mt-4 w-full disabled:opacity-60">
              {busy ? t.working : free > 0 ? t.signup : t.signupWaitlist}
            </button>
            <p className="mt-3 text-xs text-ink-500">{t.ticketHint}</p>
            <p className="mt-1 text-xs text-ink-500">{t.cancelDeadline.replace('{h}', String(cancelHours))}</p>
          </div>
        )
      )}
      {(disabled || !signedIn) && <div className="border hairline border-t-0 bg-ink-950 px-7 py-4 text-[0.62rem] uppercase tracking-[0.3em] text-ink-500 md:px-8">{t.ticketStub}</div>}
    </div>
  );
}
