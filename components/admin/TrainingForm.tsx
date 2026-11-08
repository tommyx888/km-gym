'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { localizedHref, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Training } from '@/lib/trainings';

type T = Dictionary['admin']['trainings'];

interface Props {
  locale: Locale;
  t: T;
  training: Training | null; // null = nový
}

/** Lokálny čas (Europe/Bratislava) ↔ ISO. Admin zadáva dátum a čas v slovenskom čase. */
function toLocalParts(iso: string | null) {
  if (!iso) return { date: '', time: '18:00' };
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Bratislava', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d);
  const g = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return { date: `${g('year')}-${g('month')}-${g('day')}`, time: `${g('hour')}:${g('minute')}` };
}
function toIso(date: string, time: string): string {
  // offset Europe/Bratislava pre daný dátum (CET/CEST)
  const guess = new Date(`${date}T${time}:00Z`);
  const tzDate = new Date(guess.toLocaleString('en-US', { timeZone: 'Europe/Bratislava' }));
  const offsetMs = tzDate.getTime() - new Date(guess.toLocaleString('en-US', { timeZone: 'UTC' })).getTime();
  return new Date(guess.getTime() - offsetMs).toISOString();
}

export default function TrainingForm({ locale, t, training }: Props) {
  const router = useRouter();
  const init = toLocalParts(training?.starts_at ?? null);
  const [f, setF] = useState({
    title: training?.title ?? '',
    title_en: training?.title_en ?? '',
    description: training?.description ?? '',
    description_en: training?.description_en ?? '',
    details: training?.details ?? '',
    details_en: training?.details_en ?? '',
    trainer: training?.trainer ?? '',
    location: training?.location ?? 'KM GYM, Kuchyňa 214',
    date: init.date,
    time: init.time,
    duration_min: training?.duration_min ?? 60,
    capacity: training?.capacity ?? 12,
    image_url: training?.image_url ?? '',
    pricing: training?.pricing ?? 'free',
    price: training?.price_cents != null ? String(training.price_cents / 100) : '',
    payment_url: training?.payment_url ?? '',
    payment_note: training?.payment_note ?? '',
    members_only: training?.members_only ?? false,
    cancel_deadline_hours: training?.cancel_deadline_hours ?? 12,
    status: training?.status ?? 'published',
    repeat: false,
    repeatWeeks: 4,
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  const upload = async (file: File) => {
    setUploading(true);
    setMsg(null);
    try {
      const supabase = createClient();
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error } = await supabase.storage.from('km-gym-trainings').upload(path, file, { cacheControl: '31536000', upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from('km-gym-trainings').getPublicUrl(path);
      set('image_url', data.publicUrl);
    } catch (e) {
      console.error(e);
      setMsg(t.error);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const data = {
      title: f.title,
      title_en: f.title_en,
      description: f.description,
      description_en: f.description_en,
      details: f.details,
      details_en: f.details_en,
      trainer: f.trainer,
      location: f.location,
      starts_at: toIso(f.date, f.time),
      duration_min: f.duration_min,
      capacity: f.capacity,
      image_url: f.image_url,
      pricing: f.pricing,
      price_cents: f.pricing === 'paid' && f.price !== '' ? Math.round(parseFloat(f.price.replace(',', '.')) * 100) : null,
      payment_url: f.payment_url,
      payment_note: f.payment_note,
      members_only: f.members_only,
      cancel_deadline_hours: f.cancel_deadline_hours,
      status: f.status,
    };
    const res = training
      ? await fetch('/api/admin/trainings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: training.id, data }) })
      : await fetch('/api/admin/trainings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data, repeatWeeks: f.repeat ? f.repeatWeeks : 1 }) });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMsg(`${t.error} ${json.error ?? ''}`);
      return;
    }
    if (training) {
      setMsg(t.saved);
      router.refresh();
    } else {
      const first = json.trainings?.[0];
      router.push(first ? `${localizedHref(locale, 'admin')}/treningy/${first.id}` : `${localizedHref(locale, 'admin')}/treningy`);
    }
  };

  const F = t.fields;
  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="title" className="label"><span>{F.title}</span></label>
          <input id="title" required className="field" value={f.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="title_en" className="label"><span>{F.titleEn}</span></label>
          <input id="title_en" className="field" value={f.title_en} onChange={(e) => set('title_en', e.target.value)} />
        </div>
        <div>
          <label htmlFor="date" className="label"><span>{F.date}</span></label>
          <input id="date" type="date" required className="field" value={f.date} onChange={(e) => set('date', e.target.value)} />
        </div>
        <div>
          <label htmlFor="time" className="label"><span>{F.time}</span></label>
          <input id="time" type="time" required className="field" value={f.time} onChange={(e) => set('time', e.target.value)} />
        </div>
        <div>
          <label htmlFor="duration" className="label"><span>{F.duration}</span></label>
          <input id="duration" type="number" min={10} max={600} step={5} required className="field" value={f.duration_min} onChange={(e) => set('duration_min', Number(e.target.value))} />
        </div>
        <div>
          <label htmlFor="capacity" className="label"><span>{F.capacity}</span></label>
          <input id="capacity" type="number" min={1} max={500} required className="field" value={f.capacity} onChange={(e) => set('capacity', Number(e.target.value))} />
        </div>
        <div>
          <label htmlFor="trainer" className="label"><span>{F.trainer}</span></label>
          <input id="trainer" className="field" value={f.trainer} onChange={(e) => set('trainer', e.target.value)} />
        </div>
        <div>
          <label htmlFor="location" className="label"><span>{F.location}</span></label>
          <input id="location" className="field" value={f.location} onChange={(e) => set('location', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="label"><span>{F.description}</span></label>
          <textarea id="description" rows={2} maxLength={300} className="field" value={f.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description_en" className="label"><span>{F.descriptionEn}</span></label>
          <textarea id="description_en" rows={2} maxLength={300} className="field" value={f.description_en} onChange={(e) => set('description_en', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="details" className="label"><span>{F.details}</span></label>
          <textarea id="details" rows={5} className="field" value={f.details} onChange={(e) => set('details', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="details_en" className="label"><span>{F.detailsEn}</span></label>
          <textarea id="details_en" rows={3} className="field" value={f.details_en} onChange={(e) => set('details_en', e.target.value)} />
        </div>

        {/* Fotka */}
        <div className="md:col-span-2">
          <label className="label"><span>{F.image}</span></label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {f.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.image_url} alt="" className="aspect-[16/10] w-full max-w-xs border hairline object-cover" />
            ) : (
              <div className="font-display flex aspect-[16/10] w-full max-w-xs items-center justify-center border hairline text-[3rem] text-white/10">KM</div>
            )}
            <div className="space-y-3">
              <label className="btn btn-ghost inline-flex cursor-pointer !px-5 !py-3 !text-[0.65rem]">
                {uploading ? F.uploading : F.upload}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              </label>
              {f.image_url && (
                <button type="button" onClick={() => set('image_url', '')} className="nav-link block !text-[0.7rem]">
                  {F.removeImage}
                </button>
              )}
              <p className="max-w-xs text-xs leading-relaxed text-ink-500">{F.imageHint}</p>
            </div>
          </div>
        </div>

        {/* Platba */}
        <div>
          <label htmlFor="pricing" className="label"><span>{F.pricing}</span></label>
          <select id="pricing" className="field" value={f.pricing} onChange={(e) => set('pricing', e.target.value as typeof f.pricing)}>
            <option value="free">{F.pricingFree}</option>
            <option value="included">{F.pricingIncluded}</option>
            <option value="paid">{F.pricingPaid}</option>
          </select>
        </div>
        {f.pricing === 'paid' && (
          <>
            <div>
              <label htmlFor="price" className="label"><span>{F.price}</span></label>
              <input id="price" inputMode="decimal" className="field" value={f.price} onChange={(e) => set('price', e.target.value)} placeholder="10" />
            </div>
            <div>
              <label htmlFor="payment_url" className="label"><span>{F.paymentUrl}</span></label>
              <input id="payment_url" type="url" className="field" value={f.payment_url} onChange={(e) => set('payment_url', e.target.value)} placeholder="https://kmgym.reservine.me/…" />
            </div>
            <div>
              <label htmlFor="payment_note" className="label"><span>{F.paymentNote}</span></label>
              <input id="payment_note" className="field" value={f.payment_note} onChange={(e) => set('payment_note', e.target.value)} />
            </div>
          </>
        )}
        <div>
          <label htmlFor="cancel_h" className="label"><span>{F.cancelDeadline}</span></label>
          <input id="cancel_h" type="number" min={0} max={168} className="field" value={f.cancel_deadline_hours} onChange={(e) => set('cancel_deadline_hours', Number(e.target.value))} />
        </div>
        <div>
          <label htmlFor="status" className="label"><span>{F.status}</span></label>
          <select id="status" className="field" value={f.status} onChange={(e) => set('status', e.target.value as typeof f.status)}>
            <option value="draft">{t.status.draft}</option>
            <option value="published">{t.status.published}</option>
            {training?.status === 'cancelled' && <option value="cancelled">{t.status.cancelled}</option>}
          </select>
        </div>
        <label className="flex items-center gap-3 text-sm text-mist md:col-span-2">
          <input type="checkbox" checked={f.members_only} onChange={(e) => set('members_only', e.target.checked)} className="h-4 w-4 accent-[#C8102E]" />
          {F.membersOnly}
        </label>

        {!training && (
          <div className="md:col-span-2 border-t hairline pt-5">
            <label className="flex items-center gap-3 text-sm text-mist">
              <input type="checkbox" checked={f.repeat} onChange={(e) => set('repeat', e.target.checked)} className="h-4 w-4 accent-[#C8102E]" />
              {F.repeat}
            </label>
            {f.repeat && (
              <div className="mt-3 max-w-xs">
                <label htmlFor="repeatWeeks" className="label"><span>{F.repeatCount}</span></label>
                <input id="repeatWeeks" type="number" min={2} max={52} className="field" value={f.repeatWeeks} onChange={(e) => set('repeatWeeks', Number(e.target.value))} />
                <p className="mt-2 text-xs text-ink-500">{F.repeatHint}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={busy || uploading} className="btn btn-primary disabled:opacity-60">
          {busy ? t.saving : training ? t.save : t.create}
        </button>
        {msg && <p className="text-sm text-mist" aria-live="polite">{msg}</p>}
      </div>
    </form>
  );
}
