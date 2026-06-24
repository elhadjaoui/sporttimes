'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Per-child stagger in ms when wrapping multiple direct children. Default 0 (no stagger). */
  stagger?: number;
  /** IntersectionObserver threshold. Default 0.15. */
  threshold?: number;
  /** Extra delay before this Reveal fires, in ms. */
  delay?: number;
  /** className passthrough on the wrapper. */
  className?: string;
};

/**
 * Reveal: opacity 0→1 + translateY(14px→0) once, when scrolled into view.
 * Observer disconnects after first fire.
 * Renders final state instantly under prefers-reduced-motion.
 */
export default function Reveal({
  children,
  stagger = 0,
  threshold = 0.15,
  delay = 0,
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, threshold]);

  // No stagger path — single transition on the wrapper.
  if (stagger === 0) {
    const style: CSSProperties = reducedMotion
      ? {}
      : {
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(14px)',
          transition: `opacity 320ms cubic-bezier(.22,.61,.36,1) ${delay}ms, transform 320ms cubic-bezier(.22,.61,.36,1) ${delay}ms`,
          willChange: 'opacity, transform',
        };
    return (
      <div ref={rootRef} className={className} style={style}>
        {children}
      </div>
    );
  }

  // Stagger path — wrap each direct child in a sibling div with computed delay.
  const childArray = Array.isArray(children) ? children : [children];
  return (
    <div ref={rootRef} className={className}>
      {childArray.map((child, i) => {
        const childDelay = delay + i * stagger;
        const style: CSSProperties = reducedMotion
          ? {}
          : {
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(14px)',
              transition: `opacity 320ms cubic-bezier(.22,.61,.36,1) ${childDelay}ms, transform 320ms cubic-bezier(.22,.61,.36,1) ${childDelay}ms`,
              willChange: 'opacity, transform',
            };
        return (
          <div key={i} style={style}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
