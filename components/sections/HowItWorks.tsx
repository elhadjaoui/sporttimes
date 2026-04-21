'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// ===================================================================
//  Data
// ===================================================================

type Step = { num: string; title: string; body: string };

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Join a community.',
    body: 'Campus, city, club, workplace. Join the squads that match how you actually play. Public groups open in one tap, private groups after admin approval.',
  },
  {
    num: '02',
    title: 'Discover matches.',
    body: 'Every match from every squad, in one feed. Filter by sport, browse by day, find your format. 5v5, 7v7, 11v11 — whatever you came to play.',
  },
  {
    num: '03',
    title: 'See the lineup.',
    body: 'The pitch, the formation, the players. Watch positions fill in real time. Know exactly who you are playing with before you ever step on the field.',
  },
  {
    num: '04',
    title: 'Jump in.',
    body: 'One tap. Captain approves. Your face appears in the lineup. You show up ready to play, not wondering if the match will happen.',
  },
];

// 4-3-3 positions on a 70×100 vertical pitch (shared across vizes 03/04).
// Coordinate system matches the shared HeroPitchSvg.
type Pos = [number, number];
const POS433: Pos[] = [
  [35, 92], // GK
  [14, 72], [28, 72], [42, 72], [56, 72], // DEF
  [22, 48], [35, 48], [48, 48], // MID
  [18, 25], [52, 25], // FWD LF, RF
  [35, 18], // CF — empty
];
const CF_INDEX = 10;

// Full-detail pitch rendered in the Hero's visual language — white
// field lines, penalty boxes + 6-yard boxes + arcs + spots, goals
// rendered just outside the pitch, subtle fog-green fill gradient.
// Used by Viz 03 and Viz 04 so the lineup stages match Section 01.
function HeroPitchSvg() {
  // Match the Hero's PitchWireframe exactly: no green grass, no outer
  // fill — just faint white wireframe lines on whatever dark bg is
  // behind. Default stroke opacity tuned to match the hero's ~0.32.
  const stroke = '#F5F5F0';
  const opMain = 0.38;
  const opSub = 0.28;

  return (
    <g>
      {/* Outer boundary */}
      <rect x="0" y="0" width="70" height="100" fill="none" stroke={stroke} strokeOpacity={opMain} strokeWidth="0.4" />

      {/* Halfway line + center circle + spot */}
      <line x1="0" y1="50" x2="70" y2="50" stroke={stroke} strokeOpacity={opMain} strokeWidth="0.3" />
      <circle cx="35" cy="50" r="9" fill="none" stroke={stroke} strokeOpacity={opMain} strokeWidth="0.3" />
      <circle cx="35" cy="50" r="0.55" fill={stroke} fillOpacity="0.55" />

      {/* Top penalty box + 6-yard + arc + spot */}
      <rect x="15" y="0" width="40" height="14" fill="none" stroke={stroke} strokeOpacity={opMain} strokeWidth="0.3" />
      <rect x="24" y="0" width="22" height="6" fill="none" stroke={stroke} strokeOpacity={opSub} strokeWidth="0.3" />
      <path d="M 29 14 A 6 6 0 0 0 41 14" fill="none" stroke={stroke} strokeOpacity={opMain} strokeWidth="0.3" />
      <circle cx="35" cy="9.5" r="0.45" fill={stroke} fillOpacity="0.5" />

      {/* Bottom penalty box + 6-yard + arc + spot */}
      <rect x="15" y="86" width="40" height="14" fill="none" stroke={stroke} strokeOpacity={opMain} strokeWidth="0.3" />
      <rect x="24" y="94" width="22" height="6" fill="none" stroke={stroke} strokeOpacity={opSub} strokeWidth="0.3" />
      <path d="M 29 86 A 6 6 0 0 1 41 86" fill="none" stroke={stroke} strokeOpacity={opMain} strokeWidth="0.3" />
      <circle cx="35" cy="90.5" r="0.45" fill={stroke} fillOpacity="0.5" />

      {/* Goals — wire rectangles just outside each end */}
      <rect x="30" y="-3" width="10" height="3" fill="none" stroke={stroke} strokeOpacity={opSub} strokeWidth="0.3" />
      <rect x="30" y="100" width="10" height="3" fill="none" stroke={stroke} strokeOpacity={opSub} strokeWidth="0.3" />
    </g>
  );
}

