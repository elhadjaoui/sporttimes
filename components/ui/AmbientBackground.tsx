'use client';

import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Animated ambient backdrop — drifting blurry blobs + floating particles
 * with a subtle scroll-driven parallax. Stays behind section content at
 * low z-index. Every section gets one with its own accent color, so the
 * whole page never falls into pure-black monotony.
 */
export default function AmbientBackground({
  tone = 'lime',
  density = 1,
}: {
  tone?: 'lime' | 'red' | 'cyan' | 'orange';
  density?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Palette per tone
  const palette = useMemo(() => {
    switch (tone) {
      case 'red':
        return {
          a: 'rgba(220, 70, 70, 0.20)',
          b: 'rgba(139, 30, 30, 0.14)',
          c: 'rgba(212, 255, 58, 0.05)',
          particle: 'rgba(245, 245, 240, 0.55)',
          cursor: 'rgba(230, 90, 90, 0.32)',
        };
      case 'cyan':
        return {
          a: 'rgba(0, 229, 255, 0.16)',
          b: 'rgba(0, 120, 200, 0.12)',
          c: 'rgba(212, 255, 58, 0.04)',
          particle: 'rgba(200, 240, 255, 0.55)',
          cursor: 'rgba(0, 229, 255, 0.28)',
        };
      case 'orange':
        return {
          a: 'rgba(255, 107, 26, 0.20)',
          b: 'rgba(160, 50, 10, 0.14)',
          c: 'rgba(212, 255, 58, 0.05)',
          particle: 'rgba(255, 220, 180, 0.55)',
          cursor: 'rgba(255, 130, 40, 0.3)',
        };
      case 'lime':
      default:
        return {
          a: 'rgba(212, 255, 58, 0.20)',
          b: 'rgba(100, 150, 30, 0.12)',
          c: 'rgba(212, 255, 58, 0.08)',
          particle: 'rgba(212, 255, 58, 0.6)',
          cursor: 'rgba(212, 255, 58, 0.35)',
        };
    }
  }, [tone]);

  // Particle positions (stable across renders via useMemo)
  const particles = useMemo(
    () =>
      Array.from({ length: Math.round(28 * density) }).map((_, i) => {
        const seed = i * 13.37;
        const r1 = Math.abs(Math.sin(seed) * 43758.5453) % 1;
        const r2 = Math.abs(Math.sin(seed * 2.3) * 43758.5453) % 1;
        const r3 = Math.abs(Math.sin(seed * 0.7) * 43758.5453) % 1;
        return {
          left: r1 * 100,
          top: r2 * 100,
          size: 1 + r3 * 2.5,
          opacity: 0.15 + r1 * 0.4,
          duration: 14 + r3 * 16,
          delay: -r2 * 20,
          driftX: (r1 - 0.5) * 80,
          driftY: (r2 - 0.5) * 60,
        };
      }),
    [density]
  );

  // Scroll parallax — only the ambient particle layer drifts now
  useEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const pts = rootRef.current!.querySelectorAll<HTMLElement>('.amb-particle');
      if (pts.length) {
        gsap.to(pts, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Cursor-follow blob — smooth lagged easing toward mouse position
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = rootRef.current;
    if (!root) return;

    // Skip on touch-only devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const blob = root.querySelector<HTMLDivElement>('.amb-cursor-blob');
    if (!blob) return;

    const BLOB_HALF = 300; // half of the blob's width/height
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let initialised = false;
    let raf = 0;

    const updateTarget = (clientX: number, clientY: number) => {
      const rect = root.getBoundingClientRect();
      target.x = clientX - rect.left;
      target.y = clientY - rect.top;
      if (!initialised) {
        // Jump to target on first move so the blob doesn't visibly slide
        // in from (0, 0)
        pos.x = target.x;
        pos.y = target.y;
        initialised = true;
      }
    };

    const onMove = (e: MouseEvent) => {
      updateTarget(e.clientX, e.clientY);
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.045;
      pos.y += (target.y - pos.y) * 0.045;
      blob.style.transform = `translate3d(${pos.x - BLOB_HALF}px, ${pos.y - BLOB_HALF}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Cursor-follow blob — the ONLY big glow. Static drifting blobs
          were creating permanently-tinted zones that read as "creepy";
          removed in favor of a single mouse-driven spotlight. */}
      <div
        className="amb-cursor-blob absolute"
        style={{
          left: 0,
          top: 0,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${palette.cursor} 0%, transparent 62%)`,
          filter: 'blur(90px)',
          mixBlendMode: 'screen',
          willChange: 'transform',
          transform: 'translate3d(-9999px, -9999px, 0)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="amb-particle absolute block rounded-full"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: palette.particle,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 4}px ${palette.particle}`,
              animation: `ambParticleFloat ${p.duration}s ease-in-out infinite alternate`,
              animationDelay: `${p.delay}s`,
              '--pdx': `${p.driftX}px`,
              '--pdy': `${p.driftY}px`,
            } as React.CSSProperties
          }
        />
      ))}

      <style jsx global>{`
        @keyframes ambDrift1 {
          0%   { transform: translate3d(0, 0, 0) scale(1); opacity: 0.9; }
          100% { transform: translate3d(60px, 40px, 0) scale(1.15); opacity: 1; }
        }
        @keyframes ambDrift2 {
          0%   { transform: translate3d(0, 0, 0) scale(1); opacity: 0.8; }
          100% { transform: translate3d(-60px, -40px, 0) scale(1.2); opacity: 1; }
        }
        @keyframes ambDrift3 {
          0%   { transform: translate3d(0, 0, 0) scale(0.9); opacity: 0.7; }
          100% { transform: translate3d(-40px, 50px, 0) scale(1.1); opacity: 0.95; }
        }
        @keyframes ambParticleFloat {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(var(--pdx), var(--pdy), 0); }
        }
      `}</style>
    </div>
  );
}
