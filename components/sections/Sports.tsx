'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CornerBrackets from '@/components/ui/CornerBrackets';

// ===================================================================
//  Data
// ===================================================================

type PanelId = 'football' | 'basketball' | 'handball' | 'more';

type Panel = {
  id: PanelId;
  palette: string;
  eyebrow: string;
  accent: string;
  headline: string[];
  body: string;
  pills?: string[];
  venueKind?: 'football' | 'basketball' | 'handball';
};

const PANELS: Panel[] = [
  {
    id: 'football',
    palette: 'football',
    eyebrow: '[ Football ]',
    accent: '#D4FF3A',
    headline: ['See your team.', 'Claim your spot.', 'Play.'],
    body:
      'From Tuesday pickup to Sunday league — every formation, every format, every player on the pitch before the whistle.',
    pills: ['5v5', '7v7', '9v9', '11v11'],
    venueKind: 'football',
  },
  {
    id: 'basketball',
    palette: 'basketball',
    eyebrow: '[ Basketball ]',
    accent: '#FF6B1A',
    headline: ['Build your five.', 'Reserve the court.', 'Play.'],
    body:
      'Pickup runs, rec leagues, 3v3 tournaments — organized with real rosters, not "I\u2019ll try to be there."',
    pills: ['3v3', '5v5', 'Half court', 'Full court'],
    venueKind: 'basketball',
  },
  {
    id: 'handball',
    palette: 'handball',
    eyebrow: '[ Handball ]',
    accent: '#00E5FF',
    headline: ['Handball,', 'with tools', 'that fit.'],
    body:
      'Club rosters. School teams. League brackets. Built for the way handball actually works — not bolted on from another sport.',
    pills: ['7v7', 'Club', 'School', 'League'],
    venueKind: 'handball',
  },
  {
    id: 'more',
    palette: 'roadmap',
    eyebrow: '[ And more ]',
    accent: '#D4FF3A',
    headline: ['Your sport', 'is next.'],
    body:
      'The same visual lineup, community, and match tools — coming to the sports your people actually play.',
  },
];

const MORE_LABELS: Array<{
  name: string;
  left: string;
  top: string;
  size: number;
}> = [
  { name: 'Running',      left: '6%',  top: '12%', size: 2.5 },
  { name: 'Tennis',       left: '54%', top: '6%',  size: 2.3 },
  { name: 'Volleyball',   left: '28%', top: '28%', size: 2.4 },
  { name: 'Padel',        left: '72%', top: '26%', size: 2.0 },
  { name: 'Gym',          left: '8%',  top: '46%', size: 2.6 },
  { name: 'Futsal',       left: '48%', top: '48%', size: 2.1 },
  { name: 'Pool',         left: '76%', top: '50%', size: 2.2 },
  { name: 'Rugby',        left: '22%', top: '72%', size: 2.0 },
  { name: 'Table Tennis', left: '56%', top: '74%', size: 1.7 },
];

// ===================================================================
//  Per-format lineups — dots change when a format pill is active
// ===================================================================

type Dot = [number, number];

const FOOTBALL_FORMATIONS: Record<string, Dot[]> = {
  '5v5': [
    [35, 95],          // GK
    [18, 72], [52, 72], // back pair
    [35, 50],          // mid
  ],
  '7v7': [
    [35, 95],
    [15, 78], [55, 78],
    [15, 55], [35, 52], [55, 55],
  ],
  '9v9': [
    [35, 95],
    [14, 80], [35, 82], [56, 80],
    [16, 58], [35, 52], [54, 58],
    [26, 28],
  ],
  '11v11': [
    [35, 95],
    [11, 80], [26, 82], [44, 82], [59, 80],
    [20, 58], [35, 52], [50, 58],
    [16, 28], [54, 28],
  ],
};

