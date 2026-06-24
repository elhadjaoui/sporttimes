'use client';

import Reveal from '@/components/ui/Reveal';

const STATS = [
  { label: 'Unread', before: '47', after: '0' },
  { label: 'Confirmed', before: 'unknown', after: '11 / 11' },
  { label: 'Captain time', before: 'hours', after: '0' },
  { label: 'Match', before: '50 / 50', after: 'happening' },
];

export default function Problem() {
  return (
    <section
      id="problem"
      data-palette="dark"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(5rem, 12vh, 9rem) 0',
      }}
    >
      <div className="grid-12" style={{ width: '100%' }}>
        <div style={{ gridColumn: '1 / span 12', maxWidth: 720, margin: '0 auto' }}>
          <Reveal stagger={80}>
            <div className="mono-eyebrow" style={{ marginBottom: 32 }}>
              [ the problem ]
            </div>

            <h2
              className="headline-display"
              style={{
                fontSize: 'clamp(30px, 4.4vw, 46px)',
                color: 'var(--text)',
                marginBottom: 36,
                maxWidth: '20ch',
              }}
            >
              Matches don&apos;t die from a lack of players. They die from coordination.
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 17,
                lineHeight: 1.55,
                color: 'var(--text-dim)',
                maxWidth: '65ch',
                marginBottom: 56,
              }}
            >
              Every week, in every city, the plan lives inside a group chat nobody can actually
              read. Half-confirmations, late cancellations, exhausted organizers. By kickoff, no
              one knows who&apos;s showing up. Often, nobody does.
            </p>

            <div
              style={{
                borderTop: '1px solid var(--hairline)',
                borderBottom: '1px solid var(--hairline)',
                padding: '24px 0',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px 32px',
              }}
              className="problem-stats"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--text-mute)',
                      marginBottom: 6,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      color: 'var(--text-dim)',
                      textDecoration: 'line-through',
                    }}
                  >
                    {s.before}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      color: 'var(--accent)',
                      marginTop: 4,
                    }}
                  >
                    ↓ {s.after}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .problem-stats {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
