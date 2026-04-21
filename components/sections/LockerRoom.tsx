'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ===================================================================
//  Board geometry
// ===================================================================

const BOARD_W = 1600;
const BOARD_H = 900;

// ===================================================================
//  Feature data
// ===================================================================

type StatusLevel = 'coming-soon' | 'in-design' | 'on-roadmap' | 'adopted';
type ArtifactKind =
  | 'poster'
  | 'polaroid'
  | 'sticky'
  | 'index'
  | 'magazine'
  | 'printout'
  | 'newspaper';

type ArtifactPosition =
  | { left: string; top: string }
  | { right: string; top: string };

type Feature = {
  id: string;
  seq: string;
  name: string;
  kind: ArtifactKind;
  rotation: number;
  size: { w: number; h: number };
  position: ArtifactPosition;
  anchor: { x: number; y: number };
  panelSide: 'left' | 'right' | 'below' | 'above';
  status: StatusLevel;
  summary: string;
  bullets: string[];
  statusNote: string;
};

const FEATURES: Feature[] = [
  {
    id: 'tournament',
    seq: '01',
    name: 'Tournaments',
    kind: 'poster',
    rotation: -3,
    size: { w: 300, h: 380 },
    position: { left: '7%', top: '10%' },
    anchor: { x: 262, y: 280 },
    panelSide: 'right',
    status: 'coming-soon',
    summary:
      'Run complete tournament brackets inside your community — no spreadsheets.',
    bullets: [
      'Single-elim, double-elim, round-robin',
      'Auto-seeding from match history',
      'Live bracket everyone can watch',
      'Shareable finals poster',
    ],
    statusNote: 'Building now — expected in the next release.',
  },
  {
    id: 'polaroid',
    seq: '02',
    name: 'Match chat',
    kind: 'polaroid',
    rotation: 4,
    size: { w: 220, h: 300 },
    position: { right: '10%', top: '9%' },
    anchor: { x: 1330, y: 231 },
    panelSide: 'left',
    status: 'coming-soon',
    summary:
      'A chat thread scoped to one match — goes quiet when the whistle blows.',
    bullets: [
      'Auto-opens when a match is set',
      'Auto-archives after full-time',
      'Drop-outs + confirmations live inline',
      'No group-chat bleed into your life',
    ],
    statusNote: 'Building now — shipping with the new match card.',
  },
  {
    id: 'sticky',
    seq: '03',
    name: 'AI Match Builder',
    kind: 'sticky',
    rotation: -6,
    size: { w: 190, h: 190 },
    position: { right: '20%', top: '43%' },
    anchor: { x: 1185, y: 482 },
    panelSide: 'left',
    status: 'in-design',
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
    id: 'index',
    seq: '04',
    name: 'AI Captain',
    kind: 'index',
    rotation: 2,
    size: { w: 280, h: 170 },
    position: { left: '33%', top: '46%' },
    anchor: { x: 668, y: 499 },
    panelSide: 'right',
    status: 'in-design',
    summary: 'The captain that keeps the match together for you.',
    bullets: [
      'Sends reminders before kickoff',
      'Handles drop-outs and subs',
      'Rebalances sides automatically',
      'Suggests positions by skill',
    ],
    statusNote: 'Sketching the decision logic right now.',
  },
  {
    id: 'magazine',
    seq: '05',
    name: 'SportTimes Store',
    kind: 'magazine',
    rotation: -2,
    size: { w: 320, h: 220 },
    position: { left: '11%', top: '66%' },
    anchor: { x: 336, y: 704 },
    panelSide: 'right',
    status: 'on-roadmap',
    summary:
      'Kits, gear, and community merch — ordered from the same app.',
    bullets: [
      'Team jerseys, scarves, shorts, bags',
      'Community-branded merch drops',
      'Local supplier network',
      'Pooled orders, no middle-man markups',
    ],
    statusNote: 'On the roadmap — partner discussions underway.',
  },
  {
    id: 'printout',
    seq: '06',
    name: 'Venue booking',
    kind: 'printout',
    rotation: 1,
    size: { w: 260, h: 200 },
    position: { left: '48%', top: '69%' },
    anchor: { x: 898, y: 721 },
    panelSide: 'above',
    status: 'on-roadmap',
    summary: 'Book the pitch straight from the match card.',
    bullets: [
      'Live availability across venues',
      'One-tap booking confirmations',
      'Auto-split cost across the roster',
      'Calendar + email confirmations',
    ],
    statusNote: 'On the roadmap — venue integrations in scoping.',
  },
  {
    id: 'newspaper',
    seq: '07',
    name: 'More sports',
    kind: 'newspaper',
    rotation: 2,
    size: { w: 210, h: 250 },
    position: { right: '8%', top: '53%' },
    anchor: { x: 1367, y: 602 },
    panelSide: 'left',
    status: 'adopted',
    summary: 'The catalog keeps growing with the community.',
    bullets: [
      'Sports adopted quarterly by demand',
      'Vote for your sport inside the app',
      'Padel, Volleyball, Futsal, Tennis shortlisted',
      'Same lineup engine, any format',
    ],
    statusNote: 'Rolling adoption — quarterly review cycle.',
  },
];

