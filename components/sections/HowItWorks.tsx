'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CornerBrackets from '@/components/ui/CornerBrackets';
import { scrollState } from '@/lib/scrollState';

const HowItWorksScene = dynamic(
  () => import('@/components/three/HowItWorksScene'),
  { ssr: false, loading: () => null }
);

type Beat = {
  step: string;
  kicker: string;
  title: string;
  body: string;
};

const BEATS: Beat[] = [
  {
    step: '01',
    kicker: 'The squad',
    title: 'Find your community.',
    body: 'Campus, city, club, workplace, friend circle. The squads that match how you actually play, not just how you text.',
  },
  {
    step: '02',
    kicker: 'The clarity',
    title: 'See the lineup form.',
    body: 'Every match shows the pitch, the formation, and who is already in. Instant clarity, zero unread threads.',
  },
  {
    step: '03',
    kicker: 'The moment',
    title: 'Claim your spot.',
    body: 'One tap. Captain approves. Your face appears on the pitch. You are on the team before you have even laced up.',
  },
];

export default function HowItWorks() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeBeat, setActiveBeat] = useState(0);

  useEffect(() => {
    if (!wrapRef.current || !pinRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: '+=300%', // 3x viewport scroll distance
        pin: pinRef.current,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollState.howProgress = self.progress;
          const next = self.progress < 0.33 ? 0 : self.progress < 0.66 ? 1 : 2;
          setActiveBeat(next);
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      id="how"
      data-progress-section
      data-progress-label="03 · How It Works"
      className="relative w-full"
      // Wrapper is 4x viewport so there's scroll distance for the pin
      style={{ height: '400vh' }}
    >
      {/* The pinned viewport — stays locked while scrollState.howProgress
          advances through the 3 beats */}
      <div
        ref={pinRef}
        className="relative w-full h-screen overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse at 50% 65%, rgba(15, 46, 26, 0.18) 0%, rgba(15, 46, 26, 0) 55%), #050505',
        }}
      >
        <HowItWorksScene />

        {/* Soft center vignette to lift text over the scene */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 55%, rgba(5,5,5,0) 0%, rgba(5,5,5,0.2) 60%, rgba(5,5,5,0.75) 100%)',
          }}
        />

        {/* Chapter marker top */}
        <div className="absolute z-30 top-20 left-6 md:left-10 pointer-events-none font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-lime">
          [ Chapter 03 · How it works ]
        </div>

        {/* The three text blocks — only the active one is visible.
            Layered centered; each fades + slides based on its own activeness. */}
        <div className="absolute inset-0 z-20 grid-12 items-center pointer-events-none">
          {BEATS.map((b, i) => (
            <BeatOverlay key={i} beat={b} index={i} active={activeBeat} />
          ))}
        </div>

        {/* Beat-dot indicator — bottom center */}
        <div className="absolute z-30 bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none">
          {BEATS.map((_, i) => (
            <span
              key={i}
              className="block h-[2px] transition-all duration-500"
              style={{
                width: i === activeBeat ? 44 : 22,
                background:
                  i === activeBeat
                    ? 'var(--lime)'
                    : 'rgba(245, 245, 240, 0.2)',
              }}
            />
          ))}
        </div>

        <CornerBrackets />
      </div>
    </section>
  );
}

// === Individual beat overlay ===================================================

function BeatOverlay({
  beat,
  index,
  active,
}: {
  beat: Beat;
  index: number;
  active: number;
}) {
  const isActive = index === active;
  // Alternate sides per beat for rhythm
  const side = index === 1 ? 'right' : 'left';

  return (
    <div
      className={[
        'absolute inset-0 grid-12 items-center transition-[opacity,transform] duration-700 ease-out',
        isActive ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      style={{
        transform: isActive
          ? 'translateY(0)'
          : index < active
          ? 'translateY(-30px)'
          : 'translateY(30px)',
      }}
    >
      <div
        className={[
          'col-span-12 pointer-events-auto px-6 md:px-0',
          side === 'left'
            ? 'md:col-start-2 md:col-span-6'
            : 'md:col-start-7 md:col-span-5 md:text-right md:items-end md:flex md:flex-col',
        ].join(' ')}
      >
        <div
          className={[
            'mono-eyebrow mb-6 inline-flex items-center gap-3',
            side === 'right' ? 'md:self-end' : '',
          ].join(' ')}
        >
          <span className="font-mono text-lime">Step {beat.step}</span>
          <span className="block h-px w-8 bg-lime/60" />
          <span className="text-ink/50">{beat.kicker}</span>
        </div>
        <h3 className="headline-display uppercase text-ink text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] mb-7">
          {beat.title}
        </h3>
        <p className="font-body text-ink/70 text-base md:text-lg leading-relaxed max-w-[46ch]">
          {beat.body}
        </p>
      </div>
    </div>
  );
}
