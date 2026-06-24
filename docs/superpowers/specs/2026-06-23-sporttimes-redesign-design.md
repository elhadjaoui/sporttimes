# SportTimes landing page — narrative refactor (design spec)

**Date:** 2026-06-23
**Status:** approved through brainstorm, awaiting implementation plan
**Predecessor:** `docs/superpowers/specs/2026-04-18-landing-page-design.md` (the current site)
**Owner:** elhadjaoui

---

## 1. Goal

Refactor the existing SportTimes landing page from a templated, animation-heavy, "all-caps condensed italic" execution into a quiet, narrative explainer that does four jobs in order:

1. Establish the **problem** SportTimes solves.
2. Show **how** it solves it, using real screenshots.
3. Communicate the **roadmap** without making date promises.
4. Capture **emails** for the launch ("this summer") and offer social follow as a secondary path.

The page is not a conversion funnel. It is a pre-launch story. The signature visual is a football lineup filling to **11/11**. Everything else stays quiet.

## 2. Non-goals (explicitly out of scope)

The following items appeared in the source brief but are **not** part of this spec. They may become future projects:

- **Voting on roadmap items.** No upvotes, no per-item notify-me, no vote count storage.
- **PostHog analytics.** No event firing, no funnels, no consent banner.
- **Supabase / any backend database.** Email capture goes through Formsubmit.co; no API routes for persistence.
- **Triple-DES roadmap dates.** No specific months / quarters. Phase labels only.
- **Designed sub-routes.** This is one page; `privacy.html` and `terms.html` survive as static assets only.

## 3. Decisions log

Decisions locked during brainstorm, in order:

| # | Decision | Reason |
|---|---|---|
| 1 | Scope = visual refactor + email capture only | Smallest cut that ships a portfolio-quality page; backend deferred. |
| 2 | Email capture via **Formsubmit.co** AJAX | Zero infra, zero cost, zero deploy-config; inbox = list. |
| 3 | Hero headline **`The match before the match.`** preserved | User flagged it as "a strong statement"; overrides the brief's replacement. |
| 4 | Copy strategy = **mix** existing + brief drafts | Existing voice has strong bones; brief drafts fill gaps in weak areas (Problem). |
| 5 | Launch city = **Ben Guerir** (not Casablanca) | User correction; brief was wrong. |
| 6 | Launch window = **"this summer"** (imminent, 2026-summer) | User confirmed. |
| 7 | Roadmap dates = **fuzzy phase labels only** | User-explicit; no commitments. |
| 8 | Roadmap section kept, redesigned as **horizontal scrub timeline** | User preference; replaces collage with a tighter artifact. |
| 9 | Delivery shape = **two-phase, hard checkpoint after Phase 1** | Lets user see foundation + opening half in-browser before committing to back half. |

## 4. Architecture — global foundation

### 4.1 Stack preserved

Next.js (App Router) · React · TypeScript · Tailwind CSS · GSAP · Framer Motion · Lenis (smooth scroll).

**Removed packages** (Phase 1 `npm uninstall`): `@react-three/fiber`, `@react-three/drei`, `three` — nothing in the new design uses them. Realistic bundle savings will be confirmed at PR time (rough order: hundreds of KB minified).

**Added packages** (Phase 2 `npm install`): `lucide-react` (icons for Stay-connected + Footer socials). No other new deps.

### 4.2 Design tokens (3 palettes)

Three CSS custom-property sets, scoped per section via `data-palette="dark" | "paper" | "lime"`. Every component reads tokens — never raw hex. Tokens live in `app/globals.css`.

```css
[data-palette="dark"] {
  --bg: #0B0D10;
  --surface: #14171C;
  --surface-2: #1B1F26;
  --hairline: rgba(255,255,255,0.08);
  --text: #F2F4F7;
  --text-dim: #9BA1AA;
  --text-mute: #6B7079;
  --accent: #C6F24E;       /* refined lime — <5% surface coverage */
  --turf: #0E1714;
  --chalk: rgba(255,255,255,0.14);
  --grid: rgba(255,255,255,0.07);
}

[data-palette="paper"] {
  --bg: #EDEFEA;
  --surface: #FFFFFF;
  --surface-2: #F4F5F0;
  --hairline: rgba(11,13,16,0.06);
  --text: #0B0D10;
  --text-dim: #5A5F57;
  --text-mute: #8A8F86;
  --accent: #0B0D10;       /* on paper, accent = ink, never lime */
  --turf: #DDE3D5;         /* desaturated paper-tone field fill */
  --chalk: rgba(11,13,16,0.14);
  --grid: rgba(11,13,16,0.08);
}

[data-palette="lime"] {
  --bg: #C6F24E;
  --surface: #C6F24E;
  --surface-2: #BBE842;    /* tonal step down for inset cards / form chrome */
  --hairline: rgba(11,13,16,0.18);
  --text: #0B0D10;
  --text-dim: rgba(11,13,16,0.7);
  --text-mute: rgba(11,13,16,0.55);
  --accent: #0B0D10;
  --turf: #BBE842;         /* matches surface-2 — no separate field fill */
  --chalk: rgba(11,13,16,0.18);
  --grid: rgba(11,13,16,0.12);
}
```

