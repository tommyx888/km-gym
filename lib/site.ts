/**
 * KM Gym – centrálna konfigurácia značky a faktov.
 *
 * TODO(Tomas): všetky hodnoty označené PLACEHOLDER dopĺň tu – propíšu sa
 * do celého webu (hlavička, päta, kontakt, cenník, SEO, štruktúrované dáta).
 */

export const site = {
  name: 'KM Gym',
  shortName: 'KM',
  domain: 'https://kmgym.sk', // PLACEHOLDER – reálna doména (používa sa v SEO / OG)
  foundedYear: 2026, // PLACEHOLDER – rok založenia (ukazuje sa v päte a pečati)

  contact: {
    phone: '+421 900 000 000', // PLACEHOLDER
    phoneHref: 'tel:+421900000000', // PLACEHOLDER – bez medzier
    email: 'info@kmgym.sk', // PLACEHOLDER
    address: {
      street: 'Ulica 1', // PLACEHOLDER
      city: 'Mesto', // PLACEHOLDER
      zip: '000 00', // PLACEHOLDER
      country: 'Slovensko',
      mapQuery: 'Slovensko', // PLACEHOLDER – text pre Google Maps (adresa alebo názov)
    },
  },

  social: {
    instagram: 'https://instagram.com', // PLACEHOLDER
    facebook: 'https://facebook.com', // PLACEHOLDER
  },

  hours: {
    // 'always' = 24/7 prístup (čipová karta). Ak nie, prepíš na rozpis.
    mode: 'always' as 'always' | 'schedule',
    schedule: [
      // PLACEHOLDER – použije sa len ak mode === 'schedule'
      { days: 'Po – Pia', time: '06:00 – 22:00' },
      { days: 'So – Ne', time: '08:00 – 20:00' },
    ],
  },

  pricing: {
    currency: '€',
    monthly: 30, // PLACEHOLDER
    yearly: 300, // PLACEHOLDER (0 = nezobrazovať)
    single: 3, // PLACEHOLDER – jednorazový vstup
    personalTraining: 25, // PLACEHOLDER (0 = nezobrazovať)
  },

  reservations: {
    // Časové sloty pre rezervačný formulár (pôvodná logika: 06:00 – 22:00 po hodine)
    firstHour: 6,
    lastHour: 22,
  },

  stats: {
    // Čísla v hero sekcii – PLACEHOLDER
    areaM2: 350,
    machines: 40,
    members: 120,
  },
} as const;

export type Site = typeof site;
