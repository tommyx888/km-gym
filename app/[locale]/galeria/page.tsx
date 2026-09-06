import type { Metadata } from 'next';
import Gallery from '@/components/Gallery';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: t.gallery.metaTitle }, description: t.gallery.metaDescription };
}

/**
 * TODO(Tomas): nahraď placeholder-*.svg reálnymi fotkami v public/images/
 * (napr. gym-main-1.jpg …) a uprav cesty nižšie. Alt texty sú v slovníku.
 */
const IMAGE_FILES = [
  '/images/placeholder-1.svg',
  '/images/placeholder-2.svg',
  '/images/placeholder-3.svg',
  '/images/placeholder-4.svg',
  '/images/placeholder-5.svg',
  '/images/placeholder-6.svg',
];

export default async function GalleryPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);

  const images = t.gallery.images.map((img, i) => ({
    src: IMAGE_FILES[i] ?? IMAGE_FILES[0],
    alt: img.alt,
    category: img.category,
  }));

  return (
    <>
      <PageHero eyebrow={t.gallery.eyebrow} title={t.gallery.title} lead={t.gallery.lead.replace(/\s*\[PLACEHOLDER[^\]]*\]/g, '')} />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8">
          <Reveal>
            <Gallery
              images={images}
              labels={{
                all: t.gallery.all,
                categories: t.gallery.categories,
                prev: t.gallery.prev,
                next: t.gallery.next,
                close: t.gallery.close,
              }}
            />
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline bg-ink-950 py-16 grain md:py-24">
        <div className="container relative z-10 mx-auto px-5 md:px-8">
          <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-[2.6rem] leading-none text-white md:text-[3.6rem]">{t.gallery.followTitle}</h2>
              <p className="mt-4 max-w-lg text-mist">{t.gallery.followText}</p>
            </div>
            <div className="flex gap-3">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Instagram
              </a>
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Facebook
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
