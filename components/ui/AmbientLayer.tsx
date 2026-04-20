'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// ===================================================================
//  Per-palette environment definitions. Each section tags itself with
//  data-palette="…" and the fixed ambient layer tweens its CSS vars
//  toward the palette of the most-visible section.
// ===================================================================

type Palette = {
  base: string;                // base color, near-black w/ undertone
  amb1Color: string;           // large radial gradient color
  amb1Pos: string;             // background-position for amb1
  amb2Color: string;
  amb2Pos: string;
  cursorColor: string;         // cursor-follow blob color
  particle: string;            // particle color (rgba)
  vignette: string;            // edge inset-shadow color+strength
};

const PALETTES: Record<string, Palette> = {
  hero: {
    base: '#060707',
    amb1Color: 'rgba(212, 255, 58, 0.07)',
    amb1Pos: '20% 25%',
    amb2Color: 'rgba(200, 220, 210, 0.05)',
    amb2Pos: '85% 80%',
    cursorColor: 'rgba(212, 255, 58, 0.28)',
    particle: 'rgba(212, 255, 58, 0.55)',
    vignette: 'rgba(0, 0, 0, 0.55)',
  },
  problem: {
    base: '#080505',
    amb1Color: 'rgba(230, 70, 70, 0.09)',
    amb1Pos: '25% 35%',
    amb2Color: 'rgba(139, 30, 30, 0.06)',
    amb2Pos: '85% 75%',
    cursorColor: 'rgba(230, 90, 90, 0.28)',
    particle: 'rgba(245, 220, 220, 0.45)',
    vignette: 'rgba(20, 0, 0, 0.6)',
  },
  how: {
    base: '#060708',
    amb1Color: 'rgba(212, 255, 58, 0.06)',
    amb1Pos: '75% 30%',
    amb2Color: 'rgba(130, 180, 220, 0.05)',
    amb2Pos: '20% 75%',
    cursorColor: 'rgba(212, 255, 58, 0.25)',
    particle: 'rgba(200, 230, 255, 0.4)',
    vignette: 'rgba(0, 0, 10, 0.55)',
  },
  football: {
    base: '#050807',
    amb1Color: 'rgba(80, 180, 110, 0.08)',
    amb1Pos: '20% 30%',
    amb2Color: 'rgba(212, 255, 58, 0.06)',
    amb2Pos: '80% 80%',
    cursorColor: 'rgba(212, 255, 58, 0.28)',
    particle: 'rgba(212, 255, 58, 0.45)',
    vignette: 'rgba(0, 10, 5, 0.55)',
  },
  basketball: {
    base: '#0a0706',
    amb1Color: 'rgba(255, 107, 26, 0.1)',
    amb1Pos: '20% 35%',
    amb2Color: 'rgba(160, 60, 20, 0.06)',
    amb2Pos: '85% 75%',
    cursorColor: 'rgba(255, 130, 40, 0.3)',
    particle: 'rgba(255, 220, 180, 0.5)',
    vignette: 'rgba(20, 5, 0, 0.6)',
  },
  handball: {
    base: '#050709',
    amb1Color: 'rgba(0, 180, 220, 0.08)',
    amb1Pos: '25% 30%',
    amb2Color: 'rgba(20, 60, 110, 0.06)',
    amb2Pos: '80% 80%',
    cursorColor: 'rgba(0, 229, 255, 0.28)',
    particle: 'rgba(200, 240, 255, 0.5)',
    vignette: 'rgba(0, 10, 20, 0.6)',
  },
  roadmap: {
    base: '#070510',
    amb1Color: 'rgba(160, 100, 220, 0.09)',
    amb1Pos: '70% 30%',
    amb2Color: 'rgba(212, 255, 58, 0.05)',
    amb2Pos: '20% 80%',
    cursorColor: 'rgba(180, 120, 255, 0.28)',
    particle: 'rgba(210, 180, 255, 0.45)',
    vignette: 'rgba(10, 0, 20, 0.6)',
  },
  download: {
    base: '#060807',
    amb1Color: 'rgba(212, 255, 58, 0.12)',
    amb1Pos: '50% 50%',
    amb2Color: 'rgba(212, 255, 58, 0.06)',
    amb2Pos: '50% 50%',
    cursorColor: 'rgba(212, 255, 58, 0.35)',
    particle: 'rgba(212, 255, 58, 0.6)',
    vignette: 'rgba(0, 5, 0, 0.5)',
  },
};

// ===================================================================
//  AmbientLayer — the one shared environment for the whole site
// ===================================================================

