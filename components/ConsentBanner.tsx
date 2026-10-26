'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useSyncExternalStore } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries';

/**
 * Cookie lišta – zobrazí sa len keď je nastavená analytika (site.analytics). Analytické skripty sa
 * načítajú VÝLUČNE po kliknutí „Súhlasím“. Voľba: localStorage km_consent = { v, granted, at }, 12 mesiacov.
 * „Nastavenia cookies“ v päte vyvolá lištu znova (event km:consent-open).
 */
const KEY = 'km_consent';
const MAX_AGE = 365 * 86_400_000;

type Stored = { granted: boolean; at: number };
type Snapshot = { stored: Stored | null; forceOpen: boolean };

/* Malý externý store: localStorage + príznak „otvoriť znova“ (useSyncExternalStore → bez setState v effecte, bez hydration mismatchu). */
let forceOpen = false;
let cache: Snapshot = { stored: null, forceOpen: false };
const listeners = new Set<() => void>();
const SERVER: Snapshot = { stored: { granted: false, at: 0 }, forceOpen: false }; // na serveri lišta zatvorená

function read(): Stored | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Stored;
    if (!v || typeof v.granted !== 'boolean' || Date.now() - v.at > MAX_AGE) return null;
    return v;
  } catch {
    return null;
  }
}
function snapshot(): Snapshot {
  const stored = read();
  if (cache.forceOpen !== forceOpen || cache.stored?.granted !== stored?.granted || cache.stored?.at !== stored?.at) cache = { stored, forceOpen };
  return cache;
}
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  const reopen = () => {
    forceOpen = true;
    emit();
  };
  window.addEventListener('km:consent-open', reopen);
  window.addEventListener('storage', emit);
  return () => {
    listeners.delete(l);
    window.removeEventListener('km:consent-open', reopen);
    window.removeEventListener('storage', emit);
  };
}

export default function ConsentBanner({ t, gaId, metaPixelId, moreHref }: { t: Dictionary['consent']; gaId: string; metaPixelId: string; moreHref: string }) {
  const enabled = Boolean(gaId || metaPixelId);
  const snap = useSyncExternalStore(subscribe, snapshot, () => SERVER);
  const granted = snap.stored?.granted === true;
  const open = snap.forceOpen || snap.stored === null;

  if (!enabled) return null;

  const decide = (g: boolean) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ granted: g, at: Date.now() } satisfies Stored));
    } catch {}
    forceOpen = false;
    if (!g && granted) {
      // odvolanie súhlasu – spoľahlivé odstránenie už načítaných skriptov vyžaduje reload
      window.location.reload();
      return;
    }
    emit();
  };

  return (
    <>
      {granted && gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="km-ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}</Script>
        </>
      )}
      {granted && metaPixelId && (
        <Script id="km-meta" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}</Script>
      )}

      {open && (
        <div role="dialog" aria-modal="false" aria-labelledby="km-consent-title" className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl border hairline bg-ink-950 p-6 shadow-2xl md:inset-x-auto md:right-6 md:bottom-6">
          <p id="km-consent-title" className="eyebrow">{t.title}</p>
          <p className="mt-3 text-sm leading-relaxed text-mist">{t.text}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => decide(false)} className="btn btn-ghost flex-1 !py-3">
              {t.reject}
            </button>
            <button type="button" onClick={() => decide(true)} className="btn btn-primary flex-1 !py-3">
              {t.accept}
            </button>
          </div>
          <Link href={moreHref} className="nav-link mt-4 inline-block !text-[0.7rem]">
            {t.more}
          </Link>
        </div>
      )}
    </>
  );
}

/** Odkaz do päty – otvorí lištu znova. Renderuje sa len keď je analytika zapnutá. */
export function ConsentSettingsLink({ label, enabled }: { label: string; enabled: boolean }) {
  if (!enabled) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event('km:consent-open'))} className="nav-link !text-[0.7rem]">
      {label}
    </button>
  );
}
