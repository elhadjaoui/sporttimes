'use client';

// Rubber-stamp text — solid filled, with an SVG displacement filter that
// roughens the edges like ink pressed unevenly onto paper. Much more
// visceral than the outline-only approach.

import { CSSProperties, useId } from 'react';

export default function StampText({
  text = 'ENOUGH.',
  color = '#991b1b',
  rotate = -8,
  // Container sets overall size via CSS font-size; SVG scales from it
  size = 'clamp(3rem, 6.5vw, 6rem)',
  opacity = 0.9,
  className = '',
  style = {},
}: {
  text?: string;
  color?: string;
  rotate?: number;
  size?: string;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}) {
  // Unique filter id so multiple stamps on the same page don't collide
  const filterId = 'stamp-distress-' + useId().replace(/:/g, '');
  const upper = text.toUpperCase();

  // Approximate SVG text width — ~0.58em per uppercase char at Inter 900
  const emWidth = Math.max(3, upper.length * 0.58);

  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      style={{
        opacity,
        fontSize: size,
        lineHeight: 1,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: 'center',
        ...style,
      }}
    >
      <svg
        width={`${emWidth}em`}
        height="1.2em"
        viewBox={`0 0 ${100 * emWidth} 120`}
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          <filter
            id={filterId}
            x="-5%"
            y="-10%"
            width="110%"
            height="120%"
          >
            {/* Edge roughening — irregular displacement simulates uneven
                ink pressure where the stamp met the paper. */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.14"
              numOctaves="3"
              seed="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="4"
              result="rough"
            />
            {/* Ink patches — high-frequency noise used to cut small holes
                in the rendered text, like where the rubber didn't ink. */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.1"
              numOctaves="2"
              seed="7"
              result="patches"
            />
            <feColorMatrix
              in="patches"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.15"
              result="patchesAlpha"
            />
            <feComposite
              in="rough"
              in2="patchesAlpha"
              operator="in"
            />
          </filter>
        </defs>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="900"
          fontSize="100"
          fill={color}
          letterSpacing="-3"
          filter={`url(#${filterId})`}
        >
          {upper}
        </text>
      </svg>
    </div>
  );
}
