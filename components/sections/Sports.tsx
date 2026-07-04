'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MdOutlineSportsSoccer,
  MdOutlineSportsBasketball,
  MdOutlineSportsVolleyball,
  MdOutlineSportsHandball,
  MdOutlineSportsTennis,
  MdOutlineSportsRugby,
} from 'react-icons/md';
import type { IconType } from 'react-icons';

// ===================================================================
//  Sports — ONE engine, football first, then every team sport.
//
//  Layout: 2-column on desktop — copy on the left, engine constellation
//  on the right. This avoids the constellation overlapping the sub copy
//  when both compete for the same vertical space.
//
//  Background: section is transparent. The global AmbientLayer paints
//  via its "sports" palette and tweens smoothly between sections, so
//  every section seam is a single soft ambient tween, not a stack of
//  per-section paints meeting at a hard line.
//
//  Three scrubbed beats:
//   1. Football only — core + football node on a lime spoke.
//   2. Expand — spokes draw outward, other sports populate, headline
//      crossfades to "Engineered for every team sport."
//   3. Engine in action — per-sport format chips reveal, flowing data
//      dashes start traveling along every spoke, lime pulses run
//      outward from the core, engine spec caption appears.
//
//  ALL motion is GSAP — no CSS transitions / @keyframes.
// ===================================================================

const INK = '#F5F5F0';
const DIM = 'rgba(245, 245, 240, 0.62)';
const HAIRLINE = 'rgba(245, 245, 240, 0.10)';
const LIME = '#D4FF3A';

type Sport = {
  id: string;
  name: string;
  formats: string;
  Icon: IconType;
};

// Material Design Outlined sports icons — consistent single-stroke
// style, library-quality. Padel uses the tennis icon (racquet sport
// family); Futsal uses the soccer icon (it IS indoor football).
const SPORTS: Sport[] = [
  { id: 'football',   name: 'Football',   formats: '5v5 · 7v7 · 9v9 · 11v11', Icon: MdOutlineSportsSoccer     },
  { id: 'basketball', name: 'Basketball', formats: '3v3 · 5v5',               Icon: MdOutlineSportsBasketball },
  { id: 'volleyball', name: 'Volleyball', formats: '4v4 · 6v6',               Icon: MdOutlineSportsVolleyball },
  { id: 'handball',   name: 'Handball',   formats: '7v7',                     Icon: MdOutlineSportsHandball   },
  { id: 'padel',      name: 'Padel',      formats: '2v2',                     Icon: MdOutlineSportsTennis     },
  { id: 'futsal',     name: 'Futsal',     formats: '5v5',                     Icon: MdOutlineSportsSoccer     },
  { id: 'rugby',      name: 'Rugby',      formats: '7s · 15s',                Icon: MdOutlineSportsRugby      },
];

// Polar layout in SVG-px on a 600 viewBox. Football at 12 o'clock.
const RADIUS = 240;
const NODE_POSITIONS = SPORTS.map((_, i) => {
  const angle = -90 + i * (360 / SPORTS.length);
  const rad = (angle * Math.PI) / 180;
  return {
    angle,
    x: Math.cos(rad) * RADIUS,
    y: Math.sin(rad) * RADIUS,
  };
});

const HEADLINES = ['Built for football.', 'Engineered for every team sport.'];
const ENGINE_SPEC = ['lineup builder', 'scheduling', 'check-in', 'real-time sync'];

// ===================================================================
//  Component
// ===================================================================

