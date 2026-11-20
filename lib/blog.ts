import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';
import type { Locale } from '@/lib/i18n';

// Articles are Markdown files in content/blog/<locale>/<slug>.md. Each one
// opens with `key: value` lines between two `---` lines:
//
//   title        page title for search results, 60 characters or fewer,
//                ending "— SPORTTIMES"
//   heading      the H1 on the page
//   description  meta description, 70 to 160 characters
//   phrase       the search phrase the article targets
//   published    YYYY-MM-DD
//   updated      YYYY-MM-DD; same as published until the article changes
//   translation  slug of the same article in the other language (optional)
//   draft        true keeps the article off the live site (optional)
//
// The body is Markdown, starting at ## for section headings. Notes for the
// founder go in brackets ([FOUNDER: …], [CONFIRM: …], [REVIEW: …]): the
// build fails if a published article still has one.

export type Article = {
  locale: Locale;
  slug: string;
  title: string;
  heading: string;
  description: string;
  phrase: string;
  published: string;
  updated: string;
  translation?: string;
  draft: boolean;
  html: string;
};

export const BLOG_PATH: Record<Locale, string> = { en: '/blog', fr: '/fr/blog' };

export function articlePath(locale: Locale, slug: string): string {
  return `${BLOG_PATH[locale]}/${slug}`;
}

// The article's link preview (app/(en)/blog/[slug]/share.png/route.ts).
export function articleImagePath(locale: Locale, slug: string): string {
  return `${articlePath(locale, slug)}/share.png`;
}

const CONTENT_DIR = join(process.cwd(), 'content/blog');
// Drafts show in local builds and Vercel previews, never on the live site.
const SHOW_DRAFTS = process.env.VERCEL_ENV !== 'production';
const UNFINISHED = /\[(FOUNDER|CONFIRM|REVIEW)\b/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const OTHER_LOCALE: Record<Locale, Locale> = { en: 'fr', fr: 'en' };

function readArticle(locale: Locale, file: string): Article {
  const where = `content/blog/${locale}/${file}`;
  const raw = readFileSync(join(CONTENT_DIR, locale, file), 'utf8').replace(
    /\r\n/g,
    '\n'
  );
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`${where}: missing the --- block at the top`);

  const fields: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim()) continue;
    const field = /^(\w+):\s*(.*)$/.exec(line);
    if (!field) throw new Error(`${where}: can't read the line "${line}"`);
    fields[field[1]] = field[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  const need = (key: string) => {
    if (!fields[key]) throw new Error(`${where}: "${key}" is missing`);
    return fields[key];
  };
  const date = (key: string) => {
    const value = need(key);
    if (!DATE.test(value))
      throw new Error(`${where}: "${key}" must look like 2026-11-20`);
    return value;
  };

  const article: Article = {
    locale,
    slug: file.replace(/\.md$/, ''),
    title: need('title'),
    heading: need('heading'),
    description: need('description'),
    phrase: need('phrase'),
    published: date('published'),
    updated: date('updated'),
    translation: fields.translation || undefined,
    draft: fields.draft === 'true',
    html: marked.parse(match[2], { async: false }),
  };

  if (article.title.length > 60 || !article.title.endsWith('— SPORTTIMES'))
    throw new Error(
      `${where}: the title must be 60 characters or fewer and end with "— SPORTTIMES"`
    );
  const length = article.description.length;
  if (length < 70 || length > 160)
    throw new Error(
      `${where}: the description is ${length} characters; keep it between 70 and 160`
    );
  if (article.updated < article.published)
    throw new Error(`${where}: "updated" is before "published"`);
  if (!article.draft && UNFINISHED.test(raw))
    throw new Error(
      `${where}: a note in brackets is still there; finish it or set draft: true`
    );
  return article;
}

const cache = new Map<Locale, Article[]>();

// The articles readers can see in one language, newest first.
export function getArticles(locale: Locale): Article[] {
  let articles = cache.get(locale);
  if (!articles) {
    let files: string[] = [];
    try {
      files = readdirSync(join(CONTENT_DIR, locale)).filter((f) =>
        f.endsWith('.md')
      );
    } catch {
      // No folder yet for this language.
    }
    articles = files
      .map((file) => readArticle(locale, file))
      .filter((a) => SHOW_DRAFTS || !a.draft)
      .sort((a, b) => b.published.localeCompare(a.published));
    cache.set(locale, articles);
  }
  return articles;
}

export function getArticle(locale: Locale, slug: string): Article | undefined {
  return getArticles(locale).find((a) => a.slug === slug);
}

// The same article in the other language, when readers can see it.
export function getTranslation(article: Article): Article | undefined {
  return article.translation
    ? getArticle(OTHER_LOCALE[article.locale], article.translation)
    : undefined;
}

// The blog's address in this language, or nothing while it has no articles.
export function blogHome(locale: Locale): string | undefined {
  return getArticles(locale).length > 0 ? BLOG_PATH[locale] : undefined;
}

// "2026-11-20" as "20 November 2026" or "20 novembre 2026".
export function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

// Language versions for <link rel="alternate">: an article and its
// translation list each other, English being the default.
export function articleLanguages(
  article: Article
): Record<string, string> | undefined {
  const other = getTranslation(article);
  if (!other) return undefined;
  const en = article.locale === 'en' ? article : other;
  const fr = article.locale === 'fr' ? article : other;
  return {
    en: articlePath('en', en.slug),
    fr: articlePath('fr', fr.slug),
    'x-default': articlePath('en', en.slug),
  };
}

// Index pages pair up when both languages have articles.
export function blogLanguages(): Record<string, string> | undefined {
  if (!blogHome('en') || !blogHome('fr')) return undefined;
  return { en: BLOG_PATH.en, fr: BLOG_PATH.fr, 'x-default': BLOG_PATH.en };
}
