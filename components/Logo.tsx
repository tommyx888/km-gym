import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';

/**
 * Logo KM Gym.
 * - mark:  znak (KM + činka) – hlavička, päta, favicon
 * - full:  znak + wordmark „KM GYM“ – veľké použitie (hero, OG obrázok)
 * Zdroje: public/logo/ (transparentné PNG z dodaného loga).
 */
export function LogoMark({ className = '', priority = false }: { className?: string; priority?: boolean }) {
  return (
    <>
      <Image src="/logo/km-gym-mark-160.png" alt="" width={300} height={160} priority={priority} className={`logo-dark ${className}`} aria-hidden="true" />
      <Image src="/logo/km-gym-mark-160-light.png" alt="" width={300} height={160} priority={priority} className={`logo-light ${className}`} aria-hidden="true" />
    </>
  );
}

export function LogoFull({ className = '', priority = false }: { className?: string; priority?: boolean }) {
  return (
    <>
      <Image src="/logo/km-gym-logo-400.png" alt={`${site.name} logo`} width={548} height={400} priority={priority} className={`logo-dark ${className}`} />
      <Image src="/logo/km-gym-logo-400-light.png" alt={`${site.name} logo`} width={548} height={400} priority={priority} className={`logo-light ${className}`} />
    </>
  );
}

export default function Logo({
  href,
  label = site.name,
  compact = true,
  priority = false,
}: {
  href: string;
  label?: string;
  compact?: boolean;
  priority?: boolean;
}) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3" aria-label={label}>
      <LogoMark
        priority={priority}
        className="h-11 w-auto transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-105 md:h-13"
      />
      {!compact && (
        <span className="font-display hidden text-[1.5rem] leading-none tracking-[0.1em] text-white sm:inline">
          KM<span className="text-mist"> GYM</span>
        </span>
      )}
    </Link>
  );
}
