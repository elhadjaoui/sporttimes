import Link from 'next/link';
import { articlePath, formatDate, getArticles } from '@/lib/blog';
import { getDictionary, HOME_PATH, type Locale } from '@/lib/i18n';
import { fill } from '@/lib/i18n/fill';

// The list of articles in one language, newest first.
export default function BlogIndex({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).blog;
  const articles = getArticles(locale);

  return (
    <main
      className="relative w-full"
      data-palette="hero"
      style={{
        minHeight: '100vh',
        paddingTop: 'clamp(7rem, 12vh, 10rem)',
        paddingBottom: 'clamp(4rem, 8vh, 7rem)',
      }}
    >
      <div className="grid-12 relative z-[5]">
        <div className="col-span-12 md:col-start-2 md:col-span-8">
          <Link
            href={HOME_PATH[locale]}
            className="mono-eyebrow inline-flex items-center gap-2 mb-8"
            style={{ letterSpacing: '0.2em' }}
          >
            {t.backToHome}
          </Link>

          <div className="mono-eyebrow mb-4">{t.eyebrow}</div>
          <h1
            className="headline-display uppercase text-ink mb-6"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.03em',
            }}
          >
            {t.index.heading}
          </h1>
          <p
            className="font-body mb-12"
            style={{
              color: 'rgba(245,245,240,0.6)',
              fontSize: 15,
              lineHeight: 1.5,
              maxWidth: '62ch',
            }}
          >
            {t.index.lede}
          </p>

          <ul>
            {articles.map((article) => (
              <li
                key={article.slug}
                style={{ borderTop: '1px solid rgba(245,245,240,0.12)' }}
              >
                <Link
                  href={articlePath(locale, article.slug)}
                  className="group block py-8"
                >
                  <div
                    className="font-mono uppercase mb-3"
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      color: 'rgba(245,245,240,0.55)',
                    }}
                  >
                    {fill(t.published, {
                      date: formatDate(article.published, locale),
                    })}
                    {article.draft && ` · ${t.draft}`}
                  </div>
                  <h2
                    className="headline-display uppercase text-ink group-hover:text-lime transition-colors mb-3"
                    style={{
                      fontSize: 'clamp(1.35rem, 2.4vw, 1.9rem)',
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {article.heading}
                  </h2>
                  <p
                    className="font-body"
                    style={{
                      color: 'rgba(245,245,240,0.72)',
                      fontSize: 15,
                      lineHeight: 1.6,
                      maxWidth: '64ch',
                    }}
                  >
                    {article.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
