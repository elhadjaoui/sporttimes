'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// ===================================================================
//  Palette definitions — mixed dark + lit environments
//  Dark sections: hero, problem, download (cinematic weight)
//  Lit sections: how, football, basketball, handball, roadmap
// ===================================================================

type AmbSpot = { color: string; pos: string };

type Palette = {
  lit: boolean;
  base: string;

  amb1: AmbSpot;
  amb2: AmbSpot;
  amb3?: AmbSpot;

  cursorColor: string;

  particleColor: string;
  particleColor2?: string; // optional second tone for mixed dust
  particleMinOp: number;
  particleMaxOp: number;

  vignette: string;
  vignettePx: number;

  grainOp: number;

  // Atmosphere flags (0 or 1, tweened as opacity)
  broadcastSweep: number;
  sunbeam: number;
  ledStreaks: number;
};

const PALETTES: Record<string, Palette> = {
  hero: {
    lit: false,
    base: '#060707',
    amb1: { color: 'rgba(212, 255, 58, 0.07)', pos: '20% 25%' },
    amb2: { color: 'rgba(200, 220, 210, 0.05)', pos: '85% 80%' },
    cursorColor: 'rgba(212, 255, 58, 0.28)',
    particleColor: 'rgba(212, 255, 58, 0.55)',
    particleMinOp: 0.15,
    particleMaxOp: 0.30,
    vignette: 'rgba(0, 0, 0, 0.55)',
    vignettePx: 180,
    grainOp: 0.04,
    broadcastSweep: 0,
    sunbeam: 0,
    ledStreaks: 0,
  },
  problem: {
    lit: false,
    base: '#080505',
    amb1: { color: 'rgba(230, 70, 70, 0.09)', pos: '25% 35%' },
    amb2: { color: 'rgba(139, 30, 30, 0.06)', pos: '85% 75%' },
    cursorColor: 'rgba(230, 90, 90, 0.28)',
    particleColor: 'rgba(245, 220, 220, 0.45)',
    particleMinOp: 0.15,
    particleMaxOp: 0.30,
    vignette: 'rgba(20, 0, 0, 0.6)',
    vignettePx: 200,
    grainOp: 0.05,
    broadcastSweep: 0,
    sunbeam: 0,
    ledStreaks: 0,
  },
  how: {
    lit: true,
    base: '#1A2420',
    amb1: { color: 'rgba(80, 130, 80, 0.25)', pos: '25% 35%' },
    amb2: { color: 'rgba(212, 255, 58, 0.18)', pos: '80% 75%' },
    cursorColor: 'rgba(212, 255, 58, 0.35)',
    particleColor: 'rgba(212, 255, 58, 0.6)',
    particleColor2: 'rgba(180, 230, 150, 0.55)',
    particleMinOp: 0.35,
    particleMaxOp: 0.50,
    vignette: 'rgba(0, 10, 0, 0.45)',
    vignettePx: 120,
    grainOp: 0.025,
    broadcastSweep: 1,
    sunbeam: 0,
    ledStreaks: 0,
  },
  football: {
    lit: true,
    base: '#24302A',
    // Alphas boosted 1.3x per settled-phase intensity spec
    amb1: { color: 'rgba(255, 200, 120, 0.39)', pos: '80% 35%' },
    amb2: { color: 'rgba(120, 180, 100, 0.29)', pos: '30% 85%' },
    amb3: { color: 'rgba(255, 160, 80, 0.20)', pos: '85% 15%' },
    cursorColor: 'rgba(255, 210, 130, 0.32)',
    particleColor: 'rgba(255, 200, 120, 0.55)',
    particleColor2: 'rgba(140, 200, 110, 0.50)',
    particleMinOp: 0.30,
    particleMaxOp: 0.50,
    vignette: 'rgba(20, 15, 0, 0.4)',
    vignettePx: 120,
    grainOp: 0.025,
    broadcastSweep: 0,
    sunbeam: 0,
    ledStreaks: 0,
  },
  basketball: {
    lit: true,
    base: '#2A1C14',
    // Alphas boosted 1.4x
    amb1: { color: 'rgba(255, 130, 50, 0.49)', pos: '20% 20%' },
    amb2: { color: 'rgba(255, 180, 100, 0.31)', pos: '70% 80%' },
    amb3: { color: 'rgba(160, 90, 40, 0.25)', pos: '50% 95%' },
    cursorColor: 'rgba(255, 150, 70, 0.38)',
    particleColor: 'rgba(255, 210, 160, 0.60)',
    particleColor2: 'rgba(255, 170, 90, 0.55)',
    particleMinOp: 0.35,
    particleMaxOp: 0.55,
    vignette: 'rgba(20, 10, 0, 0.45)',
    vignettePx: 130,
    grainOp: 0.025,
    broadcastSweep: 0,
    sunbeam: 1,
    ledStreaks: 0,
  },
  handball: {
    lit: true,
    base: '#1A2A3A',
    // Alphas boosted 1.5x
    amb1: { color: 'rgba(0, 229, 255, 0.48)', pos: '50% 15%' },
    amb2: { color: 'rgba(100, 180, 255, 0.33)', pos: '80% 75%' },
    amb3: { color: 'rgba(255, 255, 255, 0.15)', pos: '20% 60%' },
    cursorColor: 'rgba(60, 230, 255, 0.38)',
    particleColor: 'rgba(180, 240, 255, 0.65)',
    particleColor2: 'rgba(255, 255, 255, 0.55)',
    particleMinOp: 0.40,
    particleMaxOp: 0.55,
    vignette: 'rgba(0, 10, 20, 0.4)',
    vignettePx: 120,
    grainOp: 0.025,
    broadcastSweep: 0,
    sunbeam: 0,
    ledStreaks: 1,
  },
  roadmap: {
    lit: true,
    base: '#1A1530',
    amb1: { color: 'rgba(180, 140, 255, 0.30)', pos: '75% 25%' },
    amb2: { color: 'rgba(212, 255, 58, 0.25)', pos: '25% 85%' },
    amb3: { color: 'rgba(255, 180, 220, 0.15)', pos: '20% 15%' },
    cursorColor: 'rgba(200, 160, 255, 0.32)',
    particleColor: 'rgba(210, 180, 255, 0.55)',
    particleColor2: 'rgba(212, 255, 58, 0.55)',
    particleMinOp: 0.30,
    particleMaxOp: 0.50,
    vignette: 'rgba(15, 0, 30, 0.45)',
    vignettePx: 130,
    grainOp: 0.03,
    broadcastSweep: 0,
    sunbeam: 0,
    ledStreaks: 0,
  },
  'roadmap-warm': {
    lit: true,
    base: '#1A1209',
    amb1: { color: 'rgba(255, 180, 100, 0.34)', pos: '20% 25%' },
    amb2: { color: 'rgba(255, 140, 60, 0.22)', pos: '80% 75%' },
    amb3: { color: 'rgba(255, 210, 150, 0.16)', pos: '50% 10%' },
    cursorColor: 'rgba(255, 180, 120, 0.38)',
    particleColor: 'rgba(255, 230, 200, 0.65)',
    particleColor2: 'rgba(255, 200, 150, 0.55)',
    particleMinOp: 0.32,
    particleMaxOp: 0.52,
    vignette: 'rgba(25, 12, 0, 0.55)',
    vignettePx: 140,
    grainOp: 0.035,
    broadcastSweep: 0,
    sunbeam: 0,
    ledStreaks: 0,
  },
  download: {
    lit: false,
    base: '#060807',
    amb1: { color: 'rgba(212, 255, 58, 0.18)', pos: '50% 50%' },
    amb2: { color: 'rgba(212, 255, 58, 0.08)', pos: '50% 50%' },
    cursorColor: 'rgba(212, 255, 58, 0.40)',
    particleColor: 'rgba(212, 255, 58, 0.75)',
    particleMinOp: 0.25,
    particleMaxOp: 0.55,
    vignette: 'rgba(0, 5, 0, 0.5)',
    vignettePx: 180,
    grainOp: 0.04,
    broadcastSweep: 0,
    sunbeam: 0,
    ledStreaks: 0,
  },
};

