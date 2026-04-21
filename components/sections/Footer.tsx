'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// ===================================================================
//  Copyable email — click to copy, shows a brief "copied" confirmation
// ===================================================================

function CopyableEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const el = document.createElement('textarea');
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      data-cursor="hover"
      aria-label={`Copy ${email} to clipboard`}
      title={copied ? 'Copied!' : 'Click to copy'}
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 11,
        letterSpacing: '0.12em',
        color: copied ? 'var(--lime, #d4ff3a)' : 'rgba(245,245,240,0.65)',
        transition: 'color 220ms ease',
      }}
    >
      {email}
    </button>
  );
}

// ===================================================================
//  Proximity color interpolation — ink ↔ lime (matches Hero)
// ===================================================================

function interpolateColor(t: number): string {
  const ink = [0xf5, 0xf5, 0xf0];
  const lime = [0xd4, 0xff, 0x3a];
  const r = Math.round(ink[0] * (1 - t) + lime[0] * t);
  const g = Math.round(ink[1] * (1 - t) + lime[1] * t);
  const b = Math.round(ink[2] * (1 - t) + lime[2] * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// ===================================================================
//  Minimal line-icon social glyphs
// ===================================================================

function SocialIcon({ name }: { name: 'Instagram' | 'TikTok' | 'YouTube' }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'Instagram':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'TikTok':
      return (
        <svg {...common}>
          <path d="M 14 4 v 10.5 a 3.5 3.5 0 1 1 -3.5 -3.5" />
          <path d="M 14 4 c 0 2.2 1.8 4 4 4" />
        </svg>
      );
    case 'YouTube':
      return (
        <svg {...common}>
          <rect x="2.5" y="5" width="19" height="14" rx="3.5" />
          <path d="M 10 9 L 15 12 L 10 15 Z" fill="currentColor" />
        </svg>
      );
  }
}

// ===================================================================
//  Footer
// ===================================================================

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const playMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !playMoreRef.current) return;

    const inners = playMoreRef.current.querySelectorAll<HTMLElement>(
      '.footer-line-inner'
    );
    const rows = rootRef.current.querySelectorAll<HTMLElement>(
      '.footer-row'
    );

    // Hide initially
    gsap.set(inners, { yPercent: 100 });
    gsap.set(rows, { opacity: 0, y: 20 });

    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      gsap.to(inners, {
        yPercent: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
      });
      gsap.to(rows, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            play();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(rootRef.current);

    // Safety: if footer is already in view at mount (user loaded at the
    // bottom), IO fires async — fall back to a timer.
    const fallback = window.setTimeout(() => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight) {
        play();
        observer.disconnect();
      }
    }, 120);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  // Proximity-based hover on footer headline letters — mirrors Hero pattern
  useEffect(() => {
    if (!playMoreRef.current) return;
    const lines = Array.from(
      playMoreRef.current.querySelectorAll<HTMLElement>('.footer-line')
    );
    if (lines.length === 0) return;

    const RADIUS = 140;
    const cleanups: Array<() => void> = [];

    lines.forEach((line) => {
      const letters = Array.from(
        line.querySelectorAll<HTMLElement>('.footer-letter')
      );

      const onMove = (e: MouseEvent) => {
        const cx = e.clientX;
        const cy = e.clientY;
        letters.forEach((letter) => {
          const r = letter.getBoundingClientRect();
          const lx = r.left + r.width / 2;
          const ly = r.top + r.height / 2;
          const dx = cx - lx;
          const dy = cy - ly;
          const dist = Math.hypot(dx, dy);
          const t = Math.max(0, 1 - dist / RADIUS);
          const p = 1 - (1 - t) * (1 - t);
          letter.style.color = interpolateColor(p);
          letter.style.transform = `translateY(${(-8 * p).toFixed(2)}px)`;
          letter.style.transition = 'none';
        });
      };

      const onLeave = () => {
        letters.forEach((letter) => {
          letter.style.transition =
            'color 0.35s ease-out, transform 0.35s ease-out';
          letter.style.color = '';
          letter.style.transform = '';
        });
      };

      line.addEventListener('mousemove', onMove);
      line.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        line.removeEventListener('mousemove', onMove);
        line.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <footer
      ref={rootRef}
      id="footer"
      data-progress-section
      data-progress-label="07 · Footer"
      data-palette="hero"
      className="relative w-full overflow-hidden"
      style={{
        paddingTop: 'clamp(4rem, 8vh, 7rem)',
        paddingBottom: 'clamp(2.5rem, 5vh, 4rem)',
      }}
    >
      {/* Top row — logo + tagline (left), socials (right) */}
      <div className="grid-12 footer-row">
        <div className="col-span-12 md:col-start-2 md:col-span-6 flex items-center gap-5 flex-wrap">
          <div
            style={{
              fontFamily: 'var(--font-display), Inter, sans-serif',
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: '-0.02em',
              color: '#F5F5F0',
              textTransform: 'uppercase',
            }}
          >
            SportTimes
          </div>
          <div
            style={{
              width: 1,
              height: 16,
              background: 'rgba(245,245,240,0.25)',
            }}
          />
          <div
            className="mono-eyebrow"
            style={{
              color: 'rgba(245,245,240,0.55)',
              letterSpacing: '0.22em',
            }}
          >
            See the lineup · Join the match
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 md:col-start-10 flex items-center md:justify-end gap-4 mt-4 md:mt-0">
          {([
            {
              name: 'Instagram',
              href: 'https://www.instagram.com/sporttimesapp/',
            },
            {
              name: 'TikTok',
              href: 'https://www.tiktok.com/@sporttimesapp?lang=en-GB',
            },
            {
              name: 'YouTube',
              href: null,
            },
          ] as const).map((s) =>
            s.href ? (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                data-cursor="hover"
                className="social-link"
                style={{
                  color: 'rgba(245,245,240,0.6)',
                  display: 'inline-flex',
                  padding: 6,
                  transition:
                    'color 250ms cubic-bezier(0.22, 1, 0.36, 1), transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <SocialIcon name={s.name} />
              </a>
            ) : (
              <span
                key={s.name}
                aria-label={`${s.name} — coming soon`}
                className="social-soon"
                style={{
                  color: 'rgba(245,245,240,0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: 6,
                  position: 'relative',
                  cursor: 'help',
                }}
              >
                <SocialIcon name={s.name} />
                <span className="social-soon-label">soon</span>
              </span>
            )
          )}
        </div>
      </div>

      {/* Middle row — giant mask-revealed "PLAY MORE." with a trailing arrow */}
      <div
        ref={playMoreRef}
        className="grid-12 footer-row"
        style={{
          marginTop: 'clamp(3rem, 6vh, 5rem)',
          marginBottom: 'clamp(2.5rem, 5vh, 4rem)',
        }}
      >
        <div className="col-span-12 md:col-start-2 md:col-span-10">
          <div className="footer-play-wrap">
            <h3
              aria-label="Play more."
              className="headline-display uppercase text-ink"
              style={{
                fontSize: 'clamp(3.5rem, 14vw, 12rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                margin: 0,
                display: 'inline-block',
              }}
            >
              {['Play', 'more.'].map((line, i) => (
                <span
                  key={i}
                  className="footer-line cursor-default"
                  data-cursor="blend"
                  style={{
                    display: 'block',
                    overflow: 'hidden',
                    lineHeight: 0.9,
                    paddingBottom: '0.08em',
                  }}
                >
                  <span
                    className="footer-line-inner"
                    style={{
                      display: 'block',
                      willChange: 'transform',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {line.split('').map((ch, j) => (
                      <span
                        key={j}
                        className="footer-letter"
                        style={{
                          display: 'inline-block',
                          willChange: 'color, transform',
                        }}
                      >
                        {ch === ' ' ? '\u00A0' : ch}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </h3>

            <div className="footer-play-accent">
              <div className="footer-play-eyebrow">
                [ The match before the match · 2026 ]
              </div>
              <div className="footer-play-stats">
                <div className="footer-play-stat">
                  <span className="footer-play-stat-num">03</span>
                  <span className="footer-play-stat-label">Sports live</span>
                </div>
                <div className="footer-play-stat">
                  <span className="footer-play-stat-num">07+</span>
                  <span className="footer-play-stat-label">Coming soon</span>
                </div>
                <div className="footer-play-stat">
                  <span className="footer-play-stat-num">∞</span>
                  <span className="footer-play-stat-label">Matches ahead</span>
                </div>
              </div>
              <a
                href="#download"
                data-cursor="hover"
                className="footer-play-cta"
              >
                Open the app ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row — copyright (left), links (right) */}
      <div
        className="grid-12 footer-row"
        style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(245,245,240,0.08)',
        }}
      >
        <div
          className="col-span-12 md:col-start-2 md:col-span-6"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,240,0.45)',
          }}
        >
          © 2026 SportTimes · Made in Ben Guerir
        </div>
        <div
          className="col-span-12 md:col-span-4 md:col-start-8 mt-4 md:mt-0 flex flex-col md:items-end gap-3"
        >
          <div
            className="flex gap-5 flex-wrap md:justify-end"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                data-cursor="hover"
                className="footer-link"
                style={{
                  color: 'rgba(245,245,240,0.55)',
                  transition: 'color 220ms ease',
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <CopyableEmail email="contact@sporttimes.app" />
        </div>
      </div>

      <style jsx>{`
        .social-link:hover {
          color: var(--lime) !important;
          transform: scale(1.15);
        }
        .social-soon {
          opacity: 0.6;
        }
        .social-soon-label {
          position: absolute;
          top: -8px;
          right: -6px;
          font-family: var(--font-mono), monospace;
          font-size: 7.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--lime, #d4ff3a);
          background: rgba(212, 255, 58, 0.12);
          border: 1px solid rgba(212, 255, 58, 0.45);
          padding: 1px 4px;
          border-radius: 100px;
          pointer-events: none;
          line-height: 1;
        }
        .footer-play-wrap {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 48px;
          flex-wrap: wrap;
        }
        .footer-play-accent {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 18px;
          padding-bottom: 0.4em;
          min-width: 220px;
        }
        .footer-play-eyebrow {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245, 245, 240, 0.5);
          text-align: right;
        }
        .footer-play-stats {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .footer-play-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .footer-play-stat-num {
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 900;
          font-size: 36px;
          letter-spacing: -0.02em;
          line-height: 1;
          color: var(--lime, #d4ff3a);
        }
        .footer-play-stat-label {
          font-family: var(--font-mono), monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245, 245, 240, 0.55);
        }
        .footer-play-cta {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #f5f5f0;
          text-decoration: none;
          padding: 10px 18px;
          border: 1px solid rgba(245, 245, 240, 0.22);
          border-radius: 100px;
          transition: color 220ms ease, border-color 220ms ease,
            background 220ms ease;
        }
        .footer-play-cta:hover {
          color: #050505;
          background: var(--lime, #d4ff3a);
          border-color: var(--lime, #d4ff3a);
        }
        @media (max-width: 767px) {
          .footer-play-wrap {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }
          .footer-play-accent {
            align-items: flex-start;
          }
          .footer-play-eyebrow,
          .footer-play-stats {
            text-align: left;
            justify-content: flex-start;
          }
          .footer-play-stat {
            align-items: flex-start;
          }
        }
        .footer-link:hover {
          color: var(--lime) !important;
        }
        .footer-email:hover {
          color: var(--lime) !important;
        }
      `}</style>
    </footer>
  );
}
