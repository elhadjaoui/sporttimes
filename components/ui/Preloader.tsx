'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { getLenis } from '@/hooks/useLenis';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Lock scroll while preloader is up
  useEffect(() => {
    const lenis = getLenis();
    document.documentElement.style.overflow = 'hidden';
    lenis?.stop();

    return () => {
      document.documentElement.style.overflow = '';
      lenis?.start();
    };
  }, []);

  // Simulated 0 → 100 over ~2s
  useEffect(() => {
    const start = performance.now();
    const total = 2000;
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - start;
      const p = Math.min(100, Math.round((elapsed / total) * 100));
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setReady(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleEnter = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setHidden(true);
        document.documentElement.style.overflow = '';
        getLenis()?.start();
        // Notify the app that the curtain is open so scenes can fade in.
        window.dispatchEvent(new CustomEvent('preloader-done'));
      },
    });

    tl.to([leftRef.current, rightRef.current], {
      xPercent: (i) => (i === 0 ? -100 : 100),
      duration: 1,
      ease: 'expo.inOut',
    });
  };

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* Two curtain halves that split open on enter */}
      <div
        ref={leftRef}
        className="absolute inset-y-0 left-0 w-1/2 bg-bg"
      />
      <div
        ref={rightRef}
        className="absolute inset-y-0 right-0 w-1/2 bg-bg"
      />

      {/* Centered content over both halves */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6">
        <div className="font-mono text-[11px] tracking-[0.15em] text-ink/70">
          {ready ? 'LINEUP READY' : 'LOADING LINEUP…'}
        </div>

        <div className="font-mono text-[10px] tracking-[0.15em] text-ink/40">
          {String(progress).padStart(3, '0')}%
        </div>

        <div className="relative h-px w-[260px] bg-ink/10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-lime transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          type="button"
          onClick={handleEnter}
          disabled={!ready}
          className="mt-8 font-mono text-[11px] tracking-[0.2em] uppercase rounded-full border border-lime px-7 py-3 text-lime transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none hover:bg-lime hover:text-bg"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
