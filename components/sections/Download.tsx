'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// ===================================================================
//  Proximity ink ↔ lime
// ===================================================================

function interpolateColor(t: number): string {
  const ink = [0xf5, 0xf5, 0xf0];
  const lime = [0xd4, 0xff, 0x3a];
  const r = Math.round(ink[0] * (1 - t) + lime[0] * t);
  const g = Math.round(ink[1] * (1 - t) + lime[1] * t);
  const b = Math.round(ink[2] * (1 - t) + lime[2] * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// ===================================================================
//  App Store badge (minimal branded pill — not the licensed SVG)
// ===================================================================

function AppStoreBadge() {
  return (
    <a
      href="#"
      data-cursor="hover"
      className="store-badge"
      aria-label="Download on the App Store"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
        background: '#0A0A0A',
        border: '1px solid rgba(245,245,240,0.22)',
        borderRadius: 10,
        color: '#F5F5F0',
        textDecoration: 'none',
        fontFamily: 'var(--font-body), Inter, sans-serif',
        minWidth: 170,
        transition:
          'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1), border-color 280ms ease',
        willChange: 'transform',
      }}
    >
      <svg width="22" height="26" viewBox="0 0 22 26" fill="#F5F5F0">
        <path d="M17.5 14.1c0-2.5 2-3.7 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.1-.8-1.6 0-3 .9-3.8 2.4-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2-.1 1.6-.8 3.1-.8 1.4 0 1.8.8 3.1.7 1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.4zM14.8 7.1c.7-.8 1.1-1.9 1-3-.9.1-2 .6-2.7 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2-.5 2.7-1.3z" />
      </svg>
      <div style={{ textAlign: 'left', lineHeight: 1 }}>
        <div
          style={{
            fontSize: 9,
            letterSpacing: '0.08em',
            color: 'rgba(245,245,240,0.75)',
          }}
        >
          Download on the
        </div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            marginTop: 2,
          }}
        >
          App&nbsp;Store
        </div>
      </div>
    </a>
  );
}

// ===================================================================
//  Google Play badge
// ===================================================================

function PlayStoreBadge() {
  return (
    <a
      href="#"
      data-cursor="hover"
      className="store-badge"
      aria-label="Get it on Google Play"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
        background: '#0A0A0A',
        border: '1px solid rgba(245,245,240,0.22)',
        borderRadius: 10,
        color: '#F5F5F0',
        textDecoration: 'none',
        fontFamily: 'var(--font-body), Inter, sans-serif',
        minWidth: 170,
        transition:
          'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1), border-color 280ms ease',
        willChange: 'transform',
      }}
    >
      <svg width="22" height="26" viewBox="0 0 512 512">
        <defs>
          <linearGradient id="p1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD400" />
            <stop offset="1" stopColor="#FF3A44" />
          </linearGradient>
          <linearGradient id="p2" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#00A0FF" />
            <stop offset="1" stopColor="#33BBFF" />
          </linearGradient>
          <linearGradient id="p3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00C853" />
            <stop offset="1" stopColor="#B2FF59" />
          </linearGradient>
        </defs>
        <path
          d="M66 44c-8 4-12 11-12 21v382c0 10 4 17 12 21l224-210L66 44z"
          fill="url(#p2)"
        />
        <path
          d="M290 258L66 468c8 3 17 2 26-3l268-152-70-55z"
          fill="url(#p1)"
        />
        <path
          d="M360 313l-70-55 70-55 88 50c18 10 18 28 0 38l-88 22z"
          fill="url(#p3)"
        />
        <path
          d="M290 258L360 203 92 51c-9-5-18-6-26-3l224 210z"
          fill="#00A0FF"
          opacity="0.9"
        />
      </svg>
      <div style={{ textAlign: 'left', lineHeight: 1 }}>
        <div
          style={{
            fontSize: 9,
            letterSpacing: '0.08em',
            color: 'rgba(245,245,240,0.75)',
          }}
        >
          GET IT ON
        </div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            marginTop: 2,
          }}
        >
          Google&nbsp;Play
        </div>
      </div>
    </a>
  );
}

