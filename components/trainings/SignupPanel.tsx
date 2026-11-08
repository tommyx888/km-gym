'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { SignupStatus } from '@/lib/trainings';

interface Props {
  locale: Locale;
  t: Dictionary['trainings'];
  trainingId: string;
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

export default function SignupPanel({ locale, t, trainingId, signedIn, loginHref, myStatus, free, canCancel, cancelHours, phone, disabled, icsHref }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
      setMsg(action === 'cancel' ? t.cancelledOk : json.status === 'waitlist' ? t.youWaitlist : t.youConfirmed);
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

  const active = myStatus && myStatus !== 'cancelled';

  return (
    <div className="border hairline bg-ink-950 p-7 grain md:p-8">
      <div className="relative z-10">
        {disabled ? null : !signedIn ? (
          <Link href={loginHref} className="btn btn-primary w-full">
            {t.signupLogin}
          </Link>
        ) : active ? (
          <>
            <p className="font-display text-[1.6rem] leading-none text-white">
              {myStatus === 'waitlist' ? t.youWaitlist : myStatus === 'attended' ? t.youAttended : t.youConfirmed}
            </p>
            {myStatus !== 'attended' && myStatus !== 'no_show' && (
              canCancel ? (
                <button type="button" onClick={() => call('cancel')} disabled={busy} className="btn btn-ghost mt-5 w-full disabled:opacity-60">
                  {busy ? t.working : t.cancelSignup}
                </button>
              ) : (
                <p className="mt-4 text-sm text-mist">{t.cancelClosed.replace('{phone}', phone)}</p>
              )
            )}
          </>
        ) : (
          <>
            <button type="button" onClick={() => call('signup')} disabled={busy} className="btn btn-primary w-full disabled:opacity-60">
              {busy ? t.working : free > 0 ? t.signup : t.signupWaitlist}
            </button>
            <p className="mt-3 text-xs text-ink-500">{t.cancelDeadline.replace('{h}', String(cancelHours))}</p>
          </>
        )}

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
  );
}