// Player dot in the hero's visual language — thin outline ring + solid
// bright core. Matches Section 01's PlayerDot at this 2D scale.
function HeroPlayerDot({
  cx,
  cy,
  r = 2.3,
}: {
  cx: number;
  cy: number;
  r?: number;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 0.35} fill="none" stroke="#F5F5F0" strokeWidth="0.3" />
      <circle cx={cx} cy={cy} r={r} fill="#F5F5F0" />
    </g>
  );
}

// ===================================================================
//  Shared — isometric stage
//  Applies perspective + rotate so children sit on a tilted plane
//  like the hero pitch. Kids use `preserve-3d` where they need depth.
// ===================================================================

function IsoStage({
  children,
  tilt = 52,
  roll = -8,
  scale = 1,
}: {
  children: React.ReactNode;
  tilt?: number;
  roll?: number;
  scale?: number;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ perspective: '1400px' }}
    >
      <div
        style={{
          transform: `rotateX(${tilt}deg) rotateZ(${roll}deg) scale(${scale})`,
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ===================================================================
//  Visualization 01 — The Community Container
//
//  A community holds matches, members, sport, location — it's the
//  thing you join FIRST. We render it as ONE big glowing container
//  that visibly contains those parts, with a JOIN button hooked into
//  it. No more confusing radar/network.
// ===================================================================

const COMMUNITY = {
  badge: 's/',
  name: 'THE CAMPUS',
  location: 'Casablanca · Av Hassan II',
  members: 132,
  matchesThisWeek: 14,
  sports: ['Football', 'Basketball', 'Handball'],
};

function Viz01() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      // Whole panel emerges from dark
      gsap.from('.viz1-panel', {
        opacity: 0,
        scale: 0.88,
        filter: 'blur(18px)',
        duration: 0.9,
        ease: 'power3.out',
      });

      // Inner content reveals stagger
      gsap.from('.viz1-row', {
        opacity: 0,
        y: 18,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.4,
      });

      // Member avatars pop in one by one
      gsap.from('.viz1-avatar', {
        opacity: 0,
        scale: 0,
        stagger: 0.06,
        duration: 0.45,
        ease: 'back.out(2)',
        delay: 0.7,
        transformOrigin: 'center',
      });

      // Counter ticks up
      gsap.fromTo(
        '.viz1-count',
        { innerText: 0 },
        {
          innerText: COMMUNITY.members,
          duration: 1.4,
          ease: 'power2.out',
          snap: { innerText: 1 },
          delay: 0.8,
        }
      );
      gsap.fromTo(
        '.viz1-matches',
        { innerText: 0 },
        {
          innerText: COMMUNITY.matchesThisWeek,
          duration: 1.4,
          ease: 'power2.out',
          snap: { innerText: 1 },
          delay: 0.9,
        }
      );

      // Outer halo breathes
      gsap.to('.viz1-halo', {
        opacity: 0.35,
        scale: 1.05,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: 'center',
      });

      // JOIN button pulses
      gsap.to('.viz1-join', {
        boxShadow: '0 0 60px rgba(212,255,58,0.85)',
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* Outer halo — gives the community its "container" glow */}
      <div
        className="viz1-halo absolute"
        style={{
          width: 540,
          height: 540,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212,255,58,0.28) 0%, rgba(212,255,58,0.06) 45%, transparent 70%)',
          filter: 'blur(8px)',
          opacity: 0.55,
        }}
      />

      {/* Panel — the community itself */}
      <div
        className="viz1-panel relative"
        style={{
          width: 460,
          padding: 36,
          borderRadius: 28,
          background:
            'linear-gradient(155deg, #141414 0%, #0a0a0a 100%)',
          border: '1px solid rgba(212,255,58,0.35)',
          boxShadow:
            '0 50px 120px rgba(0,0,0,0.7), 0 0 80px rgba(212,255,58,0.18), inset 0 1px 0 rgba(255,255,255,0.04)',
          color: '#F5F5F0',
        }}
      >
        {/* Top — eyebrow + community badge + name */}
        <div className="viz1-row mb-7">
          <div
            className="font-mono mb-3"
            style={{
              fontSize: 10,
              letterSpacing: '0.3em',
              color: 'rgba(212,255,58,0.7)',
              textTransform: 'uppercase',
            }}
          >
            [ Community ]
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="font-mono"
              style={{
                fontSize: 22,
                color: 'rgba(212,255,58,0.6)',
                letterSpacing: '-0.02em',
                fontWeight: 700,
              }}
            >
              {COMMUNITY.badge}
            </span>
            <h4
              className="headline-display uppercase"
              style={{
                fontSize: 38,
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                textShadow: '0 0 24px rgba(212,255,58,0.18)',
              }}
            >
              {COMMUNITY.name}
            </h4>
          </div>
          <div
            className="mt-2 font-mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.18em',
              color: 'rgba(245,245,240,0.55)',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {COMMUNITY.location}
          </div>
        </div>

        {/* Divider */}
        <div
          className="viz1-row"
          style={{
            height: 1,
            background:
              'linear-gradient(90deg, transparent, rgba(245,245,240,0.18), transparent)',
            marginBottom: 22,
          }}
        />

        {/* Stats row — what the community CONTAINS */}
        <div className="viz1-row grid grid-cols-2 gap-4 mb-6">
          <div>
            <div
              className="font-mono mb-1"
              style={{
                fontSize: 9,
                letterSpacing: '0.25em',
                color: 'rgba(245,245,240,0.45)',
                textTransform: 'uppercase',
              }}
            >
              Members
            </div>
            <div
              className="headline-display"
              style={{
                fontSize: 36,
                lineHeight: 1,
                color: '#F5F5F0',
                letterSpacing: '-0.02em',
              }}
            >
              <span className="viz1-count">{COMMUNITY.members}</span>
            </div>
          </div>
          <div>
            <div
              className="font-mono mb-1"
              style={{
                fontSize: 9,
                letterSpacing: '0.25em',
                color: 'rgba(245,245,240,0.45)',
                textTransform: 'uppercase',
              }}
            >
              Matches / week
            </div>
            <div
              className="headline-display"
              style={{
                fontSize: 36,
                lineHeight: 1,
                color: '#D4FF3A',
                letterSpacing: '-0.02em',
                textShadow: '0 0 18px rgba(212,255,58,0.4)',
              }}
            >
              <span className="viz1-matches">{COMMUNITY.matchesThisWeek}</span>
            </div>
          </div>
        </div>

        {/* Member pile + sports */}
        <div className="viz1-row flex items-center justify-between mb-7">
          <div style={{ display: 'flex' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="viz1-avatar"
                style={{
                  display: 'inline-block',
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: ['#3a3a3a', '#555', '#2a2a2a', '#4a4a4a', '#3f3f3f', '#262626'][i],
                  border: '2px solid #0a0a0a',
                  marginLeft: i === 0 ? 0 : -10,
                }}
              />
            ))}
            <span
              className="viz1-avatar"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'rgba(212,255,58,0.18)',
                border: '1px solid rgba(212,255,58,0.5)',
                marginLeft: -10,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                color: '#D4FF3A',
                fontWeight: 700,
              }}
            >
              +{COMMUNITY.members - 6}
            </span>
          </div>
          <div className="flex gap-2">
            {COMMUNITY.sports.map((s) => (
              <span
                key={s}
                className="viz1-avatar"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 9,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,245,240,0.55)',
                  border: '1px solid rgba(245,245,240,0.18)',
                  padding: '4px 8px',
                  borderRadius: 100,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* JOIN button */}
        <button
          type="button"
          data-cursor="hover"
          className="viz1-row viz1-join w-full"
          style={{
            padding: '16px 24px',
            borderRadius: 100,
            background: '#D4FF3A',
            color: '#050505',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontWeight: 700,
            border: 'none',
            cursor: 'none',
            boxShadow: '0 0 30px rgba(212,255,58,0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span>Join community</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Bottom hint — explicit "container" message */}
        <div
          className="viz1-row mt-5 font-mono text-center"
          style={{
            fontSize: 10,
            letterSpacing: '0.22em',
            color: 'rgba(245,245,240,0.4)',
            textTransform: 'uppercase',
          }}
        >
          ↳ The container. Holds every match, every player.
        </div>
      </div>
    </div>
  );
}

// ===================================================================
//  Visualization 02 — Floating match card, iso-tilted
// ===================================================================

type Match = {
  title: string;
  group: string;
  format: string;
  time: string;
  loc: string;
  filled: number;
};

const MATCHES: Match[] = [
  { title: 'Sunday Match', group: 'Stars United', format: '11v11', time: '18:30', loc: 'East Field', filled: 9 },
  { title: 'Friday Pickup', group: 'The Campus', format: '7v7', time: '19:00', loc: 'Campus Court', filled: 6 },
  { title: 'Tournament Final', group: 'City League', format: '5v5', time: '21:00', loc: 'North Field', filled: 4 },
  { title: 'Weekend Scrim', group: 'Workplace Run', format: '9v9', time: '14:00', loc: 'South Pitch', filled: 7 },
];

function MiniLineupGlowing({ filled, total }: { filled: number; total: number }) {
  const positions: Pos[] = [
    [35, 92], [14, 72], [28, 72], [42, 72], [56, 72],
    [22, 50], [35, 50], [48, 50], [22, 25], [48, 25], [35, 18],
  ];
  return (
    <svg viewBox="0 0 70 100" width="110" style={{ display: 'block', filter: 'drop-shadow(0 0 14px rgba(212,255,58,0.18))' }}>
      <rect x="2" y="2" width="66" height="96" fill="rgba(15,46,26,0.9)" stroke="#D4FF3A" strokeOpacity="0.35" strokeWidth="0.5" />
      <line x1="2" y1="50" x2="68" y2="50" stroke="#D4FF3A" strokeOpacity="0.25" strokeWidth="0.3" />
      <circle cx="35" cy="50" r="7" fill="none" stroke="#D4FF3A" strokeOpacity="0.3" strokeWidth="0.3" />
      {positions.slice(0, total).map(([x, y], i) =>
        i < filled ? (
          <circle key={i} cx={x} cy={y} r="2.5" fill="#F5F5F0" />
        ) : (
          <circle key={i} cx={x} cy={y} r="2.5" fill="none" stroke="#D4FF3A" strokeWidth="0.5" strokeDasharray="1 0.8" />
        )
      )}
    </svg>
  );
}

function Viz02() {
  const [idx, setIdx] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % MATCHES.length),
      3200
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.viz2-root', {
        opacity: 0,
        scale: 0.85,
        filter: 'blur(16px)',
        duration: 0.9,
        ease: 'power3.out',
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const m = MATCHES[idx];

  return (
    <div ref={rootRef} className="viz2-root relative w-full h-full flex flex-col items-center justify-center gap-8">
      <div
        style={{ perspective: '1600px', width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <div
          style={{
            transform: 'rotateX(18deg) rotateY(-12deg) rotateZ(-2deg)',
            transformStyle: 'preserve-3d',
            width: 460,
            height: 240,
            position: 'relative',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -30, rotateX: -6 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 18,
                background: 'linear-gradient(135deg, #141414 0%, #0a0a0a 100%)',
                boxShadow:
                  '0 40px 90px rgba(0,0,0,0.7), 0 0 60px rgba(212,255,58,0.18), inset 0 1px 0 rgba(255,255,255,0.05)',
                border: '1px solid rgba(212,255,58,0.28)',
                padding: 24,
                color: '#F5F5F0',
                display: 'flex',
                gap: 18,
                overflow: 'hidden',
              }}
            >
              {/* Inner lime corner ribbon */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 0,
                  height: 0,
                  borderTop: '22px solid #D4FF3A',
                  borderLeft: '22px solid transparent',
                }}
              />

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div
                  style={{
                    alignSelf: 'flex-start',
                    padding: '4px 10px',
                    borderRadius: 100,
                    background: 'rgba(212,255,58,0.15)',
                    border: '1px solid rgba(212,255,58,0.35)',
                    color: '#D4FF3A',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 9,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                  }}
                >
                  {m.group}
                </div>
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 26,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    textTransform: 'uppercase',
                    textShadow: '0 0 20px rgba(212,255,58,0.15)',
                  }}
                >
                  {m.title}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span>
                    <span style={{ color: 'rgba(245,245,240,0.4)' }}>Fmt</span>{' '}
                    <span>{m.format}</span>
                  </span>
                  <span>
                    <span style={{ color: 'rgba(245,245,240,0.4)' }}>Time</span>{' '}
                    <span>{m.time}</span>
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span style={{ color: 'rgba(245,245,240,0.4)' }}>Field</span>{' '}
                  <span>{m.loc}</span>
                </div>
                <div
                  style={{
                    marginTop: 'auto',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#D4FF3A',
                  }}
                >
                  {m.filled}/{parseInt(m.format)} filled
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <MiniLineupGlowing filled={m.filled} total={parseInt(m.format)} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dots below, in screen space */}
      <div className="flex items-center gap-2">
        {MATCHES.map((_, i) => (
          <span
            key={i}
            className="block rounded-full transition-all duration-300"
            style={{
              width: i === idx ? 22 : 5,
              height: 4,
              background: i === idx ? '#D4FF3A' : 'rgba(245,245,240,0.25)',
              boxShadow: i === idx ? '0 0 10px rgba(212,255,58,0.5)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ===================================================================
//  Visualization 03 — Isometric pitch with scan-line formation
// ===================================================================

function Viz03() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      // Emerge from dark
      gsap.from('.viz3-root', {
        opacity: 0,
        scale: 0.85,
        filter: 'blur(18px)',
        duration: 0.9,
        ease: 'power3.out',
      });

      // Build master loop
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, delay: 0.3 });

      tl.set('.viz3-dot', { opacity: 0, scale: 0, transformOrigin: 'center' });
      tl.set('.viz3-counter', { innerText: '0/11' });
      tl.set(scanRef.current, { attr: { y1: -12, y2: -12 }, opacity: 0 });

      tl.to(scanRef.current, { opacity: 0.95, duration: 0.15 });
      tl.to(
        scanRef.current,
        {
          attr: { y1: 115, y2: 115 },
          duration: 3,
          ease: 'none',
        },
        '<'
      );

      const rows = [
        { sel: '.dot-gk', atY: 92 },
        { sel: '.dot-def', atY: 72 },
        { sel: '.dot-mid', atY: 48 },
        { sel: '.dot-fwd', atY: 25 },
      ];
      rows.forEach((r) => {
        const atT = 0.15 + (r.atY / 115) * 3;
        tl.to(
          r.sel,
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            stagger: 0.08,
            ease: 'back.out(2)',
          },
          atT
        );
      });

      tl.to(scanRef.current, { opacity: 0, duration: 0.3 }, 3.2);

      tl.to(
        '.viz3-counter',
        { innerText: '10/11', duration: 3, ease: 'none', snap: { innerText: 1 } },
        0.2
      );

      tl.fromTo(
        '.viz3-empty-ring',
        { scale: 1, opacity: 0 },
        {
          scale: 1.5,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          transformOrigin: 'center',
        },
        3.5
      );
      tl.to(
        '.viz3-empty-ring',
        { scale: 1, opacity: 0.6, duration: 0.5, ease: 'power2.inOut' },
        4
      );
      tl.to({}, { duration: 0.6 });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="viz3-root relative w-full h-full">
      <IsoStage tilt={42} roll={-6} scale={1.05}>
        <svg
          viewBox="-10 -12 90 124"
          width="620"
          style={{
            display: 'block',
            overflow: 'visible',
            filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.55))',
          }}
        >
          <defs>
            <linearGradient id="pitchFillV3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F2E1A" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#071a0e" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="pitchGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#D4FF3A" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#D4FF3A" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="scanGradV3" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#D4FF3A" stopOpacity="0" />
              <stop offset="50%" stopColor="#D4FF3A" stopOpacity="1" />
              <stop offset="100%" stopColor="#D4FF3A" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Hero-style pitch (white lines only, no green fill) */}
          <HeroPitchSvg />

          {/* Scan line */}
          <line
            ref={scanRef}
            x1="-3"
            y1="-12"
            x2="73"
            y2="-12"
            stroke="#D4FF3A"
            strokeWidth="1"
            opacity="0"
            style={{ filter: 'drop-shadow(0 0 3px rgba(212,255,58,0.8))' }}
          />

          {/* Empty slot — pulsing lime */}
          <circle
            className="viz3-empty-ring"
            cx={POS433[CF_INDEX][0]}
            cy={POS433[CF_INDEX][1]}
            r="4"
            fill="none"
            stroke="#D4FF3A"
            strokeWidth="0.5"
            opacity="0"
          />
          <circle
            cx={POS433[CF_INDEX][0]}
            cy={POS433[CF_INDEX][1]}
            r="2.8"
            fill="none"
            stroke="#D4FF3A"
            strokeOpacity="0.7"
            strokeWidth="0.4"
          />

          {/* Player dots — hero style, row-tagged for scan reveal */}
          {POS433.map(([x, y], i) => {
            if (i === CF_INDEX) return null;
            const rowCls =
              i === 0 ? 'dot-gk' : i <= 4 ? 'dot-def' : i <= 7 ? 'dot-mid' : 'dot-fwd';
            return (
              <g key={i} className={`viz3-dot ${rowCls}`}>
                <HeroPlayerDot cx={x} cy={y} />
              </g>
            );
          })}
        </svg>
      </IsoStage>

      {/* Counter floating top-right */}
      <div
        className="absolute"
        style={{
          top: 24,
          right: 24,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          letterSpacing: '0.22em',
          color: '#D4FF3A',
          padding: '6px 14px',
          borderRadius: 100,
          background: 'rgba(10,10,10,0.85)',
          border: '1px solid rgba(212,255,58,0.4)',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 0 24px rgba(212,255,58,0.18)',
        }}
      >
        <span className="viz3-counter">0/11</span>
      </div>
    </div>
  );
}

