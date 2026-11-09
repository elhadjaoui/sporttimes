import type { Metadata } from 'next';
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

export const HOME_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'SPORTTIMES',
      url: SITE_URL,
      logo: `${SITE_URL}/screens/logo.png`,
      email: CONTACT_EMAIL,
      sameAs: [INSTAGRAM_URL, TIKTOK_URL],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'SPORTTIMES',
      applicationCategory: 'SportsApplication',
      operatingSystem: 'iOS',
    },
  ],
};

// A page that sets its own openGraph or twitter object replaces the
// parent's entirely, so the shared image has to be listed on each page.
export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
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