// ===================================================================
//  Rope segments
// ===================================================================

type Segment = {
  from: { x: number; y: number };
  cp1: { x: number; y: number };
  cp2: { x: number; y: number };
  to: { x: number; y: number };
  wobbleAmp: number;
  perp: { x: number; y: number };
  duration: number;
  offset: number;
};

function buildSegments(): Segment[] {
  const p = FEATURES.map((f) => f.anchor);
  const defs: Omit<Segment, 'perp' | 'duration' | 'offset'>[] = [
    {
      from: p[0],
      cp1: { x: 620, y: 360 },
      cp2: { x: 980, y: 310 },
      to: p[1],
      wobbleAmp: 3,
    },
    {
      from: p[1],
      cp1: { x: 1320, y: 360 },
      cp2: { x: 1250, y: 430 },
      to: p[2],
      wobbleAmp: 2.5,
    },
    {
      from: p[2],
      cp1: { x: 1040, y: 560 },
      cp2: { x: 820, y: 460 },
      to: p[3],
      wobbleAmp: 3.5,
    },
    {
      from: p[3],
      cp1: { x: 560, y: 620 },
      cp2: { x: 420, y: 650 },
      to: p[4],
      wobbleAmp: 2.5,
    },
    {
      from: p[4],
      cp1: { x: 540, y: 790 },
      cp2: { x: 720, y: 800 },
      to: p[5],
      wobbleAmp: 3,
    },
    {
      from: p[5],
      cp1: { x: 1040, y: 720 },
      cp2: { x: 1260, y: 640 },
      to: p[6],
      wobbleAmp: 2,
    },
  ];
  return defs.map((d) => {
    const dx = d.to.x - d.from.x;
    const dy = d.to.y - d.from.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const perp = { x: -dy / len, y: dx / len };
    return {
      ...d,
      perp,
      duration: 4 + Math.random(),
      offset: Math.random() * Math.PI * 2,
    };
  });
}

function pathString(s: Segment, w: number, pluck: number): string {
  const off = w + pluck;
  const dx = s.perp.x * off;
  const dy = s.perp.y * off;
  return `M ${s.from.x} ${s.from.y} C ${s.cp1.x + dx} ${s.cp1.y + dy}, ${s.cp2.x + dx} ${s.cp2.y + dy}, ${s.to.x} ${s.to.y}`;
}

// ===================================================================
//  Status tag
// ===================================================================

function StatusTag({ status }: { status: StatusLevel }) {
  switch (status) {
    case 'coming-soon':
      return (
        <div
          style={{
            display: 'inline-block',
            padding: '4px 9px',
            color: '#A0332F',
            border: '1.6px solid #A0332F',
            fontFamily: 'var(--font-display), Inter, sans-serif',
            fontWeight: 900,
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            transform: 'rotate(-3deg)',
            opacity: 0.88,
            boxShadow:
              'inset 0 0 0 1px rgba(160,51,47,0.35), 2px 2px 0 rgba(160,51,47,0.12)',
            background: 'rgba(235,200,195,0.14)',
            mixBlendMode: 'multiply',
            whiteSpace: 'nowrap',
          }}
        >
          Coming Soon
        </div>
      );
    case 'in-design':
      return (
        <div
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-caveat), cursive',
            fontSize: 16,
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#6B7F15',
            transform: 'rotate(-2deg)',
            whiteSpace: 'nowrap',
          }}
        >
          [ in design ]
        </div>
      );
    case 'on-roadmap':
      return (
        <div
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 9,
            letterSpacing: '0.26em',
            color: '#6B5D4A',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          [ on the roadmap ]
        </div>
      );
    case 'adopted':
      return (
        <div
          style={{
            display: 'block',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 9,
            letterSpacing: '0.3em',
            color: '#2A1A10',
            textTransform: 'uppercase',
            borderTop: '1px solid rgba(74,40,16,0.45)',
            paddingTop: 4,
            whiteSpace: 'nowrap',
          }}
        >
          Adopted · Quarterly
        </div>
      );
  }
}

// ===================================================================
//  Seq header
// ===================================================================

