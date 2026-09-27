'use client';

import Script from 'next/script';
import { site } from '@/lib/site';

interface Props {
  text: string;
  className?: string;
  variant?: 'primary' | 'ghost' | 'light';
  /** 'reservation' (predvolené) = termín, 'membership' = kúpa členstva */
  target?: 'reservation' | 'membership';
}

/**
 * Rezervačné tlačidlo Reservine.
 * - Ak je v lib/site.ts nastavený `reservine.partner` + `reservine.scriptSrc`, vloží oficiálny
 *   embed (<reservine-button>) – rezervácia sa otvorí priamo na webe.
 * - Inak odkáže na hostovanú rezervačnú stránku `reservine.url` (funguje vždy).
 */
export default function ReservineButton({ text, className = '', variant = 'primary', target = 'reservation' }: Props) {
  const { partner, scriptSrc } = site.reservine;
  const url = target === 'membership' ? site.reservine.membership : site.reservine.url;
  const btn = `btn btn-${variant} ${className}`;

  if (partner && scriptSrc) {
    return (
      <>
        <Script src={scriptSrc} strategy="lazyOnload" />
        <span className={`reservine-wrap ${className}`}>
          {/* @ts-expect-error – custom element z Reservine embed skriptu */}
          <reservine-button partner={partner} text={text} />
        </span>
      </>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={btn} data-reservine={target}>
      {text}
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path d="M7 17L17 7M9 7h8v8" />
      </svg>
    </a>
  );
}