// ===================================================================
//  Styled placeholder QR — deterministic lime-on-black grid
// ===================================================================

function QRPlaceholder({ size = 104 }: { size?: number }) {
  const N = 21; // 21x21 module grid (QR v1 visual)
  const cell = size / N;
  // Deterministic pseudo-random pattern
  const cells: boolean[] = [];
  let seed = 7;
  for (let i = 0; i < N * N; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    cells.push(seed / 233280 > 0.5);
  }
  // Force three corner position markers
  const setBlock = (r: number, c: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const ring =
          y === 0 || y === 6 || x === 0 || x === 6;
        const center =
          y >= 2 && y <= 4 && x >= 2 && x <= 4;
        cells[(r + y) * N + (c + x)] = ring || center;
      }
    }
    for (let y = -1; y <= 7; y++) {
      for (let x = -1; x <= 7; x++) {
        const edge =
          y === -1 || y === 7 || x === -1 || x === 7;
        if (edge) {
          const rr = r + y;
          const cc = c + x;
          if (rr >= 0 && rr < N && cc >= 0 && cc < N) {
            cells[rr * N + cc] = false;
          }
        }
      }
    }
  };
  setBlock(0, 0);
  setBlock(0, N - 7);
  setBlock(N - 7, 0);

  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        padding: 5,
        background: '#050505',
        border: '1px solid rgba(212, 255, 58, 0.45)',
        borderRadius: 8,
        boxShadow:
          '0 0 24px rgba(212,255,58,0.16), inset 0 0 8px rgba(0,0,0,0.6)',
      }}
    >
      <svg viewBox={`0 0 ${N} ${N}`} width="100%" height="100%">
        {cells.map((on, idx) => {
          if (!on) return null;
          const x = idx % N;
          const y = Math.floor(idx / N);
          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={1}
              height={1}
              fill="#D4FF3A"
            />
          );
        })}
      </svg>
    </div>
  );
}

// ===================================================================
//  Phone mockup — CSS only, subtle tilt + float
// ===================================================================

