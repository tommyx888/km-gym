import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import SignupPanel from '@/components/trainings/SignupPanel';
import { createClient } from '@/lib/supabase/server';
import { isLocale, localizedHref, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { cancelDeadline, fmtDate, fmtTime, plural, tl, TRAINING_COLS, type SignupStatus, type Training, type TrainingCounts } from '@/lib/trainings';
import { siteUrl } from '@/lib/site-url';
import { site } from '@/lib/site';

type Props = { params: Promise<{ locale: string; slug: string }> };

async function load(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('km_gym_trainings').select(TRAINING_COLS).eq('slug', slug).neq('status', 'draft').maybeSingle();
  return { supabase, training: data as Training | null };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const { training } = await load(slug);
  if (!training) return {};
  const title = `${tl(training, 'title', locale)} — ${fmtDate(training.starts_at, locale, { weekday: undefined })} ${fmtTime(training.starts_at, locale)} — KM GYM`;
  const description = tl(training, 'description', locale) || getDictionary(locale).trainings.metaDescription;
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, images: training.image_url ? [{ url: training.image_url }] : undefined, type: 'website' },
  };
}

export default async function TrainingPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);
  const d = t.trainings;
  const { supabase, training } = await load(slug);
  if (!training) notFound();

  const [{ data: countsRow }, { data: { user } }] = await Promise.all([
    supabase.from('km_gym_training_counts').select('*').eq('training_id', training.id).maybeSingle(),
    supabase.auth.getUser(),
  ]);
  const counts = (countsRow as TrainingCounts | null) ?? { training_id: training.id, confirmed: 0, waitlist: 0 };
  let myStatus: SignupStatus | null = null;
  if (user) {
    const { data: s } = await supabase.from('km_gym_training_signups').select('status').eq('training_id', training.id).eq('user_id', user.id).maybeSingle();
    myStatus = (s?.status as SignupStatus) ?? null;
  }

  const now = new Date();
  const past = new Date(training.starts_at) < now;
  const disabled = training.status === 'cancelled' || past;
  const free = Math.max(0, training.capacity - counts.confirmed);
  const url = `${siteUrl()}${localizedHref(locale, 'trainings', training.slug)}`;
  const title = tl(training, 'title', locale);
  const description = tl(training, 'description', locale);
  const details = tl(training, 'details', locale);
  const price = training.pricing === 'paid' && training.price_cents != null ? `${(training.price_cents / 100).toLocaleString(locale === 'sk' ? 'sk-SK' : 'en-GB')} €` : training.pricing === 'included' ? d.included : d.free;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: title,
    startDate: training.starts_at,
    endDate: new Date(new Date(training.starts_at).getTime() + training.duration_min * 60000).toISOString(),
    eventStatus: training.status === 'cancelled' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: 'KM GYM', address: `${site.contact.address.street}, ${site.contact.address.zip} ${site.contact.address.city}` },
    image: training.image_url ?? undefined,
    description,
    organizer: { '@type': 'Organization', name: 'KM GYM', url: siteUrl() },
    offers: training.pricing === 'paid' && training.price_cents != null ? { '@type': 'Offer', price: training.price_cents / 100, priceCurrency: 'EUR', url } : { '@type': 'Offer', price: 0, priceCurrency: 'EUR', url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden border-b hairline bg-ink-950 pt-28 md:pt-36">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-10 pb-12 lg:grid-cols-12 lg:gap-14 lg:pb-20">
            <div className="lg:col-span-7">
              <Link href={localizedHref(locale, 'trainings')} className="nav-link !text-[0.7rem]">
                ← {d.title}
              </Link>
              <p className="eyebrow mt-8 animate-rise">{fmtDate(training.starts_at, locale)} · {fmtTime(training.starts_at, locale)}</p>
              <h1 className="font-display mt-5 text-[3rem] leading-[0.92] text-white animate-clip md:text-[5rem]">{title}</h1>
              {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist md:text-xl">{description}</p>}
              {training.status === 'cancelled' && <p className="mt-6 inline-block border border-crimson-600 px-4 py-2 text-sm text-crimson-500">{d.cancelled}</p>}
              {past && training.status !== 'cancelled' && <p className="mt-6 inline-block border hairline px-4 py-2 text-sm text-mist">{d.started}</p>}
            </div>
            <div className="lg:col-span-5">
              {training.image_url && (
                <div className="relative aspect-[4/3] overflow-hidden border hairline">
                  <Image src={training.image_url} alt={title} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <dl className="grid grid-cols-2 gap-px bg-ink-700 sm:grid-cols-3">
                  {[
                    [d.when, `${fmtDate(training.starts_at, locale, { weekday: 'short' })} ${fmtTime(training.starts_at, locale)}`],
                    [d.duration, `${training.duration_min} ${d.minutes}`],
                    [d.where, training.location || 'KM GYM'],
                    [d.trainer, training.trainer || '—'],
                    [d.capacity, d.signedUp.replace('{n}', String(counts.confirmed)).replace('{max}', String(training.capacity))],
                    [d.price, price],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-ink-900 p-5">
                      <dt className="text-[0.62rem] uppercase tracking-[0.25em] text-ink-500">{k}</dt>
                      <dd className="mt-2 text-sm text-white">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal delay={80}>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.2em]">
                  {!disabled && <span className={free > 0 ? 'border hairline px-3 py-1.5 text-white' : 'border border-crimson-600/60 px-3 py-1.5 text-crimson-500'}>{free > 0 ? plural(d.spots, free) : d.full}</span>}
                  {counts.waitlist > 0 && <span className="border hairline px-3 py-1.5 text-mist">{plural(d.waitlistCount, counts.waitlist)}</span>}
                  {training.members_only && <span className="border border-crimson-600/60 px-3 py-1.5 text-crimson-500">{d.membersOnly}</span>}
                </div>
              </Reveal>

              {training.pricing === 'paid' && (training.payment_url || training.payment_note) && (
                <Reveal delay={120}>
                  <div className="mt-8 border hairline p-6">
                    <p className="eyebrow">{d.payHow}</p>
                    {training.payment_note && <p className="mt-3 text-mist">{training.payment_note}</p>}
                    {training.payment_url && (
                      <a href={training.payment_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-4 !px-5 !py-3 !text-[0.65rem]">
                        {d.payLink} ↗
                      </a>
                    )}
                  </div>
                </Reveal>
              )}

              {details && (
                <Reveal delay={160}>
                  <div className="mt-10">
                    <p className="eyebrow">{d.details}</p>
                    <p className="mt-5 max-w-2xl whitespace-pre-line leading-relaxed text-mist">{details}</p>
                  </div>
                </Reveal>
              )}
            </div>

            <aside className="lg:col-span-5">
              <Reveal delay={100}>
                <SignupPanel
                  locale={locale}
                  t={d}
                  trainingId={training.id}
                  signedIn={Boolean(user)}
                  loginHref={`${localizedHref(locale, 'login')}?next=${encodeURIComponent(localizedHref(locale, 'trainings', training.slug))}`}
                  myStatus={myStatus}
                  free={free}
                  canCancel={cancelDeadline(training) > now}
                  cancelHours={training.cancel_deadline_hours}
                  phone={site.contact.phone}
                  disabled={disabled}
                  icsHref={`/api/trainings/ics?slug=${encodeURIComponent(training.slug)}&locale=${locale}`}
                />
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
