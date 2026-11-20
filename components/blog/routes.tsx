import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleView from '@/components/blog/ArticleView';
import BlogIndex from '@/components/blog/BlogIndex';
import {
  articleImagePath,
  articleLanguages,
  articlePath,
  BLOG_PATH,
  blogHome,
  blogLanguages,
  getArticle,
  getArticles,
} from '@/lib/blog';
import { getDictionary, type Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';
import { shareImage } from '@/lib/shareImage';
import { SITE_URL } from '@/lib/site';

// What the blog's route files under app/(en)/blog and app/fr/blog call,
// so both languages build the same pages.

const feedPath = (locale: Locale) => `${BLOG_PATH[locale]}/rss.xml`;

export function blogIndexMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale).blog;
  return pageMetadata({
    path: BLOG_PATH[locale],
    title: t.index.title,
    description: t.index.description,
    languages: blogLanguages(),
    feed: { title: t.feedTitle, url: feedPath(locale) },
  });
}

export function BlogIndexRoute({ locale }: { locale: Locale }) {
  if (!blogHome(locale)) notFound();
  return <BlogIndex locale={locale} />;
}

export function articleParams(locale: Locale) {
  return getArticles(locale).map((a) => ({ slug: a.slug }));
}

export function articleMetadata(locale: Locale, slug: string): Metadata {
  const article = getArticle(locale, slug);
  if (!article) return {};
  const path = articlePath(locale, slug);
  return {
    ...pageMetadata({
      path,
      title: article.title,
      description: article.description,
      image: articleImagePath(locale, slug),
      languages: articleLanguages(article),
      feed: {
        title: getDictionary(locale).blog.feedTitle,
        url: feedPath(locale),
      },
      article: { published: article.published, updated: article.updated },
    }),
    ...(article.draft && { robots: { index: false, follow: false } }),
  };
}

export function ArticleRoute({ locale, slug }: { locale: Locale; slug: string }) {
  const article = getArticle(locale, slug);
  if (!article) notFound();
  return <ArticleView article={article} />;
}

// The share image: the article's heading, with the blog's address in lime.
export function articleImage(locale: Locale, slug: string) {
  const article = getArticle(locale, slug);
  const t = getDictionary(locale).blog;
  return shareImage([article?.heading ?? t.index.heading, t.shareKicker], {
    fontSize: 54,
    textWidth: 620,
  });
}

const escapeXml = (text: string) =>
  text.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);

// RSS 2.0 feed of the published articles in one language.
export function feedResponse(locale: Locale): Response {
  if (!blogHome(locale)) return new Response('Not found', { status: 404 });
  const t = getDictionary(locale).blog;
  const items = getArticles(locale)
    .filter((a) => !a.draft)
    .map((a) => {
      const url = `${SITE_URL}${articlePath(locale, a.slug)}`;
      return `<item><title>${escapeXml(a.heading)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(`${a.published}T00:00:00Z`).toUTCString()}</pubDate><description>${escapeXml(a.description)}</description></item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(t.feedTitle)}</title><link>${SITE_URL}${BLOG_PATH[locale]}</link><description>${escapeXml(t.index.description)}</description><language>${locale}</language>${items}</channel></rss>`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
