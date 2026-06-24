'use client';

import { Instagram, X, Music } from 'lucide-react';
import PitchGrid from '@/components/ui/PitchGrid';
import Reveal from '@/components/ui/Reveal';
import NotifyForm from '@/components/ui/NotifyForm';

const SOCIALS = [
  { label: 'Instagram', href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#', Icon: Instagram },
  { label: 'TikTok',    href: process.env.NEXT_PUBLIC_TIKTOK_URL ?? '#',    Icon: Music },
  { label: 'X',         href: process.env.NEXT_PUBLIC_X_URL ?? '#',         Icon: X },
];

export default function StayConnected() {
  return (
    <section
      id="stay-connected"
      data-palette="dark"
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 10vh, 8rem) 0',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
        <PitchGrid />
      </div>
      <div className="grid-12" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ gridColumn: '1 / span 12', textAlign: 'center', marginBottom: 48 }}>
          <Reveal stagger={80}>
            <div className="mono-eyebrow" style={{ marginBottom: 24 }}>
              [ stay in the loop ]
            </div>
            <h2
              className="headline-display"
              style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', color: 'var(--text)' }}
            >
              Two ways to ride along.
            </h2>
          </Reveal>
        </div>

        <Reveal
          stagger={120}
          className="stay-grid"
        >
          <div style={{
            padding: 28,
            background: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: 16,
          }}>
            <h3 className="headline-display" style={{ fontSize: 22, color: 'var(--text)', marginBottom: 8 }}>
              Get the launch email.
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-dim)', marginBottom: 20,
            }}>
              One email, the day doors open.
            </p>
            <NotifyForm source="close" variant="dark" />
          </div>

          <div style={{
            padding: 28,
            background: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: 16,
          }}>
            <h3 className="headline-display" style={{ fontSize: 22, color: 'var(--text)', marginBottom: 8 }}>
              Follow along.
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-dim)', marginBottom: 20,
            }}>
              Behind-the-scenes, until we&apos;re live.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 16px',
                    minHeight: 44,
                    background: 'transparent',
                    border: '1px solid var(--hairline)',
                    borderRadius: 100,
                    color: 'var(--text-dim)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                  }}
                >
                  <Icon size={16} aria-hidden />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <style jsx>{`
        .stay-grid {
          grid-column: 1 / span 12;
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          max-width: 880px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .stay-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </section>
  );
}
