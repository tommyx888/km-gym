'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

interface Props {
  locale: Locale;
  t: Dictionary['members']['profileForm'];
  initial: { full_name: string; phone: string };
  email: string;
}

export default function ProfileForm({ locale, t, initial, email }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from('km_gym_profiles')
      .update({ full_name: String(fd.get('full_name') ?? '').trim() || null, phone: String(fd.get('phone') ?? '').trim() || null, locale })
      .eq('id', user.id);
    setBusy(false);
    setMsg(error ? t.error : t.saved);
    if (!error) router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-5">
      <div>
        <label className="label"><span>{t.email}</span></label>
        <input type="email" value={email} readOnly className="field opacity-60" />
      </div>
      <div>
        <label htmlFor="full_name" className="label"><span>{t.fullName}</span></label>
        <input id="full_name" name="full_name" type="text" className="field" defaultValue={initial.full_name} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="phone" className="label"><span>{t.phone}</span></label>
        <input id="phone" name="phone" type="tel" className="field" defaultValue={initial.phone} autoComplete="tel" />
      </div>
      <button type="submit" disabled={busy} className="btn btn-ghost w-full disabled:opacity-60">
        {busy ? t.saving : t.save}
      </button>
      {msg && <p className="text-sm text-mist" aria-live="polite">{msg}</p>}
    </form>
  );
}
