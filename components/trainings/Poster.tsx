import PrintButton from '@/components/PrintButton';
import { type Locale, localizedHref } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { fmtDate, fmtTime, tl, type Training } from '@/lib/trainings';
import { qrSvg } from '@/lib/qr';
import { siteUrl } from '@/lib/site-url';
import { site } from '@/lib/site';

/** Plagát A4 (server component) – používa stránka /treningy/[slug]/plagat. */
export default async function Poster({ t, locale }: { t: Training; locale: Locale }) {
  const d = getDictionary(locale).trainings;
  const url = `${siteUrl()}${localizedHref(locale, 'trainings', t.slug)}`;
  const qr = await qrSvg(url, '#131518', 600);
  const title = tl(t, 'title', locale);
  const description = tl(t, 'description', locale);
  const price = t.pricing === 'paid' && t.price_cents != null ? `${(t.price_cents / 100).toLocaleString(locale === 'sk' ? 'sk-SK' : 'en-GB')} €` : t.pricing === 'included' ? d.included : d.free;
  const start = new Date(t.starts_at);
  const day = start.toLocaleDateString('sk-SK', { timeZone: 'Europe/Bratislava', day: '2-digit' });
  const month = start.toLocaleDateString(locale === 'sk' ? 'sk-SK' : 'en-GB', { timeZone: 'Europe/Bratislava', month: 'long' });

  return (
    <main className="poster-page bg-white text-ink-950">
      <div className="mx-auto flex max-w-[210mm] flex-col items-center gap-4 px-4 pt-28 print:hidden">
        <PrintButton label={d.poster} />
      </div>
      {/* A4: 210 × 297 mm */}
      <div className="poster mx-auto my-8 flex min-h-[297mm] w-[210mm] flex-col overflow-hidden bg-white shadow-2xl print:my-0 print:shadow-none">
        <div className="relative h-[120mm] w-full bg-ink-950">
          {t.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="font-display absolute inset-0 flex items-center justify-center text-[12rem] text-white/5">KM</div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950 to-transparent" />
          <div className="absolute left-[14mm] top-[12mm] flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/km-gym-logo-400.png" alt="KM GYM" className="h-14 w-auto" />
          </div>
          <div className="absolute bottom-[12mm] left-[14mm] right-[14mm]">
            <p className="text-[11pt] uppercase tracking-[0.3em] text-crimson-500">{d.eyebrow}</p>
            <h1 className="font-display mt-2 text-[44pt] leading-[0.9] text-white">{title}</h1>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-[14mm] pt-[10mm]">
          <div className="flex items-start gap-8">
            <div className="flex flex-col items-center border-4 border-crimson-600 px-5 py-3">
              <span className="font-display text-[52pt] leading-none text-ink-950">{day}</span>
              <span className="text-[10pt] uppercase tracking-[0.25em] text-ink-700">{month}</span>
            </div>
            <div className="flex-1 pt-1">
              <p className="font-display text-[28pt] leading-none text-ink-950">
                {fmtDate(t.starts_at, locale, { day: undefined, month: undefined, year: undefined })} {fmtTime(t.starts_at, locale)}
              </p>
              <p className="mt-2 text-[12pt] text-ink-700">
                {t.duration_min} {d.minutes}
                {t.trainer ? ` · ${t.trainer}` : ''} · {t.location || 'KM GYM, Kuchyňa 214'}
              </p>
              <p className="mt-1 text-[12pt] text-ink-700">
                {d.capacity}: {t.capacity} · {d.price}: {price}
                {t.members_only ? ` · ${d.membersOnly}` : ''}
              </p>
            </div>
          </div>

          {description && <p className="mt-8 text-[13pt] leading-relaxed text-ink-800">{description}</p>}

          <div className="mt-auto flex items-end justify-between gap-8 pb-[12mm]">
            <div>
              <p className="text-[11pt] uppercase tracking-[0.3em] text-crimson-600">{d.posterScan}</p>
              <p className="font-display mt-2 text-[24pt] leading-none text-ink-950">{d.posterUrl}</p>
              <p className="mt-3 text-[10pt] text-ink-700">
                {site.contact.phone} · {site.contact.address.street}, {site.contact.address.city}
              </p>
            </div>
            <div className="h-[48mm] w-[48mm] shrink-0 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qr }} />
          </div>
        </div>
        <div className="h-[6mm] w-full bg-crimson-600" />
      </div>
    </main>
  );
}
