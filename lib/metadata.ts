import type { Metadata } from 'next';
import { HOME_PATH, type Locale } from '@/lib/i18n';
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  SITE_URL,
  TIKTOK_URL,
} from '@/lib/site';

const OG_IMAGE_PATH = '/opengraph-image';

export const HOME_TITLE =
  'SPORTTIMES — Find and join football matches near you';
export const HOME_DESCRIPTION =
  "See who's playing before you commit. SPORTTIMES shows live lineups for football matches in your campus, city or club. iOS beta open now.";

// The French homepage (app/fr/page.tsx).
export const HOME_TITLE_FR = 'SPORTTIMES — Trouve un match de foot près de chez toi';
export const HOME_DESCRIPTION_FR =
  'Vois qui joue avant de t’engager. SPORTTIMES affiche les compos en direct des matchs de foot de ton campus, ta ville ou ton club. Bêta iOS ouverte.';

const HOME_DESCRIPTIONS: Record<Locale, string> = {
  en: HOME_DESCRIPTION,
  fr: HOME_DESCRIPTION_FR,
};

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

// Tells search engines what SPORTTIMES is: the site and the ways people
// spell its name, the company and its profiles, and the iOS app. Both
// homepages carry it, each with its own description. No prices, ratings
// or reviews: the app has none to show yet.
export function homeStructuredData(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'SPORTTIMES',
        alternateName: ['SportTimes', 'Sport Times'],
        url: SITE_URL,
        inLanguage: ['en', 'fr'],
        publisher: { '@id': ORGANIZATION_ID },
      },
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: 'SPORTTIMES',
        url: SITE_URL,
        logo: `${SITE_URL}/screens/logo.png`,
        email: CONTACT_EMAIL,
        sameAs: [INSTAGRAM_URL, TIKTOK_URL],
      },
      {
        '@type': 'MobileApplication',
        '@id': `${SITE_URL}/#app`,
        name: 'SPORTTIMES',
        url: SITE_URL,
        description: HOME_DESCRIPTIONS[locale],
        applicationCategory: 'SportsApplication',
        operatingSystem: 'iOS',
        publisher: { '@id': ORGANIZATION_ID },
      },
    ],
  };
}

// The homepage exists in both languages; each version lists both, and
// English is the default for every other language.
export const HOME_LANGUAGES = {
  en: HOME_PATH.en,
  fr: HOME_PATH.fr,
  'x-default': HOME_PATH.en,
};

// A page that sets its own openGraph or twitter object replaces the
// parent's entirely, so the shared image has to be listed on each page.
export function pageMetadata({
  path,
  title,
  description,
  image = OG_IMAGE_PATH,
  languages,
}: {
  path: string;
  title: string;
  description: string;
  image?: string;
  languages?: Record<string, string>;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      siteName: 'SPORTTIMES',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

// Invite links are personal and differ per invite: no canonical, not
// indexed, but they still need the shared image for chat previews.
export function inviteMetadata({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata {
  return {
    title: `${title} — SPORTTIMES`,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'SPORTTIMES',
      images: [OG_IMAGE_PATH],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}
