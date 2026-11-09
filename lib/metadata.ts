import type { Metadata } from 'next';

const OG_IMAGE_PATH = '/opengraph-image';

export const HOME_TITLE =
  'SPORTTIMES — Find and join football matches near you';
export const HOME_DESCRIPTION =
  "See who's playing before you commit. SPORTTIMES shows live lineups for football matches in your campus, city or club. iOS beta open now.";

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