**Token coverage invariant:** every palette must define `--bg`, `--surface`, `--surface-2`, `--hairline`, `--text`, `--text-dim`, `--text-mute`, `--accent`, `--turf`, `--chalk`, `--grid`. Reusable components (`<PitchGrid>`, `<PitchFill>`, `<NotifyForm>`) may read any of these and must work in all three palettes.

### 4.3 Typography

| Role | Family | Use |
|---|---|---|
| Display | Space Grotesk (next/font/google) | Headlines, sentence case. `H1 clamp(40px,7vw,76px)`, `H2 clamp(30px,4.4vw,46px)`. Line-height 0.98 on H1, 1.05 on H2. |
| Body | Inter (next/font/google) | All prose. `17px / 1.55`. Max measure 62ch. |
| Mono | Space Mono (next/font/google) | **Only** bracket eyebrows like `[ the problem ]`, status pills, captions. Always `--text-mute` color. Never on headings, never lime. |

CSS variables (`--font-display`, `--font-body`, `--font-mono`) repoint to the new families. Existing utility class names in `app/globals.css` keep working — minimal downstream churn. **Font fallback chains must be updated too** (e.g., `font-family: var(--font-mono), 'Space Mono', monospace;`) — leaving `JetBrains Mono` in the fallback will pass review but render the wrong font on machines without Space Mono cached.

The current condensed-italic ALL-CAPS H1 style is removed.

### 4.4 Motion primitives

Two reusable components replace the current zoo of GSAP timelines + Framer transitions + springs.

#### `<Reveal>` (`components/ui/Reveal.tsx`)
- `opacity 0 → 1`, `translateY 14px → 0`, `320ms`, `cubic-bezier(.22,.61,.36,1)`.
- Triggered by IntersectionObserver, fires **once** per element. Observer **disconnects** after first fire to avoid wasted observation. Scrolling back up does not re-trigger; the element stays revealed.
- `stagger` prop in ms (default 0) staggers direct children.
- `prefers-reduced-motion` → renders final state instantly (no observer attached).

#### `<Parallax y={0.2..0.4}>` (`components/ui/Parallax.tsx`)
- Wraps a child, translates it on vertical scroll via `transform: translate3d(0, <offset>px, 0)`.
- `requestAnimationFrame`-throttled, `will-change: transform`.
- Mobile = half the y multiplier.
- `prefers-reduced-motion` → renders static (no transform applied, no rAF loop).

GSAP retained for two specific cases: the **PitchFill** sequence (precise stagger control) and the **Roadmap timeline scrub** (ScrollTrigger). All other GSAP timelines (Hero scrub, Problem 3-beat pin, Sports scrub) are deleted.

Framer Motion retained only for `AnimatePresence` in the `NotifyForm` state transitions.

### 4.5 PitchGrid background system

Single `<PitchGrid />` component (`components/ui/PitchGrid.tsx`) renders the chalk-line football field markings as inline SVG, full-bleed inside its parent section, behind everything. The lines (penalty boxes, halfway line, center circle, formation grid) are baked into the component — no external SVG file.

- Reads `--grid` from the active palette → color adapts per section.
- Optional `parallax` prop (`false | 0.2..0.4`) → wraps render in `<Parallax>`.
- Static under `prefers-reduced-motion`.

Replaces the existing 3D `HeroScene` (Three.js).

### 4.6 Deletion list

These files are removed in Phase 1 (git history preserves them):

```
components/three/HeroScene.tsx
components/three/PitchWireframe.tsx
components/ui/CustomCursor.tsx
components/ui/Preloader.tsx
components/ui/Marquee.tsx
components/ui/MenuOverlay.tsx
components/ui/AmbientBackground.tsx
components/ui/AmbientLayer.tsx
components/ui/GrainOverlay.tsx
components/ui/CornerBrackets.tsx
components/ui/StampText.tsx
components/ui/ChapterMarker.tsx
components/ui/ProgressScrubber.tsx
components/ui/ScrollIndicator.tsx
components/ui/Nav.tsx                       (old impl — replaced by sections/Nav.tsx)
components/ui/MagneticButton.tsx            (used only by current Hero, gone with rewrite)
components/sections/Sports.tsx
components/sections/LockerRoom.tsx          (FEATURES content inlined into §5.6 before deletion)
components/sections/ChatChaos.tsx
components/sections/HowItWorks.tsx          (content folded into new Solution; POS433 inlined into §5.3 before deletion)
components/sections/Download.tsx            (app isn't launched yet — no Download CTA)
public/models/                              (empty)
public/textures/                            (empty)
```

`LenisProvider.tsx` is kept. `lib/constants.ts` is kept and pruned — `APP_NAME`, `APP_NAME_DISPLAY`, `APP_LOCATION`, `APP_TIMEZONE` stay; the `COLORS` object and `CHAPTERS` array are removed (the new system reads colors from CSS tokens, and chapters disappear with the old narrative).

### 4.7 File structure after refactor