function SeqHeader({
  seq,
  name,
  nameColor = '#1A1209',
  nameSize = 26,
  nameFont = 'var(--font-display), Inter, sans-serif',
  uppercase = true,
  seqColor = 'rgba(139, 32, 32, 0.85)',
}: {
  seq: string;
  name: string;
  nameColor?: string;
  nameSize?: number;
  nameFont?: string;
  uppercase?: boolean;
  seqColor?: string;
}) {
  return (
    <>
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.32em',
          color: seqColor,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        [ {seq} / 07 ]
      </div>
      <div
        style={{
          fontFamily: nameFont,
          fontWeight: 900,
          fontSize: nameSize,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: nameColor,
          textTransform: uppercase ? 'uppercase' : 'none',
          wordBreak: 'keep-all',
          hyphens: 'none',
          overflowWrap: 'normal',
          whiteSpace: 'normal',
        }}
      >
        {name}
      </div>
    </>
  );
}

// ===================================================================
//  Tape + PushPin
// ===================================================================

function Tape({
  style,
  variant = 'cream',
}: {
  style: React.CSSProperties;
  variant?: 'cream' | 'blue';
}) {
  const color =
    variant === 'cream'
      ? 'rgba(240, 225, 175, 0.88)'
      : 'rgba(155, 195, 220, 0.82)';
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        width: 58,
        height: 16,
        background: color,
        boxShadow:
          'inset 0 0 0 1px rgba(255,255,255,0.2), 0 2px 3px rgba(0,0,0,0.22)',
        opacity: 0.9,
        ...style,
      }}
    />
  );
}

function PushPin({
  style,
  color = '#D43B2A',
  size = 15,
}: {
  style?: React.CSSProperties;
  color?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, ${color} 0%, ${color} 40%, #6a1a10 100%)`,
        boxShadow:
          '0 2px 4px rgba(0,0,0,0.55), inset -1.5px -1.5px 2px rgba(0,0,0,0.45), inset 1.5px 1.5px 2px rgba(255,255,255,0.45)',
        ...style,
      }}
    />
  );
}

// ===================================================================
//  Artifact body
// ===================================================================

