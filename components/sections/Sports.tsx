'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CornerBrackets from '@/components/ui/CornerBrackets';
import AmbientBackground from '@/components/ui/AmbientBackground';

// ===================================================================
//  Data
// ===================================================================

type SportTone = 'lime' | 'orange' | 'cyan';

type Sport = {
  id: 'football' | 'basketball' | 'handball';
  chapter: string;          // e.g. "03"
  name: string;
  tagline: string;          // short
  headline: string[];       // display lines
  body: string;
  formats: string[];
  stats: Array<{ value: string; label: string }>;
  tone: SportTone;
  accent: string;           // hex
};

const SPORTS: Sport[] = [
  {
    id: 'football',
    chapter: '03',
    name: 'Football',
    tagline: 'The beautiful game.',
    headline: ['Eleven.', 'Seven.', 'Five.'],
    body:
      'Pick your format. Tuesday pickup, Sunday league, or a proper cup final — every match gets its own lineup, its own formation, its own energy.',
    formats: ['5v5', '7v7', '9v9', '11v11'],
    stats: [
      { value: '2.4M', label: 'matches organized' },
      { value: '180+', label: 'formations supported' },
      { value: '45K',  label: 'active pitches' },
    ],
    tone: 'lime',
    accent: '#D4FF3A',
  },
  {
    id: 'basketball',
    chapter: '04',
    name: 'Basketball',
    tagline: 'Run it back.',
    headline: ['Hold', 'the court.'],
    body:
      'Pickup runs. Rec leagues. Full-court organized ball. Call next, build your five, and lock in the game before you even leave the house.',
    formats: ['3v3', '5v5', 'Half court', 'Full court'],
    stats: [
      { value: '890K', label: 'runs called' },
      { value: '12K',  label: 'courts mapped' },
      { value: '3v3+', label: 'to full court' },
    ],
    tone: 'orange',
    accent: '#FF6B1A',
  },
  {
    id: 'handball',
    chapter: '05',
    name: 'Handball',
    tagline: 'Fast. Physical. Organized.',
    headline: ['Seven', 'a side.', 'No excuses.'],
    body:
      'Club rosters, school teams, national leagues. Handball deserves real tools — proper formations, league-ready brackets, and the same visual lineup that makes football work.',
    formats: ['7v7', 'Club', 'Leagues', 'School'],
    stats: [
      { value: '120K', label: 'matches hosted' },
      { value: '600+', label: 'club teams' },
      { value: '7v7',  label: 'formations native' },
    ],
    tone: 'cyan',
    accent: '#00E5FF',
  },
];

// ===================================================================
//  Venue SVGs — pitch / court / handball court
//  Faded white lines on transparent bg, matching the Hero's
//  PitchWireframe language.
// ===================================================================

function FootballPitchSvg({ accent }: { accent: string }) {
  const op1 = 0.42;
  const op2 = 0.3;
  return (
    <svg viewBox="0 0 70 100" width="100%" style={{ display: 'block', overflow: 'visible' }}>
      {/* Outer boundary */}
      <rect x="0" y="0" width="70" height="100" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.4" />
      {/* Halfway line + center circle + spot */}
      <line x1="0" y1="50" x2="70" y2="50" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <circle cx="35" cy="50" r="9" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <circle cx="35" cy="50" r="0.6" fill="#F5F5F0" fillOpacity="0.55" />
      {/* Top penalty box + 6-yard + arc + spot */}
      <rect x="15" y="0" width="40" height="14" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <rect x="24" y="0" width="22" height="6" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.3" />
      <path d="M 29 14 A 6 6 0 0 0 41 14" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      {/* Bottom penalty box + 6-yard + arc + spot */}
      <rect x="15" y="86" width="40" height="14" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <rect x="24" y="94" width="22" height="6" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.3" />
      <path d="M 29 86 A 6 6 0 0 1 41 86" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      {/* Goals */}
      <rect x="30" y="-3" width="10" height="3" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.3" />
      <rect x="30" y="100" width="10" height="3" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.3" />

      {/* Accent dots — 4-3-3 formation */}
      {[
        [35, 92], [14, 72], [28, 72], [42, 72], [56, 72],
        [22, 48], [35, 48], [48, 48], [18, 25], [52, 25],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="2.6" fill="none" stroke="#F5F5F0" strokeWidth="0.3" strokeOpacity="0.7" />
          <circle cx={x} cy={y} r="2.2" fill="#F5F5F0" opacity="0.85" />
        </g>
      ))}
      <circle cx="35" cy="18" r="2.8" fill="none" stroke={accent} strokeWidth="0.5" />
      <circle cx="35" cy="18" r="2.2" fill={accent} opacity="0.75" />
    </svg>
  );
}