// ===================================================================
//  Visualization 04 — Iso pitch with YOU drop-in
// ===================================================================

function Viz04({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
    const ctx = gsap.context(() => {
      // Emerge
      gsap.from('.viz4-root', {
        opacity: 0,
        scale: 0.85,
        filter: 'blur(18px)',
        duration: 0.9,
        ease: 'power3.out',
      });

      gsap.set('.viz4-you', {
        opacity: 0,
        y: -28,
        scale: 0.2,
        transformOrigin: 'center',
      });
      gsap.set('.viz4-particle', { opacity: 0, x: 0, y: 0, scale: 1 });
      gsap.set('.viz4-badge', { opacity: 0, scale: 0, transformOrigin: 'center' });
      gsap.set('.viz4-counter', { innerText: '10/11' });

      const pulse = gsap.to('.viz4-slot-pulse', {
        scale: 1.4,
        opacity: 0.25,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        transformOrigin: 'center',
      });

      if (!active) return;

      const tl = gsap.timeline({ delay: 0.6 });
      tlRef.current = tl;

      tl.to('.viz4-slot-pulse', { opacity: 0, duration: 0.2 }, 0.3);
      tl.add(() => pulse.kill(), 0.3);

      tl.to(
        '.viz4-you',
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.8)' },
        0.4
      );

      tl.to('.viz4-particle', { opacity: 1, duration: 0.05 }, 0.65);
      tl.to(
        '.viz4-particle',
        {
          x: (i) => Math.cos((i / 14) * Math.PI * 2) * 46,
          y: (i) => Math.sin((i / 14) * Math.PI * 2) * 46,
          opacity: 0,
          scale: 0.4,
          duration: 0.8,
          ease: 'power3.out',
        },
        0.7
      );

      tl.to(
        '.viz4-counter',
        {
          innerText: '11/11',
          duration: 0.4,
          ease: 'power2.out',
          snap: { innerText: 1 },
        },
        0.85
      );

      tl.to(
        '.viz4-badge',
        { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
        1.0
      );
    }, rootRef);

    return () => ctx.revert();
  }, [active]);

  const [sx, sy] = POS433[CF_INDEX];

  return (
    <div ref={rootRef} className="viz4-root relative w-full h-full">
      <IsoStage tilt={42} roll={-6} scale={1.05}>
        <svg
          viewBox="-10 -12 90 124"
          width="620"
          style={{
            display: 'block',
            overflow: 'visible',
            filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.55))',
          }}
        >
          <defs>
            <linearGradient id="pitchFillV4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F2E1A" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#071a0e" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="slotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4FF3A" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#D4FF3A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Hero-style pitch */}
          <HeroPitchSvg />

          {/* 10 pre-filled players — hero-style dots */}
          {POS433.filter((_, i) => i !== CF_INDEX).map(([px, py], i) => (
            <HeroPlayerDot key={i} cx={px} cy={py} />
          ))}

          {/* Slot pulse + ring */}
          <circle cx={sx} cy={sy} r="10" fill="url(#slotGlow)" />
          <circle
            className="viz4-slot-pulse"
            cx={sx}
            cy={sy}
            r="4"
            fill="none"
            stroke="#D4FF3A"
            strokeWidth="0.6"
          />
          <circle cx={sx} cy={sy} r="2.8" fill="none" stroke="#D4FF3A" strokeOpacity="0.7" strokeWidth="0.5" />

          {/* YOU drop — bigger dot + larger SVG text (scales crisply in
              the parent iso transform). textRendering hint + Inter so
              glyphs don't pixelate at this size. */}
          <g className="viz4-you">
            <circle cx={sx} cy={sy} r="4.4" fill="#D4FF3A" filter="url(#glow)" />
            <text
              x={sx}
              y={sy}
              textAnchor="middle"
              dominantBaseline="central"
              textRendering="optimizeLegibility"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 2.8,
                fontWeight: 800,
                fill: '#050505',
                letterSpacing: 0,
              }}
            >
              YOU
            </text>
          </g>

          {/* Particles */}
          {Array.from({ length: 14 }).map((_, i) => (
            <circle
              key={i}
              className="viz4-particle"
              cx={sx}
              cy={sy}
              r="0.9"
              fill="#D4FF3A"
              opacity="0"
            />
          ))}
        </svg>
      </IsoStage>

      {/* Counter */}
      <div
        className="absolute"
        style={{
          top: 24,
          right: 24,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          letterSpacing: '0.22em',
          color: '#D4FF3A',
          padding: '6px 14px',
          borderRadius: 100,
          background: 'rgba(10,10,10,0.85)',
          border: '1px solid rgba(212,255,58,0.4)',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 0 24px rgba(212,255,58,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span className="viz4-counter">10/11</span>
        <span
          className="viz4-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#D4FF3A',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="3">
            <path d="M20 6 L9 17 L4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

    </div>
  );
}

// ===================================================================
//  Viz router
// ===================================================================

function VizFor({ index, active }: { index: number; active: boolean }) {
  switch (index) {
    case 0: return <Viz01 />;
    case 1: return <Viz02 />;
    case 2: return <Viz03 />;
    case 3: return <Viz04 active={active} />;
    default: return null;
  }
}

// ===================================================================
//  Step row
// ===================================================================

function StepRow({
  step,
  active,
  onHover,
  onLeave,
  onClick,
}: {
  step: Step;
  active: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const dotRef = useRef<HTMLSpanElement>(null);
  const wasActive = useRef(active);

  useEffect(() => {
    if (active && !wasActive.current && dotRef.current) {
      gsap.fromTo(
        dotRef.current,
        { scale: 1 },
        { scale: 1.3, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 }
      );
    }
    wasActive.current = active;
  }, [active]);

  return (
    <div
      className="group cursor-default"
      data-cursor="hover"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 mb-3">
        <span
          ref={dotRef}
          className="inline-block"
          style={{
            width: 12,
            height: 12,
            borderRadius: 2,
            border: active ? 'none' : '1px solid rgba(245,245,240,0.3)',
            background: active ? '#D4FF3A' : 'transparent',
            transition: 'background 0.4s ease-out, border-color 0.4s ease-out',
          }}
        />
        <span
          className="font-mono"
          style={{
            fontSize: 12,
            letterSpacing: '0.25em',
            color: active ? '#D4FF3A' : 'rgba(245,245,240,0.35)',
            transition: 'color 0.4s ease-out',
          }}
        >
          {step.num}
        </span>
      </div>

      <h3
        className="headline-display uppercase leading-[0.95] mb-4"
        style={{
          fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
          color: active ? '#F5F5F0' : 'rgba(245,245,240,0.28)',
          transition: 'color 0.4s ease-out',
        }}
      >
        {step.title}
      </h3>

      <p
        className="font-body leading-relaxed max-w-[46ch]"
        style={{
          fontSize: 17,
          color: active ? 'rgba(245,245,240,0.75)' : 'rgba(245,245,240,0.38)',
          transition: 'color 0.4s ease-out',
        }}
      >
        {step.body}
      </p>
    </div>
  );
}

// ===================================================================
//  Main section
// ===================================================================

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  // Hover OR click sticks a step active. Default to 01 until the user
  // engages. No scroll-driven auto-advance.
  const [locked, setLocked] = useState<number>(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? locked;

  return (
    <section
      ref={sectionRef}
      id="how"
      data-progress-section
      data-progress-label="03 · How It Works"
      data-palette="how"
      className="relative w-full"
      style={{ minHeight: '220vh' }}
    >
      <div className="grid-12 pt-[18vh] relative z-10">
        <div className="col-span-12 md:col-start-2 md:col-span-10">
          <div className="mono-eyebrow mb-5">
            [ Chapter 03 · How it works ]
          </div>
          <h2 className="headline-display uppercase text-ink text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] max-w-[18ch]">
            From discovery to kickoff.
          </h2>
        </div>
      </div>

      <div className="grid-12 mt-24 relative z-10">
        {/* LEFT — step list */}
        <div className="col-span-12 md:col-start-2 md:col-span-5 flex flex-col gap-16 pb-[30vh]">
          {STEPS.map((step, i) => (
            <StepRow
              key={i}
              step={step}
              active={active === i}
              onHover={() => setHovered(i)}
              onLeave={() => setHovered(null)}
              onClick={() => setLocked(i)}
            />
          ))}
        </div>

        {/* RIGHT — sticky big glowing visual, no border, fills space */}
        <div className="hidden md:block md:col-start-7 md:col-span-6 relative">
          <div
            className="sticky"
            style={{
              top: 0,
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'sticky',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '72vh',
                maxHeight: 720,
                position: 'relative',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <VizFor index={active} active={active === 3} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
