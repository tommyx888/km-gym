'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { localizedHref, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Training } from '@/lib/trainings';

type T = Dictionary['admin']['trainings'];

export default function TrainingActions({ locale, t, training }: { locale: Locale; t: T; training: Training }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const put = async (action: string) => {
    setBusy(action);
    setMsg(null);
    const res = await fetch('/api/admin/trainings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: training.id, action, locale }) });
    const json = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setMsg(t.error);
      return;
    }
    if (action === 'duplicate' && json.training?.id) {
      router.push(`${localizedHref(locale, 'admin')}/treningy/${json.training.id}`);
      return;
    }
    if (action === 'cancel') setMsg(t.cancelledOk);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={localizedHref(locale, 'trainings', training.slug)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-4 !py-2 !text-[0.65rem]">
        {t.open} ↗
      </a>
      <a href={`${localizedHref(locale, 'trainings', training.slug)}/plagat`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-4 !py-2 !text-[0.65rem]">
        {t.poster} ↗
      </a>
      <button type="button" disabled={busy !== null} onClick={() => put('duplicate')} className="btn btn-ghost !px-4 !py-2 !text-[0.65rem] disabled:opacity-60">
        {t.duplicate}
      </button>
      {training.status !== 'cancelled' && (
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => {
            if (confirm(t.cancelConfirm)) put('cancel');
          }}
          className="btn btn-ghost !border-crimson-600/60 !px-4 !py-2 !text-[0.65rem] !text-crimson-500 disabled:opacity-60"
        >
          {busy === 'cancel' ? '…' : t.cancelTraining}
        </button>
      )}
      {msg && <span className="text-sm text-mist">{msg}</span>}
    </div>
  );
}
