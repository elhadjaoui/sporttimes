# SportTimes landing redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the existing SportTimes landing page from an animation-heavy templated execution into a quiet narrative explainer with seven sections, a signature pitch-fill animation, real screenshots, a horizontal roadmap timeline, and zero-infra email capture via Formsubmit. Ship as two PRs with a hard checkpoint in between.

**Architecture:** Single Next.js App Router page, three CSS-token palettes (`dark` / `paper` / `lime`) scoped per section via `data-palette`, two reusable motion primitives (`<Reveal>` + `<Parallax>`), one signature animation (`<PitchFill>`), one reusable email-capture form (`<NotifyForm>`). No backend. Removes `@react-three/fiber`, `@react-three/drei`, `three`. Adds `lucide-react` (Phase 2) and `playwright` devDep (Phase 2, for OG image rendering).

**Tech Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind 3 · GSAP (ScrollTrigger) · Framer Motion (form state transitions only) · Lenis (smooth scroll) · `next/font/google` (Space Grotesk · Inter · Space Mono).

**Spec:** `docs/superpowers/specs/2026-06-23-sporttimes-redesign-design.md` — every section in this plan cites the spec section that authorized it. Read the spec before starting.

**Verification posture:** This is a marketing site with no test infra. Each task ends with **(a) `npx tsc --noEmit && npm run lint` clean**, **(b) a browser smoke-check at `http://localhost:3000`** for visual tasks, and **(c) a focused commit**. Final per-phase gate is **`npm run build` green**. Tests are not required for any task in this plan.

---

## Working agreements

1. **Work on a feature branch**, not `main`. Recommended: `git checkout -b refactor/landing-narrative-phase-1` for Phase 1, then a separate branch for Phase 2 after the checkpoint.
2. **Commit after each task** (each numbered Task in this plan = one commit, unless explicitly grouped).
3. **Never `--no-verify`.** Fix the underlying issue.
4. **Do not skip the ordering** in Phase 1. The order exists because the current `Hero.tsx` and `Problem.tsx` import files that are being deleted; rewriting consumers before deleting dependencies keeps the working tree buildable at every commit.
5. **Run `npm run dev` in a background terminal** throughout — verify each task in-browser before committing.
6. **Reduced-motion is not optional.** Every animation primitive in this plan ships with `prefers-reduced-motion` handling on day one.

---

## Chunk 1: Phase 1 — Foundation + opening half

End state of this chunk: a single mergeable PR delivering tokens + type + motion primitives + PitchFill + Nav + Hero + Problem + Solution. The remaining four sections (Roadmap, Launching-soon, Stay-connected, Footer) render as height-preserving placeholder blocks so the page is walkable end-to-end at the checkpoint.

### Task 1: Branch + dev server up

**Files:** none (env setup)

- [ ] **Step 1: Create feature branch**

```bash
cd /Users/mohamed/Downloads/sporttimes
git checkout -b refactor/landing-narrative-phase-1
```

- [ ] **Step 2: Install deps (clean baseline)**

Run: `npm install`

Expected: completes without errors. If lockfile drift warnings appear, that's fine.

- [ ] **Step 3: Start dev server in background**

Run: `npm run dev` (in a long-running terminal — leave it open for the whole chunk)

Expected: `▲ Next.js 14.x ready on http://localhost:3000`

- [ ] **Step 4: Confirm baseline current site loads**

Open `http://localhost:3000` in a browser. Confirm the existing site renders (cursor, preloader, 3D pitch). This is the "before" snapshot.

- [ ] **Step 5: No commit yet** (no code changes).

---

### Task 2: Replace fonts in `app/layout.tsx` — Space Grotesk, Inter, Space Mono

**Files:**
- Modify: `app/layout.tsx`

Spec authority: §4.3.

- [ ] **Step 1: Open `app/layout.tsx`** and locate the `next/font/google` imports at the top (currently lines 2–8: `Inter, JetBrains_Mono, Caveat, Permanent_Marker, Kalam`).

- [ ] **Step 2: Replace imports + font loader blocks**

Replace lines 2–56 of the current file (the imports + the 6 loader const declarations + the metadata export — but **keep the metadata export untouched**, we replace it later in Task 30) with:

```tsx
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';
import LenisProvider from '@/components/ui/LenisProvider';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});
```

- [ ] **Step 3: Strip deleted-provider imports and the legacy wrappers from the JSX**

The current `RootLayout` body wraps children in `<AmbientLayer />`, `<Preloader />`, `<Nav />` (from `components/ui`), `<ProgressScrubber />`, `<GrainOverlay />`, `<CustomCursor />`. All of these are being deleted in Task 16. Replace the `<body>` block contents with:

```tsx
<body className="antialiased" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
  <LenisProvider>
    {children}
  </LenisProvider>
</body>
```

Strip the corresponding imports at the top (`GrainOverlay`, `Preloader`, `Nav`, `CustomCursor`, `ProgressScrubber`, `AmbientLayer`). Keep `LenisProvider`.

- [ ] **Step 4: Update the `<html>` className to use only the new three font variables**

```tsx
<html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
```

- [ ] **Step 5: Save. Verify dev server hot-reloads.**

The page will look broken (tokens not yet rewritten, sections not yet rewritten, deleted-component imports may still fire from `app/page.tsx` etc.) — **that's expected**. We only check that **layout.tsx itself compiles**. Watch the dev server output: there should be no "Module not found" error sourced from `app/layout.tsx`. Errors sourced from `app/page.tsx` or sections are OK at this point.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx
git commit -m "refactor(layout): swap fonts to Space Grotesk/Inter/Space Mono; strip deleted-provider wrappers"
```

---

### Task 3: Rewrite `app/globals.css` with 3-palette token system

**Files:**
- Modify: `app/globals.css` (full rewrite)

Spec authority: §4.2, §4.3.

- [ ] **Step 1: Open `app/globals.css`** and read the current contents (~400 lines of old token system + utility classes).

- [ ] **Step 2: Replace the entire file with:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===== Palette tokens (3 sets, scoped via data-palette) =====
   Default to the dark palette so sections without an explicit
   data-palette attribute still render readably. */

:root,
[data-palette="dark"] {
  --bg: #0B0D10;
  --surface: #14171C;
  --surface-2: #1B1F26;
  --hairline: rgba(255, 255, 255, 0.08);
  --text: #F2F4F7;
  --text-dim: #9BA1AA;
  --text-mute: #6B7079;
  --accent: #C6F24E;
  --turf: #0E1714;
  --chalk: rgba(255, 255, 255, 0.14);
  --grid: rgba(255, 255, 255, 0.07);
}

[data-palette="paper"] {
  --bg: #EDEFEA;
  --surface: #FFFFFF;
  --surface-2: #F4F5F0;
  --hairline: rgba(11, 13, 16, 0.06);
  --text: #0B0D10;
  --text-dim: #5A5F57;
  --text-mute: #8A8F86;
  --accent: #0B0D10;
  --turf: #DDE3D5;
  --chalk: rgba(11, 13, 16, 0.14);
  --grid: rgba(11, 13, 16, 0.08);
}

[data-palette="lime"] {
  --bg: #C6F24E;
  --surface: #C6F24E;
  --surface-2: #BBE842;
  --hairline: rgba(11, 13, 16, 0.18);
  --text: #0B0D10;
  --text-dim: rgba(11, 13, 16, 0.7);
  --text-mute: rgba(11, 13, 16, 0.55);
  --accent: #0B0D10;
  --turf: #BBE842;
  --chalk: rgba(11, 13, 16, 0.18);
  --grid: rgba(11, 13, 16, 0.12);
}

/* ===== Base + reset ===== */

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  background: var(--bg);
  color: var(--text);
  scroll-behavior: auto; /* Lenis handles smooth scroll */
}

body {
  background: var(--bg);
  color: var(--text);
  overflow-x: hidden;
  font-family: var(--font-body), Inter, system-ui, sans-serif;
  font-size: 17px;
  line-height: 1.55;
}

/* Each section paints its own palette background so the global body
   doesn't bleed at section boundaries. */
section[data-palette] {
  background: var(--bg);
  color: var(--text);
}

/* ===== Lenis smooth scroll bridge ===== */

html.lenis,
html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
.lenis.lenis-stopped { overflow: hidden; }
.lenis.lenis-scrolling iframe { pointer-events: none; }

/* ===== Type primitives ===== */

.headline-display {
  font-family: var(--font-display), 'Space Grotesk', system-ui, sans-serif;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 0.98;
}

.font-body {
  font-family: var(--font-body), Inter, system-ui, sans-serif;
}

.font-mono {
  font-family: var(--font-mono), 'Space Mono', monospace;
}

/* Bracketed eyebrow label — used everywhere as the small caps marker */
.mono-eyebrow {
  font-family: var(--font-mono), 'Space Mono', monospace;
  text-transform: lowercase;
  letter-spacing: 0.18em;
  font-size: 11px;
  color: var(--text-mute);
}

@media (min-width: 768px) {
  .mono-eyebrow {
    font-size: 12px;
  }
}

/* ===== Focus ring (always visible, palette-aware) ===== */

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 2px;
}

/* ===== Reduced-motion override ===== */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

/* ===== 12-col grid helper (used by sections) ===== */

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 24px;
  padding-left: clamp(20px, 4vw, 64px);
  padding-right: clamp(20px, 4vw, 64px);
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}
```

- [ ] **Step 3: Save. The dev server may show many errors** — most consumers (the old Hero, Problem, Sports, LockerRoom) reference removed utility classes. **Ignore those errors for now** — they vanish once those files are rewritten or deleted.

