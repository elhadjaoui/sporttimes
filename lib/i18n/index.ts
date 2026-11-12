import en from './en';

export type Locale = 'en';

// Every language has the same shape as the English dictionary, with its
// own text in place of each string (and the same number of list items).
type Text<T> = T extends string
  ? string
  : { readonly [K in keyof T]: Text<T[K]> };
export type Dictionary = Text<typeof en>;

const DICTIONARIES: Record<Locale, Dictionary> = { en };

export const HOME_PATH: Record<Locale, string> = { en: '/' };

// Server-only: client components receive their text as props, so a page
// only ships its own language.
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
