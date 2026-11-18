'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Dictionary } from '@/lib/i18n/dictionaries';

export type SubscriberRow = { id: string; email: string; locale: string; source: string | null; confirmed_at: string | null; unsubscribed_at: string | null; created_at: string };
type T = Dictionary['admin']['newsletter'];

export default function NewsletterAdmin({ t, rows }: { t: T; rows: SubscriberRow[] }) {
  const router = useRouter();
  const confirmed = rows.filter((r) => r.confirmed_at && !r.unsubscribed_at);
  const pending = rows.filter((r) => !r.confirmed_at && !r.unsubscribed_at);
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const send = async (test: boolean) => {
    if (!subject.trim() || !text.trim()) return;
    if (!test && !confirm(t.sendConfirm.replace('{n}', String(confirmed.length)))) return;
    setBusy(test ? 'test' : 'send');
    setMsg(null);
    const res = await fetch('/api/admin/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, text, ctaLabel, ctaUrl, test }) });
    const json = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setMsg(t.error);
      return;
    }
    setMsg(test ? t.testSent : t.sent.replace('{n}', String(json.sent ?? 0)));
    if (!test) {
      setSubject('');
      setText('');
      setCtaLabel('');
      setCtaUrl('');
    }
  };

  const remove = async (r: SubscriberRow) => {
    if (!confirm(t.removeConfirm.replace('{email}', r.email))) return;
    setBusy(r.id);
    await fetch('/api/admin/newsletter', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: r.id }) });
    setBusy(null);
    router.refresh();
  };

  const copyEmails = async () => {
    try {
      await navigator.clipboard.writeText(confirmed.map((r) => r.email).join(', '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const fmt = (iso: string) => new Date(iso).toLocaleDateString('sk-SK', { day: 'numeric', month: 'numeric', year: 'numeric' });

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 gap-px bg-ink-700">
          <div className="bg-ink-900 p-6">
            <p className="font-display text-[3rem] leading-none text-white">{confirmed.length}</p>
            <p className="mt-2 text-[0.68rem] uppercase tracking-[0.25em] text-mist">{t.subscribers}</p>
          </div>
          <div className="bg-ink-900 p-6">
            <p className="font-display text-[3rem] leading-none text-ink-500">{pending.length}</p>
            <p className="mt-2 text-[0.68rem] uppercase tracking-[0.25em] text-mist">{t.pending}</p>
          </div>
        </div>

        <div className="mt-8 border hairline bg-ink-900 p-6 md:p-8">
          <p className="eyebrow">{t.compose}</p>
          <p className="mt-3 text-sm text-mist">{t.lead}</p>
          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="nl-subject" className="label"><span>{t.subject}</span></label>
              <input id="nl-subject" className="field" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={150} />
            </div>
            <div>
              <label htmlFor="nl-text" className="label"><span>{t.body}</span></label>
              <textarea id="nl-text" className="field min-h-48" value={text} onChange={(e) => setText(e.target.value)} maxLength={10000} />
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="nl-cta" className="label"><span>{t.ctaLabel}</span></label>
                <input id="nl-cta" className="field" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} maxLength={60} />
              </div>
              <div>
                <label htmlFor="nl-cta-url" className="label"><span>{t.ctaUrl}</span></label>
                <input id="nl-cta-url" type="url" className="field" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://kmgym.sk/…" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button type="button" disabled={busy !== null || !subject.trim() || !text.trim()} onClick={() => send(false)} className="btn btn-primary disabled:opacity-60">
                {busy === 'send' ? t.sending : t.send}
              </button>
              <button type="button" disabled={busy !== null || !subject.trim() || !text.trim()} onClick={() => send(true)} className="btn btn-ghost disabled:opacity-60">
                {busy === 'test' ? t.sending : t.test}
              </button>
              {msg && <span className="text-sm text-mist">{msg}</span>}
            </div>
          </div>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">{t.recent}</p>
          {confirmed.length > 0 && (
            <button type="button" onClick={copyEmails} className="nav-link !text-[0.65rem]">
              {copied ? t.copied : t.export}
            </button>
          )}
        </div>
        {rows.length ? (
          <ul className="mt-4 divide-y hairline text-sm">
            {rows.slice(0, 100).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className={`truncate ${r.confirmed_at && !r.unsubscribed_at ? 'text-white' : 'text-ink-500 line-through'}`}>{r.email}</p>
                  <p className="text-xs text-mist">
                    {fmt(r.created_at)} · {r.confirmed_at ? t.confirmed : t.unconfirmed}
                    {r.source ? ` · ${r.source}` : ''} · {r.locale}
                  </p>
                </div>
                <button type="button" disabled={busy !== null} onClick={() => remove(r)} className="shrink-0 border hairline px-2 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-ink-500 transition-colors hover:border-crimson-600 hover:text-crimson-500">
                  {t.remove}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-mist">{t.none}</p>
        )}
      </aside>
    </div>
  );
}