const ROOT = () =>
  typeof document !== 'undefined' ? document.documentElement : null;

// Apply palette to :root immediately (used on mount)
function applyPaletteImmediate(p: Palette) {
  const root = ROOT();
  if (!root) return;
  const s = root.style;
  s.setProperty('--amb-base', p.base);
  s.setProperty('--amb-1-color', p.amb1.color);
  s.setProperty('--amb-1-pos', p.amb1.pos);
  s.setProperty('--amb-2-color', p.amb2.color);
  s.setProperty('--amb-2-pos', p.amb2.pos);
  s.setProperty('--amb-3-color', p.amb3?.color || 'rgba(0,0,0,0)');
  s.setProperty('--amb-3-pos', p.amb3?.pos || '50% 50%');
  s.setProperty('--amb-cursor', p.cursorColor);
  s.setProperty('--amb-particle', p.particleColor);
  s.setProperty(
    '--amb-particle-2',
    p.particleColor2 || p.particleColor
  );
  s.setProperty('--amb-particle-min', String(p.particleMinOp));
  s.setProperty('--amb-particle-max', String(p.particleMaxOp));
  s.setProperty('--amb-vignette', p.vignette);
  s.setProperty('--amb-vignette-px', `${p.vignettePx}px`);
  s.setProperty('--amb-grain', String(p.grainOp));
  s.setProperty('--amb-sweep', String(p.broadcastSweep));
  s.setProperty('--amb-sunbeam', String(p.sunbeam));
  s.setProperty('--amb-led', String(p.ledStreaks));
}

