import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { site } from '@/lib/site';

// Self-hostované fonty (žiadne requesty na Google – GDPR, rýchlejšie načítanie)
const inter = localFont({
  variable: '--font-inter',
  display: 'swap',
  src: [
    { path: '../fonts/inter-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: '../fonts/inter-latin-ext-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ],
});

const bebas = localFont({
  variable: '--font-bebas',
  display: 'swap',
  src: [
    { path: '../fonts/bebas-neue-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/bebas-neue-latin-ext-400-normal.woff2', weight: '400', style: 'normal' },
  ],
});

export const viewport = { themeColor: '#131518' };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sk';
  const t = getDictionary(l);
  return {
    metadataBase: new URL(site.domain),
    title: {
      default: t.meta.title,
      template: `%s — ${site.name}`,
    },
    description: t.meta.description,
    keywords: t.meta.keywords,
    alternates: {
      languages: { sk: '/sk', en: '/en' },
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      type: 'website',
      locale: l === 'sk' ? 'sk_SK' : 'en_GB',
      siteName: site.name,
    },
    manifest: '/manifest.webmanifest',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${bebas.variable}`} suppressHydrationWarning>
      <head>
        {/* Nastaví tému pred prvým vykreslením – bez preblikávania */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(localStorage.getItem('km_theme')==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ink-900 text-white">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-crimson-600 focus:px-4 focus:py-2 focus:text-white"
        >
          {t.common.skipToContent}
        </a>
        <Header locale={locale} />
        <main id="content" className="flex-grow">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
