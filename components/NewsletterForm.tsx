'use client';

import { useState } from 'react';
import Link from 'next/link';
import { legalDocs, localizedHref, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

type T = Dictionary['newsletter'];
type Status = 'idle' | 'working' | 'sent' | 'already' | 'invalid' | 'error';

/** Prihlásenie na newsletter (double opt‑in). compact = verzia do päty. */
export default function NewsletterForm({ locale, t, source, compact }: { locale: Locale; t: T; source: string; compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';
    setStatus('working');
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, locale, source, website: honeypot }) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(json?.error === 'invalid' ? 'invalid' : 'error');
        return;
      }
      setStatus(json.status === 'already' ? 'already' : 'sent');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  const message = status === 'sent' ? t.sent : status === 'already' ? t.already : status === 'invalid' ? t.invalid : status === 'error' ? t.error : null;
  const ok = status === 'sent' || status === 'already';

  return (
    <form onSubmit={submit} className={compact ? 'mt-6' : 'mt-10 max-w-xl'} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`nl-${source}`} className="sr-only">
          E-mail
        </label>
        <input
          id={`nl-${source}`}
          type="email"
          autoComplete="email"
          required
          className="field flex-1"
          placeholder={t.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'working'}
        />
        {/* Honeypot – ľudia nevidia, boty vyplnia. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
        <button type="submit" disabled={status === 'working'} className={`btn btn-primary shrink-0 ${compact ? '!px-5 !py-3 !text-[0.65rem]' : ''} disabled:opacity-60`}>
          {status === 'working' ? t.working : t.button}
        </button>
      </div>
      {message && (
        <p className={`mt-3 text-sm ${ok ? 'text-white' : 'text-crimson-500'}`} role="status" aria-live="polite">
          {message}
        </p>
      )}
      <p className={`mt-3 text-xs leading-relaxed text-ink-500 ${compact ? '' : 'max-w-md'}`}>
        {t.consent}{' '}
        <Link href={localizedHref(locale, 'legal', legalDocs.privacy[locale])} className="underline underline-offset-2 hover:text-white">
          →
        </Link>
      </p>
    </form>
  );
}