```
app/
  layout.tsx                 ← global tokens, fonts, providers
  page.tsx                   ← rewritten: new 7-section order
  privacy/page.tsx           ← retained, palette + tokens refreshed in Phase 1
  terms/page.tsx             ← retained, palette + tokens refreshed in Phase 1
  globals.css                ← rewritten tokens + base type
  og-preview/page.tsx        ← Phase 2 only: hidden route used by render-og script
components/
  sections/
    Nav.tsx                  (new)
    Hero.tsx                 (rewritten)
    Problem.tsx              (rewritten)
    Solution.tsx             (new)
    Roadmap.tsx              (new)
    LaunchingSoon.tsx        (new)
    StayConnected.tsx        (new)
    Footer.tsx               (rewritten)
  ui/
    Reveal.tsx               (new)
    Parallax.tsx             (new)
    PitchGrid.tsx            (new)
    PitchFill.tsx            (new — signature animation)
    NotifyForm.tsx           (new — Formsubmit, reused)
    StickyMobileCTA.tsx      (new)
public/
  screens/
    01-community.png  02-discover.png  03-lineup.png  04-jump-in.png
    (4 chosen from /screens/, cropped to strip phone bezel,
     normalized to 9:19.5 aspect, committed as PNG @2x.
     next/image produces AVIF/WebP at request time — see §8.2)
  og/
    sporttimes-og.png        (1200×630, produced by scripts/render-og.ts — see §8.3)
scripts/
  render-og.ts               (Phase 2 — Playwright screenshot of /og-preview)
```

The `screens/` folder at repo root (the 35 Feb 2026 source captures) is moved to `docs/source-assets/screens/` in Phase 1 to avoid bloating `/public/`. Only the 4 chosen + cropped exports live under `public/screens/`.

---

## 5. Section design

Section order, top to bottom, with palette tonal rhythm noted:

```
Nav (dark)
  ↓
Hero (dark)              ← signature pitch-fill animation, dark theme
  ↓
Problem (dark)           ← quiet conviction line + before/after
  ↓
Solution (PAPER)         ← LIGHT BREAK 1 — real screenshots
  ↓
Roadmap (dark)           ← back to dark
  ↓
Launching-soon (LIME)    ← LIGHT BREAK 2 — the one loud beat
  ↓
Stay-connected (dark)    ← back to dark
  ↓
Footer (dark)
```

Two non-dark breaks. Never adjacent. Each marks a turn in the narrative (Solution = "the lights come on"; Launching-soon = "the catchy beat").

### 5.1 Nav

`components/sections/Nav.tsx`, `data-palette="dark"`.

- Layout: wordmark **SportTimes** left, single soft-text `Get notified` button right. No hamburger, no menu.
- Sticky transparent over the Hero. At scroll `> 40px`, gains a 1px `--hairline` bottom border + `backdrop-filter: blur(12px)` over `rgba(11,13,16,0.7)`.
- Clicking `Get notified` smooth-scrolls (Lenis) to the `Stay-connected` section anchor.
- Mobile: identical shape — no hamburger needed.
- Tap targets ≥ 44×44px.

### 5.2 Hero

`components/sections/Hero.tsx`, `data-palette="dark"`. Full viewport height.

**Desktop layout (12-col grid):**
- Cols 1–6: eyebrow → headline → subhead → CTA, vertically centered.
- Cols 7–12: `<PitchFill>` animation, vertically centered.

**Mobile layout:**
- `<PitchFill>` renders **above** the text block — animation lands first, then the prose. Halved parallax offset.

**Content:**

```
[ launching this summer · ben guerir ]              ← mono, --text-mute

The match before the match.                          ← display, KEEPER
                                                       lowercased, sentence case

Every game is won before kickoff. The app that       ← body, --text-dim,
turns group-chat chaos into a confirmed 11-a-side.     max 42ch

[ Get notified → ]                                   ← single CTA, button
                                                       smooth-scrolls to
                                                       Stay-connected
```

**CTA flow at every breakpoint** (consistent): click/tap on the Hero `Get notified` button smooth-scrolls (Lenis) to the `#stay-connected` anchor. It is **not** a form, not a modal, not a sheet, on any viewport. Sheet UX belongs exclusively to the Sticky Mobile CTA (§7) and does not overlap behavior despite the shared "Get notified" label.

**Background:** `<PitchGrid parallax={0.25} />` behind everything.

