'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { localizedHref, type Locale } from '@/lib/i18n/config';

/** Ikona účtu v hlavičke: bez session → Prihlásiť sa, so session → Členská zóna. */
export default function AccountLink({ locale, labels, className = '' }: { locale: Locale; labels: { login: string; members: string }; className?: string }) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(Boolean(session?.user)));
    return () => sub.subscription.unsubscribe();
  }, []);

  const href = signedIn ? localizedHref(locale, 'members') : localizedHref(locale, 'login');
  const label = signedIn ? labels.members : labels.login;
  return (
    <Link href={href} className={`nav-link inline-flex items-center gap-2 whitespace-nowrap ${className}`} aria-label={label} title={label}>
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
      <span className="hidden xl:inline">{label}</span>
    </Link>
  );
}
