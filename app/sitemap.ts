import type { MetadataRoute } from 'next';
import {
  articleLanguages,
  articlePath,
  BLOG_PATH,
  blogLanguages,
  getArticles,
} from '@/lib/blog';
import type { Locale } from '@/lib/i18n';
import { HOME_LANGUAGES } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site';

const url = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`;

// A page's language versions as absolute URLs, as its <head> lists them.
const alternates = (languages?: Record<string, string>) =>
  languages && {
    languages: Object.fromEntries(
      Object.entries(languages).map(([lang, path]) => [lang, url(path)])
    ),
  };

// Published articles only: drafts are never listed, even in previews.
function blogEntries(locale: Locale): MetadataRoute.Sitemap {
  const articles = getArticles(locale).filter((a) => !a.draft);
  if (articles.length === 0) return [];
  return [
    { url: url(BLOG_PATH[locale]), alternates: alternates(blogLanguages()) },
    ...articles.map((a) => ({
      url: url(articlePath(locale, a.slug)),
      lastModified: a.updated,
      alternates: alternates(articleLanguages(a)),
    })),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: url('/'), alternates: alternates(HOME_LANGUAGES) },
    { url: url('/fr'), alternates: alternates(HOME_LANGUAGES) },
    ...blogEntries('en'),
    ...blogEntries('fr'),
    { url: url('/privacy') },
    { url: url('/terms') },
  ];
}
