'use client';

import Parallax from './Parallax';

type Props = {
  /** Wrap in <Parallax> with this multiplier. Pass false to render static. Default false. */
  parallax?: false | number;
  className?: string;
};

/**
 * PitchGrid: chalk-line football pitch markings as full-bleed SVG.
 * Reads --grid + --chalk from the active palette (works on dark / paper / lime).
 * Sits behind section content (z-0). Pointer-events: none.
 */
export default function PitchGrid({ parallax = false, className }: Props) {
  const svg = (
    <svg
      aria-hidden
      viewBox="0 0 70 100"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        color: 'var(--grid)',
      }}
    >
      {/* Outer boundary */}
      <rect x="0" y="0" width="70" height="100" fill="none" stroke="currentColor" strokeWidth="0.25" />
      {/* Halfway line + center circle + spot */}
      <line x1="0" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="0.2" />
      <circle cx="35" cy="50" r="9" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <circle cx="35" cy="50" r="0.5" fill="currentColor" />
      {/* Top penalty box + 6-yard + arc + spot */}
      <rect x="15" y="0" width="40" height="14" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <rect x="24" y="0" width="22" height="6" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <path d="M 29 14 A 6 6 0 0 0 41 14" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <circle cx="35" cy="9.5" r="0.4" fill="currentColor" />
      {/* Bottom penalty box + 6-yard + arc + spot */}
      <rect x="15" y="86" width="40" height="14" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <rect x="24" y="94" width="22" height="6" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <path d="M 29 86 A 6 6 0 0 1 41 86" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <circle cx="35" cy="90.5" r="0.4" fill="currentColor" />
    </svg>
  );

  if (parallax === false) {
    return (
      <div
        aria-hidden
        className={className}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      >
        {svg}
      </div>
    );
  }
  return (
    <Parallax y={parallax} className={className}>
      <div
        aria-hidden
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      >
        {svg}
      </div>
    </Parallax>
  );
}
