'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
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

const TEAR_AT = 72; // px ťahu, po ktorých sa útržok odtrhne
const MAX_PULL = 110;

/** Zubatá horná hrana útržku – `progress` 0–1 určuje, odkiaľ zľava je už roztrhnutá. */
function tornEdge(progress: number) {
  const pts: string[] = [];
  const n = 34;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * 100;
    const torn = x <= progress * 100 + 0.01;
    const y = torn ? (i % 2 === 0 ? 10 : 1 + ((i * 7) % 5)) : 0;
    pts.push(`${x.toFixed(1)}% ${y}px`);
  }
  return `polygon(${pts.join(', ')}, 100% 100%, 0 100%)`;
}

/**
 * Panel prihlásenia ako lístok: horná časť = tréning, dolná = útržok s perforáciou.
 * Útržok sa dá odtrhnúť ťahom (pointer events) alebo kliknutím na tlačidlo; po odtrhnutí prebehne prihlásenie.
 */
export default function SignupPanel({ locale, t, trainingId, title, when, signedIn, loginHref, myStatus, free, canCancel, cancelHours, phone, disabled, icsHref }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // optimistický stav po akcii – server potvrdí cez router.refresh(); anim: 'tear' (klik) | 'drop' (ťah) | null
  const [local, setLocal] = useState<{ status: SignupStatus | null; anim: 'tear' | 'drop' | null; fromY: number } | null>(null);
  // ťahanie útržku
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ id: number; startY: number; moved: boolean } | null>(null);

  const status: SignupStatus | null = local ? local.status : myStatus;
  const torn = Boolean(status && status !== 'cancelled');

  const call = async (action: 'signup' | 'cancel', anim: 'tear' | 'drop' = 'tear', fromY = 0) => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    if (action === 'signup') {
      // útržok odtrhneme hneď (optimisticky); pri chybe ho vrátime
      setLocal({ status: free > 0 ? 'confirmed' : 'waitlist', anim, fromY });
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) playRip();
    }
    try {
      const res = await fetch('/api/trainings/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trainingId, action, locale }) });
      const json = await res.json();
      if (!res.ok) {
        setErr((t.errors as Record<string, string>)[json.error] ?? t.errors.generic);
        if (action === 'signup') setLocal({ status: 'cancelled', anim: null, fromY: 0 });
        return;
      }
      if (action === 'signup') {
        setLocal((l) => ({ status: json.status === 'waitlist' ? 'waitlist' : 'confirmed', anim: l?.anim ?? anim, fromY: l?.fromY ?? fromY }));
      } else {
        setLocal({ status: 'cancelled', anim: null, fromY: 0 });
        setMsg(t.cancelledOk);
      }
      router.refresh();
    } catch {
      setErr(t.errors.generic);
      if (action === 'signup') setLocal({ status: 'cancelled', anim: null, fromY: 0 });
    } finally {
      setBusy(false);
    }
  };

  /* --- ťah útržku --- */
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (busy || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return; // tlačidlo má vlastný klik, ťah začína mimo neho
    drag.current = { id: e.pointerId, startY: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dy = Math.max(0, Math.min(MAX_PULL, e.clientY - d.startY));
    if (dy > 6) d.moved = true;
    setPull(dy);
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    const dy = Math.max(0, Math.min(MAX_PULL, e.clientY - d.startY));
    setPull(0);
    if (dy >= TEAR_AT) void call('signup', 'drop', dy);
  };
  const onClickButton = () => void call('signup', 'tear');

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
  const progress = Math.min(1, pull / TEAR_AT);
  const animClass = local?.anim === 'drop' ? 'ticket-stub--dropping' : local?.anim === 'tear' ? 'ticket-stub--tearing' : 'ticket-stub--torn';

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
          <div className={`ticket-stub ${stubTone} px-7 pb-6 pt-7 md:px-8 ${animClass}`} style={{ '--tear-y': `${local?.fromY ?? 70}px` } as React.CSSProperties} aria-live="polite">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] opacity-80">{t.ticketStub}</p>
            <p className="font-display mt-2 text-[1.6rem] leading-none">{busy ? t.working : stubText}</p>
            {!busy && status !== 'attended' && status !== 'no_show' && (
              canCancel ? (
                <button type="button" onClick={() => call('cancel')} className="mt-4 text-[0.68rem] uppercase tracking-[0.2em] underline underline-offset-4 opacity-80 transition-opacity hover:opacity-100">
                  {t.cancelSignup}
                </button>
              ) : (
                <p className="mt-3 text-xs opacity-80">{t.cancelClosed.replace('{phone}', phone)}</p>
              )
            )}
          </div>
        ) : (
          <div
            className="ticket-grab relative border hairline border-t-0 bg-ink-950 px-7 pb-7 pt-5 md:px-8"
            style={{
              transform: `translateY(${pull}px) rotate(${(pull * 0.03).toFixed(2)}deg)`,
              clipPath: pull > 0 ? tornEdge(progress) : undefined,
              transformOrigin: '8% 0',
              transition: dragging ? 'none' : 'transform .45s var(--ease-out-expo), clip-path .3s',
            }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <div className="flex items-center justify-between text-[0.62rem] uppercase tracking-[0.3em] text-ink-500">
              <span>{t.ticketStub}</span>
              <span className={progress >= 1 ? 'text-crimson-500' : ''} aria-hidden="true">
                {progress >= 1 ? t.ticketRelease : t.ticketDrag} ↓
              </span>
            </div>
            <button type="button" onClick={onClickButton} disabled={busy} className="btn btn-primary mt-4 w-full disabled:opacity-60">
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
