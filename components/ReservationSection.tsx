'use client';

import ReservationForm, { type ReservationFormData } from './ReservationForm';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

/** Klientský obal – pôvodná logika: POST na API, chyba → throw. */
export default function ReservationSection({ labels, locale }: { labels: Dictionary['reservations']['form']; locale: Locale }) {
  const handleSubmit = async (data: ReservationFormData) => {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, locale }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || 'Failed to submit reservation');
    }
  };

  return <ReservationForm labels={labels} onSubmit={handleSubmit} />;
}