function PhoneMockup() {
  // Tiny pitch SVG used inside each match card (matches the real app UI)
  const MiniPitch = ({ youIndex = 3 }: { youIndex?: number }) => (
    <svg viewBox="0 0 70 100" width="62" height="88">
      <rect
        x="0.5"
        y="0.5"
        width="69"
        height="99"
        fill="none"
        stroke="rgba(245,245,240,0.2)"
        strokeWidth="0.5"
      />
      <line
        x1="0"
        y1="50"
        x2="70"
        y2="50"
        stroke="rgba(245,245,240,0.2)"
        strokeWidth="0.4"
      />
      <circle
        cx="35"
        cy="50"
        r="8"
        fill="none"
        stroke="rgba(245,245,240,0.2)"
        strokeWidth="0.4"
      />
      {/* Defenders */}
      {[14, 28, 42, 56].map((x, i) => (
        <circle
          key={`d${i}`}
          cx={x}
          cy={78}
          r={2.2}
          fill={i === youIndex - 2 ? '#D4FF3A' : '#F5F5F0'}
          opacity={i === youIndex - 2 ? 1 : 0.85}
          stroke={i === youIndex - 2 ? '#D4FF3A' : 'none'}
          strokeWidth={i === youIndex - 2 ? 0.6 : 0}
        />
      ))}
      {/* Mids */}
      {[22, 35, 48].map((x, i) => (
        <circle
          key={`m${i}`}
          cx={x}
          cy={55}
          r={2.2}
          fill="#F5F5F0"
          opacity={0.85}
        />
      ))}
      {/* Forwards */}
      {[22, 48].map((x, i) => (
        <circle
          key={`f${i}`}
          cx={x}
          cy={28}
          r={2.2}
          fill="#F5F5F0"
          opacity={0.85}
        />
      ))}
      {/* GK */}
      <circle cx="35" cy="93" r={2.2} fill="#F5F5F0" opacity={0.85} />
      {/* "You" badge */}
      <g>
        <rect
          x="30"
          y="75"
          width="10"
          height="6"
          rx="1"
          fill="#D4FF3A"
        />
        <text
          x="35"
          y="79.5"
          fontSize="4"
          fontWeight="900"
          fontFamily="var(--font-display), Inter"
          fill="#050505"
          textAnchor="middle"
        >
          YOU
        </text>
      </g>
    </svg>
  );

  return (
    <div className="phone-outer" aria-hidden>
      <div className="phone-float">
        <div className="phone-tilt">
          <div className="phone-body">
            <div className="phone-notch" />
            <div className="phone-screen">
              {/* Status bar */}
              <div className="phone-status">
                <span>9:41</span>
                <span
                  style={{
                    display: 'flex',
                    gap: 3,
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 8,
                      border: '1px solid currentColor',
                      borderRadius: 2,
                      padding: 1,
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        width: '80%',
                        height: '100%',
                        background: 'currentColor',
                      }}
                    />
                  </span>
                </span>
              </div>

              {/* Screen header */}
              <div className="phone-screen-header">
                <div className="phone-screen-title">Discover matches</div>
                <span className="phone-bell" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2z" />
                    <path d="M10 20a2 2 0 0 0 4 0" />
                  </svg>
                </span>
              </div>

              {/* Sport tabs */}
              <div className="phone-sports">
                <span className="phone-sport phone-sport-active">
                  <span className="phone-sport-dot" />
                  Football
                </span>
                <span className="phone-sport">Basketball</span>
                <span className="phone-sport">Handball</span>
              </div>

              {/* Date strip */}
              <div className="phone-dates">
                {[
                  { d: 'SAT', n: 4 },
                  { d: 'SUN', n: 5 },
                  { d: 'MON', n: 6 },
                  { d: 'TUE', n: 7, active: true },
                  { d: 'WED', n: 8 },
                  { d: 'THU', n: 9 },
                ].map((date) => (
                  <span
                    key={date.n}
                    className={`phone-date ${date.active ? 'phone-date-active' : ''}`}
                  >
                    <span className="phone-date-day">{date.d}</span>
                    <span className="phone-date-num">{date.n}</span>
                  </span>
                ))}
              </div>

              {/* Section label */}
              <div className="phone-section">
                <span>Team vs Team</span>
                <span className="phone-section-link">See all</span>
              </div>

              {/* Match card */}
              <div className="phone-match">
                <div className="phone-match-left">
                  <div className="phone-match-title">Sunday match</div>
                  <div className="phone-match-group">
                    <span className="phone-shield" aria-hidden />
                    Stars United Group
                  </div>
                  <div className="phone-match-meta">
                    <span>
                      <span className="phone-match-meta-label">11/11</span>
                    </span>
                    <span>
                      <span className="phone-match-meta-label">18:30</span>
                    </span>
                    <span>
                      <span className="phone-match-meta-label">East Field</span>
                    </span>
                  </div>
                </div>
                <div className="phone-match-right">
                  <MiniPitch youIndex={3} />
                </div>
              </div>

              {/* Second section */}
              <div className="phone-section" style={{ marginTop: 6 }}>
                <span>Random matches</span>
                <span className="phone-section-link">See all</span>
              </div>

              <div className="phone-match phone-match-dim">
                <div className="phone-match-left">
                  <div className="phone-match-title">Friday run</div>
                  <div className="phone-match-group">
                    <span className="phone-shield" aria-hidden />
                    Casablanca Sports
                  </div>
                </div>
                <div className="phone-match-right" style={{ opacity: 0.75 }}>
                  <MiniPitch youIndex={0} />
                </div>
              </div>

              {/* Bottom nav */}
              <div className="phone-nav">
                <div className="phone-nav-item phone-nav-active">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11 L 12 3 L 21 11 V 21 H 3 Z" />
                  </svg>
                  <span>Home</span>
                </div>
                <div className="phone-nav-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="8" r="3" />
                    <circle cx="17" cy="8" r="2.5" />
                    <path d="M3 19 c 1-3 4-5 6-5 s 5 2 6 5" />
                    <path d="M14 17 c 1-2 2-3 4-3" />
                  </svg>
                  <span>Community</span>
                </div>
                <div className="phone-nav-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="3.2" />
                    <path d="M4 21 c 1-5 4-7 8-7 s 7 2 8 7" />
                  </svg>
                  <span>Profile</span>
                </div>
                <div className="phone-nav-fab" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="2.4" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Lime rim light */}
          <div className="phone-rim" aria-hidden />
        </div>
      </div>

      <style jsx>{`
        .phone-outer {
          position: relative;
          width: 300px;
          height: 600px;
          perspective: 1600px;
        }
        .phone-float {
          width: 100%;
          height: 100%;
          animation: phoneFloat 7s ease-in-out infinite;
        }
        .phone-tilt {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: phoneTilt 14s ease-in-out infinite;
          position: relative;
        }
        .phone-body {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(160deg, #1a1a1a 0%, #060606 100%);
          border-radius: 38px;
          padding: 10px;
          box-sizing: border-box;
          box-shadow:
            0 30px 60px rgba(0, 0, 0, 0.7),
            0 10px 20px rgba(0, 0, 0, 0.5),
            inset 0 0 0 1.2px rgba(245, 245, 240, 0.08),
            inset 0 0 32px rgba(0, 0, 0, 0.6);
        }
        .phone-notch {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 84px;
          height: 22px;
          background: #050505;
          border-radius: 100px;
          z-index: 3;
        }
        .phone-screen {
          width: 100%;
          height: 100%;
          background: #050505;
          border-radius: 30px;
          overflow: hidden;
          position: relative;
          padding: 34px 14px 0;
          box-sizing: border-box;
          color: #f5f5f0;
          font-family: var(--font-body), Inter, sans-serif;
          display: flex;
          flex-direction: column;
        }
        .phone-rim {
          position: absolute;
          inset: -2px;
          border-radius: 40px;
          pointer-events: none;
          background: radial-gradient(
            100% 60% at 50% 0%,
            rgba(212, 255, 58, 0.22) 0%,
            transparent 70%
          );
          mix-blend-mode: screen;
          z-index: 2;
        }
        .phone-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          color: rgba(245, 245, 240, 0.85);
          padding: 2px 6px 10px;
        }
        .phone-screen-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding: 0 4px;
        }
        .phone-screen-title {
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 900;
          font-size: 18px;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }
        .phone-bell {
          color: #f5f5f0;
          opacity: 0.8;
        }
        .phone-sports {
          display: flex;
          gap: 6px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .phone-sport {
          font-family: var(--font-mono), monospace;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 100px;
          border: 1px solid rgba(245, 245, 240, 0.12);
          color: rgba(245, 245, 240, 0.55);
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .phone-sport-active {
          background: rgba(40, 46, 38, 0.95);
          border-color: rgba(245, 245, 240, 0.2);
          color: #f5f5f0;
        }
        .phone-sport-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--lime, #d4ff3a);
        }
        .phone-dates {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }
        .phone-date {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 0 7px;
          border-radius: 10px;
          background: rgba(20, 22, 20, 0.7);
          border: 1px solid rgba(245, 245, 240, 0.06);
        }
        .phone-date-active {
          background: var(--lime, #d4ff3a);
          border-color: var(--lime, #d4ff3a);
          color: #050505;
          box-shadow: 0 0 12px rgba(212, 255, 58, 0.25);
        }
        .phone-date-day {
          font-family: var(--font-mono), monospace;
          font-size: 7.5px;
          letter-spacing: 0.12em;
          opacity: 0.8;
        }
        .phone-date-num {
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 900;
          font-size: 14px;
          margin-top: 2px;
          line-height: 1;
        }
        .phone-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 2px 2px 8px;
          font-family: var(--font-mono), monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(245, 245, 240, 0.55);
        }
        .phone-section-link {
          color: rgba(245, 245, 240, 0.65);
        }
        .phone-match {
          display: flex;
          gap: 10px;
          padding: 12px;
          border-radius: 14px;
          background: rgba(18, 22, 18, 0.95);
          border: 1px solid rgba(245, 245, 240, 0.08);
          margin-bottom: 10px;
        }
        .phone-match-dim { opacity: 0.75; }
        .phone-match-left {
          flex: 1;
          min-width: 0;
        }
        .phone-match-title {
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 900;
          font-size: 15px;
          color: var(--lime, #d4ff3a);
          letter-spacing: -0.015em;
          margin-bottom: 6px;
          line-height: 1;
        }
        .phone-match-group {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          color: rgba(245, 245, 240, 0.6);
          margin-bottom: 8px;
        }
        .phone-shield {
          width: 11px;
          height: 12px;
          background: linear-gradient(135deg, #d4ff3a, #9ad012);
          clip-path: polygon(
            50% 0,
            100% 15%,
            100% 65%,
            50% 100%,
            0 65%,
            0 15%
          );
          display: inline-block;
        }
        .phone-match-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-family: var(--font-mono), monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          color: rgba(245, 245, 240, 0.75);
          text-transform: uppercase;
        }
        .phone-match-meta-label {
          color: rgba(245, 245, 240, 0.85);
        }
        .phone-match-right {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .phone-nav {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 6px 10px;
          border-top: 1px solid rgba(245, 245, 240, 0.06);
        }
        .phone-nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          font-family: var(--font-mono), monospace;
          font-size: 8px;
          letter-spacing: 0.14em;
          color: rgba(245, 245, 240, 0.4);
          text-transform: uppercase;
        }
        .phone-nav-active {
          color: #f5f5f0;
        }
        .phone-nav-fab {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--lime, #d4ff3a);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 14px rgba(212, 255, 58, 0.45);
          margin-left: 4px;
        }

        @keyframes phoneFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -10px, 0); }
        }
        @keyframes phoneTilt {
          0%, 100% { transform: rotateY(-8deg) rotateX(4deg) rotateZ(-1deg); }
          50%      { transform: rotateY(8deg) rotateX(2deg) rotateZ(1deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .phone-float, .phone-tilt { animation: none; }
        }

        @media (max-width: 767px) {
          .phone-outer {
            width: 240px;
            height: 500px;
          }
          .phone-screen-title { font-size: 16px; }
        }
      `}</style>
    </div>
  );
}

