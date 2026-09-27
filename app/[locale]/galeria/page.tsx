import { permanentRedirect } from 'next/navigation';
import { isLocale, localizedHref } from '@/lib/i18n/config';

/** Stará URL /galeria → /vybavenie */
export default async function LegacyGallery({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  permanentRedirect(localizedHref(isLocale(locale) ? locale : 'sk', 'equipment'));
}
