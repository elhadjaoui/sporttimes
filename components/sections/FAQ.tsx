import type { Dictionary } from '@/lib/i18n';

export default function FAQ({ t }: { t: Dictionary['faq'] }) {
  return (
    <section
      id="faq"
      data-progress-section
      data-progress-label={t.progressLabel}
      data-palette="hero"
      className="relative"
      style={{ padding: 'clamp(6rem, 12vh, 9rem) 0' }}
    >
      <div className="grid-12" data-reveal>
        <div className="col-span-12 xl:col-start-2 xl:col-span-4" data-reveal-child>
          <div className="mono-eyebrow" style={{ marginBottom: 24 }}>
            {t.eyebrow}
          </div>
          <h2
            className="headline-display"
            style={{
              fontSize: 'clamp(2rem, 4.6vw, 3.4rem)',
              color: 'var(--ink)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              marginBottom: 40,
              maxWidth: '12ch',
            }}
          >
            {t.headline}
          </h2>
        </div>

        <div className="col-span-12 xl:col-span-6" data-reveal-child>
          {t.questions.map(({ question, answer }) => (
            <div
              key={question}
              style={{
                padding: '22px 0',
                borderTop: '1px solid rgba(245, 245, 240, 0.10)',
              }}
            >
              <h3
                className="headline-display"
                style={{
                  fontSize: 19,
                  color: 'var(--ink)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.015em',
                  marginBottom: 8,
                }}
              >
                {question}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body), Inter, system-ui, sans-serif',
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: 'var(--muted)',
                  maxWidth: '58ch',
                }}
              >
                {typeof answer === 'string' ? (
                  answer
                ) : (
                  // The Android answer, split around its waitlist link.
                  <>
                    {answer.before}{' '}
                    <a
                      href="#download"
                      className="text-lime underline underline-offset-2"
                    >
                      {answer.link}
                    </a>{' '}
                    {answer.after}
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
