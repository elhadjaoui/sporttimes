'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHAPTERS, APP_NAME_DISPLAY } from '@/lib/constants';
import { getLenis } from '@/hooks/useLenis';
import CornerBrackets from './CornerBrackets';

export default function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleJump = (anchor: string) => {
    const el = document.getElementById(anchor);
    onClose();
    // If we're on a route that doesn't have this section, navigate home.
    if (!el) {
      window.location.href = `/#${anchor}`;
      return;
    }
    requestAnimationFrame(() => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
      else el.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const activeTagline =
    hovered != null ? CHAPTERS[hovered].tagline : 'Pick a chapter to jump to.';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          initial={{ y: '-100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
          className="fixed inset-0 z-[80] bg-bg overflow-hidden"
        >
          {/* Grain on overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              backgroundSize: '240px 240px',
            }}
          />

          {/* Corner brackets */}
          <CornerBrackets />

          {/* Header row */}
          <div className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-7">
            <div className="flex items-center gap-4">
              <span className="font-display text-lg uppercase">
                {APP_NAME_DISPLAY}
              </span>
              <span className="hidden md:inline-block w-8 h-px bg-lime/50" />
              <span className="hidden md:inline-block font-mono text-[10px] tracking-[0.25em] uppercase text-ink/50">
                [ Navigation · {CHAPTERS.length.toString().padStart(2, '0')} chapters ]
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              data-cursor="hover"
              className="group flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase text-ink/80 hover:text-lime transition-colors"
            >
              <span>Close</span>
              <span className="block h-px w-8 bg-current" />
              <span>✕</span>
            </button>
          </div>

          {/* Chapter list — large stacked items with hover-revealed taglines */}
          <nav className="relative z-10 mt-12 md:mt-16 px-6 md:px-12 grid grid-cols-12 gap-4 md:gap-8">
            <ul
              className="col-span-12 md:col-span-8"
              onMouseLeave={() => setHovered(null)}
            >
              {CHAPTERS.map((c, i) => {
                const isHovered = hovered === i;
                const isAnyHovered = hovered != null;
                return (
                  <motion.li
                    key={c.num}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.18 + i * 0.05,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-ink/8"
                  >
                    <button
                      type="button"
                      onClick={() => handleJump(c.anchor)}
                      onMouseEnter={() => setHovered(i)}
                      data-cursor="hover"
                      className="group flex items-baseline gap-6 md:gap-12 w-full text-left py-4 md:py-5 transition-opacity duration-300"
                      style={{
                        opacity: isAnyHovered && !isHovered ? 0.32 : 1,
                      }}
                    >
                      <span className="font-mono text-[11px] md:text-xs text-lime min-w-[3ch] transition-all duration-500 group-hover:-translate-x-1">
                        {c.num}
                      </span>
                      <span
                        className="font-display uppercase leading-none tracking-tight text-[clamp(2rem,6.5vw,5rem)] transition-all duration-500 group-hover:translate-x-3 group-hover:text-lime"
                        style={{ letterSpacing: '-0.025em' }}
                      >
                        {c.name}
                      </span>
                      <span
                        className="ml-auto font-mono text-xs text-ink/30 transition-all duration-500 group-hover:text-lime group-hover:translate-x-2"
                        aria-hidden
                      >
                        →
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            {/* Right column — live tagline + meta info */}
            <aside className="hidden md:flex md:col-span-4 flex-col justify-between min-h-[360px] pt-2">
              <div>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/40 mb-3">
                  [ Now showing ]
                </div>
                <motion.p
                  key={hovered ?? 'default'}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="font-display text-2xl leading-tight text-ink/85"
                >
                  {activeTagline}
                </motion.p>
              </div>

              <div className="space-y-3">
                <div className="h-px w-full bg-ink/10" />
                <div className="flex items-baseline justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-ink/45">
                  <span>Made in Ben Guerir</span>
                  <span className="text-lime/70">v0.1 · Pre-launch</span>
                </div>
              </div>
            </aside>
          </nav>

          {/* Footer hint */}
          <div className="absolute z-10 bottom-6 left-6 md:left-10 right-6 md:right-10 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase text-ink/40">
            <span>
              [ Chapters · 01 —{' '}
              {CHAPTERS.length.toString().padStart(2, '0')} ]
            </span>
            <span className="hidden md:inline">
              Press <span className="text-lime/80">Esc</span> to close
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