const BASKETBALL_FORMATIONS: Record<string, Dot[]> = {
  '3v3': [
    [15, 45], [35, 45],
  ],
  '5v5': [
    [15, 30], [35, 30],
    [20, 55], [30, 55],
  ],
  'Half court': [
    [15, 38], [35, 38],
    [15, 55], [35, 55],
  ],
  'Full court': [
    [15, 28], [35, 28],
    [20, 55], [30, 55],
  ],
};

const HANDBALL_FORMATIONS: Record<string, Dot[]> = {
  '7v7': [
    [20, 68], // GK
    [10, 58], [30, 58],
    [15, 48], [25, 48],
    [20, 35],
  ],
  'Club': [
    [20, 68],
    [8, 55], [32, 55],
    [13, 45], [27, 45],
    [20, 32],
  ],
  'School': [
    [20, 68],
    [12, 58], [28, 58],
    [15, 50], [25, 50],
    [20, 38],
  ],
  'League': [
    [20, 68],
    [6, 55], [34, 55],
    [12, 46], [28, 46],
    [20, 30],
  ],
};

const ACCENT_POS: Record<string, Dot> = {
  football: [35, 18],
  basketball: [25, 30],
  handball: [20, 22],
};

// ===================================================================
//  Venue SVGs
// ===================================================================

