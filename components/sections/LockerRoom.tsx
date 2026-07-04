'use client';

import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

// The 3D pitch from Hero, repurposed as a backdrop. Loaded client-side only
// because Three.js doesn't run during SSR.
const RoadmapPitch = dynamic(() => import('@/components/three/RoadmapPitch'), {
  ssr: false,
});

// ===================================================================
//  Data — 7 features × 4 bullets, regrouped per the new phase plan.
//
//  NOW   (building):   Tournaments · More sports
//  NEXT  (in design):  Match chat · AI Match Builder · AI Captain
//  LATER (roadmap):    SportTimes Store · Venue booking
//
//  `pos` = initial percentage position on the 100×100 board viewBox.
//  Magnets are placed with intent (cluster per phase) and connected
//  by a single chalk thread in build order (NOW → NEXT → LATER).
// ===================================================================

type Phase = 'now' | 'next' | 'later';

type Feature = {
  id: string;
  seq: string;
  name: string;
  phase: Phase;
  summary: string;
  bullets: string[];
  statusNote: string;
  pos: { x: number; y: number };
};

// Positions live in the board's viewBox space: 100 wide × 60 tall (horizontal
// pitch). Magnets flow LEFT → RIGHT in build order, with vertical undulation
// so the connecting curve reads as a wave.

const FEATURES: Feature[] = [
  // NOW (left)
  {
    id: 'tournaments', seq: '01', name: 'Tournaments', phase: 'now',
    pos: { x: 10, y: 38 },
    summary: 'Run complete tournament brackets inside your community — no spreadsheets.',
    bullets: [
      'Single-elim, double-elim, round-robin',
      'Auto-seeding from match history',
      'Live bracket everyone can watch',
      'Shareable finals poster',
    ],
    statusNote: 'Building now — expected in the next release.',
  },
  {
    id: 'more-sports', seq: '02', name: 'More sports', phase: 'now',
    pos: { x: 23, y: 22 },
    summary: 'The catalog keeps growing with the community.',
    bullets: [
      'Sports adopted quarterly by demand',
      'Players vote for their sport in-app',
      'Padel, Volleyball, Futsal, Tennis shortlisted',
      'Same lineup engine, any format',
    ],
    statusNote: 'Rolling adoption — quarterly review cycle.',
  },

  // NEXT
  {
    id: 'match-chat', seq: '03', name: 'Match chat', phase: 'next',
    pos: { x: 37, y: 42 },
    summary: 'A chat thread scoped to one match — goes quiet when the whistle blows.',
    bullets: [
      'Auto-opens when a match is set',
      'Auto-archives after full-time',
      'Drop-outs + confirmations live inline',
      'No group-chat bleed into your life',
    ],
    statusNote: 'In design — shipping with the new match card.',
  },
  {
    id: 'ai-match-builder', seq: '04', name: 'AI Match Builder', phase: 'next',
    pos: { x: 50, y: 24 },
    summary: 'Describe your match, we line it up.',
    bullets: [
      'Suggests a pitch from community venues',
      'Invites players who match the slot',
      'Balances sides on arrival',
      'Sends a ready-to-confirm match card',
    ],
    statusNote: 'Sketching the flows — design review in progress.',
  },
  {
    id: 'ai-captain', seq: '05', name: 'AI Captain', phase: 'next',
    pos: { x: 63, y: 42 },
    summary: 'The captain that keeps the match together for you.',
    bullets: [
      'Sends reminders before kickoff',
      'Handles drop-outs and subs',
      'Rebalances sides automatically',
      'Suggests positions by skill',
    ],
    statusNote: 'Sketching the decision logic right now.',
  },

  // LATER (rendered as dim/muted dots — futureward)
  {
    id: 'store', seq: '06', name: 'SportTimes Store', phase: 'later',
    pos: { x: 77, y: 24 },
    summary: 'Kits, gear, and community merch — ordered from the same app.',
    bullets: [
      'Team jerseys, scarves, shorts, bags',
      'Community-branded merch drops',
      'Local supplier network',
      'Pooled orders, no middle-man markups',
    ],
    statusNote: 'On the roadmap — partner discussions underway.',
  },
  {
    id: 'venue-booking', seq: '07', name: 'Venue booking', phase: 'later',
    pos: { x: 90, y: 40 },
    summary: 'Book the pitch straight from the match card.',
    bullets: [
      'Live availability across venues',
      'One-tap booking confirmations',
      'Auto-split cost across the roster',
      'Calendar + email confirmations',
    ],
    statusNote: 'On the roadmap — venue integrations in scoping.',
  },
];

