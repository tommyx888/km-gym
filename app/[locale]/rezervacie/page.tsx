import { permanentRedirect } from 'next/navigation';
import { isLocale, localizedHref } from '@/lib/i18n/config';

/** Stará URL /rezervacie → /clenstvo (rezervácia) */
export default async function LegacyReservations({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  permanentRedirect(localizedHref(isLocale(locale) ? locale : 'sk', 'membership'));
}