function FormationDot({
  x,
  y,
  r,
  strokeR,
  active,
}: {
  x: number;
  y: number;
  r: number;
  strokeR: number;
  active: boolean;
}) {
  return (
    <g
      style={{
        transformBox: 'fill-box',
        transformOrigin: 'center',
        opacity: active ? 1 : 0,
        transform: active ? 'scale(1)' : 'scale(0.55)',
        transition:
          'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <circle
        cx={x}
        cy={y}
        r={strokeR}
        fill="none"
        stroke="#F5F5F0"
        strokeWidth="0.3"
        strokeOpacity="0.7"
      />
      <circle cx={x} cy={y} r={r} fill="#F5F5F0" opacity="0.9" />
    </g>
  );
}

function FootballPitchSvg({
  accent,
  activeFormat,
}: {
  accent: string;
  activeFormat: string;
}) {
  const op1 = 0.4;
  const op2 = 0.28;
  const [ax, ay] = ACCENT_POS.football;
  return (
    <svg viewBox="0 0 70 100" width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <rect x="0" y="0" width="70" height="100" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.4" />
      <line x1="0" y1="50" x2="70" y2="50" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <circle cx="35" cy="50" r="9" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <circle cx="35" cy="50" r="0.55" fill="#F5F5F0" fillOpacity="0.55" />
      <rect x="15" y="0" width="40" height="14" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <rect x="24" y="0" width="22" height="6" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.3" />
      <path d="M 29 14 A 6 6 0 0 0 41 14" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <rect x="15" y="86" width="40" height="14" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <rect x="24" y="94" width="22" height="6" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.3" />
      <path d="M 29 86 A 6 6 0 0 1 41 86" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <rect x="30" y="-3" width="10" height="3" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.3" />
      <rect x="30" y="100" width="10" height="3" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.3" />

      {Object.entries(FOOTBALL_FORMATIONS).map(([fmt, dots]) =>
        dots.map(([x, y], i) => (
          <FormationDot
            key={`${fmt}-${i}`}
            x={x}
            y={y}
            r={2.2}
            strokeR={2.6}
            active={fmt === activeFormat}
          />
        ))
      )}

      <g className="venue-dot-accent" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx={ax} cy={ay} r="2.8" fill="none" stroke={accent} strokeWidth="0.5" />
        <circle cx={ax} cy={ay} r="2.2" fill={accent} opacity="0.85" />
      </g>
    </svg>
  );
}

function BasketballCourtSvg({
  accent,
  activeFormat,
}: {
  accent: string;
  activeFormat: string;
}) {
  const op1 = 0.4;
  const [ax, ay] = ACCENT_POS.basketball;
  return (
    <svg viewBox="0 0 50 94" width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <rect x="0" y="0" width="50" height="94" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <line x1="0" y1="47" x2="50" y2="47" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <circle cx="25" cy="47" r="6" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <rect x="17" y="0" width="16" height="19" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <circle cx="25" cy="19" r="6" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <path d="M 3 0 L 3 14 A 22 22 0 0 0 47 14 L 47 0" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <line x1="21" y1="-2" x2="29" y2="-2" stroke={accent} strokeOpacity="0.8" strokeWidth="0.4" />
      <circle cx="25" cy="2" r="1" fill={accent} opacity="0.8" />
      <rect x="17" y="75" width="16" height="19" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <circle cx="25" cy="75" r="6" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <path d="M 3 94 L 3 80 A 22 22 0 0 1 47 80 L 47 94" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <line x1="21" y1="96" x2="29" y2="96" stroke={accent} strokeOpacity="0.8" strokeWidth="0.4" />
      <circle cx="25" cy="92" r="1" fill={accent} opacity="0.8" />

      {Object.entries(BASKETBALL_FORMATIONS).map(([fmt, dots]) =>
        dots.map(([x, y], i) => (
          <FormationDot
            key={`${fmt}-${i}`}
            x={x}
            y={y}
            r={1.6}
            strokeR={2}
            active={fmt === activeFormat}
          />
        ))
      )}

      <g className="venue-dot-accent" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx={ax} cy={ay} r="2.2" fill="none" stroke={accent} strokeWidth="0.4" />
        <circle cx={ax} cy={ay} r="1.7" fill={accent} opacity="0.85" />
      </g>
    </svg>
  );
}

function HandballCourtSvg({
  accent,
  activeFormat,
}: {
  accent: string;
  activeFormat: string;
}) {
  const op1 = 0.4;
  const op2 = 0.28;
  const [ax, ay] = ACCENT_POS.handball;
  return (
    <svg viewBox="0 0 40 80" width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <rect x="0" y="0" width="40" height="80" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.3" />
      <line x1="0" y1="40" x2="40" y2="40" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <path d="M 12 0 L 12 4 A 8 8 0 0 0 28 4 L 28 0" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <path d="M 9 0 L 9 4 A 11 11 0 0 0 31 4 L 31 0" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.25" strokeDasharray="0.8 0.6" />
      <line x1="18" y1="7" x2="22" y2="7" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <rect x="16" y="-2" width="8" height="2" fill="none" stroke={accent} strokeOpacity="0.8" strokeWidth="0.4" />
      <path d="M 12 80 L 12 76 A 8 8 0 0 1 28 76 L 28 80" fill="none" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <path d="M 9 80 L 9 76 A 11 11 0 0 1 31 76 L 31 80" fill="none" stroke="#F5F5F0" strokeOpacity={op2} strokeWidth="0.25" strokeDasharray="0.8 0.6" />
      <line x1="18" y1="73" x2="22" y2="73" stroke="#F5F5F0" strokeOpacity={op1} strokeWidth="0.25" />
      <rect x="16" y="80" width="8" height="2" fill="none" stroke={accent} strokeOpacity="0.8" strokeWidth="0.4" />

      {Object.entries(HANDBALL_FORMATIONS).map(([fmt, dots]) =>
        dots.map(([x, y], i) => (
          <FormationDot
            key={`${fmt}-${i}`}
            x={x}
            y={y}
            r={1.3}
            strokeR={1.6}
            active={fmt === activeFormat}
          />
        ))
      )}

      <g className="venue-dot-accent" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx={ax} cy={ay} r="1.7" fill="none" stroke={accent} strokeWidth="0.35" />
        <circle cx={ax} cy={ay} r="1.3" fill={accent} opacity="0.85" />
      </g>
    </svg>
  );
}

function VenueFor({
  kind,
  accent,
  activeFormat,
}: {
  kind: Panel['venueKind'];
  accent: string;
  activeFormat: string;
}) {
  if (kind === 'football')
    return <FootballPitchSvg accent={accent} activeFormat={activeFormat} />;
  if (kind === 'basketball')
    return <BasketballCourtSvg accent={accent} activeFormat={activeFormat} />;
  if (kind === 'handball')
    return <HandballCourtSvg accent={accent} activeFormat={activeFormat} />;
  return null;
}

// ===================================================================
//  Coming-soon sport icons — minimal wireframes
// ===================================================================

function SportIcon({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'Running':
      return (
        <svg {...common}>
          <circle cx="14" cy="5" r="1.6" fill={color} stroke="none" />
          <path d="M 5 13 L 10 10 L 13 12 L 12 16 L 15 20" />
          <path d="M 10 10 L 8 14 L 4 14" />
          <path d="M 13 9 L 18 11" />
        </svg>
      );
    case 'Tennis':
      return (
        <svg {...common}>
          <ellipse cx="9" cy="9" rx="5" ry="5.5" />
          <path d="M 13 13 L 20 20" strokeWidth="2.2" />
        </svg>
      );
    case 'Volleyball':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M 4 12 Q 12 15 20 12" />
          <path d="M 12 4 Q 9 12 12 20" />
          <path d="M 12 4 Q 15 12 12 20" />
        </svg>
      );
    case 'Padel':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="8" rx="5" ry="5.5" />
          <path d="M 12 13.5 L 12 21" strokeWidth="2" />
        </svg>
      );
    case 'Futsal':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <polygon points="12,8 15.5,10.5 14,14.5 10,14.5 8.5,10.5" />
        </svg>
      );
    case 'Rugby':
      return (
        <svg {...common}>
          <ellipse
            cx="12"
            cy="12"
            rx="8"
            ry="5"
            transform="rotate(-25 12 12)"
          />
          <path
            d="M 8 10 L 16 14"
            strokeWidth="1.2"
            strokeDasharray="1 1.4"
          />
        </svg>
      );
    case 'Table Tennis':
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="5" />
          <path d="M 14 14 L 19 19" strokeWidth="2" />
        </svg>
      );
    case 'Gym':
      return (
        <svg {...common}>
          <path d="M 3 9 L 3 15" strokeWidth="2.4" />
          <path d="M 6 7 L 6 17" strokeWidth="2.2" />
          <path d="M 6 12 L 18 12" strokeWidth="2" />
          <path d="M 18 7 L 18 17" strokeWidth="2.2" />
          <path d="M 21 9 L 21 15" strokeWidth="2.4" />
        </svg>
      );
    case 'Pool':
      return (
        <svg {...common}>
          <path d="M 2.5 7 Q 6 5 10 7 Q 14 9 18 7 Q 20.5 6 22 7" />
          <path d="M 2.5 12 Q 6 10 10 12 Q 14 14 18 12 Q 20.5 11 22 12" />
          <path d="M 2.5 17 Q 6 15 10 17 Q 14 19 18 17 Q 20.5 16 22 17" />
        </svg>
      );
    default:
      return null;
  }
}