function BasketballCourtSvg({ accent }: { accent: string }) {
  // Vertical court, 50 wide × 94 tall (approximated, top-down view)
  const op1 = 0.42;
  const op2 = 0.3;
  return (
    <svg viewBox="0 0 50 94" width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <rect x="0" y="0" width="50" height="94" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      {/* Half-court line + center circle */}
      <line x1="0" y1="47" x2="50" y2="47" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <circle cx="25" cy="47" r="6" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <circle cx="25" cy="47" r="2" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.2" />
      {/* Top — free throw lane */}
      <rect x="17" y="0" width="16" height="19" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      {/* Top — free throw circle */}
      <circle cx="25" cy="19" r="6" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      {/* Top — 3-point arc */}
      <path d="M 3 0 L 3 14 A 22 22 0 0 0 47 14 L 47 0" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      {/* Top — backboard + rim */}
      <line x1="21" y1="-2" x2="29" y2="-2" stroke={accent} strokeOpacity="0.75" strokeWidth="0.4" />
      <circle cx="25" cy="2" r="1" fill={accent} opacity="0.75" />
      {/* Bottom — mirror */}
      <rect x="17" y="75" width="16" height="19" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <circle cx="25" cy="75" r="6" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <path d="M 3 94 L 3 80 A 22 22 0 0 1 47 80 L 47 94" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <line x1="21" y1="96" x2="29" y2="96" stroke={accent} strokeOpacity="0.75" strokeWidth="0.4" />
      <circle cx="25" cy="92" r="1" fill={accent} opacity="0.75" />

      {/* Accent player dots — 5v5 */}
      {[
        [25, 80], [15, 68], [35, 68], [18, 55], [32, 55],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="2" fill="none" stroke="#F5F5F0" strokeWidth="0.25" strokeOpacity="0.7" />
          <circle cx={x} cy={y} r="1.6" fill="#F5F5F0" opacity="0.85" />
        </g>
      ))}
      <circle cx="25" cy="30" r="2.2" fill="none" stroke={accent} strokeWidth="0.4" />
      <circle cx="25" cy="30" r="1.7" fill={accent} opacity="0.8" />
    </svg>
  );
}

function HandballCourtSvg({ accent }: { accent: string }) {
  // 40 wide × 20 tall horizontal, rotated to vertical for the visual
  // column. Goal areas at top/bottom. 6m (hard line) and 9m (dashed).
  const op1 = 0.42;
  const op2 = 0.3;
  return (
    <svg viewBox="0 0 40 80" width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <rect x="0" y="0" width="40" height="80" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <line x1="0" y1="40" x2="40" y2="40" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      {/* Top — 6m goal area (semi-circle) */}
      <path d="M 12 0 L 12 4 A 8 8 0 0 0 28 4 L 28 0" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      {/* Top — 9m dashed arc */}
      <path d="M 9 0 L 9 4 A 11 11 0 0 0 31 4 L 31 0" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.25" strokeDasharray="0.8 0.6" />
      {/* Top — penalty line 7m */}
      <line x1="18" y1="7" x2="22" y2="7" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      {/* Top — goal */}
      <rect x="16" y="-2" width="8" height="2" fill="none" stroke={accent} strokeOpacity="0.75" strokeWidth="0.4" />
      {/* Bottom — mirror */}
      <path d="M 12 80 L 12 76 A 8 8 0 0 1 28 76 L 28 80" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <path d="M 9 80 L 9 76 A 11 11 0 0 1 31 76 L 31 80" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.25" strokeDasharray="0.8 0.6" />
      <line x1="18" y1="73" x2="22" y2="73" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <rect x="16" y="80" width="8" height="2" fill="none" stroke={accent} strokeOpacity="0.75" strokeWidth="0.4" />

      {/* 7v7 — 6 court players (GK at goals implied by the colored accent) */}
      {[
        [20, 68], [10, 58], [30, 58], [15, 48], [25, 48], [20, 38],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="1.6" fill="none" stroke="#F5F5F0" strokeWidth="0.25" strokeOpacity="0.7" />
          <circle cx={x} cy={y} r="1.3" fill="#F5F5F0" opacity="0.85" />
        </g>
      ))}
      <circle cx="20" cy="22" r="1.7" fill="none" stroke={accent} strokeWidth="0.35" />
      <circle cx="20" cy="22" r="1.3" fill={accent} opacity="0.8" />
    </svg>
  );
}

// ===================================================================
//  One sport chapter
// ===================================================================

