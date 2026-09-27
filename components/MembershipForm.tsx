'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { site } from '@/lib/site';

interface MembershipFormProps {
  labels: Dictionary['membership']['form'];
  pricing: Dictionary['pricing'];
  locale: Locale;
  defaultPlan?: string;
}

/**
 * Prihláška za člena (nahrádza pôvodný rezervačný formulár – rovnaká logika:
 * react-hook-form + zod → POST /api/reservations → Supabase).
 */
export default function MembershipForm({ labels, pricing, locale, defaultPlan }: MembershipFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const planKeys = [...site.pricing.plans.map((p) => p.key), ...site.pricing.passes.map((p) => p.key)] as string[];

  const schema = z.object({
    name: z.string().min(2, labels.errors.name),
    email: z.string().email(labels.errors.email),
    phone: z.string().min(6, labels.errors.phone),
    plan: z.string().refine((v) => planKeys.includes(v), labels.errors.plan),
    date: z.string().min(1, labels.errors.date),
    note: z.string().max(500).optional(),
    consent: z.boolean().refine((v) => v === true, labels.errors.consent),
    company: z.string().max(0).optional(), // honeypot
  });
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { plan: defaultPlan && planKeys.includes(defaultPlan) ? defaultPlan : '', consent: false },
  });

  const submit = async (data: FormData) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          plan: data.plan,
          date: data.date,
          note: data.note,
          locale,
          company: data.company,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed');
      }
      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
      console.error('Membership form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const cur = site.pricing.currency;

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-7" noValidate>
      <div>
        <label htmlFor="name" className="label">
          <span>{labels.name}</span>
          <span className="text-crimson-500">{labels.required}</span>
        </label>
        <input id="name" type="text" autoComplete="name" className="field" placeholder={labels.namePlaceholder} {...register('name')} />
        {errors.name && <p className="mt-2 text-sm text-crimson-500">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="label">
            <span>{labels.email}</span>
            <span className="text-crimson-500">{labels.required}</span>
          </label>
          <input id="email" type="email" autoComplete="email" className="field" placeholder={labels.emailPlaceholder} {...register('email')} />
          {errors.email && <p className="mt-2 text-sm text-crimson-500">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="label">
            <span>{labels.phone}</span>
            <span className="text-crimson-500">{labels.required}</span>
          </label>
          <input id="phone" type="tel" autoComplete="tel" className="field" placeholder={labels.phonePlaceholder} {...register('phone')} />
          {errors.phone && <p className="mt-2 text-sm text-crimson-500">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        <div>
          <label htmlFor="plan" className="label">
            <span>{labels.plan}</span>
            <span className="text-crimson-500">{labels.required}</span>
          </label>
          <select id="plan" className="field" {...register('plan')}>
            <option value="" disabled>
              {labels.planPlaceholder}
            </option>
            <optgroup label={pricing.membershipsTitle}>
              {site.pricing.plans.map((p) => (
                <option key={p.key} value={p.key}>
                  {pricing.plans[p.key].title} — {p.price} {cur} {pricing.plans[p.key].period}
                </option>
              ))}
            </optgroup>
            <optgroup label={pricing.passesTitle}>
              {site.pricing.passes.map((p) => (
                <option key={p.key} value={p.key}>
                  {pricing.passes[p.key].title} — {p.price} {cur}
                </option>
              ))}
            </optgroup>
          </select>
          {errors.plan && <p className="mt-2 text-sm text-crimson-500">{errors.plan.message}</p>}
        </div>
        <div>
          <label htmlFor="date" className="label">
            <span>{labels.date}</span>
            <span className="text-crimson-500">{labels.required}</span>
          </label>
          <input id="date" type="date" min={today} className="field" {...register('date')} />
          {errors.date && <p className="mt-2 text-sm text-crimson-500">{errors.date.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="note" className="label">
          <span>{labels.note}</span>
          <span>{labels.noteOptional}</span>
        </label>
        <textarea id="note" rows={3} className="field resize-y" placeholder={labels.notePlaceholder} {...register('note')} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-mist">
          <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#c8102e]" {...register('consent')} />
          <span>{labels.consent}</span>
        </label>
        {errors.consent && <p className="mt-2 text-sm text-crimson-500">{errors.consent.message}</p>}
      </div>

      {/* honeypot */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register('company')} />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? labels.submitting : labels.submit}
      </button>

      <div aria-live="polite">
        {status === 'success' && (
          <div className="border border-white/20 bg-white/5 p-5">
            <p className="font-display text-[1.5rem] leading-none text-white">{labels.successTitle}</p>
            <p className="mt-2 text-sm text-mist">{labels.successText}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="border border-crimson-600/60 bg-crimson-600/10 p-5">
            <p className="font-display text-[1.5rem] leading-none text-crimson-500">{labels.errorTitle}</p>
            <p className="mt-2 text-sm text-mist">{labels.errorText}</p>
          </div>
        )}
      </div>
    </form>
  );
}
