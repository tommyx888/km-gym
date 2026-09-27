/**
 * KM Gym – centrálna konfigurácia značky a faktov.
 * Zdroj: „KM GYM – podklady pre web“ (9. 9. 2026). Hodnoty s DOPLNIŤ ešte chýbajú.
 */

export const site = {
  name: 'KM GYM',
  shortName: 'KM',
  claim: { sk: 'Fitness 24/7 v Kuchyni', en: 'Fitness 24/7 in Kuchyňa' },
  domain: 'https://kmgym.sk', // DOPLNIŤ – reálna doména (SEO / OG / sitemap)
  foundedYear: 2026,

  contact: {
    phone: '0903 246 453',
    phoneHref: 'tel:+421903246453',
    email: '', // DOPLNIŤ – e-mail (prázdne = nezobrazuje sa)
    address: {
      street: 'Kuchyňa 214',
      city: 'Kuchyňa',
      zip: '900 52',
      country: 'Slovensko',
      mapQuery: 'Kuchyňa 214, 900 52 Kuchyňa, Slovensko',
    },
  },

  operator: {
    name: 'West road s.r.o.',
    street: 'Kuchyňa 1304',
    zip: '900 52',
    city: 'Kuchyňa',
    country: 'Slovensko',
    ico: '53 686 748',
    dic: '2121490734',
    icdph: 'SK2121490734',
  },

  social: {
    instagram: '', // DOPLNIŤ (prázdne = nezobrazuje sa)
    facebook: '', // DOPLNIŤ
  },

  hours: {
    mode: 'always' as 'always' | 'schedule',
    schedule: [] as { days: string; time: string }[],
  },

  /** Cenník – ceny v €. Kľúče sa používajú v slovníku (lib/i18n) a vo formulári členstva. */
  pricing: {
    currency: '€',
    plans: [
      { key: 'monthly', price: 39, featured: true },
      { key: 'quarterly', price: 109, featured: false },
      { key: 'yearly', price: 429, featured: false },
      { key: 'student', price: 32, featured: false },
      { key: 'senior', price: 32, featured: false },
    ],
    passes: [
      { key: 'single', price: 5 },
      { key: 'ten', price: 45 },
    ],
  },

  /**
   * Reservine – rezervácie, platba a PIN na dvere (TTLock).
   * partner:   identifikátor pobočky z administrácie Reservine (napr. 'km-gym'). DOPLNIŤ.
   * scriptSrc: adresa embed skriptu z návodu Reservine (Nastavenia → Web). DOPLNIŤ.
   * url:       hostovaná rezervačná stránka – použije sa ako fallback, keď embed nie je nastavený.
   */
  reservine: {
    partner: '', // voliteľné – embed tlačidlo (ak Reservine pošle partner ID + skript)
    scriptSrc: '',
    home: 'https://kmgym.reservine.me', // rezervačná stránka KM GYM
    url: 'https://kmgym.reservine.me/branch/1/km-gym/reservation', // priamo do rezervácie termínu
    membership: 'https://kmgym.reservine.me/branch/1/km-gym/reservation', // DOPLNIŤ – ak Reservine má samostatný link na kúpu členstva
  },

  /** Homepage: cesta k 360° videu interiéru (public/...). Prázdne = statické pozadie. */
  heroVideo: '', // DOPLNIŤ, napr. '/video/interier-360.mp4'
  heroPoster: '',

  /** Fotky pre stránku Vybavenie – nahraď placeholdery reálnymi (public/images/...). */
  gallery: [
    { src: '/images/placeholder-1.svg', key: 'exterior' },
    { src: '/images/placeholder-2.svg', key: 'entrance' },
    { src: '/images/placeholder-3.svg', key: 'main' },
    { src: '/images/placeholder-4.svg', key: 'machines' },
    { src: '/images/placeholder-5.svg', key: 'freeweights' },
    { src: '/images/placeholder-6.svg', key: 'cardio' },
    { src: '/images/placeholder-1.svg', key: 'functional' },
    { src: '/images/placeholder-2.svg', key: 'combat' },
    { src: '/images/placeholder-3.svg', key: 'lockers' },
    { src: '/images/placeholder-4.svg', key: 'showers' },
  ],
} as const;

export type Site = typeof site;
export type PlanKey = (typeof site.pricing.plans)[number]['key'];
export type PassKey = (typeof site.pricing.passes)[number]['key'];
