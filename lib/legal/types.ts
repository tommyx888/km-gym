/** Štruktúra právnych dokumentov – text je v lib/legal/sk.ts a en.ts, renderuje app/[locale]/dokumenty/[slug]. */
export type LegalSection = {
  h: string;
  p?: string[];
  ul?: string[];
  /** definičný zoznam (napr. účely spracúvania): [názov, popis] */
  dl?: [string, string][];
};

export type LegalDoc = {
  title: string;
  lead?: string;
  sections: LegalSection[];
};

export type LegalKeyAll = 'terms' | 'privacy' | 'cookies' | 'complaints' | 'operating' | 'withdrawal';
export type LegalContent = Record<LegalKeyAll, LegalDoc>;
