'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

export type ReservationFormData = {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
};

interface ReservationFormProps {
  labels: Dictionary['reservations']['form'];
  onSubmit: (data: ReservationFormData) => Promise<void>;
}

export default function ReservationForm({ labels, onSubmit }: ReservationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const schema = z.object({
    name: z.string().min(2, labels.errors.name),
    email: z.string().email(labels.errors.email),
    phone: z.string().optional(),
    date: z.string().min(1, labels.errors.date),
    time: z.string().min(1, labels.errors.time),
    // honeypot – boti ho vyplnia, ľudia ho nevidia
    company: z.string().max(0).optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const submit = async (data: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      await onSubmit({ name: data.name, email: data.email, phone: data.phone, date: data.date, time: data.time });
      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
      console.error('Reservation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const { firstHour, lastHour } = site.reservations;
  const slots = Array.from({ length: lastHour - firstHour + 1 }, (_, i) => `${String(firstHour + i).padStart(2, '0')}:00`);

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
          <span>{labels.phoneOptional}</span>
        </label>
        <input id="phone" type="tel" autoComplete="tel" className="field" placeholder={labels.phonePlaceholder} {...register('phone')} />
      </div>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        <div>
          <label htmlFor="date" className="label">
            <span>{labels.date}</span>
            <span className="text-crimson-500">{labels.required}</span>
          </label>
          <input id="date" type="date" min={today} className="field" {...register('date')} />
          {errors.date && <p className="mt-2 text-sm text-crimson-500">{errors.date.message}</p>}
        </div>
        <div>
          <label htmlFor="time" className="label">
            <span>{labels.time}</span>
            <span className="text-crimson-500">{labels.required}</span>
          </label>
          <select id="time" className="field" defaultValue="" {...register('time')}>
            <option value="" disabled>
              {labels.timePlaceholder}
            </option>
            {slots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.time && <p className="mt-2 text-sm text-crimson-500">{errors.time.message}</p>}
        </div>
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
