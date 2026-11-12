import type { MetadataRoute } from 'next';
import { HOME_LANGUAGES } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site';

const url = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`;

// Both homepages list every language version, as their <head> does.
const homeAlternates = {
  languages: Object.fromEntries(
    Object.entries(HOME_LANGUAGES).map(([lang, path]) => [lang, url(path)])
  ),
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: url('/'), alternates: homeAlternates },
    { url: url('/fr'), alternates: homeAlternates },
    { url: url('/privacy') },
    { url: url('/terms') },
  ];
}
