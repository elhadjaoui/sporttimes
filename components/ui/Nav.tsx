'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { APP_NAME_DISPLAY } from '@/lib/constants';
import type { Dictionary } from '@/lib/i18n';

// The overlay and its animation library stay out of the first load: they
// load once the page has settled, or as soon as someone reaches for Menu.
const MenuOverlay = dynamic(() => import('./MenuOverlay'), { ssr: false });
const MENU_PRELOAD_MS = 1500;

export default function Nav({
  t,
  homePath,
  blogPath,
  otherHome,
}: {
  t: Dictionary['chrome'];
  homePath: string;
  // Set once the blog has articles in this language.
  blogPath?: string;
  // The homepage in the other language, for the language switch.
  otherHome: { href: string; lang: string };
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const loadMenu = () => setMenuLoaded(true);

  useEffect(() => {
    let timer: number | undefined;
    const preload = () => {
      timer = window.setTimeout(() => setMenuLoaded(true), MENU_PRELOAD_MS);
    };
    if (document.readyState === 'complete') preload();
    else window.addEventListener('load', preload, { once: true });
    return () => {
      window.removeEventListener('load', preload);
      window.clearTimeout(timer);
    };
  }, []);
  // Only the homepage exists in both languages, so the switch only shows
  // there; elsewhere it would lead away from the page being read.
  const onHome = usePathname() === homePath;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[70] pointer-events-none">
        <div className="flex items-center justify-between px-6 md:px-10 pt-6 pointer-events-auto">
          {/* Logo — always returns home */}
          <Link
            href={homePath}
            aria-label={t.homeLabel}
            className="tap-target group flex items-center gap-2 md:gap-3 leading-none hover:text-lime transition-colors"
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

          <div className="flex items-center gap-6 md:gap-8">
            {/* Language switch — a full page load, since each language has its own layout */}
            {onHome && (
              <a
                href={otherHome.href}
                hrefLang={otherHome.lang}
                lang={otherHome.lang}
                aria-label={t.languageSwitch.label}
                className="tap-target group font-mono text-[11px] tracking-[0.2em] uppercase text-ink/80 hover:text-lime transition-colors"
              >
                {t.languageSwitch.short}
                <span className="absolute left-0 -bottom-1 h-px w-full bg-lime origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
            )}

            {/* Menu */}
            <button
              type="button"
              onPointerEnter={loadMenu}
              onFocus={loadMenu}
              onClick={() => {
                loadMenu();
                setMenuOpen(true);
              }}
              className="tap-target group font-mono text-[11px] tracking-[0.2em] uppercase text-ink/80 hover:text-lime transition-colors"
            >
              {t.menu}
              <span className="absolute left-0 -bottom-1 h-px w-full bg-lime origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </header>

      {menuLoaded && (
        <MenuOverlay
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          t={t}
          homePath={homePath}
          blogPath={blogPath}
        />
      )}
    </>
  );
}
