'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

const HASH_SETTLE_MS = 150;
const HASH_MAX_MS = 4000;
const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;

// Opening /#section from another page: the browser jumps to the section
// before the pinned sections above it add their scroll space, so jump again
// each time the page grows, until it settles or the visitor scrolls.
function landOnHash(lenis: Lenis): () => void {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return () => {};

  let timer: number | undefined;
  let deadline: number | undefined;
  const land = () => {
    const el = document.getElementById(id);
    if (!el) return;
    // Lenis re-measures the page on its own only after a 250 ms debounce,
    // and clamps scrollTo to the old height until then.
    lenis.resize();
    lenis.scrollTo(el, { immediate: true, force: true });
  };
  const settle = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(land, HASH_SETTLE_MS);
  };
  const observer = new ResizeObserver(settle);
  const stop = () => {
    observer.disconnect();
    ScrollTrigger.removeEventListener('refresh', settle);
    window.clearTimeout(timer);
    window.clearTimeout(deadline);
    for (const e of USER_SCROLL_EVENTS) window.removeEventListener(e, stop);
  };

  observer.observe(document.body);
  ScrollTrigger.addEventListener('refresh', settle);
  for (const e of USER_SCROLL_EVENTS) window.addEventListener(e, stop, { passive: true });
  deadline = window.setTimeout(stop, HASH_MAX_MS);
  settle();
  return stop;
}

export function useLenis() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisInstance = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Runs on the first load and again after every in-app navigation,
  // since the provider stays mounted across pages.
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) return landOnHash(lenis);
  }, [pathname]);
}
