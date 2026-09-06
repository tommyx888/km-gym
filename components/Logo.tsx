import Link from 'next/link';
import { site } from '@/lib/site';

/**
 * Dočasné logo KM Gym – koncept „Hanko“ (červená pečať s monogramom).
 * Až bude finálne logo (SVG), nahraď obsah tohto komponentu.
 */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="2" width="60" height="60" fill="var(--km-red-600)" />
      <rect x="2" y="2" width="60" height="60" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      {/* K */}
      <path d="M13 15h8v14l10-14h9L28 31l12 18h-9L21 34v15h-8z" fill="#fff" />
      {/* M – zjednodušené, z pravej strany */}
      <path d="M40 49V15h6l5 10 5-10h6v34h-7V31l-4 8h-1l-4-8v18z" fill="#fff" opacity="0" />
    </svg>
  );
}

export default function Logo({
  href,
  label = site.name,
  compact = false,
}: {
  href: string;
  label?: string;
  compact?: boolean;
}) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3" aria-label={label}>
      <span className="relative block h-10 w-10 shrink-0 overflow-hidden">
        <span className="absolute inset-0 bg-crimson-600 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-110" />
        <span className="font-display absolute inset-0 flex items-center justify-center text-[1.35rem] leading-none text-white">
          KM
        </span>
      </span>
      {!compact && (
        <span className="font-display text-[1.6rem] leading-none tracking-[0.08em] text-white">
          KM<span className="text-mist"> GYM</span>
        </span>
      )}
    </Link>
  );
}