**Removed from current Hero:** the letter-by-letter cursor-proximity hover (`line-hover`, `letter` spans), the 3D HeroScene, the preloader-coupled fade-in, the GSAP scroll scrub, the two-CTA layout (`Download the app` removed — the app doesn't exist yet), the ALL-CAPS uppercase styling, the corner brackets, the chapter marker, the scroll indicator.

### 5.3 PitchFill — the signature animation

`components/ui/PitchFill.tsx`. Used in Hero. **Not** reused in Solution (the screenshots already show lineups).

**Geometry:** 70×100 SVG viewBox (chalk lines, penalty boxes, 6-yard boxes, halfway line, center circle, goals). Recreated inside `PitchFill.tsx` itself — the legacy `PitchWireframe.tsx` is being deleted (§4.6), so we don't import from it.

**Player slots:** 11 positions in a 4-3-3, inlined directly in `PitchFill.tsx` (do **not** import from `HowItWorks.tsx`, which is also being deleted):

```ts
// inlined inside components/ui/PitchFill.tsx
const POS433: ReadonlyArray<readonly [number, number]> = [
  [35, 92],                                 // GK
  [14, 72], [28, 72], [42, 72], [56, 72],   // DEF (LB → RB)
  [22, 48], [35, 48], [48, 48],             // MID (L → R)
  [18, 25], [52, 25],                       // FWD (LF, RF)
  [35, 18],                                 // CF
];
```

**Note on the contract change:** the legacy `HowItWorks` had a `CF_INDEX = 10` constant and kept the centre-forward slot intentionally empty in its visualization. The new `<PitchFill>` **fills all 11 slots** — that's the point of the 0/11 → 11/11 narrative. CF is no longer special.

**Slot states:**
- Empty: dashed chalk circle, radius `~1.6`, `stroke: var(--chalk)`, `stroke-dasharray: 1 1`.
- Filled: solid dot with thin `--accent` (lime) ring around an abstract solid fill (`var(--surface-2)`). **No photo avatars in Phase 1** — sourcing 6 transparent-bg avatar crops from the screenshots is extra implementation cost and the dot-with-ring reads beautifully on its own. If avatars are added later as a Phase 2 polish item, the slot component is small enough to extend in one edit.

**Sequence:**
- Trigger: the **first** of these two events wins; the other is a no-op after the animation starts:
  1. Scroll-into-view via IntersectionObserver (`threshold: 0.3`).
  2. `window.load + 400ms`.
  Internal `hasFired` boolean guards against double-firing if both events race. Because `<PitchFill>` is `next/dynamic({ ssr: false })`, the component mounts post-hydration; on desktop where the Hero is in view at first paint, the IntersectionObserver typically fires first.
- Order: GK → DEF (left→right) → MID (left→right) → FWD (LF, RF, CF).
- Stagger: 230ms between slots. Total sequence ≈ 2.5s.
- Each slot fade-in: dashed circle shrinks to ~0.4 opacity, lime ring + dot pop in with `scale 0.6 → 1`, 240ms, ease `power3.out`.
- Counter (mono, dark-screen `--text-dim`, final tick lime): types `0/11 → 11/11` in sync with slot fills.

**Reduced-motion:** renders final filled-11/11 state + `11/11` counter instantly, no animation, no rAF.

**Plays once.** Does not loop. Does not replay on re-scroll. No re-trigger on route change (SPA, single page).

**Implementation library:** GSAP (timeline + stagger control).

### 5.4 Problem

`components/sections/Problem.tsx`, `data-palette="dark"`. Single non-pinned section, height ~100vh, no scroll-jacking.

**Content:**

```
                    [ the problem ]                  ← mono eyebrow

         Matches don't die from a lack
         of players. They die from
         coordination.                               ← H2 conviction
                                                       (brief draft, kept)

  Every week, in every city, the plan lives          ← body, --text-dim,
  inside a group chat nobody can actually              ~65ch
  read. Half-confirmations, late cancellations,
  exhausted organizers. By kickoff, no one
  knows who's showing up. Often, nobody does.

  ─────────────────────────────────────────────────  ← hairline
   Unread    Confirmed    Captain time    Match
   47        unknown      hours           50 / 50    ← mono, --text-dim
   ↓         ↓            ↓               ↓
   0         11 / 11      0               happening  ← mono, --accent
  ─────────────────────────────────────────────────
```

- Eyebrow, headline, paragraph, stat row stacked vertically, centered, max 720px wide.
- Stat row: 4 cells, hairline divider above + below, before-values dim, after-values accent.
- Animation: single `<Reveal stagger={80}>` across all four children. No parallax, no pin, no scrub, no per-letter effects, no flashes, no auto-spawning chat bubbles, no diagnosis cards.

**Deleted from current Problem:** the `ChatColumn` auto-spawning WhatsApp bubbles + `MESSAGE_POOL`, the `TOOL_CARDS` (WhatsApp / Discord / Facebook / "just showing up"), the 3-beat pinned scrub (`ScrollTrigger.matchMedia`), the `enough-char` glyph animation + `ENOUGH.` finale, the red-flash radial overlay, the 6 `PROMISES` list, the StatusDot, the `ChapterMarker`, the bottom stats-bar cross-fade, the `MobileProblem` fallback (no longer needed — section is mobile-first by default), all CornerBrackets.

### 5.5 Solution (the **light break**)

`components/sections/Solution.tsx`, `data-palette="paper"`. Centerpiece. Real screenshots LEAD.

**Layout:** 4 alternating rows. Row N: screenshot on side `N % 2 === 1 ? left : right`, text on the other side. 12-col grid, screenshot col-span 5, text col-span 5, with col 1 + col 12 as breathing room.

**Content:**

```
─────────── paper / daylight ───────────

              [ how it works ]

   The match before the match — built.

  ┌──────────┬─────────────────────────┐
  │ SHOT 01  │ Join your community.    │
  │ feed     │ Campus, city, club.     │
  │          │ Public groups open in   │
  │          │ a tap.                  │
  └──────────┴─────────────────────────┘

  ┌─────────────────────────┬──────────┐
  │ Discover matches.       │ SHOT 02  │
  │ Every match from every  │ discover │
  │ squad, in one feed.     │          │
  └─────────────────────────┴──────────┘

  ┌──────────┬─────────────────────────┐
  │ SHOT 03  │ See the lineup fill.    │
  │ lineup   │ Watch positions claim   │
  │          │ themselves in real      │
  │          │ time.                   │
  └──────────┴─────────────────────────┘

  ┌─────────────────────────┬──────────┐
  │ Jump in.                │ SHOT 04  │
  │ One tap. Captain        │ jump in  │
  │ approves. Your face     │          │
  │ appears in the lineup.  │          │
  │ You show up ready.      │          │
  └─────────────────────────┴──────────┘
```

**Step verbs preserved from the current HowItWorks:** `Join` / `Discover` / `See` / `Jump in`.

**Screenshots:**
- Source pool: the 35 Feb 2026 captures, moved in Phase 1 from `/screens/` (repo root) to `docs/source-assets/screens/`.
- Crop: strip the existing black phone bezel — the bezel-on-paper reads poorly. Replace with a rounded-corner frame in CSS (`border-radius: 28px`), inner `1px solid var(--hairline)`, drop-shadow `0 30px 60px rgba(0,0,0,0.08)`.
- Normalize: single 9:19.5 aspect ratio. Largest export ~800px wide @2x.
- Format: commit **PNG sources only** under `public/screens/` as `01-community.png`, `02-discover.png`, `03-lineup.png`, `04-jump-in.png`. `next/image` automatically serves AVIF/WebP via the responses/format negotiation when `next.config.mjs` declares `images: { formats: ['image/avif', 'image/webp'] }`. No separate AVIF authoring required.
- Render via `next/image` with `loading="lazy"`, `fetchpriority="low"`, `sizes="(min-width: 1024px) 40vw, 80vw"`.
- **Choosing the 4 source captures:** deferred to implementation time. The mapping is `verb → screen the verb refers to`, not a fixed filename. Implementation TODO: walk `docs/source-assets/screens/` in the dev's eye-of-mind, pick one capture per verb (Join community / Discover matches / See the lineup fill / Jump in), crop, export to the four target filenames. Do **not** import a screen unless its content actually depicts the verb beside it — a community-creation screen does not match "Discover matches" no matter how nice it looks.

**Background:** `<PitchGrid parallax={0.2} />`, color = `--grid` (ink lines on paper).

**Animation:** each row is one `<Reveal stagger={80}>` (screenshot + text reveal in sequence).

**Section close:** 4–6vh gradient fade from `--bg` (paper) to next section's `--bg` (dark) so the dark Roadmap doesn't slam in at a hard edge. The fade is a static CSS gradient, so it is unaffected by `prefers-reduced-motion`.

**Body type token assignment on paper:** prose body uses `--text-dim` (`#5A5F57` on `#EDEFEA`, contrast ratio ~5.46:1, passes WCAG AA for body text ≥ 18px and large body at 17px). Headlines use `--text`. Eyebrows and captions use `--text-mute`. Verify with a contrast tool at PR time.

### 5.6 Roadmap — horizontal scrub timeline

`components/sections/Roadmap.tsx`, `data-palette="dark"`. Replaces the entire LockerRoom collage.

**Desktop behavior:**
- The section pins (GSAP ScrollTrigger, `pin: true`) for `+=200%` of viewport height.
- A horizontal strip of cards lives inside the pinned wrapper. Vertical scroll = strip translates horizontally (`xPercent: -100%` over scroll progress, scrub).
- Strip has `mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)` so cards fade out at the viewport edges.
- Three phase headers (`live at launch`, `coming next`, `on the horizon`) act as visual dividers between card clusters within the strip — mono, `--text-mute`, no specific dates.

**Cards:**
- ~220×280, dark `--surface` background, 1px `--hairline` border, rounded `12px`.
- Each: sequence number (`01`, `02`, …) in mono · feature name in display · status pill (`[ live at launch ]` / `[ coming next ]` / `[ on the horizon ]`).
- Hover **or** keyboard focus → a stable detail panel slides into view **below the strip** (not a tooltip — a dedicated readable region in the lower half of the pinned viewport). Panel shows feature name, 2-sentence summary, 2–3 bullets, status pill.
- Leaving the card collapses the panel after 300ms.
- **Pinning behavior gated by hover capability** (`@media (hover: hover)`):
  - On true hover devices (mouse): hover opens, leaving closes after 300ms, clicking pins the panel open (click again unpins).
  - On touch devices wide enough to land on the desktop branch (e.g., iPad in landscape ≥ 1024px wide): tap opens **and pins** the panel; tap a different card switches; tap outside the strip closes.

**Mobile behavior (≤ 1023px):**
- Scroll-jacking **off**. No pin.
- Strip becomes a vertical stack grouped by phase headers.
- Every card is expanded inline — no hover state needed.

**Reduced-motion:**
- Pin + scrub disabled even on desktop.
- Strip becomes a native `overflow-x: auto` scrollable region with CSS scroll-snap.

**Content (preserved from current LockerRoom; dates stripped; inlined here so it survives the Phase 1 deletion of `LockerRoom.tsx`):**

| Seq | Phase | Name | Summary | Bullets |
|---|---|---|---|---|
| 01 | Live at launch | **Football pickup** | The day-one promise: organize and discover pickup football across formats. | • 5v5, 7v7, 9v9, 11v11 • One-tap join • Visual lineup |
| 02 | Live at launch | **Communities** | Join the squads that match how you actually play — campus, city, club, workplace. | • Public groups open in one tap • Private groups gated by admin approval • One feed across all your groups |
| 03 | Live at launch | **Live lineups** | The signature surface. Watch positions fill in real time before kickoff. | • Real-time roster • Formation-aware (4-3-3, etc.) • Captain approves joins |
| 04 | Coming next | **Tournaments** | Run complete tournament brackets inside your community — no spreadsheets. | • Single-elim, double-elim, round-robin • Auto-seeding from match history • Live bracket everyone can watch • Shareable finals poster |
| 05 | Coming next | **Match chat** | In-app messaging tied to the match, not the squad. No more buried plans, no more switching apps. | • Conversation lives inside the match • Auto-archive after final whistle • Mentions + reactions |
| 06 | On the horizon | **More sports** | The same visual lineup, community, and match tools — coming to the sports your people actually play. | • Basketball (3v3, 5v5) • Handball (7v7) • Padel · Tennis · more |
| 07 | On the horizon | **More cities** | After Ben Guerir: the cities your community lives in. | • Player-requested city activation • Local admin onboarding |
| 08 | On the horizon | **Player ratings** | Lightweight per-match peer ratings — captain reliability, sportsmanship, skill. Opt-in. | • Post-match prompt only • Aggregated trends, never single-game scores • Players control visibility |

This table is the source of truth for Phase 2's Roadmap implementation — there is no need to read deleted `LockerRoom.tsx` from git history.

### 5.7 Launching-soon — the lime panel

`components/sections/LaunchingSoon.tsx`, `data-palette="lime"`. The one loud beat. ~90vh.

**Layout:** centered column, generous whitespace.

**Content:**

```
              [ summer · ben guerir ]                 ← mono, --text-mute
                                                       (noun form here; Hero uses
                                                       verb form "launching this
                                                       summer" — both intentional,
                                                       not drift)

         Doors open this summer.                      ← H1 display, ink

  We're in the final stretch. Be there when           ← body, --text-dim
  the first match goes live.                            (ink on lime)

       ┌───────────────────────────────┐
       │ your@email.com   [ Notify → ] │              ← NotifyForm (lime)
       └───────────────────────────────┘                source="launch"
```

**Background:** `<PitchGrid parallax={0.3} />` in `--grid` (darker ink lines on lime).

### 5.8 Stay-connected — the close

`components/sections/StayConnected.tsx`, `data-palette="dark"`. Quieter than the lime — this is "and one more thing."

**Layout:** two equal columns on desktop, stacked on mobile.

```
                  [ stay in the loop ]

         Two ways to ride along.

  ┌──────────────────────────┐   ┌──────────────────────────┐
  │ Get the launch email.    │   │ Follow along.            │
  │                          │   │                          │
  │ [ your@email  Notify → ] │   │ Instagram · TikTok · X   │
  └──────────────────────────┘   └──────────────────────────┘
```

- Left card: `<NotifyForm variant="dark" source="close" />`.
- Right card: three social links, each an `<a>` with lucide-react icon + label, opens in new tab.
- Faint `<PitchGrid />` at ~5% opacity, **no** parallax (the close should feel still).
- Social handles ship as `[INSTAGRAM_URL]`, `[TIKTOK_URL]`, `[X_URL]` placeholders — user provides real handles before deploy.

### 5.9 Footer

`components/sections/Footer.tsx`, `data-palette="dark"`. Single row.

```
───────────────────────────────────────────────────────────────────
 SportTimes      Privacy · Terms · contact@…       IG · TT · X
───────────────────────────────────────────────────────────────────
```

- Wordmark left, link cluster center, social icons right.
- All `--text-mute`, no flourish.
- Links point to the **App Router routes**: `/privacy` (`app/privacy/page.tsx`) and `/terms` (`app/terms/page.tsx`) — both already exist and are retained, refreshed in Phase 1 to use the new tokens (drop the legacy `data-palette="hero"`, switch to `data-palette="dark"`).
- The standalone `public/privacy.html` and `public/terms.html` are kept on disk (per user preference to "preserve" them) but are **not linked from anywhere**. They are functionally redundant with the App Router routes; future cleanup can decide whether to delete the duplicates. Spec does not link to `.html` paths.
- Contact email: placeholder (`contact@…`) until user provides.

---

## 6. NotifyForm — the reusable email-capture unit

`components/ui/NotifyForm.tsx`. **Rendered in 3 places**: Launching-soon (`source="launch"`), Stay-connected (`source="close"`), and the Sticky Mobile sheet (`source="sticky-mobile"`).

The Hero `Get notified` CTA does **not** render a NotifyForm — it scroll-anchors to the Stay-connected form. The Nav `Get notified` CTA behaves the same way.

Variants: `dark` / `lime` — auto-detected from nearest `data-palette` ancestor.

### 6.1 Submission flow

Submits via fetch (AJAX, no page redirect) to Formsubmit:

```ts
POST https://formsubmit.co/ajax/<FORMSUBMIT_EMAIL>
Content-Type: application/json
Accept: application/json
Body: {
  email,
  source,                          // "hero" | "launch" | "close" | "sticky-mobile"
  _subject: `SportTimes notify · ${source}`,
  _captcha: "false",
  _honey: ""                       // honeypot — bots fill this, real users don't
}
```

`<FORMSUBMIT_EMAIL>` placeholder filled at deploy time via `NEXT_PUBLIC_FORMSUBMIT_EMAIL` env var.

**Public-exposure caveat:** because the variable is prefixed `NEXT_PUBLIC_`, the email lands in the client JS bundle and is scrapeable. This is by design for Formsubmit's AJAX endpoint. If the user prefers the email obscured, switch to the random-token endpoint Formsubmit generates after the first verified submit (`https://formsubmit.co/ajax/<token>` instead of `…/<email>`) and put the token in the env var. This is a 1-line change at deploy time; spec ships with the email variant for simplicity.

### 6.2 Form states

| State | UI |
|---|---|
| `idle` | input + button enabled |
| `loading` | button shows spinner, input disabled, sr-only "submitting…" |
| `success` | input + button replaced by ✓ + *"You're on the list. We'll email you when doors open."* |
| `error` | inline error below input: *"Something went wrong. Try again?"* + retry |
| `invalid` | client-side regex check, red hairline + inline *"That doesn't look right."* |
| `duplicate` | shown as `success` to avoid leaking signup state (Formsubmit doesn't dedupe — accepted by design) |

Framer Motion `<AnimatePresence mode="wait">` handles state-to-state transitions (200ms opacity fade only — no slide, no spring).

### 6.3 Spam mitigation

- Honeypot `_honey` text input (hidden via `display:none`, `tabindex={-1}`, `aria-hidden="true"`). Bots fill it; submissions with non-empty `_honey` are dropped server-side by Formsubmit.
- Client-side rate limit: one submission per 5s (kept in component state).

### 6.4 Accessibility

- `<label>` linked to input via `htmlFor` (visually hidden, sr-only).
- `aria-live="polite"` region announces state changes.
- On submit success, focus moves to the success message.
- Inputs honor `prefers-reduced-motion` — transitions become instant.

---

## 7. Sticky mobile CTA

`components/ui/StickyMobileCTA.tsx`. Mobile only (hidden `≥ lg`).

- Fixed bottom, full-width, `data-palette="lime"` background, dark text: `Get notified`.
- Two IntersectionObservers govern visibility:
  - **Appears** when Hero's bottom sentinel leaves the viewport (Hero's bottom 1px row, `rootMargin: 0px`, `threshold: 0`).
  - **Disappears** when Footer's top sentinel enters the viewport (Footer's top 1px row, `rootMargin: 0px`, `threshold: 0`).
  - In the gap between the two, the CTA is visible.