export default function Sports() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const formatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spokeRefs = useRef<(SVGLineElement | null)[]>([]);
  const pulseLineRefs = useRef<(SVGLineElement | null)[]>([]);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  const coreRef = useRef<HTMLDivElement>(null);
  const coreGlowRef = useRef<HTMLDivElement>(null);
  const engineSpecRef = useRef<HTMLDivElement>(null);
  const headlineRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mb = window.matchMedia('(max-width: 879px)');
    const updRm = () => setReducedMotion(rm.matches);
    const updMb = () => setIsMobile(mb.matches);
    updRm(); updMb();
    rm.addEventListener('change', updRm);
    mb.addEventListener('change', updMb);
    return () => {
      rm.removeEventListener('change', updRm);
      mb.removeEventListener('change', updMb);
    };
  }, []);

  // -------------------- Desktop: pinned scrubbed timeline --------------------
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const stage = stageRef.current;
    if (!stage) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      spokeRefs.current.forEach((line, i) => {
        if (!line) return;
        const isFootball = i === 0;
        gsap.set(line, {
          attr: { 'stroke-dashoffset': isFootball ? 0 : 1 },
          opacity: isFootball ? 0.95 : 0.5,
        });
      });
      pulseLineRefs.current.forEach((line) => {
        if (line) gsap.set(line, { opacity: 0 });
      });
      nodeRefs.current.forEach((node, i) => {
        if (!node) return;
        gsap.set(node, {
          scale: i === 0 ? 1 : 0,
          opacity: i === 0 ? 1 : 0,
        });
      });
      formatRefs.current.forEach((fmt, i) => {
        if (!fmt) return;
        gsap.set(fmt, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 4 });
      });
      pulseRefs.current.forEach((p) => {
        if (p) gsap.set(p, { opacity: 0 });
      });
      if (engineSpecRef.current) {
        gsap.set(engineSpecRef.current, { opacity: 0, y: 6 });
      }
      if (headlineRefs.current[0]) {
        gsap.set(headlineRefs.current[0], { opacity: 1, y: 0 });
      }
      if (headlineRefs.current[1]) {
        gsap.set(headlineRefs.current[1], { opacity: 0, y: 10 });
      }

      if (coreGlowRef.current) {
        gsap.to(coreGlowRef.current, {
          scale: 1.08,
          opacity: 1,
          duration: 2.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      // Flowing dashes on the spokes
      const pulseLineTweens: gsap.core.Tween[] = [];
      pulseLineRefs.current.forEach((line) => {
        if (!line) return;
        const tw = gsap.to(line, {
          attr: { 'stroke-dashoffset': -22 },
          duration: 1.6,
          ease: 'none',
          repeat: -1,
        });
        pulseLineTweens.push(tw);
      });

      // Traveling pulse dots
      const pulseTweens: gsap.core.Tween[] = [];
      pulseRefs.current.forEach((pulse, i) => {
        if (!pulse) return;
        const p = NODE_POSITIONS[i];
        gsap.set(pulse, { attr: { cx: 300, cy: 300 } });
        const tw = gsap.to(pulse, {
          attr: { cx: 300 + p.x, cy: 300 + p.y },
          duration: 2.2,
          ease: 'power1.inOut',
          repeat: -1,
          delay: 0.16 * i,
        });
        pulseTweens.push(tw);
      });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=2400',
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      const B1 = 0.32;
      const B2 = 0.66;

      tl.to(
        spokeRefs.current.slice(1).filter(Boolean) as SVGLineElement[],
        {
          attr: { 'stroke-dashoffset': 0 },
          duration: 0.18,
          stagger: 0.018,
          ease: 'power2.out',
        },
        B1 - 0.04
      );
      tl.to(
        nodeRefs.current.slice(1).filter(Boolean) as HTMLDivElement[],
        {
          scale: 1,
          opacity: 1,
          duration: 0.18,
          stagger: 0.022,
          ease: 'back.out(1.6)',
        },
        B1
      );
      tl.to(headlineRefs.current[0]!, { opacity: 0, y: -8, duration: 0.06 }, B1 - 0.02);
      tl.to(headlineRefs.current[1]!, { opacity: 1, y: 0, duration: 0.06 }, B1 + 0.02);

      tl.to(
        formatRefs.current.slice(1).filter(Boolean) as HTMLDivElement[],
        { opacity: 1, y: 0, duration: 0.12, stagger: 0.02, ease: 'power2.out' },
        B2
      );
      tl.to(
        pulseLineRefs.current.filter(Boolean) as SVGLineElement[],
        { opacity: 1, duration: 0.18, stagger: 0.015 },
        B2 + 0.01
      );
      tl.to(
        pulseRefs.current.filter(Boolean) as SVGCircleElement[],
        { opacity: 1, duration: 0.15, stagger: 0.02 },
        B2 + 0.02
      );
      if (engineSpecRef.current) {
        tl.to(
          engineSpecRef.current,
          { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' },
          B2 + 0.04
        );
      }

      ScrollTrigger.create({
        trigger: stage,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => {
          pulseTweens.forEach((t) => t.play());
          pulseLineTweens.forEach((t) => t.play());
        },
        onLeave: () => {
          pulseTweens.forEach((t) => t.pause());
          pulseLineTweens.forEach((t) => t.pause());
        },
        onEnterBack: () => {
          pulseTweens.forEach((t) => t.play());
          pulseLineTweens.forEach((t) => t.play());
        },
        onLeaveBack: () => {
          pulseTweens.forEach((t) => t.pause());
          pulseLineTweens.forEach((t) => t.pause());
        },
      });

      nodeRefs.current.forEach((node) => {
        if (!node) return;
        const ring = node.querySelector('.sports-node-ring') as HTMLElement | null;
        const onEnter = () => {
          gsap.to(node, { scale: 1.06, duration: 0.28, ease: 'power3.out' });
          if (ring) gsap.to(ring, { opacity: 1, duration: 0.28, ease: 'power3.out' });
        };
        const onLeave = () => {
          gsap.to(node, { scale: 1, duration: 0.35, ease: 'power3.out' });
          if (ring) gsap.to(ring, { opacity: 0, duration: 0.35, ease: 'power3.out' });
        };
        node.addEventListener('pointerenter', onEnter);
        node.addEventListener('pointerleave', onLeave);
        (node as HTMLDivElement & { _cleanup?: () => void })._cleanup = () => {
          node.removeEventListener('pointerenter', onEnter);
          node.removeEventListener('pointerleave', onLeave);
        };
      });
    }, stage);

    return () => {
      nodeRefs.current.forEach((n) => {
        const wn = n as (HTMLDivElement & { _cleanup?: () => void }) | null;
        if (wn?._cleanup) wn._cleanup();
      });
      ctx.revert();
    };
  }, [reducedMotion, isMobile]);

  if (isMobile) return <MobileSports />;
  if (reducedMotion) return <StaticConstellation />;

  return (
    <section
      ref={sectionRef}
      id="sports"
      data-progress-section
      data-progress-label="The Sports"
      data-palette="sports"
      className="relative"
      style={{ background: 'transparent', overflow: 'visible' }}
    >
      <div ref={stageRef} className="sports-stage">
        <div className="sports-stage-grid">
          {/* LEFT — copy + engine spec */}
          <div className="sports-copy">
            <div className="sports-eyebrow">one engine</div>
            <div className="sports-headlines">
              {HEADLINES.map((h, i) => (
                <h2
                  key={h}
                  ref={(el) => {
                    headlineRefs.current[i] = el;
                  }}
                  className="sports-headline"
                >
                  {h}
                </h2>
              ))}
            </div>
            <p className="sports-sub">
              From a five-a-side futsal to an 11v11 league. One engine adapts
              to every team sport.
            </p>
            <div ref={engineSpecRef} className="sports-spec" aria-hidden>
              <span className="sports-spec-label">engine</span>
              <div className="sports-spec-list">
                {ENGINE_SPEC.map((s) => (
                  <span key={s} className="sports-spec-item">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — constellation */}
          <div className="sports-constellation">
            <div className="sports-stack">
              <svg viewBox="0 0 600 600" className="sports-spokes" aria-hidden>
                <circle
                  cx="300" cy="300" r={RADIUS - 10}
                  fill="none" stroke={INK} strokeOpacity="0.05"
                  strokeWidth="1" strokeDasharray="2 6"
                />
                {/* Base spokes */}
                {NODE_POSITIONS.map((p, i) => (
                  <line
                    key={`l${i}`}
                    ref={(el) => {
                      spokeRefs.current[i] = el;
                    }}
                    x1="300" y1="300"
                    x2={300 + p.x} y2={300 + p.y}
                    stroke={i === 0 ? LIME : INK}
                    strokeOpacity={i === 0 ? 1 : 0.18}
                    strokeWidth={i === 0 ? 1.6 : 1}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1}
                  />
                ))}
                {/* Flowing-dash overlay lines */}
                {NODE_POSITIONS.map((p, i) => (
                  <line
                    key={`pl${i}`}
                    ref={(el) => {
                      pulseLineRefs.current[i] = el;
                    }}
                    x1="300" y1="300"
                    x2={300 + p.x} y2={300 + p.y}
                    stroke={LIME}
                    strokeOpacity={i === 0 ? 0.9 : 0.55}
                    strokeWidth={i === 0 ? 1.6 : 1.1}
                    strokeLinecap="round"
                    strokeDasharray="3 19"
                    strokeDashoffset={0}
                  />
                ))}
                {/* Traveling pulse dots */}
                {NODE_POSITIONS.map((_, i) => (
                  <circle
                    key={`p${i}`}
                    ref={(el) => {
                      pulseRefs.current[i] = el;
                    }}
                    cx="300" cy="300"
                    r={i === 0 ? 4 : 3}
                    fill={LIME}
                    opacity="0"
                  />
                ))}
              </svg>

              {SPORTS.map((sport, i) => {
                const p = NODE_POSITIONS[i];
                const isFootball = i === 0;
                const Icon = sport.Icon;
                return (
                  <div
                    key={sport.id}
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    className={`sports-node ${isFootball ? 'sports-node-accent' : ''}`}
                    style={{
                      left: `calc(50% + ${(p.x / 600) * 100}%)`,
                      top: `calc(50% + ${(p.y / 600) * 100}%)`,
                    }}
                  >
                    <div className="sports-node-inner">
                      <div className="sports-node-chip">
                        <span aria-hidden className="sports-node-ring" />
                        <Icon size={34} aria-hidden />
                      </div>
                      <div className="sports-node-label">{sport.name}</div>
                      <div
                        ref={(el) => {
                          formatRefs.current[i] = el;
                        }}
                        className="sports-node-format"
                      >
                        {sport.formats}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Core */}
              <div ref={coreRef} className="sports-core">
                <div ref={coreGlowRef} aria-hidden className="sports-core-glow" />
                <div className="sports-core-disc">
                  <Image
                    src="/screens/logo.png"
                    alt="SportTimes"
                    width={150}
                    height={150}
                    priority
                    className="sports-core-logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sports-stage {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: visible;
          color: ${INK};
          isolation: isolate;
        }
        .sports-stage-grid {
          position: relative;
          z-index: 3;
          height: 100%;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: clamp(24px, 4vh, 56px) clamp(20px, 4vw, 56px);
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          align-items: center;
          gap: clamp(28px, 4vw, 80px);
        }
        .sports-copy {
          display: flex;
          flex-direction: column;
          gap: clamp(16px, 2.5vh, 28px);
          max-width: 560px;
        }
        .sports-eyebrow {
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: ${DIM};
        }
        /* Headlines — reserve enough px-based vertical space for the
           2-line "Engineered for every team sport." variant. */
        .sports-headlines {
          position: relative;
          width: 100%;
          height: clamp(130px, 11vw, 180px);
        }
        .sports-headline {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          margin: 0;
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 900;
          font-size: clamp(2.25rem, 4.4vw, 3.6rem);
          line-height: 1.04;
          letter-spacing: -0.035em;
          color: ${INK};
        }
        .sports-sub {
          font-family: var(--font-body), Inter, sans-serif;
          font-size: 16px;
          line-height: 1.55;
          color: ${DIM};
          margin: 0;
          max-width: 48ch;
        }
        .sports-spec {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }
        .sports-spec-label {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: ${LIME};
          opacity: 0.85;
        }
        .sports-spec-list {
          display: inline-flex;
          gap: 6px 8px;
          flex-wrap: wrap;
          max-width: 380px;
        }
        .sports-spec-item {
          font-family: var(--font-mono), monospace;
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${INK};
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid ${HAIRLINE};
          background: rgba(245, 245, 240, 0.04);
        }

        .sports-constellation {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sports-stack {
          position: relative;
          width: min(680px, 70vmin);
          height: min(680px, 70vmin);
          max-height: 86vh;
          aspect-ratio: 1 / 1;
        }
        .sports-spokes {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .sports-node {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
          z-index: 3;
        }
        .sports-node-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .sports-node-chip {
          position: relative;
          width: 66px;
          height: 66px;
          border-radius: 999px;
          background: rgba(245, 245, 240, 0.04);
          border: 1px solid ${HAIRLINE};
          box-shadow:
            0 8px 22px rgba(0, 0, 0, 0.5),
            inset 0 0 0 1px rgba(245, 245, 240, 0.02);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(245, 245, 240, 0.92);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .sports-node-accent .sports-node-chip {
          background: ${LIME};
          border-color: rgba(212, 255, 58, 0.6);
          color: #0A0A0A;
          box-shadow:
            0 12px 32px rgba(212, 255, 58, 0.35),
            0 6px 16px rgba(0, 0, 0, 0.5);
        }
        .sports-node-ring {
          position: absolute;
          inset: -8px;
          border-radius: 999px;
          border: 1px solid ${LIME};
          opacity: 0;
          pointer-events: none;
        }
        .sports-node-label {
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.01em;
          color: ${INK};
          white-space: nowrap;
        }
        .sports-node-format {
          font-family: var(--font-mono), monospace;
          font-size: 10.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${DIM};
          white-space: nowrap;
        }

        .sports-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
          width: 220px;
          height: 220px;
        }
        .sports-core-glow {
          position: absolute;
          inset: -20px;
          border-radius: 999px;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(212, 255, 58, 0.55) 0%,
            rgba(212, 255, 58, 0.18) 40%,
            transparent 70%
          );
          filter: blur(34px);
          opacity: 0.7;
          z-index: -1;
          pointer-events: none;
        }
        .sports-core-disc {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 999px;
          background: #08090A;
          border: 2px solid ${LIME};
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow:
            0 0 0 8px rgba(212, 255, 58, 0.08),
            0 24px 60px rgba(0, 0, 0, 0.6);
        }
        .sports-core-disc :global(.sports-core-logo) {
          width: 150px;
          height: 150px;
          object-fit: contain;
          display: block;
        }

        @media (max-width: 1100px) {
          .sports-stage-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .sports-headline { font-size: clamp(1.8rem, 3.6vw, 2.6rem); }
          .sports-stack { width: min(560px, 64vmin); height: min(560px, 64vmin); }
          .sports-node-chip { width: 56px; height: 56px; }
          .sports-core { width: 170px; height: 170px; }
          .sports-core-disc :global(.sports-core-logo) { width: 115px; height: 115px; }
        }
      `}</style>
    </section>
  );
}

// ===================================================================
//  Mobile fallback — no pin, no infinite tweens. Static constellation.
// ===================================================================
function MobileSports() {
  const radius = 138;
  return (
    <section
      id="sports"
      data-progress-section
      data-progress-label="The Sports"
      data-palette="sports"
      className="relative"
      style={{
        background: 'transparent',
        color: INK,
        padding: 'clamp(4rem, 10vh, 7rem) 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 20px',
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 11,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: DIM,
          }}
        >
          one engine
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display), Inter, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 6vw, 2.4rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
            margin: 0,
            color: INK,
            maxWidth: '16ch',
          }}
        >
          Built for football. Engineered for every team sport.
        </h2>
        <div
          style={{
            position: 'relative',
            width: radius * 2 + 110,
            height: radius * 2 + 110,
            marginTop: 8,
          }}
        >
          <svg
            viewBox={`0 0 ${radius * 2 + 110} ${radius * 2 + 110}`}
            style={{ position: 'absolute', inset: 0 }}
            aria-hidden
          >
            {SPORTS.map((_, i) => {
              const angle = -90 + i * (360 / SPORTS.length);
              const rad = (angle * Math.PI) / 180;
              const cx = radius + 55;
              const cy = radius + 55;
              return (
                <line
                  key={i}
                  x1={cx} y1={cy}
                  x2={cx + Math.cos(rad) * radius}
                  y2={cy + Math.sin(rad) * radius}
                  stroke={i === 0 ? LIME : INK}
                  strokeOpacity={i === 0 ? 1 : 0.18}
                  strokeWidth={i === 0 ? 1.4 : 1}
                />
              );
            })}
          </svg>
          {SPORTS.map((sport, i) => {
            const angle = -90 + i * (360 / SPORTS.length);
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const Icon = sport.Icon;
            const isFootball = i === 0;
            return (
              <div
                key={sport.id}
                style={{
                  position: 'absolute',
                  top: `calc(50% + ${y}px)`,
                  left: `calc(50% + ${x}px)`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 999,
                    background: isFootball ? LIME : 'rgba(245,245,240,0.04)',
                    border: `1px solid ${isFootball ? 'rgba(212,255,58,0.6)' : HAIRLINE}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isFootball ? '#0A0A0A' : INK,
                  }}
                >
                  <Icon size={28} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-display), Inter, sans-serif',
                    fontWeight: 800,
                    fontSize: 12,
                    color: INK,
                  }}
                >
                  {sport.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: DIM,
                  }}
                >
                  {sport.formats}
                </span>
              </div>
            );
          })}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 124,
              height: 124,
              borderRadius: 999,
              background: '#08090A',
              border: `2px solid ${LIME}`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 6px rgba(212,255,58,0.10)',
            }}
          >
            <Image
              src="/screens/logo.png"
              alt="SportTimes"
              width={90}
              height={90}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
        <div
          style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 6,
            maxWidth: 320,
            marginTop: 6,
          }}
        >
          {ENGINE_SPEC.map((s) => (
            <span
              key={s}
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: INK,
                padding: '4px 10px',
                borderRadius: 999,
                border: `1px solid ${HAIRLINE}`,
                background: 'rgba(245,245,240,0.04)',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===================================================================
//  Reduced-motion fallback — full expanded constellation, no motion.
// ===================================================================
function StaticConstellation() {
  return (
    <section
      id="sports"
      data-progress-section
      data-progress-label="The Sports"
      data-palette="sports"
      className="relative"
      style={{
        background: 'transparent',
        color: INK,
        padding: 'clamp(6rem, 14vh, 10rem) 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '0.85fr 1.15fr',
          alignItems: 'center',
          gap: 64,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: DIM,
            }}
          >
            one engine
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display), Inter, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.035em',
              margin: 0,
              color: INK,
              maxWidth: '18ch',
            }}
          >
            Built for football. Engineered for every team sport.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body), Inter, sans-serif',
              fontSize: 16,
              lineHeight: 1.55,
              color: DIM,
              margin: 0,
              maxWidth: '46ch',
            }}
          >
            From a five-a-side futsal to an 11v11 league. One engine adapts
            to every team sport.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: LIME,
                opacity: 0.85,
              }}
            >
              engine
            </span>
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px 8px' }}>
              {ENGINE_SPEC.map((s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 10.5,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: INK,
                    padding: '4px 10px',
                    borderRadius: 999,
                    border: `1px solid ${HAIRLINE}`,
                    background: 'rgba(245,245,240,0.04)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', aspectRatio: '1/1', width: '100%', maxWidth: 560 }}>
          <svg viewBox="0 0 600 600" style={{ position: 'absolute', inset: 0 }} aria-hidden>
            <circle
              cx="300" cy="300" r={RADIUS - 10}
              fill="none" stroke={INK} strokeOpacity="0.05"
              strokeWidth="1" strokeDasharray="2 6"
            />
            {NODE_POSITIONS.map((p, i) => (
              <line
                key={i}
                x1="300" y1="300"
                x2={300 + p.x} y2={300 + p.y}
                stroke={i === 0 ? LIME : INK}
                strokeOpacity={i === 0 ? 1 : 0.2}
                strokeWidth={i === 0 ? 1.6 : 1}
              />
            ))}
          </svg>
          {SPORTS.map((sport, i) => {
            const p = NODE_POSITIONS[i];
            const Icon = sport.Icon;
            const isFootball = i === 0;
            return (
              <div
                key={sport.id}
                style={{
                  position: 'absolute',
                  top: `calc(50% + ${(p.y / 600) * 100}%)`,
                  left: `calc(50% + ${(p.x / 600) * 100}%)`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 999,
                    background: isFootball ? LIME : 'rgba(245,245,240,0.04)',
                    border: `1px solid ${isFootball ? 'rgba(212,255,58,0.6)' : HAIRLINE}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isFootball ? '#0A0A0A' : INK,
                  }}
                >
                  <Icon size={32} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-display), Inter, sans-serif',
                    fontWeight: 800,
                    fontSize: 13,
                    color: INK,
                  }}
                >
                  {sport.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: DIM,
                  }}
                >
                  {sport.formats}
                </span>
              </div>
            );
          })}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 190,
              height: 190,
              borderRadius: 999,
              background: '#08090A',
              border: `2px solid ${LIME}`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 8px rgba(212,255,58,0.10)',
            }}
          >
            <Image
              src="/screens/logo.png"
              alt="SportTimes"
              width={130}
              height={130}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
