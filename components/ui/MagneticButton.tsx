'use client';

import { useEffect, useRef, MouseEvent, ReactNode } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'ghost';

// The button eases toward the cursor on a spring. These are the constants
// of the framer-motion spring it used before; running the spring here
// keeps that library out of the homepage's first load.
const STIFFNESS = 200;
const DAMPING = 16;
const MASS = 0.4;
const STEP_S = 0.001;
const REST = 0.01;

type Axis = { pos: number; vel: number; target: number };

// Advances one axis by dt seconds; returns true once it has come to rest.
function advance(axis: Axis, dt: number): boolean {
  for (let t = 0; t < dt; t += STEP_S) {
    const h = Math.min(STEP_S, dt - t);
    const force = -STIFFNESS * (axis.pos - axis.target) - DAMPING * axis.vel;
    axis.vel += (force / MASS) * h;
    axis.pos += axis.vel * h;
  }
  if (Math.abs(axis.pos - axis.target) < REST && Math.abs(axis.vel) < REST) {
    axis.pos = axis.target;
    axis.vel = 0;
    return true;
  }
  return false;
}

export default function MagneticButton({
  children,
  variant = 'primary',
  href,
  onClick,
  className,
  strength = 8,
}: {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const spring = useRef({
    x: { pos: 0, vel: 0, target: 0 },
    y: { pos: 0, vel: 0, target: 0 },
    frame: 0,
    last: 0,
  });

  useEffect(() => {
    const s = spring.current;
    return () => cancelAnimationFrame(s.frame);
  }, []);

  const pullTo = (x: number, y: number) => {
    const s = spring.current;
    s.x.target = x;
    s.y.target = y;
    if (s.frame) return;
    s.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - s.last) / 1000, 0.064);
      s.last = now;
      const restX = advance(s.x, dt);
      const restY = advance(s.y, dt);
      if (ref.current) {
        ref.current.style.transform =
          s.x.pos || s.y.pos
            ? `translateX(${s.x.pos}px) translateY(${s.y.pos}px)`
            : 'none';
      }
      s.frame = restX && restY ? 0 : requestAnimationFrame(tick);
    };
    s.frame = requestAnimationFrame(tick);
  };

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    pullTo(
      Math.max(-1, Math.min(1, dx)) * strength,
      Math.max(-1, Math.min(1, dy)) * strength
    );
  };

  const handleLeave = () => pullTo(0, 0);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  const styles =
    variant === 'primary'
      ? 'bg-lime text-bg hover:shadow-[0_0_40px_rgba(212,255,58,0.45)]'
      : 'border border-lime text-lime hover:bg-lime/10';

  return (
    <a
      ref={ref}
      href={href ?? '#'}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-7 py-4 font-mono text-[12px] tracking-[0.18em] uppercase transition-shadow duration-300',
        styles,
        className
      )}
    >
      {children}
    </a>
  );
}
