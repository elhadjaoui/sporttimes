'use client';

import { useEffect, useRef } from 'react';

// Each bubble has: text, timestamp, author, position (x% y%), z-depth,
// rotation, scale. Hand-placed so the chaos feels authored, not random.
const BUBBLES: Array<{
  text: string;
  time: string;
  author: string;
  x: number;
  y: number;
  z: number;
  rot: number;
  scale: number;
  read?: boolean;
  muted?: boolean;
}> = [
  { text: 'who\u2019s in tonight?', time: '18:42', author: 'Yassine', x: 12, y: 18, z: -40, rot: -3, scale: 1, read: true },
  { text: '???', time: '19:01', author: 'Mehdi', x: 62, y: 12, z: 20, rot: 4, scale: 0.85 },
  { text: 'bring a ball', time: '19:15', author: 'Amine', x: 28, y: 32, z: 10, rot: -5, scale: 0.95, read: true },
  { text: 'i might be late', time: '19:22', author: 'Karim', x: 8, y: 48, z: -20, rot: 2, scale: 0.9, muted: true },
  { text: 'changed to 21:00', time: '19:34', author: 'Youssef', x: 55, y: 40, z: 30, rot: -4, scale: 1.05 },
  { text: 'who\u2019s coming??', time: '19:50', author: 'Reda', x: 22, y: 56, z: 0, rot: 3, scale: 0.88, read: true },
  { text: 'cancelled?', time: '20:02', author: 'Imad', x: 68, y: 58, z: -30, rot: -2, scale: 0.92 },
  { text: 'i\u2019m out sorry', time: '20:11', author: 'Ali', x: 12, y: 72, z: 15, rot: 5, scale: 0.85, muted: true },
  { text: 'still on?', time: '20:18', author: 'Hamza', x: 48, y: 70, z: -10, rot: -3, scale: 1 },
  { text: 'only 5 of us', time: '20:25', author: 'Yassine', x: 28, y: 82, z: 25, rot: 2, scale: 0.95 },
  { text: 'need 3 more', time: '20:31', author: 'Mehdi', x: 62, y: 84, z: 0, rot: 4, scale: 0.9, read: true },
  { text: '\u2026', time: '20:38', author: 'Karim', x: 40, y: 92, z: -25, rot: -1, scale: 0.8, muted: true },
];

export default function ChatChaos() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Gentle parallax on mouse — bubbles at deeper z move less, nearer move more
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const bubbles = Array.from(
      root.querySelectorAll<HTMLDivElement>('[data-bubble]')
    );
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
      tx = nx;
      ty = ny;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      bubbles.forEach((el) => {
        const z = Number(el.dataset.z ?? 0);
        // Nearer (z > 0) responds more, farther (z < 0) responds less
        const factor = 0.5 + (z / 50) * 0.8;
        el.style.setProperty('--px', `${-cx * 24 * factor}px`);
        el.style.setProperty('--py', `${-cy * 20 * factor}px`);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    root.addEventListener('mousemove', onMove);
    root.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener('mousemove', onMove);
      root.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{ perspective: '1400px' }}
    >
      {/* Warm red radial wash — gives the section its "frustration" mood
          without ever leaving the dark theme */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(255, 107, 107, 0.08) 0%, rgba(255, 107, 107, 0) 55%)',
        }}
      />

      {/* Bubbles */}
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            data-bubble
            data-z={b.z}
            className="absolute bubble-float"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: `translate3d(var(--px, 0), var(--py, 0), ${b.z}px) rotate(${b.rot}deg) scale(${b.scale})`,
              animationDelay: `${(i * 0.27) % 3.1}s`,
              opacity: b.muted ? 0.38 : 0.82,
              filter:
                Math.abs(b.z) > 25
                  ? `blur(${(Math.abs(b.z) - 25) * 0.08}px)`
                  : undefined,
            }}
          >
            <div
              className="rounded-2xl border border-ink/10 bg-[#0e0e0e] shadow-[0_0_40px_rgba(0,0,0,0.4)] px-4 py-2.5 min-w-[140px] max-w-[220px]"
            >
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink/40">
                  {b.author}
                </span>
                <span className="font-mono text-[9px] text-ink/30">
                  {b.time}
                </span>
              </div>
              <div className="font-body text-[13px] text-ink/85 leading-snug">
                {b.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edge fade + vignette so chaos dissolves cleanly into bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to left, #050505 0%, rgba(5,5,5,0.6) 12%, rgba(5,5,5,0) 35%), radial-gradient(ellipse at 35% 50%, rgba(5,5,5,0) 0%, rgba(5,5,5,0.35) 75%, rgba(5,5,5,0.85) 100%)',
        }}
      />

      <style jsx global>{`
        @keyframes bubble-float {
          0%, 100% { transform: translate3d(var(--px, 0), var(--py, 0), var(--tz, 0)) rotate(var(--tr, 0)) scale(var(--ts, 1)); }
          50%     { transform: translate3d(var(--px, 0), calc(var(--py, 0) - 6px), var(--tz, 0)) rotate(var(--tr, 0)) scale(var(--ts, 1)); }
        }
        .bubble-float {
          animation: none;
        }
      `}</style>
    </div>
  );
}
