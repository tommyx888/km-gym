'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  labels: {
    all: string;
    categories: Record<string, string>;
    prev: string;
    next: string;
    close: string;
  };
}

/** Galéria s filtrom kategórií a lightboxom – logika zachovaná z pôvodnej verzie, doplnená klávesnica. */
export default function Gallery({ images, labels }: GalleryProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('all');

  const categories = Array.from(new Set(images.map((i) => i.category).filter(Boolean))) as string[];
  const visible = images
    .map((img, index) => ({ ...img, index }))
    .filter((img) => category === 'all' || img.category === category);

  const close = useCallback(() => setSelected(null), []);
  const navigate = useCallback(
    (dir: 'prev' | 'next') => {
      setSelected((cur) => {
        if (cur === null) return cur;
        return dir === 'prev' ? (cur > 0 ? cur - 1 : images.length - 1) : cur < images.length - 1 ? cur + 1 : 0;
      });
    },
    [images.length],
  );

  useEffect(() => {
    document.body.style.overflow = selected !== null ? 'hidden' : '';
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selected, close, navigate]);

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {['all', ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`border px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.25em] transition-all duration-300 ${
                category === c
                  ? 'border-crimson-600 bg-crimson-600 text-white'
                  : 'hairline text-mist hover:border-white hover:text-white'
              }`}
            >
              {c === 'all' ? labels.all : labels.categories[c] ?? c}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((image, i) => (
          <button
            key={image.index}
            type="button"
            onClick={() => setSelected(image.index)}
            className={`group relative overflow-hidden border hairline bg-ink-950 text-left ${
              i % 5 === 0 ? 'aspect-[4/5] sm:row-span-2 sm:aspect-auto' : 'aspect-[4/3]'
            }`}
            aria-label={image.alt}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover grayscale transition-all duration-1000 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-105 group-hover:grayscale-0"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="absolute bottom-5 left-5 translate-y-3 text-[0.7rem] uppercase tracking-[0.25em] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {image.alt}
            </span>
            <span className="absolute right-0 top-0 h-[2px] w-0 bg-crimson-600 transition-all duration-700 group-hover:w-full" />
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={images[selected].alt}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center border hairline text-white transition-colors hover:border-crimson-500 hover:text-crimson-500"
            aria-label={labels.close}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center border hairline text-white transition-colors hover:border-white md:left-8"
            aria-label={labels.prev}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); navigate('next'); }}
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center border hairline text-white transition-colors hover:border-white md:right-8"
            aria-label={labels.next}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="relative max-h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selected].src}
              alt={images[selected].alt}
              width={1600}
              height={1067}
              className="max-h-[85vh] w-auto max-w-full object-contain"
              priority
            />
            <p className="mt-4 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.25em] text-mist">
              <span>{images[selected].alt}</span>
              <span className="tabular">
                {selected + 1} / {images.length}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
