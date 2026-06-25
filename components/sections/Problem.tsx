'use client';

import { useEffect, useRef, useState } from 'react';

// ===================================================================
//  Quiet before/after stat row — three cells, cross-fade once on scroll-in
// ===================================================================
const STATS = [
  { label: 'Messages',   before: '47 unread', after: '0' },
  { label: 'Lineup',     before: 'unknown',   after: '11 / 11' },
  { label: 'Organizers', before: 'exhausted', after: 'hands-free' },
];

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  // Gentle scroll-tied parallax for the two floating cards.
  // The base rotation lives in inline style; we rebuild the transform
  // each frame so rotate and translate compose correctly.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    let lastY = -1;
    const tick = () => {
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      if (scrolled !== lastY) {
        lastY = scrolled;
        if (card1Ref.current) {
          card1Ref.current.style.transform =
            `translate3d(0, ${(scrolled * 0.08).toFixed(2)}px, 0) rotate(-4deg)`;
        }
        if (card2Ref.current) {
          card2Ref.current.style.transform =
            `translate3d(0, ${(-scrolled * 0.06).toFixed(2)}px, 0) rotate(5deg)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Cross-fade the stat row from BEFORE → AFTER once it enters view.
  // Single direction. No repeat. ~800ms after enter so the eye lands first.
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setFlipped(true), 800);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="problem"
      data-progress-section
      data-progress-label="The Problem"
      className="relative"
      style={{
        padding: 'clamp(7rem, 14vh, 11rem) 0 clamp(5rem, 10vh, 8rem)',
        overflow: 'hidden',
      }}
    >
      <div className="grid-12 items-center" data-reveal>
        {/* ============================================================
            LEFT — copy block
            ============================================================ */}
        <div
          className="col-span-12 xl:col-start-2 xl:col-span-5"
          data-reveal-child
          style={{ marginBottom: 'clamp(3rem, 6vh, 5rem)' }}
        >
          <div className="mono-eyebrow" style={{ marginBottom: 24 }}>
            The problem
          </div>

          <h2
            className="headline-display"
            style={{
              fontSize: 'clamp(2rem, 4.4vw, 3.6rem)',
              color: 'var(--ink)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              textTransform: 'none',
              marginBottom: 28,
              maxWidth: '22ch',
            }}
          >
            Matches don&apos;t die from a lack of players. They die from{' '}
            <span style={{ color: 'var(--lime)' }}>coordination</span>.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body), Inter, system-ui, sans-serif',
              fontSize: 17,
              lineHeight: 1.55,
              color: 'var(--muted)',
              maxWidth: '42ch',
            }}
          >
            Every week, in every city, plans live inside group chats nobody
            can actually read — and matches collapse before kickoff.
          </p>
        </div>

        {/* ============================================================
            RIGHT — confirmed lineup screenshot + 2 floating cards
            ============================================================ */}
        <div
          className="col-span-12 xl:col-start-8 xl:col-span-4"
          data-reveal-child
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            // Breathing room for the floating cards to overhang without
            // pushing the layout when they shift on parallax.
            paddingLeft: 'clamp(0px, 4vw, 40px)',
            paddingRight: 'clamp(0px, 4vw, 40px)',
          }}
        >
          {/* Phone frame holding the confirmed-lineup screenshot.
              Drop the PNG at `public/screens/problem-lineup.png` to fill the frame.
              Aspect ratio matches a tall phone (9:19.5). */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 320,
              aspectRatio: '9 / 19.5',
              borderRadius: 28,
              overflow: 'hidden',
              background: '#0A0A0A',
              border: '1px solid rgba(245,245,240,0.08)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.35)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/screens/problem-lineup.png"
              alt="A confirmed 11 of 11 match lineup in the SportTimes app"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              loading="eager"
            />
          </div>

          {/* Floating card 1 — muted "BEFORE" fragment.
              Sits over the top-left of the phone, drifts down on scroll. */}
          <div
            ref={card1Ref}
            aria-hidden
            style={{
              position: 'absolute',
              top: '8%',
              left: 'clamp(-12px, 2vw, 12px)',
              transform: 'rotate(-4deg)',
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(20, 20, 20, 0.92)',
              border: '1px solid rgba(245,245,240,0.06)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 14px 36px rgba(0,0,0,0.45)',
              willChange: 'transform',
              minWidth: 130,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 9,
                letterSpacing: '0.22em',
                color: 'rgba(245,245,240,0.4)',
                marginBottom: 4,
              }}
            >
              BEFORE
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display), Inter, sans-serif',
                fontSize: 22,
                fontWeight: 800,
                color: 'rgba(245,245,240,0.55)',
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              47 unread
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body), Inter, sans-serif',
                fontSize: 11,
                color: 'rgba(245,245,240,0.4)',
                marginTop: 4,
                fontStyle: 'italic',
              }}
            >
              &quot;who&apos;s in tonight?&quot;
            </div>
          </div>

          {/* Floating card 2 — bright lime "AFTER" fragment.
              Sits over the bottom-right of the phone, drifts up on scroll. */}
          <div
            ref={card2Ref}
            aria-hidden
            style={{
              position: 'absolute',
              bottom: '10%',
              right: 'clamp(-12px, 2vw, 12px)',
              transform: 'rotate(5deg)',
              padding: '14px 18px',
              borderRadius: 12,
              background: 'var(--lime)',
              color: '#0A0A0A',
              boxShadow:
                '0 20px 50px rgba(212,255,58,0.20), 0 14px 36px rgba(0,0,0,0.45)',
              willChange: 'transform',
              minWidth: 140,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 9,
                letterSpacing: '0.22em',
                opacity: 0.65,
                marginBottom: 4,
              }}
            >
              AFTER
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display), Inter, sans-serif',
                fontSize: 26,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              11 / 11
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body), Inter, sans-serif',
                fontSize: 11,
                opacity: 0.78,
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              confirmed
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          BOTTOM — quiet cross-fading before/after stat strip
          ============================================================== */}
      <div className="grid-12" style={{ marginTop: 'clamp(4rem, 8vh, 7rem)' }}>
        <div
          ref={statsRef}
          className="col-span-12 xl:col-start-2 xl:col-span-10"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 'clamp(20px, 4vw, 60px)',
            borderTop: '1px solid rgba(245,245,240,0.08)',
            borderBottom: '1px solid rgba(245,245,240,0.08)',
            padding: '24px 0',
          }}
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,245,240,0.4)',
                  marginBottom: 8,
                }}
              >
                {s.label}
              </div>
              <div style={{ position: 'relative', minHeight: 26 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 17,
                    fontWeight: 600,
                    color: 'rgba(245,245,240,0.55)',
                    textDecoration: 'line-through',
                    textDecorationColor: 'rgba(245,245,240,0.25)',
                    opacity: flipped ? 0 : 1,
                    transition: 'opacity 600ms cubic-bezier(.22,.61,.36,1)',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                  }}
                  aria-hidden={flipped}
                >
                  {s.before}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 17,
                    fontWeight: 700,
                    color: 'var(--lime)',
                    opacity: flipped ? 1 : 0,
                    transition: 'opacity 600ms cubic-bezier(.22,.61,.36,1)',
                    whiteSpace: 'nowrap',
                  }}
                  aria-hidden={!flipped}
                >
                  {s.after}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
