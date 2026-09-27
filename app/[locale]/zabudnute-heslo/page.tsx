import type { Metadata } from 'next';
import AuthPage from '@/components/auth/AuthPage';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : 'sk');
  return { title: { absolute: `${t.auth.pages.forgot.title} — KM GYM` }, robots: { index: false } };
}

export default async function Page({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'sk';
  const t = getDictionary(locale);
  return <AuthPage mode="forgot" locale={locale} t={t.auth} />;
}