// ===================================================================
//  Format pills — auto-cycling highlight (unique layoutId per panel)
// ===================================================================

function PillRow({
  pills,
  accent,
  panelId,
  active,
  onActive,
}: {
  pills: string[];
  accent: string;
  panelId: PanelId;
  active: number;
  onActive: (i: number) => void;
}) {
  const pauseUntil = useRef(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      if (performance.now() < pauseUntil.current) return;
      onActive((active + 1) % pills.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [pills.length, active, onActive]);
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {pills.map((p, i) => (
        <button
          key={p}
          type="button"
          data-cursor="hover"
          aria-pressed={active === i}
          onMouseEnter={() => {
            pauseUntil.current = performance.now() + 5000;
            onActive(i);
          }}
          className="relative inline-flex items-center"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: 100,
            color: active === i ? '#050505' : 'rgba(245,245,240,0.75)',
            border: active === i ? 'none' : '1px solid rgba(245,245,240,0.2)',
            background: active === i ? 'transparent' : 'rgba(245,245,240,0.03)',
            cursor: 'none',
            zIndex: 1,
            transition: 'color 0.3s ease-out',
          }}
        >
          {active === i && (
            <motion.span
              layoutId={`sport-pill-hl-${panelId}`}
              className="absolute inset-0"
              style={{
                borderRadius: 100,
                background: accent,
                boxShadow: `0 0 24px ${accent}55`,
                zIndex: -1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            />
          )}
          {p}
        </button>
      ))}
    </div>
  );
}

