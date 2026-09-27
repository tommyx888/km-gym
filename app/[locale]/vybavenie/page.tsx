import type { Metadata } from 'next';
import Gallery from '@/components/Gallery';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import ReservineButton from '@/components/ReservineButton';
import PlaceholderNote, { clean } from '@/components/PlaceholderNote';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: t.equipment.metaTitle }, description: t.equipment.metaDescription };
}

export default async function EquipmentPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);

  const images = site.gallery.map((img) => ({ src: img.src, alt: t.equipment.photos[img.key] }));

  return (
    <>
      <PageHero eyebrow={t.equipment.eyebrow} title={t.equipment.title} lead={t.equipment.lead} />

      {/* Zóny */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-px bg-ink-700 md:grid-cols-2 lg:grid-cols-5">
            {t.equipment.zones.map((z, i) => (
              <Reveal key={z.n} delay={i * 90} className="h-full">
                <div className="flex h-full flex-col bg-ink-900 p-7 md:p-8">
                  <span className="font-display text-[0.9rem] tracking-[0.2em] text-crimson-500">{z.n}</span>
                  <h2 className="font-display mt-8 text-[1.9rem] leading-[0.95] text-white">{z.title}</h2>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-mist">{z.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Galéria */}
      <section className="border-t hairline bg-ink-950 py-20 grain md:py-28">
        <div className="container relative z-10 mx-auto px-5 md:px-8">
          <Reveal className="mb-10 max-w-2xl">
            <p className="eyebrow">{t.equipment.galleryTitle}</p>
            <p className="mt-4 text-mist">
              {clean(t.equipment.galleryLead)}
              <PlaceholderNote text={t.equipment.galleryLead} label={t.common.placeholderBadge} />
            </p>
          </Reveal>
          <Reveal>
            <Gallery
              images={images}
              labels={{ all: t.equipment.all, categories: {}, prev: t.equipment.prev, next: t.equipment.next, close: t.equipment.close }}
            />
          </Reveal>
          <Reveal delay={150} className="mt-14">
            <ReservineButton text={t.nav.cta} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