function SportChapter({ sport, index }: { sport: Sport; index: number }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Line-by-line mask reveal on entry
      gsap.set('.sport-line .line-inner', { yPercent: 100 });
      gsap.set('.sport-fade', { opacity: 0, y: 14 });
      gsap.set('.sport-venue', {
        opacity: 0,
        scale: 0.9,
        filter: 'blur(14px)',
      });
      gsap.set('.sport-pill', { opacity: 0, scale: 0.9 });
      gsap.set('.sport-stat', { opacity: 0, y: 12 });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to('.sport-venue', {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
          });
          tl.to(
            '.sport-line .line-inner',
            {
              yPercent: 0,
              duration: 0.9,
              ease: 'expo.out',
              stagger: 0.08,
            },
            '-=0.55'
          );
          tl.to(
            '.sport-fade',
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.08,
            },
            '-=0.45'
          );
          tl.to(
            '.sport-pill',
            {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              stagger: 0.06,
              ease: 'back.out(2)',
            },
            '-=0.3'
          );
          tl.to(
            '.sport-stat',
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.08,
              ease: 'power3.out',
            },
            '-=0.4'
          );
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Alternate side per index — 0 = left text, 1 = right text, 2 = left
  const textOnRight = index === 1;

  const Venue = sport.id === 'football'
    ? FootballPitchSvg
    : sport.id === 'basketball'
    ? BasketballCourtSvg
    : HandballCourtSvg;

  return (
    <div
      ref={rootRef}
      className="sport-chapter relative w-full"
      style={{
        minHeight: '92vh',
        background: '#050505',
      }}
    >
      {/* Per-sport ambient glow */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <AmbientBackground tone={sport.tone} density={0.8} />
      </div>

      <div className="relative z-[10] grid-12 h-[92vh] items-center">
        {/* TEXT column */}
        <div
          className={[
            'col-span-12',
            textOnRight
              ? 'md:col-start-7 md:col-span-5'
              : 'md:col-start-2 md:col-span-5',
          ].join(' ')}
        >
          <div
            className="sport-fade mono-eyebrow mb-6 inline-flex items-center gap-3"
            style={{ color: sport.accent }}
          >
            <span>{sport.chapter}</span>
            <span
              className="block h-px w-8"
              style={{ background: sport.accent, opacity: 0.8 }}
            />
            <span
              style={{
                color: 'rgba(245,245,240,0.5)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {sport.tagline}
            </span>
          </div>

          <h2
            className="headline-display uppercase text-ink mb-7"
            style={{
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
            }}
          >
            {sport.headline.map((line, i) => (
              <span
                key={i}
                className="mask-line sport-line"
                style={{ display: 'block' }}
              >
                <span
                  className="line-inner"
                  style={{ display: 'block', willChange: 'transform' }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <p
            className="sport-fade font-body mb-8"
            style={{
              color: 'rgba(245,245,240,0.7)',
              fontSize: 16,
              lineHeight: 1.55,
              maxWidth: '42ch',
            }}
          >
            {sport.body}
          </p>

          {/* Stats row */}
          <div
            className="flex items-start gap-8 mb-8"
            style={{ flexWrap: 'wrap' }}
          >
            {sport.stats.map((s) => (
              <div key={s.label} className="sport-stat">
                <div
                  className="headline-display"
                  style={{
                    fontSize: 30,
                    lineHeight: 1,
                    color: sport.accent,
                    letterSpacing: '-0.02em',
                    textShadow: `0 0 18px ${sport.accent}40`,
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="font-mono mt-1"
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,245,240,0.5)',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Format pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {sport.formats.map((f) => (
              <span
                key={f}
                className="sport-pill"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,245,240,0.8)',
                  border: '1px solid rgba(245,245,240,0.2)',
                  padding: '6px 14px',
                  borderRadius: 100,
                  background: 'rgba(245,245,240,0.03)',
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* VENUE column */}
        <div
          className={[
            'col-span-12 flex items-center justify-center',
            textOnRight
              ? 'md:col-start-2 md:col-span-5 md:row-start-1'
              : 'md:col-start-8 md:col-span-4',
          ].join(' ')}
          style={{ perspective: '1400px' }}
        >
          <div
            className="sport-venue relative"
            style={{
              width: '100%',
              maxWidth: 380,
              aspectRatio: sport.id === 'handball' ? '1/2' : '7/10',
              transform: 'rotateX(42deg) rotateZ(-6deg)',
              transformStyle: 'preserve-3d',
              filter: `drop-shadow(0 40px 60px rgba(0,0,0,0.55)) drop-shadow(0 0 40px ${sport.accent}30)`,
            }}
          >
            <Venue accent={sport.accent} />
          </div>
        </div>
      </div>

      <CornerBrackets />
    </div>
  );
}

// ===================================================================
//  Section
// ===================================================================

export default function Sports() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="sports"
      data-progress-section
      data-progress-label="03 · Three Sports"
      className="relative w-full"
    >
      {/* Section header */}
      <div
        className="relative z-[5] grid-12 py-[18vh]"
        style={{ background: '#050505' }}
      >
        <div className="col-span-12 md:col-start-2 md:col-span-10">
          <div className="mono-eyebrow mb-5">[ Chapter 03 · Three Sports ]</div>
          <h2
            className="headline-display uppercase text-ink"
            style={{
              fontSize: 'clamp(2.5rem, 6.2vw, 5.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              maxWidth: '22ch',
            }}
          >
            Three sports. One app.
          </h2>
          <p
            className="font-body mt-5"
            style={{
              color: 'rgba(245,245,240,0.6)',
              fontSize: 17,
              lineHeight: 1.55,
              maxWidth: '52ch',
            }}
          >
            Every sport gets the full visual-lineup treatment. Same tools,
            native formats, sport-specific feel.
          </p>
        </div>
      </div>

      {SPORTS.map((s, i) => (
        <SportChapter key={s.id} sport={s} index={i} />
      ))}
    </section>
  );
}
