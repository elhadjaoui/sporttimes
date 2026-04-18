'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CHAPTERS, APP_NAME_DISPLAY } from '@/lib/constants';
import { getLenis } from '@/hooks/useLenis';

export default function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const handleJump = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (!el) {
      onClose();
      return;
    }
    onClose();
    requestAnimationFrame(() => {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el, { offset: 0, duration: 1.4 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          initial={{ y: '-100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
          className="fixed inset-0 z-[80] bg-bg"
        >
          {/* Grain on overlay too */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              backgroundSize: '240px 240px',
            }}
          />

          {/* Header row inside overlay */}
          <div className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-7">
            <span className="font-display text-lg tracking-tightest uppercase">
              {APP_NAME_DISPLAY}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink/80 hover:text-lime transition-colors"
            >
              Close ✕
            </button>
          </div>

          {/* Chapter list */}
          <nav className="relative z-10 mt-16 md:mt-24 px-6 md:px-12">
            <ul className="flex flex-col gap-2">
              {CHAPTERS.map((c, i) => (
                <motion.li
                  key={c.num}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.15 + i * 0.05,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleJump(c.anchor)}
                    className="group flex items-baseline gap-6 md:gap-10 w-full text-left py-2"
                  >
                    <span className="font-mono text-xs md:text-sm text-lime min-w-[3ch] transition-transform duration-300 group-hover:-translate-x-2">
                      {c.num}
                    </span>
                    <span className="font-display uppercase tracking-tightest leading-none text-[clamp(2.4rem,7vw,5.5rem)] transition-transform duration-300 group-hover:translate-x-2 group-hover:text-lime">
                      {c.name}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Footer line in overlay */}
          <div className="absolute bottom-6 left-6 md:left-10 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
            [ Sports coordination × made visual ]
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