function ArtifactBody({ feature }: { feature: Feature }) {
  const { seq, name, kind, status } = feature;

  switch (kind) {
    case 'poster':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #F2E4BE 0%, #E3D09A 100%)',
            padding: 22,
            position: 'relative',
            boxSizing: 'border-box',
            boxShadow: 'inset 0 0 32px rgba(120,70,20,0.18)',
            overflow: 'hidden',
          }}
        >
          <Tape style={{ top: -10, left: -4, transform: 'rotate(-14deg)' }} />
          <Tape style={{ top: -10, right: -4, transform: 'rotate(12deg)' }} />
          <SeqHeader
            seq={seq}
            name={name}
            nameColor="#2A1810"
            nameSize={32}
            seqColor="#8B2020"
          />
          <div
            style={{
              background: '#8B2020',
              height: 2,
              margin: '14px 0 10px',
            }}
          />
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.22em',
              color: '#4A2810',
              textTransform: 'uppercase',
              lineHeight: 1.6,
            }}
          >
            · Feature No. 01
            <br />
            · Building now
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 22,
              left: 22,
            }}
          >
            <StatusTag status={status} />
          </div>
        </div>
      );

    case 'polaroid':
      return (
        <>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: -14,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 22,
              height: 28,
              background:
                'linear-gradient(180deg, #D9B98A 0%, #A6855A 100%)',
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
              zIndex: 5,
            }}
          />
          <div
            className="polaroid-float"
            style={{
              width: '100%',
              height: '100%',
              background: '#F7F2E4',
              padding: '16px 16px 20px',
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '100%',
                height: 160,
                background:
                  'linear-gradient(180deg, #2a3440 0%, #1a2028 100%)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  filter: 'blur(1.4px)',
                  opacity: 0.85,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 10,
                    right: 60,
                    height: 12,
                    background: 'rgba(255,255,255,0.18)',
                    borderRadius: 6,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 30,
                    left: 10,
                    right: 30,
                    height: 20,
                    background: 'rgba(212,255,58,0.28)',
                    borderRadius: 6,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 56,
                    right: 10,
                    width: 100,
                    height: 24,
                    background: 'rgba(255,255,255,0.16)',
                    borderRadius: 6,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 86,
                    left: 10,
                    right: 70,
                    height: 16,
                    background: 'rgba(255,255,255,0.14)',
                    borderRadius: 6,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 110,
                    right: 10,
                    width: 108,
                    height: 28,
                    background: 'rgba(255,90,90,0.3)',
                    borderRadius: 6,
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <SeqHeader
                seq={seq}
                name={name}
                nameColor="#1A1209"
                nameSize={18}
                nameFont='var(--font-marker), cursive'
                uppercase={false}
                seqColor="#8B2020"
              />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 14,
                right: 14,
              }}
            >
              <StatusTag status={status} />
            </div>
          </div>
        </>
      );

    case 'sticky':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(145deg, #DCFF3A 0%, #B8E520 100%)',
            padding: '20px 18px 18px',
            boxSizing: 'border-box',
            position: 'relative',
            boxShadow:
              'inset 0 0 16px rgba(110,130,20,0.25), 0 6px 10px rgba(80,90,10,0.35)',
            clipPath:
              'polygon(0% 0%, 100% 0%, 100% 92%, 92% 100%, 0% 100%)',
            overflow: 'hidden',
          }}
        >
          <SeqHeader
            seq={seq}
            name={name}
            nameColor="#1A1209"
            nameSize={18}
            nameFont='var(--font-caveat), cursive'
            uppercase={false}
            seqColor="rgba(26, 18, 9, 0.7)"
          />
          <div
            style={{
              position: 'absolute',
              bottom: 14,
              left: 18,
            }}
          >
            <StatusTag status={status} />
          </div>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 24,
              height: 24,
              background:
                'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      );

    case 'index':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#FBF7EC',
            padding: '18px 20px 16px 34px',
            boxSizing: 'border-box',
            position: 'relative',
            backgroundImage: `
              repeating-linear-gradient(to bottom, transparent 0px, transparent 22px, rgba(120, 160, 220, 0.25) 22px, rgba(120, 160, 220, 0.25) 23px, transparent 23px, transparent 44px)
            `,
            overflow: 'hidden',
          }}
        >
          <PushPin
            style={{ top: -5, left: '50%', transform: 'translateX(-50%)' }}
            color="#2B6EE8"
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 28,
              top: 0,
              bottom: 0,
              width: 1,
              background: 'rgba(200, 50, 50, 0.5)',
            }}
          />
          <SeqHeader
            seq={seq}
            name={name}
            nameColor="#1A1209"
            nameSize={20}
            nameFont='var(--font-kalam), cursive'
            uppercase={false}
            seqColor="rgba(110, 70, 30, 0.8)"
          />
          <div
            style={{
              position: 'absolute',
              bottom: 14,
              left: 34,
            }}
          >
            <StatusTag status={status} />
          </div>
        </div>
      );

    case 'magazine':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#ECE6D1',
            boxSizing: 'border-box',
            padding: '26px 20px 20px',
            position: 'relative',
            clipPath:
              'polygon(0% 3%, 5% 0%, 12% 3%, 20% 0%, 28% 2%, 35% 0%, 44% 3%, 52% 0%, 60% 2%, 68% 0%, 76% 3%, 85% 1%, 93% 3%, 100% 0%, 100% 100%, 0% 100%)',
            boxShadow: 'inset 0 0 24px rgba(110,60,20,0.14)',
            overflow: 'hidden',
          }}
        >
          <Tape
            variant="blue"
            style={{
              top: -8,
              left: '50%',
              transform: 'translateX(-50%) rotate(-4deg)',
              width: 70,
            }}
          />
          <SeqHeader
            seq={seq}
            name={name}
            nameColor="#1A1209"
            nameSize={22}
            seqColor="#8B2020"
          />
          <div
            style={{
              position: 'absolute',
              bottom: 18,
              left: 20,
            }}
          >
            <StatusTag status={status} />
          </div>
        </div>
      );

    case 'printout':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#FAF5E4',
            boxSizing: 'border-box',
            padding: '20px 20px 18px',
            position: 'relative',
            boxShadow: 'inset 0 0 20px rgba(120,70,20,0.10)',
            backgroundImage:
              'linear-gradient(to bottom, transparent 48%, rgba(120,90,50,0.18) 49%, rgba(120,90,50,0.18) 51%, transparent 52%)',
            overflow: 'hidden',
          }}
        >
          <PushPin style={{ top: -5, left: 18 }} color="#D4B820" />
          <PushPin style={{ top: -5, right: 18 }} color="#D4B820" />
          <SeqHeader
            seq={seq}
            name={name}
            nameColor="#1A1209"
            nameSize={22}
            nameFont='var(--font-mono), monospace'
            seqColor="#8B4513"
          />
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 20,
            }}
          >
            <StatusTag status={status} />
          </div>
        </div>
      );

    case 'newspaper':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(165deg, #E8D9B5 0%, #D4BF91 100%)',
            padding: '20px 18px 18px',
            boxSizing: 'border-box',
            position: 'relative',
            clipPath:
              'polygon(0% 2%, 10% 0%, 22% 2%, 34% 0%, 48% 2%, 62% 0%, 76% 2%, 90% 0%, 100% 2%, 100% 98%, 90% 100%, 78% 98%, 64% 100%, 50% 98%, 36% 100%, 22% 98%, 8% 100%, 0% 98%)',
            boxShadow: 'inset 0 0 24px rgba(110,60,20,0.2)',
            overflow: 'hidden',
          }}
        >
          <PushPin style={{ top: 12, left: -4 }} color="#6B4A25" />
          <PushPin style={{ bottom: 16, left: -4 }} color="#6B4A25" />
          <div
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 9,
              letterSpacing: '0.3em',
              color: '#4A2810',
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(74,40,16,0.45)',
              paddingBottom: 4,
              marginBottom: 12,
            }}
          >
            Sports · Section B
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.28em',
              color: '#6B4A25',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            [ {seq} / 07 ]
          </div>
          <h3
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontWeight: 900,
              fontSize: 20,
              color: '#1A1209',
              lineHeight: 0.96,
              letterSpacing: '-0.015em',
              textTransform: 'uppercase',
              margin: 0,
              wordBreak: 'keep-all',
              hyphens: 'none',
              overflowWrap: 'normal',
            }}
          >
            {name}.
          </h3>
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 18,
              right: 18,
            }}
          >
            <StatusTag status={status} />
          </div>
        </div>
      );
  }
}

