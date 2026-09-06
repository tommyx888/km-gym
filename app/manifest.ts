import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: 'KM Gym',
    start_url: '/',
    display: 'standalone',
    background_color: '#131518',
    theme_color: '#131518',
    icons: [
      { src: '/logo/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/logo/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
