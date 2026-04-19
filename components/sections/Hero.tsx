'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import MagneticButton from '@/components/ui/MagneticButton';
import ChapterMarker from '@/components/ui/ChapterMarker';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import CornerBrackets from '@/components/ui/CornerBrackets';
import { getLenis } from '@/hooks/useLenis';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="block h-2 w-2 rounded-full bg-lime animate-pulse" />
    </div>
  ),
});

const HEADLINE = ['Run the match.', 'Not the chat.'];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      // Mask reveal each headline line — target the .line-inner wrapper only
      // so the individual letter spans stay free for hover transforms.
      gsap.set('.hero-line .line-inner', { yPercent: 100 });
      gsap.set('.hero-fade', { opacity: 0, y: 16 });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.to('.hero-line .line-inner', {
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
      {/* 3D scene contained to the right half — no full-bleed bleed-everywhere */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[55%] z-0">
        <HeroScene />
        {/* Soft left edge-fade so the pitch dissolves into black where it
            meets the text column */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, #050505 0%, rgba(5,5,5,0.6) 12%, rgba(5,5,5,0) 30%), radial-gradient(ellipse at 50% 60%, rgba(5,5,5,0) 0%, rgba(5,5,5,0.3) 80%, rgba(5,5,5,0.7) 100%)',
          }}
        />
      </div>

      {/* Foreground content — clean left stack, nothing on the right.
          IMPORTANT: outer grid is pointer-events-none so canvas under it
          stays interactive; the actual content column re-enables events. */}
      <div className="relative z-20 h-full grid-12 pointer-events-none">
        <div className="col-span-12 md:col-start-1 md:col-span-7 h-full flex flex-col justify-center pt-24 pb-24 pointer-events-auto">
          <div
            className="hero-fade mono-eyebrow mb-5 md:mb-7 group inline-flex items-center gap-3 cursor-default"
            data-cursor="hover"
          >
            <span className="block h-px w-6 bg-lime/60 transition-all duration-500 group-hover:w-12 group-hover:bg-lime" />
            <span className="transition-colors duration-500 group-hover:text-lime">
              [ Sports Coordination × Reimagined ]
            </span>
          </div>

          <h1 className="headline-display uppercase text-ink text-[clamp(2.25rem,5vw,4.5rem)] mb-7 md:mb-9">
            {HEADLINE.map((line, i) => (
              <span
                key={i}
                className="mask-line hero-line line-hover cursor-default"
                data-cursor="hover"
              >
                <span className="line-inner whitespace-nowrap">
                  {line.split('').map((char, j) => (
                    <span key={j} className="letter">
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-fade font-body text-ink/65 text-base md:text-lg leading-snug max-w-[40ch] mb-9">
            The visual lineup for pickup sports. Football, basketball,
            handball.
          </p>

          <div className="hero-fade flex flex-wrap items-center gap-3">
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
      <div className="absolute z-20 bottom-6 md:bottom-10 left-6 md:left-10 hero-fade pointer-events-none">
        <ChapterMarker num="01" label="Welcome" />
      </div>

      {/* Bottom-right scroll indicator */}
      <div className="absolute z-20 bottom-6 md:bottom-10 right-6 md:right-10 hero-fade pointer-events-none">
        <ScrollIndicator />
      </div>

      {/* E — corner brackets (HUD frame) */}
      <CornerBrackets />
    </section>
  );
}
