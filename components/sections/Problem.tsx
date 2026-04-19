'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CornerBrackets from '@/components/ui/CornerBrackets';
import StampText from '@/components/ui/StampText';
import ChatChaos from './ChatChaos';

const HEADLINE = ['Group chats', "weren't built", 'for this.'];

// Blood red — deep + visceral, signals "this is the problem."
// Deeper than the section warm wash so hovered letters punch through.
function interpolateColor(t: number): string {
  const ink = [0xf5, 0xf5, 0xf0];
  const blood = [0xb9, 0x1c, 0x1c]; // red-700 — proper blood
  const r = Math.round(ink[0] * (1 - t) + blood[0] * t);
  const g = Math.round(ink[1] * (1 - t) + blood[1] * t);
  const b = Math.round(ink[2] * (1 - t) + blood[2] * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function Problem() {
  const rootRef = useRef<HTMLElement>(null);

  // Scroll-triggered mask reveal on the headline + fade-in of supporting text
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.set('.problem-line .line-inner', { yPercent: 100 });
      gsap.set('.problem-fade', { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 70%',
          once: true,
        },
      });

      tl.to('.problem-line .line-inner', {
        yPercent: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.1,
      }).to(
        '.problem-fade',
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

  // Proximity-based per-letter hover on the headline
  useEffect(() => {
    if (!rootRef.current) return;
    const lines = Array.from(
      rootRef.current.querySelectorAll<HTMLElement>('.line-hover')
    );
    if (lines.length === 0) return;

    const RADIUS = 110;
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

  return (
    <section
      ref={rootRef}
      id="problem"
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        // Subtle warm-red wash over the whole section to shift the mood
        // from "neutral dark" (Hero) to "frustrated dark" (Problem) — still
        // reads as part of the same dark theme.
        background:
          'radial-gradient(ellipse at 25% 40%, rgba(255, 107, 107, 0.045) 0%, rgba(255, 107, 107, 0) 60%), #050505',
      }}
    >
      {/* Chat-bubble chaos on the LEFT — reversed vs hero for rhythm */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[55%] z-0">
        <ChatChaos />
      </div>

      {/* Rubber-stamp marks — repeated impressions at low opacity.
          Each stamp is individually readable, but overlapping builds
          the feeling of "someone slammed this stamp down, over and over." */}
      <div
        className="problem-fade absolute z-10 pointer-events-none inset-0 hidden md:block"
        aria-hidden
      >
        <div className="absolute left-[4%] top-[15%]">
          <StampText
            text="Enough."
            color="#991b1b"
            rotate={-9}
            size="clamp(4rem, 9vw, 9rem)"
            opacity={0.42}
          />
        </div>
        <div className="absolute left-[12%] top-[52%]">
          <StampText
            text="Enough."
            color="#991b1b"
            rotate={-14}
            size="clamp(4.5rem, 10vw, 10.5rem)"
            opacity={0.52}
          />
        </div>
        <div className="absolute left-[30%] top-[76%]">
          <StampText
            text="Enough."
            color="#991b1b"
            rotate={-6}
            size="clamp(4rem, 8.5vw, 8.75rem)"
            opacity={0.35}
          />
        </div>
      </div>

      {/* Foreground — text on the RIGHT */}
      <div className="relative z-20 min-h-screen grid-12 pointer-events-none">
        <div className="col-span-12 md:col-start-7 md:col-span-6 min-h-screen flex flex-col justify-center pt-24 pb-24 pointer-events-auto">
          <div
            className="problem-fade mono-eyebrow mb-5 md:mb-7 group inline-flex items-center gap-3 cursor-default"
            data-cursor="hover"
          >
            <span className="font-mono text-lime">01</span>
            <span className="block h-px w-6 bg-lime/60 transition-all duration-500 group-hover:w-12 group-hover:bg-lime" />
            <span className="transition-colors duration-500 group-hover:text-lime">
              The Problem
            </span>
          </div>

          <h2 className="headline-display uppercase text-ink text-[clamp(2.25rem,5vw,4.5rem)] mb-7 md:mb-9">
            {HEADLINE.map((line, i) => (
              <span
                key={i}
                className="mask-line problem-line line-hover cursor-default"
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
          </h2>

          <p className="problem-fade font-body text-ink/65 text-base md:text-lg leading-snug max-w-[46ch] mb-7">
            Every week, the same chaos. Forty-seven unread messages,
            half-confirmed players, last-minute drops. Nobody knows who&apos;s
            actually showing up until everyone shows up. Sometimes half the
            team doesn&apos;t.
          </p>

          {/* Meta strip — mimics the hero&apos;s live-preview data row */}
          <div className="problem-fade flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45">
            <span>
              <span className="text-ink/30">Messages</span>{' '}
              <span className="text-ink">47 unread</span>
            </span>
            <span>
              <span className="text-ink/30">Confirmed</span>{' '}
              <span className="text-ink">unknown</span>
            </span>
            <span>
              <span className="text-ink/30">Status</span>{' '}
              <span className="text-[#ff6b6b]">chaos</span>
            </span>
          </div>
        </div>
      </div>

      {/* Chapter marker bottom-right */}
      <div className="absolute z-20 bottom-6 md:bottom-10 right-6 md:right-10 problem-fade pointer-events-none">
        <div className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-lime">
          [ Chapter 02 · The Problem ]
        </div>
      </div>

      <CornerBrackets />
    </section>
  );
}
