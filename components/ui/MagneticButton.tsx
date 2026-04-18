'use client';

import { useRef, MouseEvent, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import clsx from 'clsx';

type Variant = 'primary' | 'ghost';

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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 16, mass: 0.4 });

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * strength);
    y.set(Math.max(-1, Math.min(1, dy)) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

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
    <motion.a
      ref={ref}
      href={href ?? '#'}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      style={{ x: sx, y: sy }}
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-7 py-4 font-mono text-[12px] tracking-[0.18em] uppercase transition-shadow duration-300',
        styles,
        className
      )}
    >
      {children}
    </motion.a>
  );
}