export default function AmbientLayer() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorBlobRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<string>('hero');

  // Initialize CSS vars to the hero palette on mount
  useEffect(() => {
    if (!rootRef.current) return;
    const p = PALETTES.hero;
    const el = rootRef.current;
    el.style.setProperty('--base-color', p.base);
    el.style.setProperty('--amb-1-color', p.amb1Color);
    el.style.setProperty('--amb-1-pos', p.amb1Pos);
    el.style.setProperty('--amb-2-color', p.amb2Color);
    el.style.setProperty('--amb-2-pos', p.amb2Pos);
    el.style.setProperty('--cursor-color', p.cursorColor);
    el.style.setProperty('--particle-color', p.particle);
    el.style.setProperty('--vignette-color', p.vignette);
  }, []);

  // IntersectionObserver → determine which section's palette is dominant
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-palette]')
    );
    if (elements.length === 0) return;

    // Store visibility ratio per element
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id =
            (entry.target as HTMLElement).dataset.palette || 'hero';
          ratios.set(id, entry.intersectionRatio);
        });
        // Pick highest ratio
        let best: string = 'hero';
        let bestRatio = 0;
        ratios.forEach((r, id) => {
          if (r > bestRatio) {
            bestRatio = r;
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

  // Tween CSS vars when active section changes
  useEffect(() => {
    if (!rootRef.current) return;
    const p = PALETTES[active] || PALETTES.hero;
    gsap.to(rootRef.current, {
      duration: 1.2,
      ease: 'power2.inOut',
      '--base-color': p.base,
      '--amb-1-color': p.amb1Color,
      '--amb-1-pos': p.amb1Pos,
      '--amb-2-color': p.amb2Color,
      '--amb-2-pos': p.amb2Pos,
      '--cursor-color': p.cursorColor,
      '--particle-color': p.particle,
      '--vignette-color': p.vignette,
    } as gsap.TweenVars);
  }, [active]);

  // Cursor-follow blob with smooth easing
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const blob = cursorBlobRef.current;
    if (!blob) return;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let initialised = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!initialised) {
        pos.x = target.x;
        pos.y = target.y;
        initialised = true;
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

  // Particle canvas
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

    // Respect reduced motion
    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Particle count — 12 desktop, 6 mobile
    const count = window.innerWidth < 768 ? 6 : 12;

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      phase: number;
      phaseSpeed: number;
    };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const particles: P[] = Array.from({ length: count }).map(() => ({
      x: rand(0, w()),
      y: rand(0, h()),
      vx: rand(-0.25, 0.25),
      vy: rand(-0.18, 0.18),
      size: rand(1, 2.2),
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: rand(0.003, 0.007),
    }));

    const parseRgba = (str: string) => {
      const m = str.match(/rgba?\(([^)]+)\)/);
      if (!m) return { r: 212, g: 255, b: 58 };
      const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
      return { r: parts[0] || 212, g: parts[1] || 255, b: parts[2] || 58 };
    };

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const cssColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--particle-color')
        .trim() || 'rgba(212,255,58,0.5)';
      const { r, g, b } = parseRgba(cssColor);

      particles.forEach((p) => {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          // Wrap to opposite edge
          if (p.x < -5) p.x = w() + 5;
          if (p.x > w() + 5) p.x = -5;
          if (p.y < -5) p.y = h() + 5;
          if (p.y > h() + 5) p.y = -5;
          p.phase += p.phaseSpeed;
        }

        const opacity = 0.15 + 0.15 * (0.5 + 0.5 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${opacity * 0.6})`;
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
      ref={rootRef}
      aria-hidden
      className="pointer-events-none"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
      }}
    >
      {/* Base color + two radial gradients — all driven by CSS vars */}
      <div
        className="absolute inset-0"
        style={{
          background: 'var(--base-color, #050505)',
          backgroundImage: `
            radial-gradient(ellipse 60% 60% at var(--amb-1-pos, 20% 30%), var(--amb-1-color, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 55% at var(--amb-2-pos, 80% 75%), var(--amb-2-color, transparent) 0%, transparent 60%)
          `,
          transition: 'background-color 0s', // GSAP handles transitions
        }}
      />

      {/* Cursor-follow blob — large soft radial */}
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
            'radial-gradient(circle, var(--cursor-color, rgba(212,255,58,0.28)) 0%, transparent 62%)',
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

      {/* Edge vignette — inset shadow via a large inset-shadow rect */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            'inset 0 0 180px 20px var(--vignette-color, rgba(0,0,0,0.55))',
        }}
      />
    </div>
  );
}
