'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME_DISPLAY } from '@/lib/constants';
import MenuOverlay from './MenuOverlay';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[70] pointer-events-none">
        <div className="flex items-center justify-between px-6 md:px-10 pt-6 pointer-events-auto">
          {/* Logo — always returns home */}
          <Link
            href="/"
            aria-label={`${APP_NAME_DISPLAY} — home`}
            className="group flex items-center gap-2 md:gap-3 leading-none hover:text-lime transition-colors"
          >
            <Image
              src="/screens/logo.png"
              alt=""
              width={32}
              height={32}
              priority
              className="h-7 w-7 md:h-8 md:w-8 rounded-md object-contain"
            />
            <span className="font-display text-base md:text-lg tracking-tightest uppercase">
              {APP_NAME_DISPLAY}
            </span>
          </Link>

          {/* Menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="group relative font-mono text-[11px] tracking-[0.2em] uppercase text-ink/80 hover:text-lime transition-colors"
          >
            Menu
            <span className="absolute left-0 -bottom-1 h-px w-full bg-lime origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </button>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
