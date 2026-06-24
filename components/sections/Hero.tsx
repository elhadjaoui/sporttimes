'use client';

import dynamic from 'next/dynamic';
import PitchGrid from '@/components/ui/PitchGrid';
import Reveal from '@/components/ui/Reveal';
import { getLenis } from '@/hooks/useLenis';

const PitchFill = dynamic(() => import('@/components/ui/PitchFill'), { ssr: false });

export default function Hero() {
  const scrollToConnect = () => {
    const target = document.getElementById('stay-connected');
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="top"
      data-palette="dark"
      style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}
    >
      <PitchGrid parallax={0.25} />

      <div
        className="grid-12"
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          alignItems: 'center',
          paddingTop: 'clamp(7rem, 14vh, 10rem)',
          paddingBottom: 'clamp(3rem, 8vh, 6rem)',
        }}
      >
        <Reveal
          className="hero-text"
          stagger={80}
        >
          <div className="mono-eyebrow" style={{ marginBottom: 28 }}>
            [ launching this summer · ben guerir ]
          </div>
          <h1
            className="headline-display"
            style={{
              fontSize: 'clamp(40px, 7vw, 76px)',
              marginBottom: 28,
              color: 'var(--text)',
            }}
          >
            The match before the match.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 17,
              lineHeight: 1.55,
              color: 'var(--text-dim)',
              maxWidth: '42ch',
              marginBottom: 36,
            }}
          >
            Every game is won before kickoff. The app that turns group-chat
            chaos into a confirmed 11-a-side.
          </p>
          <button
            type="button"
            onClick={scrollToConnect}
            style={{
              background: 'var(--accent)',
              color: '#0B0D10',
              border: 'none',
              borderRadius: 100,
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: 15,
              padding: '14px 24px',
              minHeight: 44,
              cursor: 'pointer',
              transition: 'transform 200ms cubic-bezier(.22,.61,.36,1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Get notified →
          </button>
        </Reveal>

        <div
          className="hero-art"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PitchFill />
        </div>
      </div>

      <style jsx>{`
        .hero-text {
          grid-column: span 12;
          order: 2;
        }
        .hero-art {
          grid-column: span 12;
          order: 1;
          margin-bottom: 32px;
        }
        @media (min-width: 1024px) {
          .hero-text {
            grid-column: 1 / span 6;
            order: 1;
          }
          .hero-art {
            grid-column: 7 / span 6;
            order: 2;
            margin-bottom: 0;
          }
        }
      `}</style>
    </section>
  );
}
