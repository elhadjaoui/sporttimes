'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui/MagneticButton';
import ChapterMarker from '@/components/ui/ChapterMarker';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import CornerBrackets from '@/components/ui/CornerBrackets';
import { getLenis } from '@/hooks/useLenis';
import { scrollState } from '@/lib/scrollState';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="block h-2 w-2 rounded-full bg-lime animate-pulse" />
    </div>
  ),
});

const HEADLINE = ['The match before', 'the match.'];

// Interpolate between ink (F5F5F0) and lime (D4FF3A) based on proximity (0..1)
function interpolateColor(t: number): string {
  const ink = [0xf5, 0xf5, 0xf0];
  const lime = [0xd4, 0xff, 0x3a];
  const r = Math.round(ink[0] * (1 - t) + lime[0] * t);
  const g = Math.round(ink[1] * (1 - t) + lime[1] * t);
  const b = Math.round(ink[2] * (1 - t) + lime[2] * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set('.hero-line .line-inner', { yPercent: 100 });
      gsap.set('.hero-fade', { opacity: 0, y: 16 });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.to('.hero-line .line-inner', {
        yPercent: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
      }).to(
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

      // Scroll-scrubbed camera dolly + FOV crunch + pitch level-out.
      // As the hero scrolls off screen, the camera descends from aerial
      // to player-eye level with a telephoto FOV compression.
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          scrollState.heroProgress = self.progress;
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Slow fade-in of the 3D scene from black — triggered when the preloader
  // curtain finishes opening (or after a max delay if the event never fires).
  useEffect(() => {
    if (!sceneRef.current) return;
    const el = sceneRef.current;
    el.style.opacity = '0';

    let fired = false;
    const fadeIn = () => {
      if (fired) return;
      fired = true;
      gsap.to(el, {
        opacity: 1,
        duration: 1.8,
        ease: 'power2.out',
        delay: 0.15,
      });
    };

    window.addEventListener('preloader-done', fadeIn);
    // Fallback: if the preloader was already dismissed / isn't present, fade in anyway
    const fallback = window.setTimeout(fadeIn, 3500);

    return () => {
      window.removeEventListener('preloader-done', fadeIn);
      window.clearTimeout(fallback);
    };
  }, []);

  // Proximity-based hover on headline letters. The nearer the cursor, the
  // more lime the letter, and the more it lifts.
  useEffect(() => {
    if (!rootRef.current) return;
    const lines = Array.from(
      rootRef.current.querySelectorAll<HTMLElement>('.line-hover')
    );
    if (lines.length === 0) return;

    const RADIUS = 110; // px — field of influence around cursor
    const cleanups: Array<() => void> = [];

    lines.forEach((line) => {
      const letters = Array.from(
        line.querySelectorAll<HTMLElement>('.letter')
      );

      const onMove = (e: MouseEvent) => {
        const cx = e.clientX;
        const cy = e.clientY;
        letters.forEach((letter) => {
          const r = letter.getBoundingClientRect();
          const lx = r.left + r.width / 2;
          const ly = r.top + r.height / 2;
          const dx = cx - lx;
          const dy = cy - ly;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = Math.max(0, 1 - dist / RADIUS);
          // Smooth the response a bit (easeOutQuad)
          const p = 1 - (1 - t) * (1 - t);
          letter.style.color = interpolateColor(p);
          letter.style.transform = `translateY(${(-8 * p).toFixed(2)}px)`;
          letter.style.transition = 'none';
        });
      };

      const onLeave = () => {
        letters.forEach((letter) => {
          letter.style.transition =
            'color 0.35s ease-out, transform 0.35s ease-out';
          letter.style.color = '';
          letter.style.transform = '';
        });
      };

      line.addEventListener('mousemove', onMove);
      line.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        line.removeEventListener('mousemove', onMove);
        line.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => cleanups.forEach((c) => c());
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
      data-progress-section
      data-progress-label="01 · Welcome"
      data-palette="hero"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* 3D scene — left edge softly masked so the pitch dissolves
          into the section bg instead of meeting it at a hard boundary. */}
      <div
        ref={sceneRef}
        className="absolute inset-y-0 right-0 w-full md:w-[55%] z-0"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        <HeroScene />
        {/* Radial darken near the edges — no horizontal axis, no seam */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 55%, rgba(5,5,5,0) 0%, rgba(5,5,5,0.25) 75%, rgba(5,5,5,0.6) 100%)',
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
              [ Made for players · by players ]
            </span>
          </div>

          <h1 className="hero-headline headline-display uppercase text-ink text-[clamp(2.25rem,5vw,4.5rem)] mb-7 md:mb-9">
            {HEADLINE.map((line, i) => (
              <span
                key={i}
                className="mask-line hero-line line-hover cursor-default"
                data-cursor="blend"
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

          <p className="hero-fade font-body text-ink/65 text-base md:text-lg leading-snug max-w-[46ch] mb-9">
            Every game is won before kickoff. See the lineup, claim your
            spot, show up ready to play.
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