// ===================================================================
//  Main section
// ===================================================================

const HEADLINE = ['Your next match', 'is already happening.'];

export default function Download() {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  // Entry animation on intersect
  useEffect(() => {
    if (!rootRef.current) return;

    const inners = headlineRef.current
      ? Array.from(
          headlineRef.current.querySelectorAll<HTMLElement>(
            '.dl-line-inner'
          )
        )
      : [];
    const fades = fadeRef.current
      ? Array.from(
          fadeRef.current.querySelectorAll<HTMLElement>('.dl-fade')
        )
      : [];

    if (inners.length) gsap.set(inners, { yPercent: 100 });
    if (fades.length) gsap.set(fades, { opacity: 0, y: 16 });

    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      if (inners.length) {
        gsap.to(inners, {
          yPercent: 0,
          duration: 0.95,
          ease: 'expo.out',
          stagger: 0.09,
        });
      }
      if (fades.length) {
        gsap.to(fades, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 0.2,
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            play();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(rootRef.current);

    const fallback = window.setTimeout(() => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight) {
        play();
        observer.disconnect();
      }
    }, 160);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  // Proximity hover on headline letters (hero-style)
  useEffect(() => {
    if (!headlineRef.current) return;
    const lines = Array.from(
      headlineRef.current.querySelectorAll<HTMLElement>('.dl-line')
    );
    if (lines.length === 0) return;

    const RADIUS = 130;
    const cleanups: Array<() => void> = [];

    lines.forEach((line) => {
      const letters = Array.from(
        line.querySelectorAll<HTMLElement>('.dl-letter')
      );

      const onMove = (e: MouseEvent) => {
        const cx = e.clientX;
        const cy = e.clientY;
        letters.forEach((letter) => {
          const r = letter.getBoundingClientRect();
          const lx = r.left + r.width / 2;
          const ly = r.top + r.height / 2;
          const dist = Math.hypot(cx - lx, cy - ly);
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
      id="download"
      data-progress-section
      data-progress-label="06 · Download"
      data-palette="download"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh', paddingTop: 'clamp(5rem, 10vh, 8rem)', paddingBottom: 'clamp(5rem, 10vh, 8rem)' }}
    >
      <div className="grid-12 items-center relative z-[5]" style={{ minHeight: '80vh' }}>
        {/* LEFT — content */}
        <div
          ref={fadeRef}
          className="col-span-12 md:col-start-2 md:col-span-6"
        >
          <div className="mono-eyebrow mb-6 dl-fade">
            [ Chapter 06 · Download ]
          </div>

          <h2
            ref={headlineRef}
            aria-label="Your next match is already happening."
            className="headline-display uppercase text-ink mb-8"
            style={{
              fontSize: 'clamp(1.9rem, 4.2vw, 3.8rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.025em',
              maxWidth: '14ch',
            }}
          >
            {HEADLINE.map((line, i) => (
              <span
                key={i}
                className="dl-line cursor-default"
                data-cursor="blend"
                style={{
                  display: 'block',
                  overflow: 'hidden',
                  lineHeight: 0.95,
                  paddingBottom: '0.06em',
                }}
              >
                <span
                  className="dl-line-inner"
                  style={{
                    display: 'block',
                    willChange: 'transform',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {line.split('').map((ch, j) => (
                    <span
                      key={j}
                      className="dl-letter"
                      style={{
                        display: 'inline-block',
                        willChange: 'color, transform',
                      }}
                    >
                      {ch === ' ' ? '\u00A0' : ch}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h2>

          <p
            className="dl-fade font-body mb-10"
            style={{
              color: 'rgba(245,245,240,0.65)',
              fontSize: 18,
              lineHeight: 1.45,
              maxWidth: '44ch',
            }}
          >
            You just need to open the app.
          </p>

          {/* CTA row — badges + QR */}
          <div className="dl-fade flex flex-wrap items-center gap-6 mb-8">
            <div className="flex flex-wrap gap-3">
              <AppStoreBadge />
              <PlayStoreBadge />
            </div>

            <div
              style={{
                width: 1,
                height: 56,
                background: 'rgba(245,245,240,0.12)',
                margin: '0 4px',
              }}
              className="hidden md:block"
            />

            <div className="flex items-center gap-3">
              <QRPlaceholder size={96} />
              <div>
                <div
                  className="mono-eyebrow"
                  style={{
                    color: 'var(--lime, #d4ff3a)',
                    marginBottom: 4,
                  }}
                >
                  [ Or scan to download ]
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    color: 'rgba(245,245,240,0.5)',
                    textTransform: 'uppercase',
                    maxWidth: '20ch',
                    lineHeight: 1.4,
                  }}
                >
                  Points to the App Store / Play listing for your region
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — phone mockup */}
        <div
          className="col-span-12 md:col-start-8 md:col-span-5 flex justify-center md:justify-end dl-fade"
          style={{ paddingTop: '1rem' }}
        >
          <PhoneMockup />
        </div>
      </div>

      {/* Bottom corner caption */}
      <div
        className="absolute left-0 right-0 text-center dl-fade"
        style={{
          bottom: 'clamp(1.5rem, 3vh, 2.5rem)',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          letterSpacing: '0.28em',
          color: 'rgba(245,245,240,0.4)',
          textTransform: 'uppercase',
          zIndex: 5,
        }}
      >
        [ Available on iOS and Android ]
      </div>

      <style jsx>{`
        :global(.store-badge:hover) {
          transform: translateY(-2px) scale(1.03);
          border-color: var(--lime, #d4ff3a) !important;
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.5),
            0 0 24px rgba(212, 255, 58, 0.28);
        }
      `}</style>
    </section>
  );
}
