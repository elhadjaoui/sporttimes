'use client';

import Image from 'next/image';
import PitchGrid from '@/components/ui/PitchGrid';
import Reveal from '@/components/ui/Reveal';

type Row = {
  num: string;
  title: string;
  body: string;
  src: string;
  alt: string;
  imageRight: boolean;
};

const ROWS: Row[] = [
  {
    num: '01',
    title: 'Join your community.',
    body: 'Campus, city, club. Public groups open in a tap.',
    src: '/screens/01-community.png',
    alt: 'SportTimes community feed showing public groups in Ben Guerir',
    imageRight: false,
  },
  {
    num: '02',
    title: 'Discover matches.',
    body: 'Every match from every squad, in one feed.',
    src: '/screens/02-discover.png',
    alt: 'SportTimes match discovery feed with upcoming pickup games',
    imageRight: true,
  },
  {
    num: '03',
    title: 'See the lineup fill.',
    body: 'Watch positions claim themselves in real time.',
    src: '/screens/03-lineup.png',
    alt: 'SportTimes live lineup view with players filling a 4-3-3 formation',
    imageRight: false,
  },
  {
    num: '04',
    title: 'Jump in.',
    body: 'One tap. Captain approves. Your face appears in the lineup. You show up ready.',
    src: '/screens/04-jump-in.png',
    alt: 'SportTimes match confirmation screen with share-to-social options',
    imageRight: true,
  },
];

export default function Solution() {
  return (
    <section
      id="solution"
      data-palette="paper"
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 10vh, 8rem) 0 clamp(7rem, 12vh, 10rem)',
        overflow: 'hidden',
      }}
    >
      <PitchGrid parallax={0.2} />

      <div className="grid-12" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ gridColumn: '1 / span 12', textAlign: 'center', marginBottom: 'clamp(4rem, 8vh, 6rem)' }}>
          <Reveal stagger={80}>
            <div className="mono-eyebrow" style={{ marginBottom: 24 }}>
              [ how it works ]
            </div>
            <h2
              className="headline-display"
              style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', color: 'var(--text)' }}
            >
              The match before the match — built.
            </h2>
          </Reveal>
        </div>

        {ROWS.map((row) => (
          <SolutionRow key={row.num} row={row} />
        ))}
      </div>

      {/* Section close fade to next (dark) palette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '6vh',
          background: 'linear-gradient(to bottom, transparent, #0B0D10)',
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}

function SolutionRow({ row }: { row: Row }) {
  return (
    <div
      style={{
        gridColumn: '1 / span 12',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 32,
        alignItems: 'center',
        marginBottom: 'clamp(4rem, 8vh, 7rem)',
      }}
      className="solution-row"
      data-image-right={row.imageRight}
    >
      <Reveal stagger={80}>
        <div
          className="shot-frame"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '9 / 19.5',
            maxWidth: 320,
            margin: '0 auto',
            borderRadius: 28,
            overflow: 'hidden',
            background: 'var(--surface-2)',
            border: '1px solid var(--hairline)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
          }}
        >
          <Image
            src={row.src}
            alt={row.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 80vw"
            style={{ objectFit: 'cover' }}
            loading="lazy"
          />
        </div>
        <div style={{ padding: '0 8px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.22em',
              color: 'var(--text-mute)',
              marginBottom: 12,
            }}
          >
            {row.num}
          </div>
          <h3
            className="headline-display"
            style={{
              fontSize: 'clamp(24px, 3.2vw, 34px)',
              color: 'var(--text)',
              marginBottom: 16,
            }}
          >
            {row.title}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 17,
              lineHeight: 1.55,
              color: 'var(--text-dim)',
              maxWidth: '38ch',
            }}
          >
            {row.body}
          </p>
        </div>
      </Reveal>

      <style jsx>{`
        @media (min-width: 1024px) {
          .solution-row {
            grid-template-columns: 1fr 1fr !important;
            gap: 64px !important;
          }
          .solution-row[data-image-right='true'] :global(.shot-frame) {
            order: 2;
          }
        }
      `}</style>
    </div>
  );
}
