'use client';

interface GoogleMapProps {
  query: string;
  title: string;
}

/**
 * Google Maps embed. S NEXT_PUBLIC_GOOGLE_MAPS_API_KEY používa Embed API,
 * bez neho verejný embed podľa textu (funguje, ale bez kľúča).
 */
export default function GoogleMap({ query, title }: GoogleMapProps) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const q = encodeURIComponent(query);
  const src = key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}`
    : `https://www.google.com/maps?q=${q}&output=embed`;

  return (
    <div className="relative h-[380px] w-full overflow-hidden border hairline bg-ink-950 md:h-[480px]">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'grayscale(1) invert(0.92) contrast(1.05)' }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
        title={title}
      />
    </div>
  );
}