// ===================================================================
//  AmbientLayer
// ===================================================================

export default function AmbientLayer() {
  const cursorBlobRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<string>('hero');
  const prevActiveRef = useRef<string>('hero');

  // Initial palette on mount
  useEffect(() => {
    applyPaletteImmediate(PALETTES.hero);
  }, []);

  // IntersectionObserver — determines which data-palette is most visible
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-palette]')
    );
    if (elements.length === 0) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const id = (e.target as HTMLElement).dataset.palette || 'hero';
          ratios.set(id, e.intersectionRatio);
        });
        let best = 'hero';
        let br = 0;
        ratios.forEach((r, id) => {
          if (r > br) {
            br = r;
            best = id;
          }
        });
        setActive((prev) => (prev === best ? prev : best));
      },
      {
        threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
        rootMargin: '-10% 0px -10% 0px',
      }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Tween CSS vars when active changes — dark↔lit crossings get longer
  // duration + punchier ease ("lights on" feel)
  useEffect(() => {
    const root = ROOT();
    if (!root) return;
    const p = PALETTES[active] || PALETTES.hero;
    const prev = PALETTES[prevActiveRef.current] || PALETTES.hero;
    prevActiveRef.current = active;

    const crossesGroups = prev.lit !== p.lit;
    const duration = crossesGroups ? 1.8 : 1.2;
    const ease = crossesGroups ? 'expo.inOut' : 'power2.inOut';

    gsap.to(root, {
      duration,
      ease,
      '--amb-base': p.base,
      '--amb-1-color': p.amb1.color,
      '--amb-1-pos': p.amb1.pos,
      '--amb-2-color': p.amb2.color,
      '--amb-2-pos': p.amb2.pos,
      '--amb-3-color': p.amb3?.color || 'rgba(0,0,0,0)',
      '--amb-3-pos': p.amb3?.pos || '50% 50%',
      '--amb-cursor': p.cursorColor,
      '--amb-particle': p.particleColor,
      '--amb-particle-2': p.particleColor2 || p.particleColor,
      '--amb-particle-min': p.particleMinOp,
      '--amb-particle-max': p.particleMaxOp,
      '--amb-vignette': p.vignette,
      '--amb-vignette-px': `${p.vignettePx}px`,
      '--amb-grain': p.grainOp,
      '--amb-sweep': p.broadcastSweep,
      '--amb-sunbeam': p.sunbeam,
      '--amb-led': p.ledStreaks,
    } as gsap.TweenVars);
  }, [active]);

  // Cursor-follow blob
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const blob = cursorBlobRef.current;
    if (!blob) return;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let init = false;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!init) {
        pos.x = target.x;
        pos.y = target.y;
        init = true;
      }
    };
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.045;
      pos.y += (target.y - pos.y) * 0.045;
      blob.style.transform = `translate3d(${pos.x - 300}px, ${
        pos.y - 300
      }px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  // Particle canvas — dual-color, opacity range driven by CSS vars
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    const setSize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    setSize();
    window.addEventListener('resize', setSize);

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const count = window.innerWidth < 768 ? 10 : 18;

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      phase: number;
      phaseSpeed: number;
      tone: 0 | 1;
    };
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const particles: P[] = Array.from({ length: count }).map((_, i) => ({
      x: rand(0, w()),
      y: rand(0, h()),
      vx: rand(-0.25, 0.25),
      vy: rand(-0.18, 0.18),
      size: rand(1, 2.5),
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: rand(0.003, 0.008),
      tone: (i % 2) as 0 | 1,
    }));

    const parseRgba = (str: string) => {
      const m = str.match(/rgba?\(([^)]+)\)/);
      if (!m) return { r: 212, g: 255, b: 58 };
      const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
      return {
        r: parts[0] || 212,
        g: parts[1] || 255,
        b: parts[2] || 58,
      };
    };

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const root = ROOT();
      const cs = root ? getComputedStyle(root) : null;
      const color1 = cs?.getPropertyValue('--amb-particle').trim() ||
        'rgba(212,255,58,0.5)';
      const color2 = cs?.getPropertyValue('--amb-particle-2').trim() ||
        color1;
      const min =
        parseFloat(
          cs?.getPropertyValue('--amb-particle-min').trim() || '0.15'
        ) || 0.15;
      const max =
        parseFloat(
          cs?.getPropertyValue('--amb-particle-max').trim() || '0.30'
        ) || 0.30;

      const c1 = parseRgba(color1);
      const c2 = parseRgba(color2);

      particles.forEach((p) => {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -5) p.x = w() + 5;
          if (p.x > w() + 5) p.x = -5;
          if (p.y < -5) p.y = h() + 5;
          if (p.y > h() + 5) p.y = -5;
          p.phase += p.phaseSpeed;
        }
        const op = min + (max - min) * (0.5 + 0.5 * Math.sin(p.phase));
        const c = p.tone === 0 ? c1 : c2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${op})`;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${op * 0.5})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none"
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      {/* Base + three radial gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: 'var(--amb-base, #060707)',
          backgroundImage: `
            radial-gradient(ellipse 60% 60% at var(--amb-1-pos, 20% 30%), var(--amb-1-color, transparent) 0%, transparent 62%),
            radial-gradient(ellipse 55% 55% at var(--amb-2-pos, 80% 75%), var(--amb-2-color, transparent) 0%, transparent 62%),
            radial-gradient(ellipse 50% 50% at var(--amb-3-pos, 50% 50%), var(--amb-3-color, transparent) 0%, transparent 60%)
          `,
        }}
      />

      {/* Basketball — diagonal sunbeam shaft (driven by --amb-sunbeam) */}
      <div
        className="absolute"
        style={{
          top: '-30%',
          left: '-20%',
          width: '70%',
          height: '230%',
          background:
            'linear-gradient(to right, transparent 0%, rgba(255, 200, 130, 0.13) 40%, rgba(255, 200, 130, 0.13) 60%, transparent 100%)',
          transform: 'rotate(28deg)',
          transformOrigin: 'top left',
          mixBlendMode: 'screen',
          opacity: 'var(--amb-sunbeam, 0)',
          filter: 'blur(18px)',
        }}
      />

      {/* How-It-Works — broadcast light sweeps across the top */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 'var(--amb-sweep, 0)',
          mixBlendMode: 'screen',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '6%',
            left: 0,
            right: 0,
            height: 70,
            background:
              'linear-gradient(to right, transparent 0%, rgba(212, 255, 58, 0.14) 40%, rgba(212, 255, 58, 0.14) 60%, transparent 100%)',
            filter: 'blur(24px)',
            animation: 'ambBcast1 18s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '82%',
            left: 0,
            right: 0,
            height: 60,
            background:
              'linear-gradient(to right, transparent 0%, rgba(180, 230, 150, 0.12) 40%, rgba(180, 230, 150, 0.12) 60%, transparent 100%)',
            filter: 'blur(22px)',
            animation: 'ambBcast2 24s linear infinite',
          }}
        />
      </div>

      {/* Handball — horizontal LED streak arrays */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 'var(--amb-led, 0)',
          mixBlendMode: 'screen',
        }}
      >
        {[0.18, 0.35, 0.66, 0.84].map((y, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${y * 100}%`,
              left: 0,
              right: 0,
              height: 1,
              background:
                'linear-gradient(to right, transparent 5%, rgba(0, 229, 255, 0.5) 35%, rgba(255, 255, 255, 0.5) 50%, rgba(0, 229, 255, 0.5) 65%, transparent 95%)',
              filter: 'blur(1px)',
              animation: `ambLedPulse ${4 + i * 0.7}s ease-in-out ${
                -i * 0.5
              }s infinite`,
            }}
          />
        ))}
      </div>

      {/* Cursor-follow blob */}
      <div
        ref={cursorBlobRef}
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, var(--amb-cursor, rgba(212,255,58,0.28)) 0%, transparent 62%)',
          filter: 'blur(90px)',
          mixBlendMode: 'screen',
          willChange: 'transform',
          transform: 'translate3d(-9999px, -9999px, 0)',
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Edge vignette — inset shadow size + color from vars */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            'inset 0 0 var(--amb-vignette-px, 180px) 20px var(--amb-vignette, rgba(0,0,0,0.55))',
        }}
      />

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes ambBcast1 {
          0%   { transform: translateX(-60%); }
          100% { transform: translateX(100%); }
        }
        @keyframes ambBcast2 {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-60%); }
        }
        @keyframes ambLedPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50%      { opacity: 1;   transform: scaleY(1.6); }
        }
      `}</style>
    </div>
  );
}
