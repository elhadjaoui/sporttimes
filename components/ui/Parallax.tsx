'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Vertical multiplier vs. scroll. 0.2..0.4 typical. Default 0.25. */
  y?: number;
  /** className passthrough on the wrapper. */
  className?: string;
};

/**
 * Parallax: translates children on vertical scroll. Mobile uses half the y.
 * Static under prefers-reduced-motion (no transform, no rAF loop).
 */
export default function Parallax({ children, y = 0.25, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const yMul = isMobile ? y * 0.5 : y;

    let raf = 0;
    let lastScroll = -1;
    const tick = () => {
      const root = rootRef.current;
      const child = childRef.current;
      if (root && child) {
        const rect = root.getBoundingClientRect();
        // Distance scrolled past the section top, clamped to section height
        const scrolled = -rect.top;
        if (scrolled !== lastScroll) {
          lastScroll = scrolled;
          child.style.transform = `translate3d(0, ${(scrolled * yMul).toFixed(2)}px, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [y]);

  return (
    <div ref={rootRef} className={className}>
      <div ref={childRef} style={{ willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
}