- Slides in from below by 100%, 240ms ease-out. Under `prefers-reduced-motion`, appears/disappears instantly without slide.
- Tap → opens an inline overlay sheet (not a modal) containing `<NotifyForm variant="lime" source="sticky-mobile" />`. Backdrop is `rgba(11,13,16,0.6)`. Tap backdrop to close, or swipe sheet down.

---

## 8. Quality floor

### 8.1 Accessibility

- Tap targets ≥ 44×44px throughout. Verified manually on form submit, social links, Nav CTA, Sticky CTA.
- Visible focus rings: `outline: 2px solid var(--accent); outline-offset: 2px;` — works across all three palettes (lime on dark, ink on paper, ink on lime).
- Never `outline: none` without a replacement.
- Color contrast ≥ AA: body type on paper (`#5A5F57` on `#EDEFEA` ≈ 5.2:1, passes), ink on lime (`#0B0D10` on `#C6F24E` ≈ 15:1, passes), all dark-section combos already pass.

### 8.2 Performance

- LCP < 2.5s: Hero text + chalk pitch markup are inline server-rendered, no JS-blocked first paint. `<PitchFill>` is `next/dynamic` with `ssr: false`, fires after `window.load + 400ms` or scroll-into-view (first wins, see §5.3).
- CLS ≈ 0: every section has explicit `min-h` token, all fonts via `next/font` with `display: swap` (`adjustFontFallback` defaults to `true` for Google fonts — no explicit ceremony needed).
- Below-fold sections code-split via `next/dynamic` — already in place in `app/page.tsx`, preserved.
- All `/public/screens/` images: commit PNG sources, served via `next/image`. `next.config.mjs` declares `images: { formats: ['image/avif', 'image/webp'] }` so the framework negotiates AVIF/WebP at request time. `loading="lazy"`, `fetchpriority="low"`.
- `@react-three/fiber`, `@react-three/drei`, `three` removed from `package.json` in Phase 1.
- **Verification mechanism:** at the end of Phase 2, run `npm run build && npx lighthouse http://localhost:3000 --only-categories=performance --preset=mobile --view`. Acceptance: Performance score ≥ 90, LCP < 2.5s. If not, debug before declaring Phase 2 done.