> ⚠ **Browser-walkthrough gate:** From this task through Task 13, the page will look catastrophically wrong in-browser (unstyled, missing colors). That's expected — old sections still use Tailwind classes that the new config no longer ships. **Do not judge the design until Task 14 step 3, which is the first commit at which the page renders end-to-end with the new system.** Between now and then, only verify that `npx tsc --noEmit && npm run lint` stay green for each file you create or rewrite.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "refactor(globals): replace old token system with dark/paper/lime palettes; new type + reduced-motion baseline"
```

---

### Task 4: Update `tailwind.config.ts` font fallbacks

**Files:**
- Modify: `tailwind.config.ts`

Spec authority: §4.3 ("must be updated in two places").

- [ ] **Step 1: Open `tailwind.config.ts`**.

- [ ] **Step 2: Replace the entire file with:**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Space Mono', 'monospace'],
      },
      maxWidth: {
        content: '1440px',
      },
      spacing: {
        gutter: '24px',
      },
    },
  },
  plugins: [],
};

export default config;
```

The deleted `colors` block, `letterSpacing`, `lineHeight`, etc. are gone — sections now read everything from CSS tokens.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "refactor(tailwind): replace color palette with token-based fonts; drop legacy theme extensions"
```

---

### Task 5: Configure `next.config.mjs` images + remove three transpile

**Files:**
- Modify: `next.config.mjs`

Spec authority: §8.2.

- [ ] **Step 1: Open `next.config.mjs`**.

- [ ] **Step 2: Replace the entire file with:**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/apple-app-site-association',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

The `transpilePackages: ['three']` and `optimizePackageImports: ['@react-three/drei']` lines are deleted — those packages are leaving in Task 17.

- [ ] **Step 3: Commit**

```bash
git add next.config.mjs
git commit -m "refactor(next-config): enable AVIF/WebP image formats; drop three-related options"
```

---

### Task 6: Build the `<Reveal>` motion primitive

**Files:**
- Create: `components/ui/Reveal.tsx`

Spec authority: §4.4.

- [ ] **Step 1: Create file with:**

```tsx
'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Per-child stagger in ms when wrapping multiple direct children. Default 0 (no stagger). */
  stagger?: number;
  /** IntersectionObserver threshold. Default 0.15. */
  threshold?: number;
  /** Extra delay before this Reveal fires, in ms. */
  delay?: number;
  /** className passthrough on the wrapper. */
  className?: string;
};

/**
 * Reveal: opacity 0→1 + translateY(14px→0) once, when scrolled into view.
 * Observer disconnects after first fire.
 * Renders final state instantly under prefers-reduced-motion.
 */