// Kept as data only for the modal phase label string; no global UI for these.
const PHASES = [
  { id: 'now',   label: 'Now',   note: 'Building'  },
  { id: 'next',  label: 'Next',  note: 'In design' },
  { id: 'later', label: 'Later', note: 'Roadmap'   },
] as const;

// Build a SMOOTH curve through the magnets in build order using
// Catmull-Rom-style cubic Bezier interpolation. Tension 0.5 gives a
// natural, wave-like flow without sharp corners.
function buildThreadD(positions: Record<string, { x: number; y: number }>): string {
  const pts = FEATURES.map((f) => positions[f.id] ?? f.pos);
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;

  const tension = 0.5;
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;

  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const pPrev = pts[i - 2] ?? p0;
    const pNext = pts[i + 1] ?? p1;

    const cp1x = p0.x + ((p1.x - pPrev.x) * tension) / 3;
    const cp1y = p0.y + ((p1.y - pPrev.y) * tension) / 3;
    const cp2x = p1.x - ((pNext.x - p0.x) * tension) / 3;
    const cp2y = p1.y - ((pNext.y - p0.y) * tension) / 3;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  }
  return d;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ===================================================================
//  Section
// ===================================================================

export default function LockerRoom() {
  return (
    <section
      id="roadmap-features"
      data-progress-section
      data-progress-label="Roadmap"
      data-palette="hero"
      className="relative"
      style={{
        padding: 'clamp(6rem, 12vh, 9rem) 0 clamp(6rem, 12vh, 9rem)',
        overflow: 'hidden',
      }}
    >
      {/* Section heading sits in the page grid; the board breaks out below. */}
      <div className="grid-12" data-reveal>
        <div
          className="col-span-12"
          data-reveal-child
          style={{
            marginBottom: 'clamp(2.5rem, 5vh, 4rem)',
            textAlign: 'center',
          }}
        >
          <div
            className="mono-eyebrow"
            style={{ marginBottom: 24 }}
          >
            Roadmap
          </div>
          <h2
            className="headline-display"
            style={{
              fontSize: 'clamp(2.25rem, 5.4vw, 4.4rem)',
              color: 'var(--ink)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              textTransform: 'none',
              margin: '0 auto',
              maxWidth: '22ch',
            }}
          >
            <span style={{ color: 'var(--lime)' }}>Next</span> on the pitch.
          </h2>
        </div>
      </div>

      <DesktopBoard />
      <MobileList />
    </section>
  );
}

// ===================================================================
//  Desktop board — full-bleed dark slate, draggable magnets, chalk
//  thread, slide-in detail panel. Hidden < 768px (mobile uses the list).
// ===================================================================

function DesktopBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const positionerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Canonical positions (only updated when a drag ends — during the drag
  // we mutate the magnet + thread inline via refs to keep React idle).
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(
    () => {
      const init: Record<string, { x: number; y: number }> = {};
      for (const f of FEATURES) init[f.id] = { ...f.pos };
      return init;
    }
  );

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Container size — needed because `transform: translate3d(%, %, 0)` uses
  // percentages OF THE ELEMENT'S OWN size (useless for placing magnets on the
  // board). We track the board's pixel size and compute pixel translations
  // from the canonical % positions instead.
  const [boardSize, setBoardSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // ResizeObserver — tracks board pixel dimensions for translate computation.
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setBoardSize((prev) =>
        prev.w === r.width && prev.h === r.height ? prev : { w: r.width, h: r.height }
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Initial thread `d` derived from canonical positions.
  const threadD = useMemo(() => buildThreadD(positions), [positions]);

  // GSAP-driven gentle float on each magnet (independent y bobbing).
  // Each dot bobs with its own period + phase so they don't sync up.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const tweens: gsap.core.Tween[] = [];
    FEATURES.forEach((f, i) => {
      const el = positionerRefs.current[f.id];
      if (!el) return;
      // Find the inner floater wrapper inside the positioner.
      const floater = el.querySelector<HTMLElement>('[data-floater]');
      if (!floater) return;
      const tween = gsap.to(floater, {
        y: '-=10',
        duration: 2.6 + (i % 3) * 0.35,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 0.18,
      });
      tweens.push(tween);
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  // GSAP ScrollTrigger ties the curve's stroke-dashoffset to the section's
  // scroll progress: 0 at top-of-board-entering-viewport, 1 at bottom-leaving.
  // Curve draws top → bottom as the user scrolls through the section.
  useEffect(() => {
    const path = threadRef.current;
    const board = boardRef.current;
    if (!path || !board) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Path length depends on layout — recompute after first paint.
    const setup = () => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      if (reduced) {
        // Reduced motion: render the curve already drawn.
        path.style.strokeDashoffset = '0';
        return null;
      }
      path.style.strokeDashoffset = `${len}`;
      gsap.registerPlugin(ScrollTrigger);
      // Pin the board while the curve draws — page scroll feels as if it
      // pauses until all dots are linked, then resumes.
      const trigger = ScrollTrigger.create({
        trigger: board,
        start: 'top top',
        end: '+=120%',
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          path.style.strokeDashoffset = `${len * (1 - self.progress)}`;
        },
        onRefresh: () => {
          const newLen = path.getTotalLength();
          path.style.strokeDasharray = `${newLen}`;
        },
      });
      return trigger;
    };

    // Defer setup so getTotalLength is accurate (board size known).
    const id = window.setTimeout(() => {
      const trigger = setup();
      (path as unknown as { _trigger?: ScrollTrigger | null })._trigger = trigger;
    }, 80);

    return () => {
      window.clearTimeout(id);
      const trigger = (path as unknown as { _trigger?: ScrollTrigger | null })._trigger;
      trigger?.kill();
    };
  }, []);

  // Single source of truth for what's currently on screen, used both
  // when we rebuild the thread during drag and when we apply
  // post-drag positions on render.
  const livePosRef = useRef<Record<string, { x: number; y: number }>>(positions);
  useEffect(() => {
    livePosRef.current = positions;
  }, [positions]);

  // Apply transforms to the positioners after every state change.
  // We use transform: translate3d ONLY — never left/top.
  // Positions live in board viewBox space (x: 0-100, y: 0-60); convert to px here.
  useLayoutEffect(() => {
    if (boardSize.w === 0) return;
    for (const f of FEATURES) {
      const el = positionerRefs.current[f.id];
      if (!el) continue;
      const p = positions[f.id];
      const px = (p.x / 100) * boardSize.w;
      const py = (p.y / 60) * boardSize.h;
      el.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`;
    }
  }, [positions, boardSize]);

  // ============================================================
  //  (Drag has been removed — magnets are now static + GSAP floating.)
  // ============================================================

  //  Keyboard — Escape clears the hover tooltip
  // ============================================================
  useEffect(() => {
    if (!hoveredId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHoveredId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hoveredId]);

  const hovered = FEATURES.find((f) => f.id === hoveredId);

  return (
    <div className="board-row" style={{ position: 'relative' }}>
      <div
        ref={boardRef}
        className="board"
        style={{
          position: 'relative',
          // Wider than the page grid (1440px) but not full-bleed —
          // 92% of viewport with a comfortable max so it never gets
          // ridiculous on ultrawide screens.
          width: 'min(92vw, 1700px)',
          marginLeft: 'auto',
          marginRight: 'auto',
          aspectRatio: '100 / 60',
        }}
      >
        {/* 3D pitch — transparent inclined wireframe behind everything */}
        <RoadmapPitch />

        {/* Smooth connecting curve — single Catmull-Rom path drawn left→right
            as the user scrolls (see GSAP ScrollTrigger above). */}
        <svg
          aria-hidden
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <path
            ref={threadRef}
            d={threadD}
            fill="none"
            stroke="rgba(212, 255, 58, 0.42)"
            strokeWidth="0.28"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: '9999', strokeDashoffset: '9999' }}
          />
        </svg>

        {/* Magnets — absolutely positioned via transform: translate3d only.
            Nested DOM: positioner (sets px position) → floater (GSAP bobbing)
            → magnet-pin (visual + hover lift). Each layer animates independently. */}
        {FEATURES.map((f) => (
          <div
            key={f.id}
            ref={(el) => {
              positionerRefs.current[f.id] = el;
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'translate3d(0px, 0px, 0)',
              zIndex: 10,
            }}
          >
            <div data-floater style={{ willChange: 'transform' }}>
              <Magnet
                feature={f}
                onHover={() => setHoveredId(f.id)}
                onUnhover={() => setHoveredId((cur) => (cur === f.id ? null : cur))}
              />
            </div>
          </div>
        ))}

        {/* Hover/tap tooltip — positioned next to the hovered magnet */}
        <HoverTooltip
          feature={hovered ?? null}
          position={hovered ? positions[hovered.id] : null}
          boardSize={boardSize}
          onPointerEnter={() => {
            // No-op; tooltip is pointer-events:none so this never fires.
          }}
          onClose={() => setHoveredId(null)}
        />
      </div>

      <style jsx>{`
        @media (max-width: 767px) {
          .board-row { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ===================================================================
//  Magnet — the visual chip + the pointer-event surface
//  Outer wrapper: positioning (transform: translate3d only)
//  Inner chip:    hover/active styling (no transforms during idle,
//                  so the section is genuinely zero-work when idle)
// ===================================================================

function Magnet({
  feature,
  onHover,
  onUnhover,
}: {
  feature: Feature;
  onHover: () => void;
  onUnhover: () => void;
}) {
  const isDim = feature.phase === 'later';
  const phaseLabel =
    feature.phase === 'now' ? 'NOW' : feature.phase === 'next' ? 'NEXT' : 'LATER';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${feature.name} details`}
      onPointerEnter={onHover}
      onPointerLeave={onUnhover}
      onFocus={onHover}
      onBlur={onUnhover}
      onClick={onHover}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onHover();
        }
      }}
      className="magnet-pin"
      style={{
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {/* The solid dot */}
      <span
        aria-hidden
        className="magnet-dot"
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: isDim
            ? 'rgba(150, 160, 170, 0.55)'
            : 'var(--lime)',
          boxShadow: isDim
            ? 'none'
            : '0 0 0 6px rgba(212, 255, 58, 0.14), 0 0 32px rgba(212, 255, 58, 0.45)',
        }}
      />

      {/* Per-dot phase eyebrow */}
      <span
        style={{
          marginTop: 14,
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 13,
          letterSpacing: '0.24em',
          fontWeight: 700,
          color: isDim ? 'rgba(245, 245, 240, 0.55)' : 'var(--lime)',
        }}
      >
        {phaseLabel}
      </span>

      {/* Feature name */}
      <span
        style={{
          marginTop: 6,
          fontFamily: 'var(--font-display), Inter, sans-serif',
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          color: isDim ? 'rgba(245, 245, 240, 0.7)' : 'var(--ink)',
        }}
      >
        {feature.name}
      </span>

      <style jsx>{`
        .magnet-pin {
          transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .magnet-pin:hover :global(.magnet-dot) {
          box-shadow: 0 0 0 8px rgba(212, 255, 58, 0.22),
            0 0 40px rgba(212, 255, 58, 0.60);
          transform: scale(1.08);
        }
        .magnet-pin:focus-visible {
          outline: 2px solid var(--lime);
          outline-offset: 10px;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}

// ===================================================================
//  Hover tooltip — small detail card next to the hovered magnet.
//  Replaces the previous click-to-open modal. Pointer-events: none so it
//  doesn't trigger pointer-out on the magnet underneath.
// ===================================================================

function HoverTooltip({
  feature,
  position,
  boardSize,
}: {
  feature: Feature | null;
  position: { x: number; y: number } | null;
  boardSize: { w: number; h: number };
  onPointerEnter?: () => void;
  onClose?: () => void;
}) {
  if (!feature || !position || boardSize.w === 0) return null;

  // Convert viewBox-space position to pixels in the board (100 wide × 60 tall)
  const xPx = (position.x / 100) * boardSize.w;
  const yPx = (position.y / 60) * boardSize.h;

  // Pick side so the tooltip doesn't overflow the board edge.
  const goLeft = position.x > 55;
  const goUp = position.y > 40;

  const offsetX = 32;
  const transform = goLeft
    ? `translate3d(${(xPx - offsetX).toFixed(2)}px, ${yPx.toFixed(2)}px, 0) translate(-100%, ${goUp ? '-100%' : '0%'})`
    : `translate3d(${(xPx + offsetX).toFixed(2)}px, ${yPx.toFixed(2)}px, 0) translate(0%, ${goUp ? '-100%' : '0%'})`;

  const phaseLabel =
    feature.phase === 'now'
      ? 'Now · Building'
      : feature.phase === 'next'
      ? 'Next · In design'
      : 'Later · Roadmap';

  return (
    <div
      role="tooltip"
      aria-live="polite"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transform,
        width: 320,
        background: 'rgba(20, 23, 28, 0.96)',
        border: '1px solid rgba(245, 245, 240, 0.10)',
        borderRadius: 'var(--card-radius)',
        padding: 20,
        zIndex: 50,
        pointerEvents: 'none',
        boxShadow: '0 18px 50px rgba(0, 0, 0, 0.55)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--lime)',
          marginBottom: 8,
        }}
      >
        {feature.seq} · {phaseLabel}
      </div>
      <h3
        className="headline-display"
        style={{
          fontSize: 20,
          color: 'var(--ink)',
          lineHeight: 1.1,
          letterSpacing: '-0.015em',
          textTransform: 'none',
          marginBottom: 10,
        }}
      >
        {feature.name}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body), Inter, sans-serif',
          fontSize: 13,
          lineHeight: 1.5,
          color: 'var(--muted)',
          marginBottom: 14,
        }}
      >
        {feature.summary}
      </p>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          marginBottom: 14,
        }}
      >
        {feature.bullets.map((b) => (
          <li
            key={b}
            style={{
              fontFamily: 'var(--font-body), Inter, sans-serif',
              fontSize: 13,
              lineHeight: 1.45,
              color: 'var(--ink)',
              paddingLeft: 14,
              position: 'relative',
            }}
          >
            <span
              aria-hidden
              style={{
                position: 'absolute',
                left: 2,
                top: 0,
                color: 'var(--lime)',
                fontWeight: 800,
              }}
            >
              ·
            </span>
            {b}
          </li>
        ))}
      </ul>
      <div
        style={{
          paddingTop: 10,
          borderTop: '1px solid rgba(245, 245, 240, 0.08)',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(245, 245, 240, 0.45)',
        }}
      >
        {feature.statusNote}
      </div>
    </div>
  );
}

// ===================================================================
//  Mobile list — labelled stacked groups, tap-to-open vertical list
//  Shown only < 768px. Tap a magnet → inline expand its bullets.
// ===================================================================

function MobileList() {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div
      className="grid-12 mobile-list"
      data-reveal
      style={{ display: 'none' }}
    >
      <div
        className="col-span-12"
        data-reveal-child
        style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
      >
        {PHASES.map((p) => (
          <div key={p.id}>
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 11,
                letterSpacing: '0.28em',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              {p.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body), Inter, sans-serif',
                fontSize: 13,
                color: 'var(--muted)',
                marginBottom: 14,
              }}
            >
              {p.note}
            </div>
            <div
              aria-hidden
              style={{
                height: 1,
                background: 'rgba(245, 245, 240, 0.08)',
                marginBottom: 16,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FEATURES.filter((f) => f.phase === p.id).map((f) => (
                <MobileCard
                  key={f.id}
                  feature={f}
                  open={openId === f.id}
                  onToggle={() => setOpenId(openId === f.id ? null : f.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 767px) {
          .mobile-list { display: grid !important; }
        }
      `}</style>
    </div>
  );
}

function MobileCard({
  feature,
  open,
  onToggle,
}: {
  feature: Feature;
  open: boolean;
  onToggle: () => void;
}) {
  const detailId = `mobile-${feature.id}`;
  const headingId = `mobile-${feature.id}-heading`;
  return (
    <article
      style={{
        background: '#14171C',
        border: '1px solid rgba(245, 245, 240, 0.08)',
        borderRadius: 'var(--card-radius)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailId}
        onClick={onToggle}
        style={{
          width: '100%',
          padding: 18,
          background: 'transparent',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          color: 'var(--ink)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.22em',
              color: 'var(--muted)',
            }}
          >
            {feature.seq}
          </span>
          <span
            aria-hidden
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 14,
              color: 'var(--muted)',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 220ms cubic-bezier(.22,.61,.36,1)',
              display: 'inline-block',
            }}
          >
            ⌄
          </span>
        </div>
        <h3
          id={headingId}
          className="headline-display"
          style={{
            fontSize: 18,
            color: 'var(--ink)',
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
            textTransform: 'none',
          }}
        >
          {feature.name}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body), Inter, sans-serif',
            fontSize: 13,
            lineHeight: 1.5,
            color: 'var(--muted)',
            margin: 0,
          }}
        >
          {feature.summary}
        </p>
      </button>

      <div
        id={detailId}
        role="region"
        aria-labelledby={headingId}
        style={{
          maxHeight: open ? 600 : 0,
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 320ms cubic-bezier(.22,.61,.36,1), opacity 320ms cubic-bezier(.22,.61,.36,1)',
        }}
      >
        <div style={{ padding: '0 18px 18px' }}>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {feature.bullets.map((b) => (
              <li
                key={b}
                style={{
                  fontFamily: 'var(--font-body), Inter, sans-serif',
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: 'var(--ink)',
                  paddingLeft: 14,
                  position: 'relative',
                }}
              >
                <span aria-hidden style={{ position: 'absolute', left: 2, top: 0, color: 'var(--lime)', fontWeight: 800 }}>
                  ·
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: '1px solid rgba(245, 245, 240, 0.08)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            {feature.statusNote}
          </div>
        </div>
      </div>
    </article>
  );
}
