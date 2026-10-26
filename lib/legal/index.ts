import type { Locale } from '../i18n/config';
import type { LegalContent } from './types';
import { sk } from './sk';
import { en } from './en';

export function getLegal(locale: Locale): LegalContent {
  return locale === 'en' ? en : sk;
}
export type { LegalDoc, LegalSection, LegalKeyAll } from './types';