// ===================================================================
//  Rope — correctly maps over segments (not the empty-on-first-render
//  segRefs array). No SVG turbulence filters; depth comes from a CSS
//  drop-shadow on the SVG.
// ===================================================================

function Rope({
  segments,
  segRefs,
  hoveredIdx,
}: {
  segments: Segment[];
  segRefs: React.MutableRefObject<Array<SVGPathElement | null>>;
  hoveredIdx: number | null;
}) {
  return (
    <svg
      viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 20,
        overflow: 'visible',
        filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.35))',
      }}
    >
      {segments.map((_, i) => {
        const touchesHover =
          hoveredIdx !== null &&
          (i === hoveredIdx || i === hoveredIdx - 1);
        const anyHover = hoveredIdx !== null;
        const opacity = anyHover ? (touchesHover ? 1 : 0.45) : 1;
        const strokeWidth = touchesHover ? 3.6 : 2.8;
        return (
          <g
            key={`rope-${i}`}
            style={{
              opacity,
              transition:
                'opacity 240ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <path
              ref={(el) => {
                segRefs.current[i] = el;
              }}
              stroke="#8B2A2A"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              style={{
                transition:
                  'stroke-width 240ms cubic-bezier(0.22, 1, 0.36, 1), stroke 240ms ease',
              }}
            />
            {touchesHover && (
              <path
                d={segRefs.current[i]?.getAttribute('d') || ''}
                stroke="#D24A2E"
                strokeWidth={strokeWidth * 0.42}
                fill="none"
                strokeLinecap="round"
                opacity={0.85}
              />
            )}
          </g>
        );
      })}

      {/* Knots at anchors — small dark circles where rope meets pin */}
      {FEATURES.map((f) => (
        <g key={`knot-${f.id}`}>
          <circle cx={f.anchor.x} cy={f.anchor.y} r="5" fill="#5A1810" />
          <circle
            cx={f.anchor.x - 1.2}
            cy={f.anchor.y - 1.2}
            r="1.8"
            fill="#9B3020"
            opacity="0.6"
          />
        </g>
      ))}
    </svg>
  );
}

// ===================================================================
//  Info panel
// ===================================================================

