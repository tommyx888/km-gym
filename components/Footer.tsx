import Link from 'next/link';
import Logo from './Logo';
import { localizedHref, type Locale, type RouteKey } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

const NAV: RouteKey[] = ['about', 'gallery', 'pricing', 'reservations', 'contact'];

export default function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t hairline bg-ink-950 grain">
      {/* Veľký vodoznak */}
      <div
        className="font-display pointer-events-none absolute -bottom-10 -right-6 select-none text-[26vw] leading-none text-white/[0.025]"
        aria-hidden="true"
      >
        KM
      </div>

      <div className="container relative z-10 mx-auto px-5 pt-20 pb-10 md:px-8">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo href={localizedHref(locale, 'home')} />
            <p className="font-display mt-8 text-[2.4rem] leading-none text-white">{t.footer.tagline}</p>
            <p className="mt-4 max-w-sm leading-relaxed text-mist">{t.footer.description}</p>
            <div className="mt-8 inline-flex items-center gap-3 border hairline px-4 py-2 text-[0.7rem] uppercase tracking-[0.25em] text-mist">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson-600" />
              </span>
              {t.hero.open247}
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="eyebrow">{t.footer.links}</h3>
            <ul className="mt-6 space-y-3">
              {NAV.map((key) => (
                <li key={key}>
                  <Link href={localizedHref(locale, key)} className="nav-link !text-[0.8rem]">
                    {t.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="eyebrow">{t.footer.contact}</h3>
            <ul className="mt-6 space-y-4 text-mist">
              <li>
                <a href={site.contact.phoneHref} className="text-lg text-white transition-colors hover:text-crimson-500">
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="break-all transition-colors hover:text-white">
                  {site.contact.email}
                </a>
              </li>
              <li className="leading-relaxed">
                {site.contact.address.street}
                <br />
                {site.contact.address.zip} {site.contact.address.city}
              </li>
              <li className="flex gap-3 pt-2">
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center border hairline transition-colors hover:border-white hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z" />
                  </svg>
                </a>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center border hairline transition-colors hover:border-white hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23 10.1 23.9v-8.4H7.1v-3.5h3v-2.6c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18.1 24 12.1z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t hairline pt-6 text-[0.72rem] uppercase tracking-[0.2em] text-ink-500 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} {site.name}. {t.footer.rights}
          </p>
          <p>
            {t.footer.est} {site.foundedYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
