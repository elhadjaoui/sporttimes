import Link from 'next/link';
import BetaButton from '@/components/ui/BetaButton';
import {
  type Article,
  articlePath,
  BLOG_PATH,
  formatDate,
  getTranslation,
} from '@/lib/blog';
import { getDictionary, HOME_PATH } from '@/lib/i18n';
import { fill } from '@/lib/i18n/fill';
import { articleStructuredData } from '@/lib/metadata';

// One article: the same long-form layout as the Privacy and Terms pages,
// then a call to action.
export default function ArticleView({ article }: { article: Article }) {
  const t = getDictionary(article.locale).blog;
  const translation = getTranslation(article);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleStructuredData(article, t.breadcrumbHome)
          ),
        }}
      />
      <article className="grid-12 relative z-[5]">
        <div className="col-span-12 md:col-start-2 md:col-span-8">
          <Link
            href={BLOG_PATH[article.locale]}
            className="mono-eyebrow inline-flex items-center gap-2 mb-8"
            style={{ letterSpacing: '0.2em' }}
          >
            {t.backToBlog}
          </Link>

          {article.draft && (
            <p
              className="mono-eyebrow mb-6"
              style={{ color: '#F5F5F0', letterSpacing: '0.2em' }}
            >
              {t.draft}
            </p>
          )}

          <h1
            className="headline-display uppercase text-ink mb-6"
            style={{
              fontSize: 'clamp(2rem, 4.4vw, 3.5rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.03em',
            }}
          >
            {article.heading}
          </h1>

          <p
            className="font-body mb-10"
            style={{
              color: 'rgba(245,245,240,0.6)',
              fontSize: 15,
              lineHeight: 1.5,
              maxWidth: '62ch',
            }}
          >
            {fill(t.published, { date: formatDate(article.published, article.locale) })}
            {article.updated !== article.published && (
              <>
                {' · '}
                {fill(t.updated, { date: formatDate(article.updated, article.locale) })}
              </>
            )}
            {translation && (
              <>
                {' · '}
                <a
                  href={articlePath(translation.locale, translation.slug)}
                  hrefLang={t.otherLanguage.lang}
                  lang={t.otherLanguage.lang}
                  style={{ color: 'var(--lime)', textDecoration: 'underline' }}
                >
                  {t.otherLanguage.label}
                </a>
              </>
            )}
          </p>

          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          <aside
            className="mt-16 pt-10"
            style={{ borderTop: '1px solid rgba(245,245,240,0.12)' }}
          >
            <div className="mono-eyebrow mb-4">{t.cta.eyebrow}</div>
            <h2
              className="headline-display uppercase text-ink mb-4"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.03em',
              }}
            >
              {t.cta.heading}
            </h2>
            <p
              className="font-body mb-8"
              style={{
                color: 'rgba(245,245,240,0.72)',
                fontSize: 15,
                lineHeight: 1.6,
                maxWidth: '56ch',
              }}
            >
              {t.cta.body}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <BetaButton location="blog" label={t.cta.joinBeta} />
              <a
                href={`${HOME_PATH[article.locale]}#download`}
                className="font-mono text-[12px] tracking-[0.18em] uppercase"
                style={{ color: 'var(--lime)', textDecoration: 'underline' }}
              >
                {t.cta.waitlist}
              </a>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