### 8.3 SEO + social

- `<title>`: `"SportTimes — The match before the match"`.
- `<meta name="description">`: `"The app that turns group-chat chaos into a confirmed 11-a-side. Launching this summer in Ben Guerir."`.
- OG image: `public/og/sporttimes-og.png`, 1200×630. **Production mechanism:** a hidden Next.js route `app/og-preview/page.tsx` renders the final 11/11 PitchFill state with the wordmark overlay (no animation, no scroll, exact OG dimensions). A Node script `scripts/render-og.ts` boots Playwright, opens the dev server at `http://localhost:3000/og-preview`, screenshots the viewport at 1200×630, and writes the PNG to `public/og/sporttimes-og.png`. Run on demand: `npm run render-og` (added to `package.json` scripts). The output PNG is committed to the repo; the script is rerun only when the OG visual changes. Playwright is added as a `devDependency`.
- `apple-app-site-association`: untouched (already configured).

### 8.4 Build hygiene

- `npm run lint` passes with zero warnings.
- `npx tsc --noEmit` passes.
- No `console.*` calls in production code.
- No `any` types in new code.

---

## 9. Phasing + checkpoint

### Phase 1 — Foundation + opening half

A single mergeable PR delivering, in roughly this order:

1. **Tokens + type:** rewrite `app/globals.css` with the three palette sets from §4.2 and the type system from §4.3. Update font fallback chains. Add `next/font` Space Grotesk + Inter + Space Mono loaders in `app/layout.tsx`.
2. **Dependency surgery:** `npm uninstall @react-three/fiber @react-three/drei three`. Verify `package.json` and `package-lock.json` updated.
3. **Delete the deletion list** (§4.6) — all files listed, including `Download.tsx`, `Nav.tsx` (the old one in `components/ui/`), `MagneticButton.tsx`, the entire `components/three/` directory, and the empty `public/models/` + `public/textures/` directories.
4. **Move source screenshots:** `git mv screens/ docs/source-assets/screens/` to clean up repo root.
5. **Rewrite `app/page.tsx`:** new section order. For sections that don't yet exist (Roadmap, LaunchingSoon, StayConnected, Footer), use **height-preserving placeholder components** (`min-h: 100vh`, empty `data-palette="dark"` blocks with a single mono "// Phase 2" label) so the page renders end-to-end and the checkpoint is walkable.
6. **Prune `lib/constants.ts`:** drop `COLORS` and `CHAPTERS`; keep `APP_NAME`, `APP_NAME_DISPLAY`, `APP_LOCATION`, `APP_TIMEZONE`.
7. **Refresh `app/privacy/page.tsx` and `app/terms/page.tsx`:** change `data-palette="hero"` → `data-palette="dark"`, swap any inline hex colors for tokens. No content changes.
8. **Motion primitives:** `<Reveal>`, `<Parallax>`, `<PitchGrid>` in `components/ui/`.
9. **Signature animation:** `<PitchFill>` (§5.3).
10. **Sections (Phase 1 set):** `Nav.tsx` (§5.1), `Hero.tsx` (§5.2), `Problem.tsx` (§5.4), `Solution.tsx` (§5.5).
11. **Screenshots:** crop 4 from `docs/source-assets/screens/`, export to `public/screens/01-community.png` … `04-jump-in.png` per §5.5.
12. **Configure `next.config.mjs`:** add `images: { formats: ['image/avif', 'image/webp'] }`.
13. **Build green:** `npm run lint && npx tsc --noEmit && npm run build` must all pass before PR open.

