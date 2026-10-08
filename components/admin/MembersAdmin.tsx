'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

export type MemberRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  locale: string | null;
  membership_status: 'none' | 'active' | 'expired';
  membership_until: string | null;
  tracker_invite_code: string | null;
  is_admin: boolean;
  created_at: string;
};

type T = Dictionary['admin'];

interface Props {
  locale: Locale;
  t: T;
  members: MemberRow[];
  currentUserId: string;
  trackerAdminUrl: string;
}

function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function MembersAdmin({ locale, t, members, currentUserId, trackerAdminUrl }: Props) {
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const fmt = (d: string) => new Date(d).toLocaleDateString(locale === 'sk' ? 'sk-SK' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return members;
    return members.filter((m) => [m.full_name, m.email, m.phone].some((v) => v?.toLowerCase().includes(needle)));
  }, [members, q]);

  return (
    <div className="border hairline">
      <div className="border-b hairline p-5 md:p-6">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} className="field" aria-label={t.search} />
      </div>

      {filtered.length === 0 ? (
        <p className="p-6 text-sm text-mist">{t.noResults}</p>
      ) : (
        <ul className="divide-y hairline">
          {filtered.map((m) => {
            const open = openId === m.id;
            const hasCode = Boolean(m.tracker_invite_code);
            return (
              <li key={m.id} className="p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-[1.5rem] leading-none text-white">{m.full_name || t.noName}</h3>
                      {m.is_admin && <span className="border border-crimson-600/60 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-crimson-500">{t.adminBadge}</span>}
                      {m.id === currentUserId && <span className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-500">({t.you})</span>}
                    </div>
                    <p className="mt-2 break-all text-sm text-mist">
                      {m.email}
                      {m.phone ? ` · ${m.phone}` : ''}
                    </p>
                    <p className="mt-1 text-[0.68rem] uppercase tracking-[0.2em] text-ink-500">
                      {t.registered} {fmt(m.created_at)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 text-sm md:flex-col md:items-end md:gap-y-2">
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${m.membership_status === 'active' ? 'bg-crimson-500' : 'bg-ink-600'}`} />
                      <span className="text-white">{t.status[m.membership_status]}</span>
                      {m.membership_status === 'active' && m.membership_until && <span className="text-ink-500">· {fmt(m.membership_until)}</span>}
                    </span>
                    <span className={`text-[0.68rem] uppercase tracking-[0.2em] ${hasCode ? 'text-crimson-500' : 'text-ink-500'}`}>
                      {hasCode ? `${t.trackerHas}: ${m.tracker_invite_code}` : t.trackerNone}
                    </span>
                    <button type="button" onClick={() => setOpenId(open ? null : m.id)} className="nav-link !text-[0.7rem]" aria-expanded={open}>
                      {open ? t.close : t.edit}
                    </button>
                  </div>
                </div>

                {open && <MemberEditor key={m.id} t={t} member={m} isSelf={m.id === currentUserId} trackerAdminUrl={trackerAdminUrl} onDone={() => setOpenId(null)} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function MemberEditor({ t, member, isSelf, trackerAdminUrl, onDone }: { t: T; member: MemberRow; isSelf: boolean; trackerAdminUrl: string; onDone: () => void }) {
  const router = useRouter();
  const [status, setStatus] = useState<MemberRow['membership_status']>(member.membership_status);
  const [until, setUntil] = useState(member.membership_until ?? '');
  const [code, setCode] = useState(member.tracker_invite_code ?? '');
  const [admin, setAdmin] = useState(member.is_admin);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const quick = (days: number) => {
    const base = status === 'active' && until && new Date(until) > new Date() ? new Date(until) : new Date();
    setStatus('active');
    setUntil(addDays(base, days));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const supabase = createClient();
    const { error } = await supabase
      .from('km_gym_profiles')
      .update({
        membership_status: status,
        membership_until: until || null,
        tracker_invite_code: code.trim() || null,
        is_admin: isSelf ? member.is_admin : admin,
      })
      .eq('id', member.id);
    setBusy(false);
    if (error) {
      setMsg(t.error);
      return;
    }
    setMsg(t.saved);
    router.refresh();
    onDone();
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-5 border-t hairline pt-6 md:grid-cols-2">
      <div>
        <label htmlFor={`status-${member.id}`} className="label"><span>{t.columns.membership}</span></label>
        <select id={`status-${member.id}`} value={status} onChange={(e) => setStatus(e.target.value as MemberRow['membership_status'])} className="field">
          {(['none', 'active', 'expired'] as const).map((s) => (
            <option key={s} value={s}>{t.status[s]}</option>
          ))}
        </select>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-ink-500">
          <span>{t.quick.label}</span>
          {([30, 90, 365] as const).map((d) => (
            <button key={d} type="button" onClick={() => quick(d)} className="border hairline px-2 py-1 text-mist transition-colors hover:border-white hover:text-white">
              {d === 30 ? t.quick.d30 : d === 90 ? t.quick.d90 : t.quick.d365}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor={`until-${member.id}`} className="label"><span>{t.until}</span></label>
        <input id={`until-${member.id}`} type="date" value={until} onChange={(e) => setUntil(e.target.value)} className="field" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor={`code-${member.id}`} className="label"><span>{t.trackerCode}</span></label>
        <input id={`code-${member.id}`} type="text" value={code} onChange={(e) => setCode(e.target.value)} className="field font-mono tracking-[0.15em]" autoComplete="off" spellCheck={false} />
        <p className="mt-2 text-xs leading-relaxed text-ink-500">
          {t.trackerHint}
          {trackerAdminUrl && (
            <>
              {' '}
              <a href={trackerAdminUrl} target="_blank" rel="noopener noreferrer" className="text-crimson-500 underline-offset-4 hover:underline">
                {t.trackerOpen} ↗
              </a>
            </>
          )}
        </p>
      </div>
      {!isSelf && (
        <label className="flex items-center gap-3 text-sm text-mist md:col-span-2">
          <input type="checkbox" checked={admin} onChange={(e) => setAdmin(e.target.checked)} className="h-4 w-4 accent-[#C8102E]" />
          {t.isAdmin}
        </label>
      )}
      <div className="flex items-center gap-4 md:col-span-2">
        <button type="submit" disabled={busy} className="btn btn-primary disabled:opacity-60">
          {busy ? t.saving : t.save}
        </button>
        {msg && <p className="text-sm text-mist" aria-live="polite">{msg}</p>}
      </div>
    </form>
  );
}
