'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { SignupStatus } from '@/lib/trainings';

export type SignupRow = { id: string; user_id: string; status: SignupStatus; created_at: string; name: string; email: string | null; phone: string | null };

type T = Dictionary['admin']['trainings'];

export default function TrainingSignups({ t, trainingId, rows, started }: { t: T; trainingId: string; rows: SignupRow[]; started: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const confirmed = rows.filter((r) => r.status === 'confirmed' || r.status === 'attended' || r.status === 'no_show');
  const waitlist = rows.filter((r) => r.status === 'waitlist');

  const act = async (payload: Record<string, unknown>, key: string) => {
    setBusy(key);
    await fetch('/api/admin/trainings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: trainingId, ...payload }) });
    setBusy(null);
    router.refresh();
  };

  const copyEmails = async () => {
    const emails = confirmed.map((r) => r.email).filter(Boolean).join(', ');
    try {
      await navigator.clipboard.writeText(emails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const Row = ({ r, i }: { r: SignupRow; i: number }) => (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-white">
          <span className="mr-2 text-ink-500">{i + 1}.</span>
          {r.name}
          {r.status === 'attended' && <span className="ml-2 text-[0.6rem] uppercase tracking-[0.2em] text-crimson-500">{t.attended}</span>}
          {r.status === 'no_show' && <span className="ml-2 text-[0.6rem] uppercase tracking-[0.2em] text-ink-500">{t.noShow}</span>}
        </p>
        <p className="truncate text-xs text-mist">
          {r.email}
          {r.phone ? ` · ${r.phone}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2 text-[0.62rem] uppercase tracking-[0.2em]">
        {started && r.status !== 'waitlist' && (
          <>
            <button type="button" disabled={busy !== null} onClick={() => act({ action: 'attendance', signupId: r.id, status: r.status === 'attended' ? 'confirmed' : 'attended' }, r.id)} className={`border px-2 py-1 transition-colors ${r.status === 'attended' ? 'border-crimson-600 text-crimson-500' : 'hairline text-mist hover:text-white'}`}>
              {t.attended}
            </button>
            <button type="button" disabled={busy !== null} onClick={() => act({ action: 'attendance', signupId: r.id, status: r.status === 'no_show' ? 'confirmed' : 'no_show' }, r.id)} className={`border px-2 py-1 transition-colors ${r.status === 'no_show' ? 'border-white text-white' : 'hairline text-mist hover:text-white'}`}>
              {t.noShow}
            </button>
          </>
        )}
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => {
            if (confirm(t.removeConfirm)) act({ action: 'remove_signup', userId: r.user_id }, r.id);
          }}
          className="border hairline px-2 py-1 text-ink-500 transition-colors hover:border-crimson-600 hover:text-crimson-500"
        >
          {t.removeSignup}
        </button>
      </div>
    </li>
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">
            {t.signups} · {confirmed.length}
          </p>
          {confirmed.length > 0 && (
            <button type="button" onClick={copyEmails} className="nav-link !text-[0.65rem]">
              {copied ? t.copied : t.export}
            </button>
          )}
        </div>
        {confirmed.length ? <ul className="mt-3 divide-y hairline text-sm">{confirmed.map((r, i) => <Row key={r.id} r={r} i={i} />)}</ul> : <p className="mt-3 text-sm text-mist">{t.noSignups}</p>}
      </div>
      <div>
        <p className="eyebrow">
          {t.waitlist} · {waitlist.length}
        </p>
        {waitlist.length ? <ul className="mt-3 divide-y hairline text-sm">{waitlist.map((r, i) => <Row key={r.id} r={r} i={i} />)}</ul> : <p className="mt-3 text-sm text-mist">{t.noSignups}</p>}
      </div>
    </div>
  );
}
