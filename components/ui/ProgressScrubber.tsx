'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState } from '@/lib/scrollState';

/**
 * A thin lime bar pinned at the top of the viewport. Fills based on the
 * CURRENT section's scroll progress — resets between sections like a
 * match-clock ticking over to the next period.
 *
 * Uses gsap.quickSetter so per-frame updates don't allocate or thrash.
 * Sections opt in by adding [data-progress-section] to their root element
 * and an optional [data-progress-label] for the section name.
 */
export default function ProgressScrubber() {
  const fillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pageRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!fillRef.current) return;

    const setScaleX = gsap.quickSetter(fillRef.current, 'scaleX');

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-progress-section]')
    );

    const triggers = sections.map((section) => {
      const label =
        section.getAttribute('data-progress-label') ?? section.id ?? '';
      return ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          setScaleX(self.progress);
          if (labelRef.current) {
            labelRef.current.textContent = label;
          }
        },
        onEnter: () => {
          if (labelRef.current) labelRef.current.textContent = label;
        },
        onEnterBack: () => {
          if (labelRef.current) labelRef.current.textContent = label;
        },
      });
    });

    // Page-wide progress (updates the small right-hand percent counter).
    const page = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollState.pageProgress = self.progress;
        if (pageRef.current) {
          pageRef.current.textContent = `${String(
            Math.round(self.progress * 100)
          ).padStart(3, '0')}%`;
        }
      },
    });

    return () => {
      triggers.forEach((t) => t.kill());
      page.kill();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 right-0 z-[65]"
    >
      <div className="relative h-px w-full bg-ink/10">
        <div
          ref={fillRef}
          className="absolute inset-y-0 left-0 w-full bg-lime origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
      {/* Hidden spans keep React/TS happy — label/page refs are kept
          for a future inline-in-nav section label treatment. */}
      <span ref={labelRef} className="sr-only" />
      <span ref={pageRef} className="sr-only" />
    </div>
  );
}
