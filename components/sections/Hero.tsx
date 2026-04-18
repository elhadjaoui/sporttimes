'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import MagneticButton from '@/components/ui/MagneticButton';
import ChapterMarker from '@/components/ui/ChapterMarker';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import { getLenis } from '@/hooks/useLenis';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="block h-2 w-2 rounded-full bg-lime animate-pulse" />
    </div>
  ),
});

const HEADLINE = ['SEE THE', 'LINEUP.', 'JOIN THE', 'MATCH.'];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      // Mask reveal each headline line
      gsap.set('.hero-line span', { yPercent: 100 });
      gsap.set('.hero-fade', { opacity: 0, y: 16 });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.to('.hero-line span', {
        yPercent: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
      })
        .to(
          '.hero-fade',
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.08,
          },
          '-=0.5'
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const scrollToHow = () => {
    const target = document.getElementById('how');
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* 3D scene */}
      <HeroScene />

      {/* Radial vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(5,5,5,0) 0%, rgba(5,5,5,0.55) 55%, rgba(5,5,5,0.92) 100%)',
        }}
      />

      {/* Foreground content */}
      <div className="relative z-20 h-full grid-12">
        <div className="col-span-12 md:col-start-2 md:col-span-10 h-full flex flex-col justify-center pt-24 pb-16">
          {/* Eyebrow */}
          <div className="hero-fade mono-eyebrow mb-6 md:mb-8">
            [ Sports Coordination × Reimagined ]
          </div>

          {/* Headline — 4 stacked lines, mask reveal */}
          <h1 className="headline-display text-ink text-[clamp(3rem,11vw,10rem)] mb-8 md:mb-10">
            {HEADLINE.map((line, i) => (
              <span key={i} className="mask-line hero-line">
                <span>{line}</span>
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p className="hero-fade font-body text-ink/70 text-base md:text-lg max-w-prose50 leading-relaxed mb-10">
            Stop chasing group chats. See exactly who&apos;s playing, what
            position, and how the team is shaping up — before you commit.
            Football, basketball, handball. The way sports were meant to be
            organized.
          </p>

          {/* CTA row */}
          <div className="hero-fade flex flex-wrap items-center gap-4">
            <MagneticButton href="#download" variant="primary">
              Download the app ↗
            </MagneticButton>
            <MagneticButton variant="ghost" onClick={scrollToHow}>
              See how it works
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Bottom-left chapter marker */}
      <div className="absolute z-20 bottom-6 left-6 md:bottom-10 md:left-10 hero-fade">
        <ChapterMarker num="01" label="Welcome" />
      </div>

      {/* Bottom-right scroll indicator */}
      <div className="absolute z-20 bottom-6 right-6 md:bottom-10 md:right-10 hero-fade">
        <ScrollIndicator />
      </div>
    </section>
  );
}