// ===================================================================
//  Panel content
// ===================================================================

function PanelContent({
  panel,
  index,
  total,
  venueRef,
  moreLabelsSetter,
}: {
  panel: Panel;
  index: number;
  total: number;
  venueRef: (el: HTMLDivElement | null) => void;
  moreLabelsSetter?: (el: HTMLDivElement | null) => void;
}) {
  const [activePill, setActivePill] = useState(0);
  const activeFormat = panel.pills ? panel.pills[activePill] : '';
  const [isPhone, setIsPhone] = useState(false);
  const [tapped, setTapped] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Tablet + phone → mobile grid for the MORE panel.
    const mq = window.matchMedia('(max-width: 1279px)');
    setIsPhone(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsPhone(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  // Auto-dismiss tap-to-highlight after 2s
  useEffect(() => {
    if (!tapped) return;
    const t = window.setTimeout(() => setTapped(null), 2000);
    return () => window.clearTimeout(t);
  }, [tapped]);
  return (
    <>
      <div
        className="absolute top-6 left-6 md:top-10 md:left-10 panel-enter"
        style={{ zIndex: 10 }}
      >
        <div
          className="mono-eyebrow"
          style={{ fontSize: 10, opacity: 0.55 }}
        >
          [ Chapter 04 · {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} ]
        </div>
      </div>

      <div className="grid-12 items-center w-full">
        <div className="col-span-12 xl:col-start-2 xl:col-span-5 xl:pr-6">
          <div
            className="mono-eyebrow mb-5 panel-enter"
            style={{ color: panel.accent }}
          >
            {panel.eyebrow}
          </div>
          <h3
            className="headline-display uppercase text-ink mb-7 panel-enter"
            style={{
              fontSize: 'clamp(1.85rem, 4vw, 3.75rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.025em',
            }}
          >
            {panel.headline.map((line, li) => (
              <span key={li} style={{ display: 'block' }}>
                {line}
              </span>
            ))}
          </h3>
          <p
            className="font-body mb-7 panel-enter"
            style={{
              color: 'rgba(245,245,240,0.7)',
              fontSize: 16,
              lineHeight: 1.55,
              maxWidth: '42ch',
            }}
          >
            {panel.body}
          </p>
          {panel.pills && (
            <div className="panel-enter mb-8 xl:mb-0">
              <PillRow
                pills={panel.pills}
                accent={panel.accent}
                panelId={panel.id}
                active={activePill}
                onActive={setActivePill}
              />
            </div>
          )}
        </div>

        <div className="col-span-12 xl:col-start-8 xl:col-span-4 flex items-center justify-center panel-enter mt-4 xl:mt-0">
          {panel.venueKind ? (
            <div
              style={{
                width: '100%',
                maxWidth: 420,
                aspectRatio:
                  panel.venueKind === 'handball' ? '1/2' : '7/10',
                perspective: '1400px',
                position: 'relative',
              }}
            >
              <div
                ref={venueRef}
                className="venue-transform"
                style={
                  {
                    '--rx': '42deg',
                    '--rz': '-6deg',
                    '--ry': '0deg',
                    transform:
                      'rotateX(var(--rx)) rotateZ(var(--rz)) rotateY(var(--ry))',
                    transformStyle: 'preserve-3d',
                    filter: `drop-shadow(0 40px 60px rgba(0,0,0,0.5)) drop-shadow(0 0 40px ${panel.accent}30)`,
                    position: 'relative',
                  } as React.CSSProperties
                }
              >
                <VenueFor
                  kind={panel.venueKind}
                  accent={panel.accent}
                  activeFormat={activeFormat}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: 1,
                      background: panel.accent,
                      opacity: 0.35,
                      boxShadow: `0 0 6px ${panel.accent}88`,
                      animation: 'venueScanY 6s linear infinite',
                    }}
                  />
                </div>
              </div>
            </div>
          ) : isPhone ? (
            <div className="w-full">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 12,
                  padding: '0 16px',
                }}
              >
                {MORE_LABELS.map((l) => {
                  const isTapped = tapped === l.name;
                  const anyTapped = tapped !== null;
                  return (
                    <button
                      key={l.name}
                      type="button"
                      onClick={() =>
                        setTapped(isTapped ? null : l.name)
                      }
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        padding: '18px 10px 14px',
                        background: 'rgba(20, 20, 25, 0.6)',
                        border: isTapped
                          ? '1px solid #D4FF3A'
                          : '1px solid rgba(245, 245, 240, 0.1)',
                        borderRadius: 12,
                        color: '#F5F5F0',
                        minHeight: 120,
                        cursor: 'pointer',
                        transform: isTapped ? 'scale(1.05)' : 'scale(1)',
                        opacity:
                          anyTapped && !isTapped ? 0.55 : 1,
                        transition:
                          'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease, border-color 260ms ease',
                        boxShadow: isTapped
                          ? '0 0 20px rgba(212, 255, 58, 0.28)'
                          : 'none',
                      }}
                    >
                      <span style={{ opacity: 0.75 }}>
                        <SportIcon
                          name={l.name}
                          color="#F5F5F0"
                          size={36}
                        />
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-display), Inter, sans-serif',
                          fontWeight: 900,
                          fontSize: 13,
                          letterSpacing: '-0.01em',
                          textTransform: 'uppercase',
                          textAlign: 'center',
                          lineHeight: 1.05,
                          color: '#F5F5F0',
                        }}
                      >
                        {l.name}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono), monospace',
                          fontSize: 9,
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          color: isTapped
                            ? 'var(--lime, #D4FF3A)'
                            : 'rgba(212, 255, 58, 0.7)',
                        }}
                      >
                        [ Coming ]
                      </span>
                    </button>
                  );
                })}
              </div>
              <div
                style={{
                  marginTop: 20,
                  padding: '0 16px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 9,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(245, 245, 240, 0.45)',
                  lineHeight: 1.5,
                }}
              >
                [ The roster keeps growing — vote for your sport in the app ]
              </div>
            </div>
          ) : (
            <div
              ref={moreLabelsSetter}
              className="relative w-full"
              style={{ height: '70vh', maxHeight: 560 }}
            >
              {MORE_LABELS.map((l, idx) => {
                const iconSize = Math.max(22, l.size * 10);
                const floatDuration = 4.5 + (idx % 4) * 0.7;
                const floatDelay = idx * 0.28;
                return (
                  <div
                    key={l.name}
                    data-more-label
                    data-cursor="hover"
                    className="absolute cursor-default"
                    style={{
                      left: l.left,
                      top: l.top,
                      opacity: 0,
                      willChange: 'opacity, transform',
                    }}
                  >
                    <div
                      className="repel-layer"
                      style={{
                        transform:
                          'translate(var(--rx, 0px), var(--ry, 0px))',
                        transition:
                          'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
                        willChange: 'transform',
                      }}
                    >
                      <div
                        className="float-layer"
                        style={{
                          animation: `sportFloat ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
                        }}
                      >
                        <div className="inline-flex items-center gap-3">
                          <SportIcon
                            name={l.name}
                            color="#D4FF3A"
                            size={iconSize}
                          />
                          <span
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 900,
                              fontSize: `${l.size}rem`,
                              letterSpacing: '-0.02em',
                              textTransform: 'uppercase',
                              color: 'rgba(245,245,240,0.72)',
                              lineHeight: 0.9,
                            }}
                          >
                            {l.name}
                          </span>
                        </div>
                        <div
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 9,
                            letterSpacing: '0.28em',
                            textTransform: 'uppercase',
                            color: 'rgba(212,255,58,0.7)',
                            marginTop: 6,
                            marginLeft: iconSize + 12,
                          }}
                        >
                          Coming soon
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div
                className="absolute bottom-2 left-0 right-0 text-center font-mono"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,245,240,0.4)',
                }}
              >
                [ The roster keeps growing — vote for your sport in the app ]
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ===================================================================
//  Section — horizontal pinned scroll
// ===================================================================

export default function Sports() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const venueRefs = useRef<Array<HTMLDivElement | null>>([]);
  const moreLabelsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ============== DESKTOP ==============
      mm.add('(min-width: 1280px)', () => {
        const panels = panelRefs.current.filter(
          (p): p is HTMLDivElement => !!p
        );
        const n = panels.length;

        const scrollTween = gsap.to(trackRef.current, {
          x: () => -(n - 1) * window.innerWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // ---- Per-panel entry animations ----
        panels.forEach((panel, i) => {
          const enterEls = panel.querySelectorAll<HTMLElement>('.panel-enter');
          if (enterEls.length === 0) return;

          gsap.set(enterEls, { opacity: 0, y: 40 });

          const entry = gsap.timeline({ paused: true });
          entry.to(enterEls, {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: 'expo.out',
          });

          if (i === 0) {
            gsap.delayedCall(0.2, () => entry.play());
          } else {
            ScrollTrigger.create({
              trigger: panel,
              containerAnimation: scrollTween,
              start: 'left 80%',
              once: true,
              onEnter: () => entry.play(),
            });
          }
        });

        // ---- Persistent in-panel motion ----
        PANELS.forEach((panel, i) => {
          const panelEl = panelRefs.current[i];
          const venueEl = venueRefs.current[i];
          if (!panelEl) return;

          // Venue iso-rotation drift (CSS-var tweens)
          if (venueEl && panel.venueKind) {
            gsap.to(venueEl, {
              '--rz': '-9deg',
              duration: 7,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
            gsap.to(venueEl, {
              '--rx': '45deg',
              duration: 5.5,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
            gsap.to(venueEl, {
              '--ry': '4deg',
              duration: 9,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
          }

          // Accent dot pulse (continuous)
          const accentDot = panelEl.querySelector<SVGGElement>(
            '.venue-dot-accent'
          );
          if (accentDot) {
            gsap.to(accentDot, {
              scale: 1.18,
              duration: 1,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              transformOrigin: 'center',
            });
          }
        });

        // ---- MORE constellation stagger (opacity only; transforms live on nested CSS layers) ----
        const moreIdx = PANELS.findIndex((p) => p.id === 'more');
        const morePanel = panelRefs.current[moreIdx];
        if (morePanel && moreLabelsRef.current) {
          const labels = moreLabelsRef.current.querySelectorAll<HTMLElement>(
            '[data-more-label]'
          );
          gsap.set(labels, { opacity: 0 });
          ScrollTrigger.create({
            trigger: morePanel,
            containerAnimation: scrollTween,
            start: 'left 70%',
            once: true,
            onEnter: () => {
              gsap.to(labels, {
                opacity: 1,
                duration: 0.6,
                stagger: 0.07,
                ease: 'power2.out',
              });
            },
          });
        }

        return () => {
          // matchMedia auto-cleans tweens created here
        };
      });

      // ============== MOBILE ==============
      mm.add('(max-width: 1279px)', () => {
        const panels = panelRefs.current.filter(
          (p): p is HTMLDivElement => !!p
        );

        panels.forEach((panel) => {
          const enterEls = panel.querySelectorAll<HTMLElement>('.panel-enter');
          gsap.from(enterEls, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.07,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 75%',
            },
          });
        });

        // Simpler venue rotation on mobile (no Y-axis tilt)
        PANELS.forEach((panel, i) => {
          const venueEl = venueRefs.current[i];
          if (venueEl && panel.venueKind) {
            gsap.to(venueEl, {
              '--rz': '-9deg',
              duration: 7,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
            gsap.to(venueEl, {
              '--rx': '45deg',
              duration: 5.5,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
          }

          // Accent pulse still on mobile
          const panelEl = panelRefs.current[i];
          if (!panelEl) return;
          const accentDot = panelEl.querySelector<SVGGElement>(
            '.venue-dot-accent'
          );
          if (accentDot) {
            gsap.to(accentDot, {
              scale: 1.18,
              duration: 1,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              transformOrigin: 'center',
            });
          }
        });
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // =========================================================
  //  MORE constellation — cursor repel (desktop only)
  // =========================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const container = moreLabelsRef.current;
    if (!container) return;

    const labels = Array.from(
      container.querySelectorAll<HTMLElement>('[data-more-label]')
    );
    if (labels.length === 0) return;

    const REPEL_RADIUS = 170;
    const MAX_PUSH = 65;
    let inside = false;

    const onMove = (e: MouseEvent) => {
      inside = true;
      labels.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const d = Math.hypot(dx, dy);
        if (d < REPEL_RADIUS && d > 0) {
          const f = Math.pow((REPEL_RADIUS - d) / REPEL_RADIUS, 1.4);
          el.style.setProperty('--rx', `${(dx / d) * f * MAX_PUSH}px`);
          el.style.setProperty('--ry', `${(dy / d) * f * MAX_PUSH}px`);
        } else {
          el.style.setProperty('--rx', '0px');
          el.style.setProperty('--ry', '0px');
        }
      });
    };

    const onLeave = () => {
      if (!inside) return;
      inside = false;
      labels.forEach((el) => {
        el.style.setProperty('--rx', '0px');
        el.style.setProperty('--ry', '0px');
      });
    };

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sports"
      data-progress-section
      data-progress-label="04 · The Sports"
      className="sports-section relative w-full"
    >
      <div ref={stickyRef} className="sports-sticky">
        <CornerBrackets />

        <div ref={trackRef} className="sports-track">
          {PANELS.map((panel, i) => (
            <div
              key={panel.id}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className="sport-panel"
              data-sport={panel.id}
              data-palette={panel.palette}
            >
              <PanelContent
                panel={panel}
                index={i}
                total={PANELS.length}
                venueRef={(el) => {
                  venueRefs.current[i] = el;
                }}
                moreLabelsSetter={
                  panel.id === 'more'
                    ? (el) => {
                        moreLabelsRef.current = el;
                      }
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .sports-section {
          position: relative;
          height: calc(100vh + ${(PANELS.length - 1) * 100}vw);
        }
        .sports-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        .sports-track {
          display: flex;
          width: calc(100vw * ${PANELS.length});
          height: 100%;
          will-change: transform;
        }
        .sport-panel {
          position: relative;
          width: 100vw;
          height: 100%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        @media (max-width: 1279px) {
          .sports-section {
            height: auto;
          }
          .sports-sticky {
            position: relative;
            height: auto;
            overflow: visible;
          }
          .sports-track {
            display: block;
            width: 100%;
            height: auto;
          }
          .sport-panel {
            width: 100vw;
            height: auto;
            min-height: 100vh;
            align-items: flex-start;
            padding: 96px 0 56px;
            box-sizing: border-box;
          }
          /* Shrink the isometric venue so the stacked headline + body
             + pills don't get pushed off-screen. */
          .sport-panel :global([style*="perspective"]) {
            max-width: 240px !important;
          }
        }
      `}</style>

      <style jsx global>{`
        @keyframes venueScanY {
          0%   { top: 0%; opacity: 0; }
          10%  { opacity: 0.35; }
          90%  { opacity: 0.35; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes sportFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -8px, 0); }
        }
      `}</style>
    </section>
  );
}
