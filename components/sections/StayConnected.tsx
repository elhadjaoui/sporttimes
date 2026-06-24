'use client';

import type { SVGProps } from 'react';
import PitchGrid from '@/components/ui/PitchGrid';
import Reveal from '@/components/ui/Reveal';
import NotifyForm from '@/components/ui/NotifyForm';

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.66a8.16 8.16 0 0 0 4.77 1.52v-3.45a4.85 4.85 0 0 1-1.84-.04z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS = [
  { label: 'Instagram', href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#', Icon: InstagramIcon },
  { label: 'TikTok',    href: process.env.NEXT_PUBLIC_TIKTOK_URL ?? '#',    Icon: TikTokIcon },
  { label: 'X',         href: process.env.NEXT_PUBLIC_X_URL ?? '#',         Icon: XIcon },
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
                  <Icon aria-hidden />
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