### Checkpoint

User runs `npm run dev`, walks the page in a browser, gives notes. Phase 2 does not start until user signs off on Phase 1 in-browser.

### Phase 2 — Back half + finishing

A second PR delivering:

1. **Dependency add:** `npm install lucide-react`. Add `playwright` as a `devDependency`.
2. **`NotifyForm`** (§6) — built first since 3 sections consume it.
3. **Sections:** `Roadmap.tsx` (§5.6), `LaunchingSoon.tsx` (§5.7), `StayConnected.tsx` (§5.8), `Footer.tsx` (§5.9). Replace the Phase 1 placeholders in `app/page.tsx`.
4. **Sticky Mobile CTA** (§7).
5. **OG image production:** `app/og-preview/page.tsx` + `scripts/render-og.ts` + `npm run render-og` script + commit the resulting PNG to `public/og/`.
6. **Meta tags:** `<title>`, description, OG/Twitter meta in `app/layout.tsx`.
7. **Quality floor verification** (§8) — manual focus-ring sweep, manual tap-target sweep, Lighthouse run with documented score.
8. **Build green:** lint + tsc + build all pass.

---

## 10. Placeholders requiring user input before deploy

| Placeholder | Where | Filled by |
|---|---|---|
| `NEXT_PUBLIC_FORMSUBMIT_EMAIL` | env var, used by NotifyForm | user, deploy time |
| `[INSTAGRAM_URL]` | Stay-connected + Footer | user |
| `[TIKTOK_URL]` | Stay-connected + Footer | user |
| `[X_URL]` | Stay-connected + Footer | user |
| `contact@…` | Footer | user |
| 4 chosen screenshots | `public/screens/01-community.png` … `04-jump-in.png` | implementation (chosen + cropped from `docs/source-assets/screens/`) |

Spec ships with placeholders; site builds and runs end-to-end with them, just doesn't submit or link to anything real.

---

## 11. Out of scope (reaffirmed)

Anything not explicitly listed above is **not** part of this work. In particular: no voting, no PostHog, no Supabase, no API routes, no countdown timer, no language switcher, no dark/light toggle, no cookie banner, no email-list double-opt-in, no automatic launch announcement email.