function InfoPanel({ feature }: { feature: Feature }) {
  const PANEL_W = 280;
  const PANEL_H = 240;
  const GAP = 24;

  const ax = (feature.anchor.x / BOARD_W) * 100;
  const ay = (feature.anchor.y / BOARD_H) * 100;
  const halfW = (feature.size.w / 2 / BOARD_W) * 100;
  const halfH = (feature.size.h / 2 / BOARD_H) * 100;

  const style: React.CSSProperties = { position: 'absolute' };
  if (feature.panelSide === 'right') {
    style.left = `calc(${ax + halfW}% + ${GAP}px)`;
    style.top = `calc(${ay - halfH}% - 12px)`;
  } else if (feature.panelSide === 'left') {
    style.right = `calc(${100 - (ax - halfW)}% + ${GAP}px)`;
    style.top = `calc(${ay - halfH}% - 12px)`;
  } else if (feature.panelSide === 'below') {
    style.left = `calc(${ax}% - ${PANEL_W / 2}px)`;
    style.top = `calc(${ay + halfH}% + ${GAP}px)`;
  } else {
    style.left = `calc(${ax}% - ${PANEL_W / 2}px)`;
    style.bottom = `calc(${100 - (ay - halfH)}% + ${GAP}px)`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        ...style,
        width: PANEL_W,
        minHeight: PANEL_H,
        background: '#FFFBEE',
        padding: '20px 20px 22px',
        boxSizing: 'border-box',
        boxShadow:
          '0 22px 40px rgba(0,0,0,0.45), 0 6px 12px rgba(0,0,0,0.3)',
        zIndex: 60,
        pointerEvents: 'none',
        borderRadius: 2,
        transform: `rotate(${feature.rotation > 0 ? -1 : 1}deg)`,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 14,
          right: 14,
          height: 2,
          background:
            'linear-gradient(to right, transparent, rgba(0,0,0,0.12), transparent)',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.3em',
          color: '#8B4513',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        [ {feature.seq} / 07 ]
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display), Inter, sans-serif',
          fontWeight: 900,
          fontSize: 24,
          letterSpacing: '-0.025em',
          lineHeight: 0.98,
          color: '#1A1209',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        {feature.name}.
      </div>
      <p
        style={{
          fontFamily: 'var(--font-body), Inter, sans-serif',
          fontSize: 12,
          lineHeight: 1.5,
          color: '#3A2510',
          margin: '0 0 10px',
        }}
      >
        {feature.summary}
      </p>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 12px',
          fontFamily: 'var(--font-body), Inter, sans-serif',
          fontSize: 11.5,
          lineHeight: 1.55,
          color: '#2A1810',
        }}
      >
        {feature.bullets.map((b, i) => (
          <li key={i} style={{ display: 'flex', gap: 6 }}>
            <span style={{ color: '#8B2A2A' }}>·</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div
        style={{
          borderTop: '1px dashed rgba(110, 60, 20, 0.35)',
          paddingTop: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <StatusTag status={feature.status} />
        <span
          style={{
            fontFamily: 'var(--font-caveat), cursive',
            fontSize: 13,
            color: '#3A2510',
            lineHeight: 1.2,
            flex: 1,
            minWidth: 0,
          }}
        >
          {feature.statusNote}
        </span>
      </div>
    </motion.div>
  );
}

// ===================================================================
//  Nav indicator + legend + dust
// ===================================================================

function NavIndicator({ hoveredIdx }: { hoveredIdx: number | null }) {
  const label =
    hoveredIdx === null
      ? '— / 07 · follow the thread'
      : `${FEATURES[hoveredIdx].seq} / 07 · ${FEATURES[hoveredIdx].name}`;
  return (
    <div
      style={{
        position: 'absolute',
        top: 14,
        right: 20,
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 10,
        letterSpacing: '0.22em',
        color: 'rgba(255, 215, 160, 0.88)',
        textTransform: 'uppercase',
        padding: '7px 14px',
        background: 'rgba(20, 10, 0, 0.4)',
        border: '1px solid rgba(255, 180, 100, 0.3)',
        borderRadius: 2,
        backdropFilter: 'blur(4px)',
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      {label}
    </div>
  );
}

function LegendSticky() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        bottom: '4%',
        left: '4%',
        width: 148,
        height: 164,
        transform: 'rotate(-8deg)',
        background: 'linear-gradient(145deg, #FFE966 0%, #E5CF30 100%)',
        padding: '12px 13px 10px',
        boxSizing: 'border-box',
        boxShadow:
          'inset 0 0 14px rgba(140,100,10,0.2), 0 6px 10px rgba(80,60,10,0.4)',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 94%, 94% 100%, 0% 100%)',
        zIndex: 15,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-caveat), cursive',
          fontSize: 13,
          fontWeight: 700,
          color: '#1A1209',
          lineHeight: 1.1,
          marginBottom: 6,
          borderBottom: '1px solid rgba(40,40,10,0.3)',
          paddingBottom: 4,
        }}
      >
        the thread:
      </div>
      <div
        style={{
          fontFamily: 'var(--font-caveat), cursive',
          fontSize: 11,
          color: '#1A1209',
          lineHeight: 1.3,
        }}
      >
        — coming soon:<br />
        &nbsp;&nbsp;&nbsp;building now<br />
        — in design:<br />
        &nbsp;&nbsp;&nbsp;sketching it out<br />
        — on the roadmap:<br />
        &nbsp;&nbsp;&nbsp;planned<br />
        — adopted quarterly:<br />
        &nbsp;&nbsp;&nbsp;rolling
      </div>
    </div>
  );
}