export default function Reveal({
  children,
  stagger = 0,
  threshold = 0.15,
  delay = 0,
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, threshold]);

  // No stagger path — single transition on the wrapper.
  if (stagger === 0) {
    const style: CSSProperties = reducedMotion
      ? {}
      : {
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(14px)',
          transition: `opacity 320ms cubic-bezier(.22,.61,.36,1) ${delay}ms, transform 320ms cubic-bezier(.22,.61,.36,1) ${delay}ms`,
          willChange: 'opacity, transform',
        };
    return (
      <div ref={rootRef} className={className} style={style}>
        {children}
      </div>
    );
  }

  // Stagger path — wrap each direct child in a sibling div with computed delay.
  const childArray = Array.isArray(children) ? children : [children];
  return (
    <div ref={rootRef} className={className}>
      {childArray.map((child, i) => {
        const childDelay = delay + i * stagger;
        const style: CSSProperties = reducedMotion
          ? {}
          : {
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(14px)',
              transition: `opacity 320ms cubic-bezier(.22,.61,.36,1) ${childDelay}ms, transform 320ms cubic-bezier(.22,.61,.36,1) ${childDelay}ms`,
              willChange: 'opacity, transform',
            };
        return (
          <div key={i} style={style}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: no new errors sourced from `components/ui/Reveal.tsx`. (Errors sourced from other files are still OK at this stage — they're going to be rewritten or deleted.)

- [ ] **Step 3: Commit**

```bash
git add components/ui/Reveal.tsx
git commit -m "feat(ui): add Reveal primitive — IntersectionObserver-driven fade-in with stagger + reduced-motion"
```

---

### Task 7: Build the `<Parallax>` motion primitive

**Files:**
- Create: `components/ui/Parallax.tsx`

Spec authority: §4.4.

- [ ] **Step 1: Create file with:**

```tsx
'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Vertical multiplier vs. scroll. 0.2..0.4 typical. Default 0.25. */
  y?: number;
  /** className passthrough on the wrapper. */
  className?: string;
};

/**
 * Parallax: translates children on vertical scroll. Mobile uses half the y.
 * Static under prefers-reduced-motion (no transform, no rAF loop).
 */
export default function Parallax({ children, y = 0.25, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const yMul = isMobile ? y * 0.5 : y;

    let raf = 0;
    let lastScroll = -1;
    const tick = () => {
      const root = rootRef.current;
      const child = childRef.current;
      if (root && child) {
        const rect = root.getBoundingClientRect();
        // Distance scrolled past the section top, clamped to section height
        const scrolled = -rect.top;
        if (scrolled !== lastScroll) {
          lastScroll = scrolled;
          child.style.transform = `translate3d(0, ${(scrolled * yMul).toFixed(2)}px, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [y]);

  return (
    <div ref={rootRef} className={className}>
      <div ref={childRef} style={{ willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: no new errors sourced from `components/ui/Parallax.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/ui/Parallax.tsx
git commit -m "feat(ui): add Parallax primitive — rAF-throttled scroll translate with mobile halving + reduced-motion"
```

---

### Task 8: Build the `<PitchGrid>` background component

**Files:**
- Create: `components/ui/PitchGrid.tsx`

Spec authority: §4.5.

- [ ] **Step 1: Create file with:**

```tsx
'use client';

import Parallax from './Parallax';

type Props = {
  /** Wrap in <Parallax> with this multiplier. Pass false to render static. Default false. */
  parallax?: false | number;
  className?: string;
};

/**
 * PitchGrid: chalk-line football pitch markings as full-bleed SVG.
 * Reads --grid + --chalk from the active palette (works on dark / paper / lime).
 * Sits behind section content (z-0). Pointer-events: none.
 */
export default function PitchGrid({ parallax = false, className }: Props) {
  const svg = (
    <svg
      aria-hidden
      viewBox="0 0 70 100"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        color: 'var(--grid)',
      }}
    >
      {/* Outer boundary */}
      <rect x="0" y="0" width="70" height="100" fill="none" stroke="currentColor" strokeWidth="0.25" />
      {/* Halfway line + center circle + spot */}
      <line x1="0" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="0.2" />
      <circle cx="35" cy="50" r="9" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <circle cx="35" cy="50" r="0.5" fill="currentColor" />
      {/* Top penalty box + 6-yard + arc + spot */}
      <rect x="15" y="0" width="40" height="14" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <rect x="24" y="0" width="22" height="6" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <path d="M 29 14 A 6 6 0 0 0 41 14" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <circle cx="35" cy="9.5" r="0.4" fill="currentColor" />
      {/* Bottom penalty box + 6-yard + arc + spot */}
      <rect x="15" y="86" width="40" height="14" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <rect x="24" y="94" width="22" height="6" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <path d="M 29 86 A 6 6 0 0 1 41 86" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <circle cx="35" cy="90.5" r="0.4" fill="currentColor" />
    </svg>
  );

  if (parallax === false) {
    return (
      <div
        aria-hidden
        className={className}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      >
        {svg}
      </div>
    );
  }
  return (
    <Parallax y={parallax} className={className}>
      <div
        aria-hidden
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      >
        {svg}
      </div>
    </Parallax>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: no new errors sourced from `components/ui/PitchGrid.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/ui/PitchGrid.tsx
git commit -m "feat(ui): add PitchGrid background — chalk SVG markings, palette-aware via --grid"
```

---

### Task 9: Build the `<PitchFill>` signature animation

**Files:**
- Create: `components/ui/PitchFill.tsx`

Spec authority: §5.3. Dark-only — assumes `--accent` is lime.

- [ ] **Step 1: Create file with:**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// 4-3-3 formation positions on a 70×100 vertical pitch.
// All 11 slots get filled in this animation (CF included).
const POS433: ReadonlyArray<readonly [number, number]> = [
  [35, 92],                                  // GK
  [14, 72], [28, 72], [42, 72], [56, 72],    // DEF (LB → RB)
  [22, 48], [35, 48], [48, 48],              // MID (L → R)
  [18, 25], [52, 25],                        // FWD (LF, RF)
  [35, 18],                                  // CF
];

/**
 * PitchFill: the signature Hero animation. 0/11 → 11/11 with staggered slot fills.
 * Plays once, never loops. Fires on first of: scroll-into-view (threshold 0.3)
 * OR window.load + 400ms.
 * Reduced-motion: renders final filled-11/11 state instantly.
 *
 * Renders only on dark palette — assumes --accent is the lime ring color.
 */
export default function PitchFill() {
  const rootRef = useRef<SVGSVGElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const firedRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  // Set initial state on mount. Reduced-motion = final state.
  useEffect(() => {
    if (!rootRef.current) return;
    const slots = rootRef.current.querySelectorAll<SVGGElement>('.pf-slot');
    const counter = counterRef.current;

    if (reducedMotion) {
      slots.forEach((s) => {
        s.querySelector('.pf-empty')?.setAttribute('opacity', '0');
        s.querySelector('.pf-filled')?.setAttribute('opacity', '1');
        const dot = s.querySelector<SVGCircleElement>('.pf-dot');
        const ring = s.querySelector<SVGCircleElement>('.pf-ring');
        if (dot) dot.setAttribute('transform', 'scale(1)');
        if (ring) ring.setAttribute('transform', 'scale(1)');
      });
      if (counter) counter.textContent = '11 / 11';
      return;
    }

    // Initial: all empty visible, filled hidden, counter 0/11
    slots.forEach((s) => {
      s.querySelector('.pf-empty')?.setAttribute('opacity', '1');
      s.querySelector('.pf-filled')?.setAttribute('opacity', '0');
    });
    if (counter) counter.textContent = '0 / 11';
  }, [reducedMotion]);

  // Trigger logic — first of scroll-in or window.load + 400ms wins.
  useEffect(() => {
    if (reducedMotion) return;
    if (!rootRef.current) return;
    const el = rootRef.current;

    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      runAnimation();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) fire();
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    const loadFallback = () => {
      window.setTimeout(fire, 400);
    };
    if (document.readyState === 'complete') loadFallback();
    else window.addEventListener('load', loadFallback, { once: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('load', loadFallback);
    };
  }, [reducedMotion]);

  const runAnimation = () => {
    if (!rootRef.current) return;
    const slots = rootRef.current.querySelectorAll<SVGGElement>('.pf-slot');
    const counter = counterRef.current;
    const tl = gsap.timeline();

    slots.forEach((slot, i) => {
      const empty = slot.querySelector('.pf-empty');
      const filled = slot.querySelector('.pf-filled');
      const dot = slot.querySelector('.pf-dot');
      const ring = slot.querySelector('.pf-ring');
      const at = i * 0.23;
      if (empty) tl.to(empty, { opacity: 0.4, duration: 0.24, ease: 'power3.out' }, at);
      if (filled) tl.to(filled, { opacity: 1, duration: 0.24, ease: 'power3.out' }, at);
      // dot + ring are inside a <g transform="translate(x y)"> so cx/cy=0 — scale works from visual center.
      if (dot) tl.fromTo(dot, { scale: 0.6 }, { scale: 1, duration: 0.24, ease: 'power3.out' }, at);
      if (ring) tl.fromTo(ring, { scale: 0.6 }, { scale: 1, duration: 0.24, ease: 'power3.out' }, at);
      tl.call(() => {
        if (counter) counter.textContent = `${i + 1} / 11`;
      }, undefined, at + 0.1);
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <svg
        ref={rootRef}
        viewBox="0 0 70 100"
        style={{ width: '100%', height: 'auto', color: 'var(--chalk)' }}
        aria-hidden
      >
        {/* Pitch markings */}
        <g style={{ color: 'var(--chalk)' }}>
          <rect x="0" y="0" width="70" height="100" fill="none" stroke="currentColor" strokeWidth="0.4" />
          <line x1="0" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="35" cy="50" r="9" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <rect x="15" y="0" width="40" height="14" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <rect x="24" y="0" width="22" height="6" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M 29 14 A 6 6 0 0 0 41 14" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <rect x="15" y="86" width="40" height="14" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <rect x="24" y="94" width="22" height="6" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M 29 86 A 6 6 0 0 1 41 86" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </g>
        {/* Slots — each wrapped in a translate <g> so the dot/ring can
            be scaled from (0,0) which is the visual center. SVG `transform`
            from-center is unreliable across browsers when scaling cx/cy
            geometry directly; this pattern works on Safari + Firefox. */}
        {POS433.map(([x, y], i) => (
          <g key={i} className="pf-slot" transform={`translate(${x} ${y})`}>
            <circle
              className="pf-empty"
              cx="0"
              cy="0"
              r="1.6"
              fill="none"
              stroke="var(--chalk)"
              strokeWidth="0.25"
              strokeDasharray="0.6 0.6"
            />
            <g className="pf-filled" opacity="0">
              <circle
                className="pf-ring"
                cx="0"
                cy="0"
                r="2.0"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="0.35"
              />
              <circle
                className="pf-dot"
                cx="0"
                cy="0"
                r="1.6"
                fill="var(--surface-2)"
              />
            </g>
          </g>
        ))}
      </svg>
      {/* Counter */}
      <div
        style={{
          marginTop: 16,
          fontFamily: 'var(--font-mono), Space Mono, monospace',
          fontSize: 13,
          letterSpacing: '0.18em',
          color: 'var(--text-dim)',
          textAlign: 'center',
        }}
      >
        <span ref={counterRef}>0 / 11</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: no new errors sourced from `components/ui/PitchFill.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/ui/PitchFill.tsx
git commit -m "feat(ui): add PitchFill — signature 0/11 → 11/11 animation, dark-palette only, GSAP timeline"
```

---

### Task 10: Build new `<Nav>` section

**Files:**
- Create: `components/sections/Nav.tsx`

Spec authority: §5.1.

- [ ] **Step 1: Create file with:**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { getLenis } from '@/hooks/useLenis';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToConnect = () => {
    const target = document.getElementById('stay-connected');
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 70,
        borderBottom: scrolled ? '1px solid var(--hairline)' : '1px solid transparent',
        background: scrolled ? 'rgba(11, 13, 16, 0.7)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 280ms ease, border-color 280ms ease, backdrop-filter 280ms ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px clamp(20px, 4vw, 64px)',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <a
          href="#top"
          aria-label="SportTimes — top of page"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: '-0.01em',
            color: 'var(--text)',
            textDecoration: 'none',
          }}
        >
          SportTimes
        </a>
        <button
          type="button"
          onClick={scrollToConnect}
          style={{
            background: 'transparent',
            border: '1px solid var(--hairline)',
            borderRadius: 100,
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            padding: '10px 18px',
            minHeight: 44,
            cursor: 'pointer',
            transition: 'color 200ms ease, border-color 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text)';
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-dim)';
            e.currentTarget.style.borderColor = 'var(--hairline)';
          }}
        >
          Get notified →
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: clean for the new file. (The `@/hooks/useLenis` import already exists in the current codebase.)

- [ ] **Step 3: Commit**

```bash
git add components/sections/Nav.tsx
git commit -m "feat(nav): new minimal Nav — wordmark + Get notified, blur-on-scroll, Lenis smooth-scroll target"
```

---

### Task 11: Rewrite `Hero.tsx` in place

**Files:**
- Modify: `components/sections/Hero.tsx` (full rewrite)

Spec authority: §5.2.

- [ ] **Step 1: Overwrite the file with:**

```tsx
'use client';

import dynamic from 'next/dynamic';
import PitchGrid from '@/components/ui/PitchGrid';
import Reveal from '@/components/ui/Reveal';
import { getLenis } from '@/hooks/useLenis';

const PitchFill = dynamic(() => import('@/components/ui/PitchFill'), { ssr: false });

export default function Hero() {
  const scrollToConnect = () => {
    const target = document.getElementById('stay-connected');
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="top"
      data-palette="dark"
      style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}
    >
      <PitchGrid parallax={0.25} />

      <div
        className="grid-12"
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          alignItems: 'center',
          paddingTop: 'clamp(7rem, 14vh, 10rem)',
          paddingBottom: 'clamp(3rem, 8vh, 6rem)',
        }}
      >
        <Reveal
          className="hero-text"
          stagger={80}
        >
          <div className="mono-eyebrow" style={{ marginBottom: 28 }}>
            [ launching this summer · ben guerir ]
          </div>
          <h1
            className="headline-display"
            style={{
              fontSize: 'clamp(40px, 7vw, 76px)',
              marginBottom: 28,
              color: 'var(--text)',
            }}
          >
            The match before the match.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 17,
              lineHeight: 1.55,
              color: 'var(--text-dim)',
              maxWidth: '42ch',
              marginBottom: 36,
            }}
          >
            Every game is won before kickoff. The app that turns group-chat
            chaos into a confirmed 11-a-side.
          </p>
          <button
            type="button"
            onClick={scrollToConnect}
            style={{
              background: 'var(--accent)',
              color: '#0B0D10',
              border: 'none',
              borderRadius: 100,
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: 15,
              padding: '14px 24px',
              minHeight: 44,
              cursor: 'pointer',
              transition: 'transform 200ms cubic-bezier(.22,.61,.36,1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Get notified →
          </button>
        </Reveal>

        <div
          className="hero-art"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PitchFill />
        </div>
      </div>

      <style jsx>{`
        .hero-text {
          grid-column: span 12;
          order: 2;
        }
        .hero-art {
          grid-column: span 12;
          order: 1;
          margin-bottom: 32px;
        }
        @media (min-width: 1024px) {
          .hero-text {
            grid-column: 1 / span 6;
            order: 1;
          }
          .hero-art {
            grid-column: 7 / span 6;
            order: 2;
            margin-bottom: 0;
          }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: errors from `app/page.tsx` (still references deleted sections), but **no new errors from `components/sections/Hero.tsx`**.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "refactor(hero): rewrite with PitchFill animation, single CTA, dark-palette tokens; drop 3D scene + magnetic button + letter hover"
```

---

### Task 12: Rewrite `Problem.tsx` in place

**Files:**
- Modify: `components/sections/Problem.tsx` (full rewrite)

Spec authority: §5.4.

- [ ] **Step 1: Overwrite the file with:**

```tsx
'use client';

import Reveal from '@/components/ui/Reveal';

const STATS = [
  { label: 'Unread', before: '47', after: '0' },
  { label: 'Confirmed', before: 'unknown', after: '11 / 11' },
  { label: 'Captain time', before: 'hours', after: '0' },
  { label: 'Match', before: '50 / 50', after: 'happening' },
];

export default function Problem() {
  return (
    <section
      id="problem"
      data-palette="dark"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(5rem, 12vh, 9rem) 0',
      }}
    >
      <div className="grid-12" style={{ width: '100%' }}>
        <div style={{ gridColumn: '1 / span 12', maxWidth: 720, margin: '0 auto' }}>
          <Reveal stagger={80}>
            <div className="mono-eyebrow" style={{ marginBottom: 32 }}>
              [ the problem ]
            </div>

            <h2
              className="headline-display"
              style={{
                fontSize: 'clamp(30px, 4.4vw, 46px)',
                color: 'var(--text)',
                marginBottom: 36,
                maxWidth: '20ch',
              }}
            >
              Matches don&apos;t die from a lack of players. They die from coordination.
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 17,
                lineHeight: 1.55,
                color: 'var(--text-dim)',
                maxWidth: '65ch',
                marginBottom: 56,
              }}
            >
              Every week, in every city, the plan lives inside a group chat nobody can actually
              read. Half-confirmations, late cancellations, exhausted organizers. By kickoff, no
              one knows who&apos;s showing up. Often, nobody does.
            </p>

            <div
              style={{
                borderTop: '1px solid var(--hairline)',
                borderBottom: '1px solid var(--hairline)',
                padding: '24px 0',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px 32px',
              }}
              className="problem-stats"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--text-mute)',
                      marginBottom: 6,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      color: 'var(--text-dim)',
                      textDecoration: 'line-through',
                    }}
                  >
                    {s.before}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      color: 'var(--accent)',
                      marginTop: 4,
                    }}
                  >
                    ↓ {s.after}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .problem-stats {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: no new errors from `components/sections/Problem.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Problem.tsx
git commit -m "refactor(problem): rewrite as quiet conviction + before/after stats; drop chat pileup, 3-beat pin, ENOUGH finale"
```

---

### Task 13: Build new `<Solution>` section (paper / light break)

**Files:**
- Create: `components/sections/Solution.tsx`

Spec authority: §5.5. Real screenshots land in Task 19; this task uses a placeholder ratio box.

- [ ] **Step 1: Create file with:**

```tsx
'use client';

import Image from 'next/image';
import PitchGrid from '@/components/ui/PitchGrid';
import Reveal from '@/components/ui/Reveal';

type Row = {
  num: string;
  title: string;
  body: string;
  src: string;
  alt: string;
  imageRight: boolean;
};

const ROWS: Row[] = [
  {
    num: '01',
    title: 'Join your community.',
    body: 'Campus, city, club. Public groups open in a tap.',
    src: '/screens/01-community.png',
    alt: 'SportTimes community feed showing public groups in Ben Guerir',
    imageRight: false,
  },
  {
    num: '02',
    title: 'Discover matches.',
    body: 'Every match from every squad, in one feed.',
    src: '/screens/02-discover.png',
    alt: 'SportTimes match discovery feed with upcoming pickup games',
    imageRight: true,
  },
  {
    num: '03',
    title: 'See the lineup fill.',
    body: 'Watch positions claim themselves in real time.',
    src: '/screens/03-lineup.png',
    alt: 'SportTimes live lineup view with players filling a 4-3-3 formation',
    imageRight: false,
  },
  {
    num: '04',
    title: 'Jump in.',
    body: 'One tap. Captain approves. Your face appears in the lineup. You show up ready.',
    src: '/screens/04-jump-in.png',
    alt: 'SportTimes match confirmation screen with share-to-social options',
    imageRight: true,
  },
];

export default function Solution() {
  return (
    <section
      id="solution"
      data-palette="paper"
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 10vh, 8rem) 0 clamp(7rem, 12vh, 10rem)',
        overflow: 'hidden',
      }}
    >
      <PitchGrid parallax={0.2} />

      <div className="grid-12" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ gridColumn: '1 / span 12', textAlign: 'center', marginBottom: 'clamp(4rem, 8vh, 6rem)' }}>
          <Reveal stagger={80}>
            <div className="mono-eyebrow" style={{ marginBottom: 24 }}>
              [ how it works ]
            </div>
            <h2
              className="headline-display"
              style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', color: 'var(--text)' }}
            >
              The match before the match — built.
            </h2>
          </Reveal>
        </div>

        {ROWS.map((row) => (
          <SolutionRow key={row.num} row={row} />
        ))}
      </div>

      {/* Section close fade to next (dark) palette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '6vh',
          background: 'linear-gradient(to bottom, transparent, #0B0D10)',
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}

function SolutionRow({ row }: { row: Row }) {
  return (
    <div
      style={{
        gridColumn: '1 / span 12',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 32,
        alignItems: 'center',
        marginBottom: 'clamp(4rem, 8vh, 7rem)',
      }}
      className="solution-row"
      data-image-right={row.imageRight}
    >
      <Reveal stagger={80}>
        <div
          className="shot-frame"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '9 / 19.5',
            maxWidth: 320,
            margin: '0 auto',
            borderRadius: 28,
            overflow: 'hidden',
            background: 'var(--surface-2)',
            border: '1px solid var(--hairline)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
          }}
        >
          <Image
            src={row.src}
            alt={row.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 80vw"
            style={{ objectFit: 'cover' }}
            loading="lazy"
          />
        </div>
        <div style={{ padding: '0 8px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.22em',
              color: 'var(--text-mute)',
              marginBottom: 12,
            }}
          >
            {row.num}
          </div>
          <h3
            className="headline-display"
            style={{
              fontSize: 'clamp(24px, 3.2vw, 34px)',
              color: 'var(--text)',
              marginBottom: 16,
            }}
          >
            {row.title}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 17,
              lineHeight: 1.55,
              color: 'var(--text-dim)',
              maxWidth: '38ch',
            }}
          >
            {row.body}
          </p>
        </div>
      </Reveal>

      <style jsx>{`
        @media (min-width: 1024px) {
          .solution-row {
            grid-template-columns: 1fr 1fr !important;
            gap: 64px !important;
          }
          .solution-row[data-image-right='true'] :global(.shot-frame) {
            order: 2;
          }
        }
      `}</style>
    </div>
  );
}
```

Note: this renders broken images until Task 19 lands the cropped screenshots. That's expected; the layout, frames, and text show up immediately.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: no new errors from `components/sections/Solution.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Solution.tsx
git commit -m "feat(solution): new paper-palette section with 4 alternating screenshot rows + chalk pitch backdrop"
```

---

### Task 14: Rewrite `app/page.tsx` with Phase 2 placeholders

**Files:**
- Modify: `app/page.tsx` (full rewrite)

Spec authority: §9 Phase 1 step 9.

- [ ] **Step 1: Overwrite the file with:**

```tsx
import Nav from '@/components/sections/Nav';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Solution from '@/components/sections/Solution';

function Phase2Placeholder({ id, label }: { id: string; label: string }) {
  return (
    <section
      id={id}
      data-palette="dark"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid var(--hairline)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.22em',
          color: 'var(--text-mute)',
        }}
      >
        {label}
      </span>
    </section>
  );
}

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Phase2Placeholder id="roadmap" label="// Phase 2 — roadmap" />
        <Phase2Placeholder id="launching-soon" label="// Phase 2 — launching-soon" />
        <Phase2Placeholder id="stay-connected" label="// Phase 2 — stay-connected" />
        <Phase2Placeholder id="footer" label="// Phase 2 — footer" />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: a few remaining errors from `components/sections/{HowItWorks,LockerRoom,Sports,Footer,Download,ChatChaos}.tsx` (those files are still on disk, still importing deleted UI components). These vanish in Task 16. Errors from `app/page.tsx` itself: should be **zero**.

- [ ] **Step 3: Open `http://localhost:3000` and visually confirm**

What you should see:
- New Nav with `SportTimes` + `Get notified →` at top right.
- Hero with eyebrow, headline, subhead, lime button, PitchFill SVG (animating 0/11 → 11/11).
- Problem: conviction line + stats row with line-through and lime "after" values.
- Solution: paper background, 4 rows with broken-image placeholders (real images land in Task 19), text.
- 4 dark placeholder blocks for Phase 2 sections.

Page should be scrollable end-to-end. Nav `Get notified` should smooth-scroll to the `stay-connected` placeholder.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "refactor(page): new 7-section order with height-preserving placeholders for Phase 2"
```

---

### Task 15: Refresh `app/privacy/page.tsx` and `app/terms/page.tsx` palette

**Files:**
- Modify: `app/privacy/page.tsx`
- Modify: `app/terms/page.tsx`

Spec authority: §9 Phase 1 step 10.

- [ ] **Step 1: In `app/privacy/page.tsx`**, find the `<main … data-palette="hero" …>` line (around line 12) and change `data-palette="hero"` to `data-palette="dark"`.

- [ ] **Step 2: Same change in `app/terms/page.tsx`.**

- [ ] **Step 3: Scan both files for stale tokens + attributes** and replace:
- Inline hex colors (`#050505`, `#F5F5F0`, `#D4FF3A`, etc.) → `var(--bg)`, `var(--text)`, `var(--accent)` respectively.
- `var(--lime)` → `var(--accent)` (the `--lime` token was removed in Task 3).
- `var(--ink)` → `var(--text)`.
- `var(--muted)` → `var(--text-dim)`.
- Strip any `data-cursor` attributes (CustomCursor is gone in Task 17).
- Strip references to deleted Tailwind colors like `text-lime`, `text-ink`, `bg-bg` — replace with the new equivalents or with inline `var(--*)` styles.

- [ ] **Step 4: Open `http://localhost:3000/privacy` and `http://localhost:3000/terms`**. Confirm both render readably on the new dark palette.

- [ ] **Step 5: Commit**

```bash
git add app/privacy/page.tsx app/terms/page.tsx
git commit -m "refactor(legal): switch privacy/terms pages from data-palette=hero to dark; align with new tokens"
```

---

### Task 16: Prune `lib/constants.ts`

**Files:**
- Modify: `lib/constants.ts`

Spec authority: §4.6.

- [ ] **Step 1: Overwrite the file with:**

```ts
export const APP_NAME = 'SPORTTIMES';
export const APP_NAME_DISPLAY = 'SportTimes';
export const APP_LOCATION = 'BEN GUERIR';
export const APP_TIMEZONE = 'Africa/Casablanca';
```

The `COLORS` object and `CHAPTERS` array are deleted — colors live in CSS tokens now, and chapters disappear with the old narrative.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: any files still importing `COLORS` or `CHAPTERS` will error. Those files are all on the deletion list (HowItWorks, LockerRoom, Sports, Footer, Download, ChatChaos) — vanish in Task 17.

- [ ] **Step 3: Commit**

```bash
git add lib/constants.ts
git commit -m "refactor(constants): drop COLORS + CHAPTERS; keep only APP_NAME/DISPLAY/LOCATION/TIMEZONE"
```

---

### Task 17: Delete the deletion list

**Files:**
- Delete: many (see §4.6 of spec)

This is the only destructive step in Phase 1. Run it only when **every** consumer has been rewritten.

- [ ] **Step 1: Skip the pre-flight grep — trust the build gate at step 3**

A manual grep over 21 patterns across the codebase is too error-prone. Instead, run the full type-check + build **after** the deletes (step 3) — those will surface any surviving consumer with a clear "Module not found" error. If they do, restore the specific file with `git checkout HEAD -- path/to/file.tsx`, fix the consumer, and re-run.

- [ ] **Step 2: Run the deletes**

```bash
rm -rf components/three
rm components/ui/CustomCursor.tsx
rm components/ui/Preloader.tsx
rm components/ui/Marquee.tsx
rm components/ui/MenuOverlay.tsx
rm components/ui/AmbientBackground.tsx
rm components/ui/AmbientLayer.tsx
rm components/ui/GrainOverlay.tsx
rm components/ui/CornerBrackets.tsx
rm components/ui/StampText.tsx
rm components/ui/ChapterMarker.tsx
rm components/ui/ProgressScrubber.tsx
rm components/ui/ScrollIndicator.tsx
rm components/ui/Nav.tsx
rm components/ui/MagneticButton.tsx
rm components/sections/Sports.tsx
rm components/sections/LockerRoom.tsx
rm components/sections/ChatChaos.tsx
rm components/sections/HowItWorks.tsx
rm components/sections/Download.tsx
rm -rf public/models public/textures
# Now-orphaned helpers (verify with: grep -rln "from '@/lib/scrollState'\|from '@/lib/easings'" app/ components/ hooks/ )
rm -f lib/scrollState.ts lib/easings.ts
```

- [ ] **Step 3: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: both clean. If either fails, a stale import slipped through — find and fix.

- [ ] **Step 4: Browser smoke-check**

Refresh `http://localhost:3000`. Page should render identically to Task 14's outcome. The animation, layout, and placeholders all still work.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: delete legacy sections + UI primitives now replaced by token-based redesign"
```

---

### Task 18: Uninstall Three.js packages

**Files:**
- Modify: `package.json`, `package-lock.json`

Spec authority: §4.1, §9 Phase 1 step 13.

- [ ] **Step 1: Confirm zero remaining imports**

Run: `grep -rln "@react-three\|from ['\"]three['\"]" app/ components/ hooks/ lib/ 2>/dev/null`

Expected: empty.

- [ ] **Step 2: Uninstall**

```bash
npm uninstall @react-three/fiber @react-three/drei three @types/three
```

- [ ] **Step 3: Build green**

Run: `npm run build`

Expected: build succeeds. (Lockfile + node_modules are now drift-free.)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): remove @react-three/fiber, @react-three/drei, three, @types/three"
```

---

### Task 19: Move source screenshots + crop 4 chosen frames

**Files:**
- Move: `screens/` → `docs/source-assets/screens/`
- Modify: `.gitignore` (remove `/screens` line)
- Create: `public/screens/01-community.png`
- Create: `public/screens/02-discover.png`
- Create: `public/screens/03-lineup.png`
- Create: `public/screens/04-jump-in.png`

Spec authority: §5.5, §9 Phase 1 steps 14–15.

- [ ] **Step 1: Move the source folder out of repo root**

The `/screens` directory is currently in `.gitignore`, so `git mv` will fail (files aren't tracked). Use a plain filesystem move + a `.gitignore` edit:

```bash
mkdir -p docs/source-assets
mv screens docs/source-assets/screens
```

Then open `.gitignore` and **delete the line `/screens`** (it's around line 22 of `.gitignore`). The 35 source captures will enter git history for the first time when this task commits — that's the intended outcome per spec §4.7 (`docs/source-assets/screens/` becomes the canonical home).

- [ ] **Step 2: Pick 4 captures by visual content**

Open `docs/source-assets/screens/` in Finder/Preview. Pick **one capture per verb**, prioritizing screens where the content matches the verb (do not pick a community-creation screen for "Discover matches"):

- **01-community** — a screen that shows joining/browsing a community or squad.
- **02-discover** — a screen that shows the match discovery feed (calendar + match cards).
- **03-lineup** — a screen that shows a live lineup with players in formation (the Lightning Strikers lineup at `Screenshot 2026-02-21 at 15.21.07.png` is a strong candidate).
- **04-jump-in** — a screen that shows the confirmation / share flow (`Screenshot 2026-02-21 at 15.19.05.png` Sharing Match lineup works).

If unsure which capture suits a verb, browse all 35 — match the screen to the verb's *content*, not the screen's *aesthetic*.

- [ ] **Step 3: Crop each to a single phone-content frame**

Use Preview (or any image editor):
1. Crop to the **phone screen content only** — strip the surrounding bezel/device chrome. The remaining image should be the app UI, edge-to-edge.
2. Normalize aspect ratio to roughly **9:19.5** (a tall phone). Slight cropping at top/bottom of UI chrome is fine.
3. Export as **PNG**, max width **~800px** (a `@2x` resolution for a ~400px-rendered frame).
4. Save to `public/screens/` as `01-community.png`, `02-discover.png`, `03-lineup.png`, `04-jump-in.png`.

- [ ] **Step 4: Browser smoke-check**

Refresh `http://localhost:3000`. The Solution section's 4 rows now show real screenshots inside rounded frames. Verify:
- Each screenshot looks crisp (not stretched).
- Each frame's alt text describes what's actually on screen (you may need to edit `components/sections/Solution.tsx` `alt` strings if your chosen captures depict something different from the suggested mappings).
- Alternating layout works (image-left on rows 01 + 03, image-right on rows 02 + 04 at ≥1024px width).

- [ ] **Step 5: Commit**

```bash
git add .gitignore docs/source-assets/screens public/screens
git add components/sections/Solution.tsx 2>/dev/null || true
git commit -m "feat(solution): land 4 cropped phone screenshots; relocate source captures to docs/source-assets"
```

(The second `git add` is best-effort — if you didn't edit Solution.tsx in step 4, it's a no-op.)

---

### Task 20: Phase 1 build-green gate

**Files:** none (verification)

- [ ] **Step 1: Type-check**

Run: `npx tsc --noEmit`

Expected: 0 errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`

Expected: 0 errors, 0 warnings. If next/image complains about missing sizes — fix in `Solution.tsx`.

- [ ] **Step 3: Production build**

Run: `npm run build`

Expected: completes successfully. Print the resulting bundle sizes for the record. The First Load JS for `/` should be noticeably smaller than the current main (the three packages are gone).

- [ ] **Step 4: Walk the page one more time**

Open the production build:

```bash
npm run start &
```

Open `http://localhost:3000`. Walk through every section. Confirm:
- Nav blur kicks in after scrolling past 40px.
- Hero PitchFill animates 0/11 → 11/11 and the lime CTA scroll-anchors to the (placeholder) stay-connected section.
- Problem reads cleanly, no scroll-jacking, stats row visible.
- Solution: 4 screenshot rows on paper background, gradient fade to dark Roadmap placeholder at section bottom.
- 4 Phase 2 placeholders render as labeled blocks.
- `prefers-reduced-motion`: in OS settings, toggle "Reduce motion" → reload. Hero PitchFill should jump straight to 11/11 with no animation. Reveals fire instantly. Parallax stops moving.

- [ ] **Step 5: Stop the prod server**

```bash
kill %1   # or pkill -f 'next start'
```

- [ ] **Step 6: Push the branch + open PR**

```bash
git push -u origin refactor/landing-narrative-phase-1
```

Open a PR titled `refactor(landing): Phase 1 — foundation + Nav/Hero/Problem/Solution`. Description should link the spec doc and call out that Roadmap/LaunchingSoon/StayConnected/Footer render as placeholders pending Phase 2.

**This is the Phase 1 checkpoint.** Wait for user sign-off in the browser before starting Chunk 2.

---

## Chunk 2: Phase 2 — Back half + finishing

End state: PR 2 lands the four Phase-2 sections, the reusable NotifyForm, sticky mobile CTA, OG image production, meta tags, and the quality-floor verification (Lighthouse run, a11y sweep).

Branch off the merged Phase 1: `git checkout main && git pull && git checkout -b refactor/landing-narrative-phase-2`.

### Task 21: Branch + install Phase 2 deps

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b refactor/landing-narrative-phase-2
```

- [ ] **Step 2: Install lucide-react (icons), playwright + tsx (devDeps for OG renderer)**

```bash
npm install lucide-react
npm install -D playwright tsx
npx playwright install chromium
```

- [ ] **Step 3: Build still green**

Run: `npm run build`

Expected: success.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add lucide-react (icons) + playwright devDep (OG image renderer)"
```

---

### Task 22: Build the `<NotifyForm>` component

**Files:**
- Create: `components/ui/NotifyForm.tsx`

Spec authority: §6.

- [ ] **Step 1: Create file with:**

```tsx
'use client';

import { useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Variant = 'dark' | 'lime';
type Source = 'launch' | 'close' | 'sticky-mobile';
type State = 'idle' | 'loading' | 'success' | 'error' | 'invalid';

const FORMSUBMIT_EMAIL = process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL ?? '';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  source: Source;
  variant?: Variant;
};

export default function NotifyForm({ source, variant = 'dark' }: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const lastSubmitRef = useRef(0);
  const honeyRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === 'loading') return;

    // Honeypot — bots fill this, drop silently as success.
    if (honeyRef.current?.value) {
      setState('success');
      return;
    }

    // Client-side rate limit: 1 submit per 5s.
    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) return;
    lastSubmitRef.current = now;

    if (!EMAIL_RE.test(email)) {
      setState('invalid');
      return;
    }

    setState('loading');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          source,
          _subject: `SportTimes notify · ${source}`,
          _captcha: 'false',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState('success');
    } catch {
      setState('error');
    }
  };

  // Color logic per variant
  const inputStyle = {
    background: variant === 'lime' ? 'transparent' : 'var(--surface)',
    border: '1px solid var(--hairline)',
    borderRadius: 100,
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    padding: '14px 18px',
    minHeight: 44,
    width: '100%',
    outline: 'none',
  } as const;

  const buttonStyle = {
    background: variant === 'lime' ? 'var(--text)' : 'var(--accent)',
    color: variant === 'lime' ? 'var(--accent)' : '#0B0D10',
    border: 'none',
    borderRadius: 100,
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: 14,
    padding: '12px 22px',
    minHeight: 44,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  };

  return (
    <form onSubmit={onSubmit} aria-live="polite" style={{ width: '100%' }}>
      <AnimatePresence mode="wait" initial={false}>
        {state === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '14px 18px',
              borderRadius: 100,
              background: 'var(--surface-2)',
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
            tabIndex={-1}
            ref={(el) => el?.focus()}
          >
            <span aria-hidden style={{ color: 'var(--accent)' }}>✓</span>
            You&apos;re on the list. We&apos;ll email you when doors open.
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
          >
            <label htmlFor={`notify-${source}`} style={{
              position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden',
              clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
            }}>
              Your email
            </label>
            <input
              id={`notify-${source}`}
              type="email"
              required
              autoComplete="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === 'invalid' || state === 'error') setState('idle');
              }}
              disabled={state === 'loading'}
              style={{
                ...inputStyle,
                flex: '1 1 220px',
                borderColor: state === 'invalid' ? '#FF6B6B' : 'var(--hairline)',
              }}
            />
            <input
              ref={honeyRef}
              type="text"
              name="_honey"
              tabIndex={-1}
              aria-hidden
              autoComplete="off"
              style={{ display: 'none' }}
            />
            <button type="submit" disabled={state === 'loading'} style={buttonStyle}>
              {state === 'loading' ? 'Submitting…' : 'Notify →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {state === 'invalid' && (
        <div style={{ marginTop: 8, fontSize: 13, color: '#FF6B6B', fontFamily: 'var(--font-body)' }}>
          That doesn&apos;t look right.
        </div>
      )}
      {state === 'error' && (
        <div style={{ marginTop: 8, fontSize: 13, color: '#FF6B6B', fontFamily: 'var(--font-body)' }}>
          Something went wrong. Try again?
        </div>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Add the env var locally**

Create `.env.local` (gitignored) with:

```
NEXT_PUBLIC_FORMSUBMIT_EMAIL=<your test email>
```

If no real email yet, use `test@example.com` — submissions to that will fail at Formsubmit, exercising the `error` state.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add components/ui/NotifyForm.tsx
git commit -m "feat(ui): add NotifyForm — Formsubmit AJAX, 6 designed states, honeypot, rate-limited"
```

---

### Task 23: Build the `<Roadmap>` horizontal scrub timeline

**Files:**
- Create: `components/sections/Roadmap.tsx`

Spec authority: §5.6.

- [ ] **Step 1: Create file with:**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Phase = 'live at launch' | 'coming next' | 'on the horizon';
type Feature = {
  seq: string;
  name: string;
  phase: Phase;
  summary: string;
  bullets: string[];
};

const FEATURES: Feature[] = [
  {
    seq: '01', phase: 'live at launch', name: 'Football pickup',
    summary: 'The day-one promise: organize and discover pickup football across formats.',
    bullets: ['5v5, 7v7, 9v9, 11v11', 'One-tap join', 'Visual lineup'],
  },
  {
    seq: '02', phase: 'live at launch', name: 'Communities',
    summary: 'Join the squads that match how you actually play — campus, city, club, workplace.',
    bullets: ['Public groups open in one tap', 'Private groups gated by admin approval', 'One feed across all your groups'],
  },
  {
    seq: '03', phase: 'live at launch', name: 'Live lineups',
    summary: 'The signature surface. Watch positions fill in real time before kickoff.',
    bullets: ['Real-time roster', 'Formation-aware (4-3-3, etc.)', 'Captain approves joins'],
  },
  {
    seq: '04', phase: 'coming next', name: 'Tournaments',
    summary: 'Run complete tournament brackets inside your community — no spreadsheets.',
    bullets: ['Single-elim, double-elim, round-robin', 'Auto-seeding from match history', 'Live bracket everyone can watch', 'Shareable finals poster'],
  },
  {
    seq: '05', phase: 'coming next', name: 'Match chat',
    summary: 'In-app messaging tied to the match, not the squad. No more buried plans, no more switching apps.',
    bullets: ['Conversation lives inside the match', 'Auto-archive after final whistle', 'Mentions + reactions'],
  },
  {
    seq: '06', phase: 'on the horizon', name: 'More sports',
    summary: 'The same visual lineup, community, and match tools — coming to the sports your people actually play.',
    bullets: ['Basketball (3v3, 5v5)', 'Handball (7v7)', 'Padel · Tennis · more'],
  },
  {
    seq: '07', phase: 'on the horizon', name: 'More cities',
    summary: 'After Ben Guerir: the cities your community lives in.',
    bullets: ['Player-requested city activation', 'Local admin onboarding'],
  },
  {
    seq: '08', phase: 'on the horizon', name: 'Player ratings',
    summary: 'Lightweight per-match peer ratings — captain reliability, sportsmanship, skill. Opt-in.',
    bullets: ['Post-match prompt only', 'Aggregated trends, never single-game scores', 'Players control visibility'],
  },
];

export default function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(-1);
  const [forceMobile, setForceMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (mq.matches) {
      // Reduced motion: force the mobile vertical-stack layout regardless of
      // viewport, so desktop-with-reduced-motion users don't see a stalled strip.
      setForceMobile(true);
      return;
    }
    if (!isDesktop) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const strip = stripRef.current;
      if (!strip) return;
      const stripWidth = strip.scrollWidth;
      const viewportWidth = window.innerWidth;
      const translatePx = Math.max(0, stripWidth - viewportWidth + 80);
      gsap.to(strip, {
        x: -translatePx,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${translatePx + 600}`,
          pin: true,
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="roadmap"
      data-palette="dark"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div
        style={{
          padding: 'clamp(5rem, 10vh, 8rem) clamp(20px, 4vw, 64px) clamp(3rem, 6vh, 5rem)',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <div className="mono-eyebrow" style={{ marginBottom: 16 }}>[ what&apos;s coming ]</div>
        <h2
          className="headline-display"
          style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', color: 'var(--text)', maxWidth: '20ch' }}
        >
          The roadmap, briefly.
        </h2>
      </div>

      {/* Desktop scrub strip — hidden via forceMobile (reduced-motion override) */}
      <div
        className="roadmap-strip-wrap"
        style={{
          position: 'relative',
          display: forceMobile ? 'none' : undefined,
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
      >
        <div
          ref={stripRef}
          className="roadmap-strip"
          style={{
            display: 'flex',
            gap: 24,
            padding: '24px clamp(20px, 4vw, 64px) 48px',
            willChange: 'transform',
          }}
        >
          {FEATURES.map((f, i) => (
            <Card
              key={f.seq}
              feature={f}
              isPinned={pinned === i}
              onToggle={() => setPinned(pinned === i ? -1 : i)}
            />
          ))}
        </div>
      </div>

      {/* Detail panel — desktop only, below the strip */}
      {pinned >= 0 && (
        <Panel feature={FEATURES[pinned]} />
      )}

      {/* Mobile vertical stacked phases — shown on small viewports OR
          when reduced-motion forces it on desktop. */}
      <div
        className="roadmap-mobile"
        data-force-mobile={forceMobile ? 'true' : undefined}
        style={{ display: forceMobile ? 'block' : 'none' }}
      >
        {(['live at launch', 'coming next', 'on the horizon'] as Phase[]).map((phase) => (
          <div key={phase} style={{ padding: '32px clamp(20px, 4vw, 64px)' }}>
            <div className="mono-eyebrow" style={{ marginBottom: 16 }}>[ {phase} ]</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {FEATURES.filter((f) => f.phase === phase).map((f) => (
                <MobileCard key={f.seq} feature={f} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 1023px) {
          .roadmap-strip-wrap { display: none !important; }
          .roadmap-mobile { display: block !important; }
        }
      `}</style>
    </section>
  );
}

function Card({ feature, isPinned, onToggle }: { feature: Feature; isPinned: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        flex: '0 0 220px',
        height: 280,
        background: isPinned ? 'var(--surface-2)' : 'var(--surface)',
        border: `1px solid ${isPinned ? 'var(--accent)' : 'var(--hairline)'}`,
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        textAlign: 'left',
        color: 'var(--text)',
        transition: 'border-color 200ms ease, background 200ms ease',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.22em',
          color: 'var(--text-mute)',
        }}
      >
        {feature.seq}
      </div>
      <div
        className="headline-display"
        style={{ fontSize: 22, color: 'var(--text)', lineHeight: 1.1 }}
      >
        {feature.name}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
          color: 'var(--text-mute)', textTransform: 'lowercase',
        }}
      >
        [ {feature.phase} ]
      </div>
    </button>
  );
}

function Panel({ feature }: { feature: Feature }) {
  return (
    <div
      style={{
        margin: '0 auto 48px',
        maxWidth: 720,
        padding: '24px clamp(20px, 4vw, 32px)',
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
        <h3 className="headline-display" style={{ fontSize: 22, color: 'var(--text)' }}>{feature.name}</h3>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
          color: 'var(--accent)', textTransform: 'lowercase',
        }}>
          [ {feature.phase} ]
        </span>
      </div>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.55,
        color: 'var(--text-dim)', marginBottom: 16,
      }}>
        {feature.summary}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {feature.bullets.map((b) => (
          <li key={b} style={{
            fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text)',
            paddingLeft: 16, position: 'relative',
          }}>
            <span aria-hidden style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>·</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileCard({ feature }: { feature: Feature }) {
  return (
    <article style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 12, padding: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
        <h3 className="headline-display" style={{ fontSize: 20, color: 'var(--text)' }}>{feature.name}</h3>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', color: 'var(--text-mute)',
        }}>{feature.seq}</span>
      </div>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55,
        color: 'var(--text-dim)', marginBottom: 12,
      }}>{feature.summary}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {feature.bullets.map((b) => (
          <li key={b} style={{
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)',
            paddingLeft: 14, position: 'relative',
          }}>
            <span aria-hidden style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>·</span>
            {b}
          </li>
        ))}
      </ul>
    </article>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Roadmap.tsx
git commit -m "feat(roadmap): horizontal scrub timeline with hover detail panel; mobile vertical stack"
```

---

### Task 24: Build the `<LaunchingSoon>` lime panel

**Files:**
- Create: `components/sections/LaunchingSoon.tsx`

Spec authority: §5.7.

- [ ] **Step 1: Create file with:**

```tsx
'use client';

import PitchGrid from '@/components/ui/PitchGrid';
import Reveal from '@/components/ui/Reveal';
import NotifyForm from '@/components/ui/NotifyForm';

export default function LaunchingSoon() {
  return (
    <section
      id="launching-soon"
      data-palette="lime"
      style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 'clamp(5rem, 10vh, 8rem) 0',
      }}
    >
      <PitchGrid parallax={0.3} />
      <div className="grid-12" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <div style={{ gridColumn: '1 / span 12', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <Reveal stagger={80}>
            <div className="mono-eyebrow" style={{ marginBottom: 24, color: 'var(--text-mute)' }}>
              [ summer · ben guerir ]
            </div>
            <h2
              className="headline-display"
              style={{
                fontSize: 'clamp(36px, 6vw, 64px)',
                color: 'var(--text)',
                marginBottom: 24,
              }}
            >
              Doors open this summer.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 17,
                lineHeight: 1.55,
                color: 'var(--text-dim)',
                marginBottom: 36,
                maxWidth: '40ch',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              We&apos;re in the final stretch. Be there when the first match goes live.
            </p>
            <div style={{ maxWidth: 460, margin: '0 auto' }}>
              <NotifyForm source="launch" variant="lime" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/sections/LaunchingSoon.tsx
git commit -m "feat(launching-soon): lime full-bleed panel with parallax pitch grid + NotifyForm"
```

---

### Task 25: Build the `<StayConnected>` close section

**Files:**
- Create: `components/sections/StayConnected.tsx`

Spec authority: §5.8.

- [ ] **Step 1: Create file with:**

```tsx
'use client';

import { Instagram, X, Music } from 'lucide-react'; // Music = TikTok stand-in (lucide has no TikTok glyph)
import PitchGrid from '@/components/ui/PitchGrid';
import Reveal from '@/components/ui/Reveal';
import NotifyForm from '@/components/ui/NotifyForm';

const SOCIALS = [
  { label: 'Instagram', href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#', Icon: Instagram },
  { label: 'TikTok',    href: process.env.NEXT_PUBLIC_TIKTOK_URL ?? '#',    Icon: Music },
  { label: 'X',         href: process.env.NEXT_PUBLIC_X_URL ?? '#',         Icon: X },
];

export default function StayConnected() {
  return (
    <section
      id="stay-connected"
      data-palette="dark"
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 10vh, 8rem) 0',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
        <PitchGrid />
      </div>
      <div className="grid-12" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ gridColumn: '1 / span 12', textAlign: 'center', marginBottom: 48 }}>
          <Reveal stagger={80}>
            <div className="mono-eyebrow" style={{ marginBottom: 24 }}>
              [ stay in the loop ]
            </div>
            <h2
              className="headline-display"
              style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', color: 'var(--text)' }}
            >
              Two ways to ride along.
            </h2>
          </Reveal>
        </div>

        <Reveal
          stagger={120}
          className="stay-grid"
        >
          <div style={{
            padding: 28,
            background: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: 16,
          }}>
            <h3 className="headline-display" style={{ fontSize: 22, color: 'var(--text)', marginBottom: 8 }}>
              Get the launch email.
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-dim)', marginBottom: 20,
            }}>
              One email, the day doors open.
            </p>
            <NotifyForm source="close" variant="dark" />
          </div>

          <div style={{
            padding: 28,
            background: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: 16,
          }}>
            <h3 className="headline-display" style={{ fontSize: 22, color: 'var(--text)', marginBottom: 8 }}>
              Follow along.
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-dim)', marginBottom: 20,
            }}>
              Behind-the-scenes, until we&apos;re live.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 16px',
                    minHeight: 44,
                    background: 'transparent',
                    border: '1px solid var(--hairline)',
                    borderRadius: 100,
                    color: 'var(--text-dim)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                  }}
                >
                  <Icon size={16} aria-hidden />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <style jsx>{`
        .stay-grid {
          grid-column: 1 / span 12;
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          max-width: 880px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .stay-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/sections/StayConnected.tsx
git commit -m "feat(stay-connected): dark close with NotifyForm + lucide social links"
```

---

### Task 26: Rewrite `<Footer>` in place

**Files:**
- Modify: `components/sections/Footer.tsx` (full rewrite)

Spec authority: §5.9.

- [ ] **Step 1: Overwrite the file with:**

```tsx
import Link from 'next/link';
import { Instagram, X, Music } from 'lucide-react';

const SOCIALS = [
  { label: 'Instagram', href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#', Icon: Instagram },
  { label: 'TikTok',    href: process.env.NEXT_PUBLIC_TIKTOK_URL ?? '#',    Icon: Music },
  { label: 'X',         href: process.env.NEXT_PUBLIC_X_URL ?? '#',         Icon: X },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      data-palette="dark"
      style={{
        padding: '32px clamp(20px, 4vw, 64px)',
        borderTop: '1px solid var(--hairline)',
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--text-mute)',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text)',
        }}>
          SportTimes
        </span>
        <nav style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ color: 'var(--text-mute)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms"   style={{ color: 'var(--text-mute)', textDecoration: 'none' }}>Terms</Link>
          <a href="mailto:contact@…" style={{ color: 'var(--text-mute)', textDecoration: 'none' }}>contact@…</a>
        </nav>
        <div style={{ display: 'flex', gap: 12 }}>
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{ color: 'var(--text-mute)', display: 'inline-flex', minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon size={18} aria-hidden />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/sections/Footer.tsx
git commit -m "refactor(footer): single quiet row, App Router /privacy + /terms links, lucide socials"
```

---

### Task 27: Build the `<StickyMobileCTA>`

**Files:**
- Create: `components/ui/StickyMobileCTA.tsx`

Spec authority: §7.

- [ ] **Step 1: Create file with:**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import NotifyForm from './NotifyForm';

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hidesAfterRef = useRef<Element | null>(null);
  const hiddenByFooterRef = useRef<Element | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  // Body scroll-lock while the sheet is open
  useEffect(() => {
    if (sheetOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [sheetOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const heroSentinel = document.getElementById('top');
    const footerSentinel = document.getElementById('footer');

    let heroOut = false;
    let footerIn = false;

    const heroObs = new IntersectionObserver(([entry]) => {
      heroOut = !entry.isIntersecting;
      setVisible(heroOut && !footerIn);
    }, { threshold: 0 });
    if (heroSentinel) {
      hidesAfterRef.current = heroSentinel;
      heroObs.observe(heroSentinel);
    }

    const footerObs = new IntersectionObserver(([entry]) => {
      footerIn = entry.isIntersecting;
      setVisible(heroOut && !footerIn);
    }, { threshold: 0 });
    if (footerSentinel) {
      hiddenByFooterRef.current = footerSentinel;
      footerObs.observe(footerSentinel);
    }

    return () => {
      heroObs.disconnect();
      footerObs.disconnect();
    };
  }, []);

  const baseStyle = {
    position: 'fixed' as const,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 60,
    background: 'var(--accent)',
    color: '#0B0D10',
    padding: '14px 20px',
    minHeight: 56,
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: 16,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 -12px 40px rgba(0,0,0,0.18)',
  };

  return (
    <div className="sticky-mobile-cta" style={{ display: 'none' }}>
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        style={{
          ...baseStyle,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: reducedMotion ? 'none' : 'transform 240ms ease-out',
        }}
      >
        Get notified →
      </button>

      {sheetOpen && (
        <>
          <div
            role="presentation"
            onClick={() => setSheetOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(11, 13, 16, 0.6)', zIndex: 80,
            }}
          />
          <div
            role="dialog"
            aria-label="Get notified"
            data-palette="lime"
            style={{
              position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 90,
              background: 'var(--bg)', color: 'var(--text)',
              padding: '24px 20px 40px',
              borderTopLeftRadius: 20, borderTopRightRadius: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <h3 className="headline-display" style={{ fontSize: 20, color: 'var(--text)' }}>
                Get the launch email.
              </h3>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close"
                style={{
                  background: 'transparent', border: 'none', color: 'var(--text)',
                  fontSize: 24, cursor: 'pointer', minWidth: 44, minHeight: 44,
                }}
              >×</button>
            </div>
            <NotifyForm source="sticky-mobile" variant="lime" />
          </div>
        </>
      )}

      <style jsx>{`
        @media (max-width: 1023px) {
          .sticky-mobile-cta { display: block !important; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/ui/StickyMobileCTA.tsx
git commit -m "feat(ui): StickyMobileCTA — IntersectionObserver-gated visibility + bottom-sheet NotifyForm"
```

---

### Task 28: Wire Phase 2 sections into `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace the contents with:**

```tsx
import dynamic from 'next/dynamic';
import Nav from '@/components/sections/Nav';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Solution from '@/components/sections/Solution';
import StickyMobileCTA from '@/components/ui/StickyMobileCTA';

const Roadmap = dynamic(() => import('@/components/sections/Roadmap'), {
  loading: () => <div style={{ minHeight: '100vh' }} aria-hidden />,
});
const LaunchingSoon = dynamic(() => import('@/components/sections/LaunchingSoon'), {
  loading: () => <div style={{ minHeight: '90vh' }} aria-hidden />,
});
const StayConnected = dynamic(() => import('@/components/sections/StayConnected'), {
  loading: () => <div style={{ minHeight: '80vh' }} aria-hidden />,
});
const Footer = dynamic(() => import('@/components/sections/Footer'), {
  loading: () => <div style={{ minHeight: '120px' }} aria-hidden />,
});

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Roadmap />
        <LaunchingSoon />
        <StayConnected />
        <Footer />
      </main>
      <StickyMobileCTA />
    </>
  );
}
```

**Why no `ssr: false`:** Next 14.2 forbids `ssr: false` inside Server Components (and `app/page.tsx` is one by default). `StickyMobileCTA` already has `'use client'` and all its `window` access lives inside `useEffect`, so SSR is safe — we just import it directly. Roadmap/LaunchingSoon/StayConnected/Footer use plain `next/dynamic` for code-splitting only (no `ssr: false`).

- [ ] **Step 2: Browser smoke-check**

Refresh `http://localhost:3000`. Walk top to bottom. Confirm:
- All 7 sections render.
- Roadmap pins on desktop and the strip horizontally scrolls under the cursor.
- Clicking a Roadmap card opens the detail panel.
- LaunchingSoon is a lime panel.
- StayConnected has two columns on ≥768px.
- Footer renders at the bottom.
- Sticky CTA appears on mobile (resize browser < 1024px to verify).

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(page): swap Phase 2 placeholders for real sections + sticky mobile CTA"
```

---

### Task 29: Build OG preview route + Playwright render script

**Files:**
- Create: `app/og-preview/page.tsx`
- Create: `scripts/render-og.ts`
- Modify: `package.json` (add `render-og` script)
- Create: `public/og/sporttimes-og.png` (generated)

Spec authority: §8.3.

- [ ] **Step 1: Create `app/og-preview/layout.tsx`** (separate from the page so `metadata` lives in a Server Component and the page itself can be a Client Component):

```tsx
export const metadata = { title: 'OG Preview', robots: 'noindex' };

export default function OgPreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Create `app/og-preview/page.tsx`** (Client Component — static import of PitchFill, no `next/dynamic`):

```tsx
'use client';

import PitchFill from '@/components/ui/PitchFill';

export default function OgPreviewPage() {
  return (
    <div
      data-palette="dark"
      style={{
        width: 1200,
        height: 630,
        background: 'var(--bg)',
        color: 'var(--text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '80px',
      }}
    >
      <div style={{ maxWidth: 600 }}>
        <div className="mono-eyebrow" style={{ marginBottom: 20 }}>
          [ launching this summer · ben guerir ]
        </div>
        <h1
          className="headline-display"
          style={{ fontSize: 72, lineHeight: 1.05, color: 'var(--text)' }}
        >
          The match before the match.
        </h1>
        <div
          style={{
            marginTop: 40,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 28,
            color: 'var(--accent)',
          }}
        >
          SportTimes
        </div>
      </div>
      <div style={{ width: 380 }}>
        <PitchFill />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `scripts/render-og.ts`:**

```ts
/* eslint-disable no-console */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

async function main() {
  const url = process.env.OG_URL ?? 'http://localhost:3000/og-preview';
  const out = resolve(process.cwd(), 'public/og/sporttimes-og.png');

  await mkdir(resolve(process.cwd(), 'public/og'), { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
  const page = await ctx.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });
  // Give the PitchFill animation a moment to finish (it auto-fires on load + 400ms).
  await page.waitForTimeout(3500);

  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });

  await browser.close();
  console.log(`OG image written to ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 4: Add `render-og` script to `package.json`**

In `package.json` `scripts`, add:

```json
"render-og": "tsx scripts/render-og.ts"
```

`tsx` is installed by Task 21. If it's missing somehow: `npm install -D tsx`.

- [ ] **Step 5: Generate the OG image**

In one terminal: `npm run dev` (must be running).
In another: `npm run render-og`

Expected output: `OG image written to /Users/mohamed/Downloads/sporttimes/public/og/sporttimes-og.png`.

Open the file and confirm it looks like a 1200×630 still of the hero composition with the filled lineup.

- [ ] **Step 6: Commit**

```bash
git add app/og-preview/layout.tsx app/og-preview/page.tsx scripts/render-og.ts package.json package-lock.json public/og
git commit -m "feat(og): hidden /og-preview route + Playwright render-og script; commit generated OG png"
```

---

### Task 30: Update `app/layout.tsx` meta tags

**Files:**
- Modify: `app/layout.tsx` (metadata only)

Spec authority: §8.3.

- [ ] **Step 1: Replace the `metadata` export with:**

```tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://sporttimes.app'),
  title: 'SportTimes — The match before the match',
  description:
    'The app that turns group-chat chaos into a confirmed 11-a-side. Launching this summer in Ben Guerir.',
  openGraph: {
    title: 'SportTimes — The match before the match',
    description:
      'The app that turns group-chat chaos into a confirmed 11-a-side. Launching this summer in Ben Guerir.',
    type: 'website',
    images: [{ url: '/og/sporttimes-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportTimes — The match before the match',
    description:
      'The app that turns group-chat chaos into a confirmed 11-a-side. Launching this summer in Ben Guerir.',
    images: ['/og/sporttimes-og.png'],
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(meta): new title/description, OG + Twitter card pointing at sporttimes-og.png"
```

---

### Task 31: Manual quality-floor sweep

**Files:** none (verification)

Spec authority: §8.

- [ ] **Step 1: Tap-target sweep on a mobile viewport**

In dev tools, simulate iPhone 14. Tap every interactive element: Nav button, Hero CTA, Sticky CTA, NotifyForm input + button, Roadmap cards, Footer links, Social links. Each should be **≥44×44px**. Fix any that aren't.

- [ ] **Step 2: Focus-ring sweep**

Use keyboard only (Tab through the whole page). Every interactive element should show the `outline: 2px solid var(--accent)` ring on focus. Check on all three palettes (dark / paper / lime). Fix any element with `outline: none` and no replacement.

- [ ] **Step 3: Reduced-motion check**

Toggle OS-level "Reduce motion" → reload. Confirm:
- Hero PitchFill is instantly 11/11.
- Reveals fire instantly.
- PitchGrid parallax static.
- Roadmap scrub pin disabled (mobile-style vertical strip instead).
- StickyMobileCTA appears/disappears without slide.

- [ ] **Step 4: Color contrast verification**

Use a contrast tool (e.g. axe DevTools, Lighthouse Accessibility) on each section. Body text on paper (`#5A5F57` on `#EDEFEA`) must read ≥ 5.46:1. Ink on lime (`#0B0D10` on `#C6F24E`) must read ≥ 15:1. Fix any combination that fails AA.

- [ ] **Step 5: Lighthouse**

```bash
npm run build && npm run start &
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility --preset=desktop --view --output html --output-path ./lighthouse.html
```

Acceptance: Performance ≥ 90, Accessibility ≥ 95, LCP < 2.5s. If you fall short, common fixes:
- Lazy-load anything above-the-fold that doesn't need to block paint.
- Increase `next/image` quality vs. file-size trade-off.
- Confirm `next.config.mjs` is producing AVIF (DevTools → Network → screenshot row → Content-Type).

Stop the prod server.

- [ ] **Step 6: Build green + commit any fixes**

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Each must pass clean. Commit fixes made during the sweep with a descriptive message (one commit per category — a11y / perf / focus).

---

### Task 32: Open Phase 2 PR

**Files:** none

- [ ] **Step 1: Push branch**

```bash
git push -u origin refactor/landing-narrative-phase-2
```

- [ ] **Step 2: Open PR** titled `refactor(landing): Phase 2 — Roadmap/LaunchingSoon/StayConnected/Footer + email + OG + a11y`. Description should:
- Link the spec doc.
- Note env vars required at deploy time: `NEXT_PUBLIC_FORMSUBMIT_EMAIL`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_TIKTOK_URL`, `NEXT_PUBLIC_X_URL`.
- Attach the Lighthouse HTML report from Task 31 step 5.
- Note that `apple-app-site-association` (working-tree change at PR open time) is unrelated to this refactor and should be its own commit.

---

## Done

After Phase 2 PR merges, the site is fully landed per the spec. Outstanding items for the user (not the engineer):

- Provide real Formsubmit email + social URLs and set them in production env.
- Verify the 4 cropped screenshots tell the story they should — swap any that don't.
- Decide whether to delete the now-unused `public/privacy.html` + `public/terms.html` static duplicates.
