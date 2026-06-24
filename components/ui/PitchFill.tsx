'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// 4-3-3 formation positions on a 70×100 vertical pitch.
// All 11 slots get filled in this animation (CF included).
const POS433: ReadonlyArray<readonly [number, number]> = [
  [35, 92],                                  // GK
  [14, 72], [28, 72], [42, 72], [56, 72],    // DEF (LB → RB)
  [22, 48], [35, 48], [48, 48],              // MID (L → R)
  [18, 25], [52, 25],                        // FWD (LF, RF)
  [35, 18],                                  // CF
];

/**
 * PitchFill: the signature Hero animation. 0/11 → 11/11 with staggered slot fills.
 * Plays once, never loops. Fires on first of: scroll-into-view (threshold 0.3)
 * OR window.load + 400ms.
 * Reduced-motion: renders final filled-11/11 state instantly.
 *
 * Renders only on dark palette — assumes --accent is the lime ring color.
 */
export default function PitchFill() {
  const rootRef = useRef<SVGSVGElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const firedRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  // Set initial state on mount. Reduced-motion = final state.
  useEffect(() => {
    if (!rootRef.current) return;
    const slots = rootRef.current.querySelectorAll<SVGGElement>('.pf-slot');
    const counter = counterRef.current;

    if (reducedMotion) {
      slots.forEach((s) => {
        s.querySelector('.pf-empty')?.setAttribute('opacity', '0');
        s.querySelector('.pf-filled')?.setAttribute('opacity', '1');
        const dot = s.querySelector<SVGCircleElement>('.pf-dot');
        const ring = s.querySelector<SVGCircleElement>('.pf-ring');
        if (dot) dot.setAttribute('transform', 'scale(1)');
        if (ring) ring.setAttribute('transform', 'scale(1)');
      });
      if (counter) counter.textContent = '11 / 11';
      return;
    }

    // Initial: all empty visible, filled hidden, counter 0/11
    slots.forEach((s) => {
      s.querySelector('.pf-empty')?.setAttribute('opacity', '1');
      s.querySelector('.pf-filled')?.setAttribute('opacity', '0');
    });
    if (counter) counter.textContent = '0 / 11';
  }, [reducedMotion]);

  // Trigger logic — first of scroll-in or window.load + 400ms wins.
  useEffect(() => {
    if (reducedMotion) return;
    if (!rootRef.current) return;
    const el = rootRef.current;

    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      runAnimation();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) fire();
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    const loadFallback = () => {
      window.setTimeout(fire, 400);
    };
    if (document.readyState === 'complete') loadFallback();
    else window.addEventListener('load', loadFallback, { once: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('load', loadFallback);
    };
  }, [reducedMotion]);

  const runAnimation = () => {
    if (!rootRef.current) return;
    const slots = rootRef.current.querySelectorAll<SVGGElement>('.pf-slot');
    const counter = counterRef.current;
    const tl = gsap.timeline();

    slots.forEach((slot, i) => {
      const empty = slot.querySelector('.pf-empty');
      const filled = slot.querySelector('.pf-filled');
      const dot = slot.querySelector('.pf-dot');
      const ring = slot.querySelector('.pf-ring');
      const at = i * 0.23;
      if (empty) tl.to(empty, { opacity: 0.4, duration: 0.24, ease: 'power3.out' }, at);
      if (filled) tl.to(filled, { opacity: 1, duration: 0.24, ease: 'power3.out' }, at);
      // dot + ring are inside a <g transform="translate(x y)"> so cx/cy=0 — scale works from visual center.
      if (dot) tl.fromTo(dot, { scale: 0.6 }, { scale: 1, duration: 0.24, ease: 'power3.out' }, at);
      if (ring) tl.fromTo(ring, { scale: 0.6 }, { scale: 1, duration: 0.24, ease: 'power3.out' }, at);
      tl.call(() => {
        if (counter) counter.textContent = `${i + 1} / 11`;
      }, undefined, at + 0.1);
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <svg
        ref={rootRef}
        viewBox="0 0 70 100"
        style={{ width: '100%', height: 'auto', color: 'var(--chalk)' }}
        aria-hidden
      >
        {/* Pitch markings */}
        <g style={{ color: 'var(--chalk)' }}>
          <rect x="0" y="0" width="70" height="100" fill="none" stroke="currentColor" strokeWidth="0.4" />
          <line x1="0" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="35" cy="50" r="9" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <rect x="15" y="0" width="40" height="14" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <rect x="24" y="0" width="22" height="6" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M 29 14 A 6 6 0 0 0 41 14" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <rect x="15" y="86" width="40" height="14" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <rect x="24" y="94" width="22" height="6" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M 29 86 A 6 6 0 0 1 41 86" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </g>
        {/* Slots — each wrapped in a translate <g> so the dot/ring can
            be scaled from (0,0) which is the visual center. SVG `transform`
            from-center is unreliable across browsers when scaling cx/cy
            geometry directly; this pattern works on Safari + Firefox. */}
        {POS433.map(([x, y], i) => (
          <g key={i} className="pf-slot" transform={`translate(${x} ${y})`}>
            <circle
              className="pf-empty"
              cx="0"
              cy="0"
              r="1.6"
              fill="none"
              stroke="var(--chalk)"
              strokeWidth="0.25"
              strokeDasharray="0.6 0.6"
            />
            <g className="pf-filled" opacity="0">
              <circle
                className="pf-ring"
                cx="0"
                cy="0"
                r="2.0"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="0.35"
              />
              <circle
                className="pf-dot"
                cx="0"
                cy="0"
                r="1.6"
                fill="var(--surface-2)"
              />
            </g>
          </g>
        ))}
      </svg>
      {/* Counter */}
      <div
        style={{
          marginTop: 16,
          fontFamily: 'var(--font-mono), Space Mono, monospace',
          fontSize: 13,
          letterSpacing: '0.18em',
          color: 'var(--text-dim)',
          textAlign: 'center',
        }}
      >
        <span ref={counterRef}>0 / 11</span>
      </div>
    </div>
  );
}
