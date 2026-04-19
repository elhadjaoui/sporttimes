'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on devices that have a fine pointer (real mouse)
    const m = window.matchMedia('(pointer: fine)');
    const update = () => setEnabled(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add('has-custom-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      // Dot snaps instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      // Ring follows with snappier easing
      rx += (mx - rx) * 0.45;
      ry += (my - ry) * 0.45;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hover state on interactive elements
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest('a, button, [data-cursor="hover"]');
      if (interactive) {
        ringRef.current?.classList.add('is-hover');
        dotRef.current?.classList.add('is-hover');
      } else {
        ringRef.current?.classList.remove('is-hover');
        dotRef.current?.classList.remove('is-hover');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring fixed left-0 top-0 z-[200] pointer-events-none w-8 h-8 rounded-full border border-lime/80 mix-blend-difference transition-[width,height,border-color,background] duration-200 ease-out"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-dot fixed left-0 top-0 z-[200] pointer-events-none w-1.5 h-1.5 rounded-full bg-lime"
      />
      <style jsx global>{`
        .has-custom-cursor,
        .has-custom-cursor body,
        .has-custom-cursor * {
          cursor: none !important;
        }
        .cursor-ring.is-hover,
        .cursor-3d-hover .cursor-ring {
          width: 56px;
          height: 56px;
          border-color: rgba(212, 255, 58, 0.95);
          background: rgba(212, 255, 58, 0.08);
        }
        .cursor-dot.is-hover,
        .cursor-3d-hover .cursor-dot {
          opacity: 0;
        }
      `}</style>
    </>
  );
}