function DustParticles() {
  const dusts = [
    { size: 3, left: '12%', top: '28%', dur: 26, delay: 0 },
    { size: 2.5, left: '70%', top: '18%', dur: 30, delay: 4 },
    { size: 4, left: '38%', top: '58%', dur: 28, delay: 9 },
    { size: 3, left: '82%', top: '56%', dur: 24, delay: 14 },
    { size: 3.5, left: '8%', top: '78%', dur: 32, delay: 18 },
    { size: 2.5, left: '54%', top: '38%', dur: 27, delay: 22 },
  ];
  return (
    <>
      {dusts.map((d, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: 'absolute',
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: 'rgba(255, 220, 170, 0.75)',
            boxShadow: '0 0 10px rgba(255, 210, 150, 0.7)',
            pointerEvents: 'none',
            animation: `dustDrift ${d.dur}s linear ${d.delay}s infinite`,
            willChange: 'transform, opacity',
            zIndex: 2,
          }}
        />
      ))}
    </>
  );
}

// ===================================================================
//  Main section
// ===================================================================

export default function LockerRoom() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const artifactRefs = useRef<Array<HTMLDivElement | null>>([]);
  const segRefs = useRef<Array<SVGPathElement | null>>([]);
  const segments = useMemo(() => buildSegments(), []);

  // Entry animation only — rope renders as a static SVG path.
  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    // Set final rest path once — stays static from here on.
    segRefs.current.forEach((path, i) => {
      if (!path) return;
      path.setAttribute('d', pathString(segments[i], 0, 0));
    });

    const ctx = gsap.context(() => {
      artifactRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, scale: 0.94 });
      });
      segRefs.current.forEach((path) => {
        if (path) {
          const len = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: len,
            strokeDashoffset: len,
          });
        }
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 65%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          if (artifactRefs.current[0]) {
            tl.to(artifactRefs.current[0], {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'power2.out',
            });
          }
          segRefs.current.forEach((path, i) => {
            if (!path) return;
            tl.to(
              path,
              {
                strokeDashoffset: 0,
                duration: 0.5,
                ease: 'power2.inOut',
              },
              i * 0.32
            );
            const nextArt = artifactRefs.current[i + 1];
            if (nextArt) {
              tl.to(
                nextArt,
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.45,
                  ease: 'power2.out',
                },
                i * 0.32 + 0.28
              );
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      id="roadmap-features"
      data-progress-section
      data-progress-label="05 · Follow the thread"
      data-palette="roadmap-warm"
      className="relative w-full section-pad overflow-hidden"
    >
      <div className="grid-12 relative z-[5] mb-10 md:mb-14">
        <div className="col-span-12 md:col-start-2 md:col-span-9">
          <div
            className="mono-eyebrow mb-4"
            style={{ color: 'rgba(255, 215, 160, 0.85)' }}
          >
            [ Chapter 05 · Follow the thread ]
          </div>
          <h2
            className="headline-display uppercase text-ink mb-4"
            style={{
              fontSize: 'clamp(2.25rem, 5.4vw, 4.8rem)',
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
            }}
          >
            What&rsquo;s coming, in order.
          </h2>
          <p
            className="font-body"
            style={{
              color: 'rgba(245,245,240,0.7)',
              fontSize: 16,
              maxWidth: '56ch',
              lineHeight: 1.55,
            }}
          >
            Hover anything on the board. The thread connects each feature to
            the next — some coming soon, some in design, some on the horizon.
          </p>
        </div>
      </div>

      <div className="locker-room-wrap">
        <div className="cork-board">
          <div className="cork-inner">
            <Rope
              segments={segments}
              segRefs={segRefs}
              hoveredIdx={hoveredIdx}
            />

            {FEATURES.map((f, i) => (
              <motion.div
                key={f.id}
                ref={(el) => {
                  artifactRefs.current[i] = el;
                }}
                className="artifact"
                style={{
                  position: 'absolute',
                  width: f.size.w,
                  height: f.size.h,
                  ...('left' in f.position
                    ? { left: f.position.left }
                    : { right: f.position.right }),
                  top: f.position.top,
                }}
                animate={{
                  rotate:
                    hoveredIdx === i ? f.rotation * 0.3 : f.rotation,
                  opacity:
                    hoveredIdx !== null && hoveredIdx !== i ? 0.55 : 1,
                  scale: hoveredIdx === i ? 1.04 : 1,
                  zIndex: hoveredIdx === i ? 16 : 10 + (i % 5),
                  filter:
                    hoveredIdx === i
                      ? 'drop-shadow(0 24px 36px rgba(0,0,0,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.35))'
                      : 'drop-shadow(0 10px 18px rgba(0,0,0,0.35)) drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 22,
                }}
                onHoverStart={() => setHoveredIdx(i)}
                onHoverEnd={() => setHoveredIdx(null)}
                data-cursor="hover"
              >
                <ArtifactBody feature={f} />
              </motion.div>
            ))}

            {/* Push pins on top of rope */}
            {FEATURES.map((f, i) => (
              <div
                key={`pin-${f.id}`}
                style={{
                  position: 'absolute',
                  left: `${(f.anchor.x / BOARD_W) * 100}%`,
                  top: `${(f.anchor.y / BOARD_H) * 100}%`,
                  marginLeft: -7.5,
                  marginTop: -7.5,
                  zIndex: 25,
                  pointerEvents: 'none',
                  transition:
                    'filter 240ms cubic-bezier(0.22, 1, 0.36, 1)',
                  filter:
                    hoveredIdx === i ||
                    hoveredIdx === i - 1 ||
                    hoveredIdx === i + 1
                      ? 'drop-shadow(0 0 6px rgba(224,69,44,0.55))'
                      : 'none',
                }}
              >
                <PushPin
                  size={15}
                  color={
                    hoveredIdx === i ||
                    hoveredIdx === i - 1 ||
                    hoveredIdx === i + 1
                      ? '#E0452C'
                      : '#A62E20'
                  }
                  style={{ position: 'relative' }}
                />
              </div>
            ))}

            <LegendSticky />
            <DustParticles />
            <NavIndicator hoveredIdx={hoveredIdx} />
          </div>

          {/* Info panel rendered outside cork-inner so it isn't clipped */}
          <AnimatePresence>
            {hoveredIdx !== null && (
              <InfoPanel
                key={FEATURES[hoveredIdx].id}
                feature={FEATURES[hoveredIdx]}
              />
            )}
          </AnimatePresence>

          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: 10,
              background:
                'radial-gradient(ellipse 70% 65% at 18% 12%, rgba(255, 200, 130, 0.22) 0%, transparent 70%)',
              mixBlendMode: 'screen',
              zIndex: 5,
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: 10,
              boxShadow:
                'inset 0 0 100px rgba(30,15,5,0.7), inset 0 0 30px rgba(20,10,0,0.55)',
              zIndex: 6,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .locker-room-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0 24px;
          box-sizing: border-box;
        }
        .cork-board {
          position: relative;
          width: min(1600px, 94vw);
          aspect-ratio: ${BOARD_W} / ${BOARD_H};
          max-height: 85vh;
          padding: 20px;
          box-sizing: border-box;
          isolation: isolate;
          border-radius: 10px;
          background-color: #a07548;
          background-image:
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0.55 0 0 0 0.2  0 0.32 0 0 0.12  0 0 0.16 0 0.04  0 0 0 0.85 0'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>"),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.12' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0.75 0 0 0 0.1  0 0.42 0 0 0.08  0 0 0.18 0 0.03  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>"),
            radial-gradient(
              ellipse 90% 90% at 22% 18%,
              rgba(255, 200, 130, 0.32) 0%,
              transparent 70%
            ),
            linear-gradient(135deg, #b08553 0%, #8a6036 100%);
          background-size: 220px, 420px, auto, auto;
          background-blend-mode: multiply, multiply, normal, normal;
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.5),
            0 8px 16px rgba(0, 0, 0, 0.35);
          border: 10px solid transparent;
          border-image: linear-gradient(
              135deg,
              #3a2210 0%,
              #5a3918 50%,
              #2a1808 100%
            )
            1;
        }

        .cork-inner {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden; /* clip any card rotation bleed */
          animation: warmPulse 8s ease-in-out infinite;
        }

        .artifact,
        .artifact * {
          word-break: keep-all;
          hyphens: none;
          overflow-wrap: normal;
        }

        @keyframes warmPulse {
          0%, 100% { filter: brightness(1); }
          50%      { filter: brightness(1.05); }
        }

        @keyframes dustDrift {
          0%   { transform: translate3d(-10px, 0, 0); opacity: 0; }
          8%   { opacity: 0.85; }
          92%  { opacity: 0.85; }
          100% { transform: translate3d(140px, -50px, 0); opacity: 0; }
        }

        @keyframes polaroidSway {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-0.8deg); }
        }

        :global(.artifact .polaroid-float) {
          animation: polaroidSway 6s ease-in-out infinite;
          transform-origin: top center;
        }

        @media (max-width: 767px) {
          .cork-board {
            aspect-ratio: auto;
            max-height: none;
            min-height: 1180px;
          }
        }
      `}</style>
    </section>
  );
}
