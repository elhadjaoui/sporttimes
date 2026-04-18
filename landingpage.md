Build a cinematic, award-worthy landing page for a mobile sports 
coordination app called [APP_NAME]. The page must feel like a hybrid 
of three specific references, all of which you should treat as the 
aesthetic ceiling:

  1. dylanbrouwer.design — for the showreel hero, oversized editorial 
     typography, and confident whitespace
  2. nova-mars-exploration.webflow.io — for chaptered storytelling, 
     preloader, pinned sections with eyebrow labels, and a single 
     persistent 3D hero object that evolves through the scroll
  3. ousmaneballondor.fr — for sports-journey storytelling, numbered 
     chapter navigation, stat reveals, grain-heavy cinematic mood, 
     and photo-collage chapter intros

This is not a "SaaS landing page." It is a scroll-driven visual 
narrative that happens to end in an app download.

========================================
TECH STACK (LOCKED)
========================================
- Next.js 14+ (App Router) + TypeScript
- React Three Fiber + @react-three/drei for the persistent 3D scene
- GSAP + ScrollTrigger for pinned sections and scroll-linked timelines 
  (use GSAP here, not Framer Motion — GSAP is better for the pinned 
  chapter scrubbing this design demands)
- Framer Motion for component-level micro-interactions (hover, tap, 
  card lift, menu reveals) only
- Lenis (@studio-freight/lenis) for smooth scroll — mandatory
- Tailwind CSS for styling
- next/font for self-hosted fonts

========================================
TYPOGRAPHY (LOCKED)
========================================
- Display: a bold condensed sans in the family of Druk Wide, Migra 
  Extrabold, or PP Editorial New Ultrabold. Use via next/font. 
  Fallback: Anton from Google Fonts.
- Body: a clean neo-grotesque — Inter or Geist.
- Mono accent: JetBrains Mono or Geist Mono for eyebrows, chapter 
  numbers, timestamps, and technical labels.
- Headlines are ALL CAPS, tight letter-spacing (-0.02em), line-height 
  0.9. Size: clamp(4rem, 12vw, 11rem).
- Subheadlines are mixed case, regular weight, line-height 1.2, 
  max-width 50ch.
- Mono labels are tiny caps, letter-spaced (+0.15em), 11–12px, 
  accent color.

========================================
COLOR SYSTEM (LOCKED)
========================================
- Background base: #050505 (near-black, not pure black — warmer)
- Text primary: #F5F5F0 (warm off-white, not pure white)
- Text muted: rgba(245, 245, 240, 0.6)
- Primary accent: #D4FF3A (lime-yellow) — used sparingly, only for 
  eyebrows, active states, the CTA buttons, and the single glowing 
  empty slot on the pitch
- Sport accent colors (appear in their respective chapters):
  • Football chapter: deep pitch green #0F2E1A with lime highlights
  • Basketball chapter: burnt orange #FF6B1A on warm wood-brown 
    background #1A0F08
  • Handball chapter: electric cyan #00E5FF on deep navy #050A1F
- Grain overlay on every section: a subtle noise texture at 
  opacity 0.04, blend mode overlay. Non-negotiable — this is what 
  gives all three reference sites their cinematic feel.

========================================
LAYOUT GRID
========================================
- 12-column grid, 24px gutters desktop, 16px mobile
- Max content width 1440px
- Generous top/bottom padding per section: clamp(8rem, 14vh, 12rem)
- Asymmetric layouts by default — avoid centered-everything. Text 
  blocks often sit in columns 2-7 or 6-11, not 1-12.

========================================
PRELOADER (REQUIRED — NOVA PATTERN)
========================================
- Full black screen on first load.
- Centered: mono text "LOADING LINEUP..." with a percentage counter 
  animating 0 → 100 (simulated, 2 seconds).
- Below counter: a thin horizontal line that fills with lime-yellow 
  from left to right as the percentage climbs.
- When complete, text swaps to "ENTER" as a pill button. User clicks 
  to enter (Nova pattern — don't auto-dismiss).
- On click: the black screen splits vertically down the center and 
  slides open like curtains, revealing the hero. Duration 1s, 
  eased with GSAP's expo.inOut.

========================================
NAVIGATION (TOP, FIXED, MINIMAL)
========================================
- Top-left: logo (just text mark "[APP_NAME]" in display font, small)
- Top-center: mono timestamp showing user's current local time, 
  updating live every second (e.g., "CASABLANCA · 14:32 CET"). 
  Borrowed from Dylan's site.
- Top-right: menu button as a mono label "MENU" with an animated 
  underline. On click, a full-screen overlay slides in with chapter 
  jump links.

The full-screen menu overlay, when open:
- Background: #050505 with heavy grain
- Large chapter list with numbers: "01 THE PROBLEM", "02 HOW IT WORKS", 
  "03 FOOTBALL", "04 BASKETBALL", "05 HANDBALL", "06 WHAT'S COMING", 
  "07 DOWNLOAD"
- Each list item: chapter number in mono lime (small), chapter name 
  in display font (huge, ALL CAPS)
- On hover: the item scales slightly and the number slides left

========================================
SECTION 01 — HERO
========================================

Full viewport. The goal is a showreel-style opening that instantly 
communicates: "this is a serious sports app, and the lineup is the 
hero feature."

Layout:
- Centered 3D scene behind the text, dimmed with a radial vignette 
  (inner 0% opacity, outer 70% black). The 3D scene is a dark 
  football pitch at a low, cinematic angle — aerial but close, 
  maybe 15 degrees off-horizontal. Low-poly player silhouettes 
  stand in a 4-3-3 formation. One slot (a forward position) is 
  empty and pulses with a lime-yellow glow at 1.2s intervals. 
  Camera does a slow, automatic dolly-in plus 5-degree lateral 
  orbit on an infinite loop (25 second cycle).

- Grain overlay on top of the canvas.

Foreground (z-index above canvas):

Top eyebrow (mono, lime, tiny caps, positioned at top-left of the 
hero content block):
  "[ SPORTS COORDINATION × REIMAGINED ]"

Main headline (display, massive, positioned left-aligned in 
columns 2-9, line-height 0.9):
  "SEE THE
   LINEUP.
   JOIN THE
   MATCH."
Four lines stacked. Each line animates in on preloader exit with 
a GSAP mask reveal (y: 100% → 0%, stagger 0.08s, ease: expo.out).

Subheadline (body, positioned columns 2-6, below headline with 
40px gap, muted white):
  "Stop chasing group chats. See exactly who's playing, what 
  position, and how the team is shaping up — before you commit. 
  Football, basketball, handball. The way sports were meant to 
  be organized."

CTA row (below subheadline, 32px gap):
  - Primary: solid lime-yellow pill, black text "Download the app ↗"
    Hover: magnetic effect (button follows cursor with slight lag, 
    max offset 8px), subtle outer glow grows
  - Secondary: ghost button with 1px lime-yellow border, lime text 
    "See how it works" — smooth-scrolls to section 02 on click

Bottom-right of hero (mono, small, muted):
  "SCROLL TO EXPLORE"
  A thin vertical line below it, 40px tall, animating a lime-yellow 
  dot sliding down it on 2s loop.

Bottom-left of hero (mono, small, muted — Nova pattern):
  "[ CHAPTER 01 · WELCOME ]"

Hero locks for exactly 1 viewport height of scroll before section 
02 begins. No pin beyond that.

========================================
SECTION 02 — THE PROBLEM (OUSMANE CHAPTER PATTERN)
========================================

This section uses Ousmane's chapter intro pattern: numbered chapter 
marker, large chapter title, and a photo-collage transition.

Chapter marker (mono, lime, sticky top-left during section):
  "01 / THE PROBLEM"

Phase 1 (first viewport of section):
- Huge chapter title spans full width, two lines:
  "GROUP CHATS
   WEREN'T BUILT
   FOR THIS."
- Below, right-aligned in columns 7-12, a body paragraph in muted 
  white: "Every week, the same chaos. 47 unread messages. 'Who's 
  in?' 'Bring a ball.' 'Changed the time.' Nobody knows who's 
  actually playing until everyone shows up. Sometimes, half the 
  team doesn't."

Phase 2 (pinned scroll, 2 viewports tall):
- Section pins. As user scrolls, three overlapping phone mockups 
  fan out across the viewport showing chaotic chat screens 
  (designed to look deliberately overwhelming — too many messages, 
  scroll spam, missed replies).
- Simultaneously, on the right half, a clean 3D lineup begins to 
  materialize — one avatar fading in every ~15% of scroll progress 
  until all 11 are placed.
- As the lineup completes, the chat phones blur out and slide off 
  the right edge. The lineup moves to center.
- Final line of text appears (large display, centered, mask reveal):
  "THERE'S A BETTER WAY."
- Section unpins; user continues scrolling.

========================================
SECTION 03 — HOW IT WORKS (3-STEP HORIZONTAL SCRUB)
========================================

Chapter marker: "02 / HOW IT WORKS"

Section pins for 3 viewport heights. User scrolls vertically, content 
scrolls horizontally (GSAP ScrollTrigger with pin + horizontal scrub).

Three panels side by side, each full viewport wide:

Panel A — "JOIN A COMMUNITY"
- Mono label: "STEP 01"
- Display title: "JOIN A COMMUNITY"
- Body: "Campus, city, club, workplace, friend group. Find the 
  squads that match how you actually play."
- Visual: 3D stack of community cards floating in space, rotating 
  gently, one card pulling to the front as scroll enters this panel.

Panel B — "SEE THE LINEUP"
- Mono label: "STEP 02"
- Display title: "SEE THE LINEUP"
- Body: "Every match shows the pitch, the formation, and who's 
  already in. Instant clarity. No guesswork."
- Visual: camera flies into a pitch; 11 avatars populate position 
  by position, synced to horizontal scroll progress within the 
  panel.

Panel C — "JUMP IN"
- Mono label: "STEP 03"
- Display title: "JUMP IN"
- Body: "One tap. Captain approves. Your face appears on the 
  pitch. You're in."
- Visual: a single empty slot on the pitch fills with a user 
  avatar; a lime-yellow particle burst triggers at the moment 
  of placement.

Progress indicator fixed at the bottom during the pinned scroll:
- Three short horizontal lines in mono style, the active one filled 
  lime, others outlined. Sits bottom-center, 24px gap between lines.

========================================
SECTION 04 — THE SPORT CHAPTERS (PERSISTENT 3D + MORPH)
========================================

This is the centerpiece. It uses NOVA's persistent-object pattern: 
ONE 3D canvas stays mounted across three chaptered sub-sections. 
The ball in the center transforms sport to sport. The pitch 
beneath it transforms. The lighting transforms. The user feels 
like they're watching the same scene breathe through three 
identities.

Implementation:
- A single pinned container: 300vh of scroll distance, the canvas 
  stays pinned at 100vh viewport.
- GSAP ScrollTrigger scrub with a single master timeline. Master 
  progress value 0 → 1 maps to:
    0.00 – 0.30 = Football chapter (steady)
    0.30 – 0.40 = Football → Basketball morph
    0.40 – 0.63 = Basketball chapter (steady)
    0.63 – 0.73 = Basketball → Handball morph
    0.73 – 1.00 = Handball chapter (steady)
- During morph windows: pitch geometry crossfades, ball texture 
  crossfades, lighting color lerps, background gradient lerps, 
  camera does a 20-degree arc pan.
- During steady phases: a slow idle orbit (0.02 rad/s) keeps the 
  scene alive without being dizzying.

Each sport chapter overlays text (HTML absolutely positioned over 
canvas):

---------- FOOTBALL ----------
Chapter marker (top-left, sticky within the pinned section):
  "03 / FOOTBALL"

Layout: copy on right half (columns 7-11), 3D scene takes full 
background.

Eyebrow (mono, lime): "THE BEAUTIFUL GAME"

Display title (stacked, three lines):
  "ELEVEN.
   SEVEN.
   FIVE."

Body: "Pick your format. Tuesday pickup, Sunday league, or a 
proper cup final — every match gets its own lineup, its own 
formation, its own energy."

Stat block below body (three stats, mono labels, display numbers):
  2.4M   matches organized
  180+   formations supported
  45K    active pitches

Bottom of chapter, a line of small pill tags:
  [ 5V5 ]  [ 7V7 ]  [ 9V9 ]  [ 11V11 ]
These pills auto-cycle a highlight every 2.5 seconds. The active 
pill is filled lime-yellow, glows subtly, and scales to 1.05. User 
can hover to manually activate (auto-cycle pauses 6s after manual 
interaction).

---------- BASKETBALL ----------
Chapter marker: "04 / BASKETBALL"
Layout: copy on LEFT half (columns 2-6) — flipped from football 
to create rhythm.

Eyebrow: "RUN IT BACK"

Display title:
  "HOLD
   THE COURT."

Body: "Pickup runs. Rec leagues. Full-court organized ball. Call 
next, build your five, and lock in the game before you even 
leave the house."

Stats:
  890K   runs called
  12K    courts mapped
  3v3    to full court

Pill tags: [ 3V3 ]  [ 5V5 ]  [ HALF COURT ]  [ FULL COURT ]
Same auto-cycle behavior as football.

---------- HANDBALL ----------
Chapter marker: "05 / HANDBALL"
Layout: copy on right half again (columns 7-11).

Eyebrow: "FAST. PHYSICAL. ORGANIZED."

Display title:
  "SEVEN
   A SIDE.
   NO EXCUSES."

Body: "Club rosters, school teams, national leagues. Handball 
deserves real tools — proper formations, league-ready brackets, 
and the same visual lineup that makes football work."

Stats:
  120K   matches hosted
  600+   club teams
  7v7    formations native

Pill tags: [ 7V7 ]  [ CLUB TEAMS ]  [ LEAGUES ]  [ SCHOOL ]

A persistent sport indicator at top center during the entire 
pinned section:
  Three small mono pills in a row: "FOOTBALL · BASKETBALL · HANDBALL"
  The current chapter's pill is filled lime. As user scrolls between 
  chapters, the fill smoothly slides across using GSAP with a 
  layoutId-style morph.

========================================
SECTION 05 — WHAT'S COMING (CARD ORBIT, NOT TIMELINE)
========================================

Chapter marker: "06 / WHAT'S COMING"

Full viewport. Not a timeline. A loose floating constellation of 
5 cards in a 3D orbit around a central point.

Headline block (top of section, left-aligned columns 2-8):
  Eyebrow: "[ THE ROADMAP ]"
  Display title: "THE SEASON'S
                  JUST STARTING."
  Body (muted, shorter): "We're building the infrastructure for 
  amateur sports. Here's what's next."

Below the headline: a 3D card orbit taking remaining viewport.

Implementation:
- @react-three/drei <Html transform> components place actual HTML 
  cards in 3D space — keeps text crisp and accessible.
- 5 cards arranged in a loose constellation (not a rigid ring). 
  Some closer to camera, some farther, different tilt axes, slight 
  vertical offsets. Feels hand-placed, not algorithmic.
- Whole constellation slowly rotates on its Y axis (0.05 rad/s 
  idle). Mouse movement applies additional parallax (limit ±6%).
- On card hover (mouse enters card bounds): card lifts forward 
  (z-offset +0.8 units), scales to 1.08, lime-yellow glow appears 
  around its edges. Other cards dim to 50% opacity.

The 5 cards (no specific dates — these are phases, not deadlines):

CARD 1 — TOURNAMENTS
  Status pill: "COMING SOON" (lime)
  Icon: trophy outline
  Title: "TOURNAMENTS"
  Body: "Bracket generation. Automated scheduling. Live scoring. 
    Prize pools. Run your championship without a spreadsheet."

CARD 2 — TEAM STORE
  Status pill: "COMING SOON" (lime)
  Icon: jersey outline
  Title: "TEAM STORE"
  Body: "Custom kits. Team merch. Fundraising drops. Your community, 
    your brand, your gear."

CARD 3 — LIVE STATS
  Status pill: "IN DEVELOPMENT" (cyan)
  Icon: chart outline
  Title: "LIVE STATS & RANKINGS"
  Body: "Goal tracking. MVP voting. Season-long player rankings. 
    Earn your reputation on the pitch, not on the group chat."

CARD 4 — SPONSORED LEAGUES
  Status pill: "PLANNED" (muted white)
  Icon: handshake outline
  Title: "SPONSORED LEAGUES"
  Body: "Local businesses back community leagues. Play in branded 
    competitions with real stakes and real prizes."

CARD 5 — MORE SPORTS
  Status pill: "PLANNED" (muted white)
  Icon: grid + plus outline
  Title: "MORE SPORTS"
  Body: "Volleyball. Padel. Futsal. Cricket. One app, every game 
    you play."

Mobile fallback: the 3D orbit becomes a 2D staggered card scatter 
with Framer Motion float animations (y: [0, -8, 0] loops on 
different timings), keeping the "floating constellation" feel 
without GPU cost.

========================================
SECTION 06 — SOCIAL PROOF (OPTIONAL BRIDGE)
========================================

Short bridge section between roadmap and download.

Two infinite marquee rows moving in opposite directions, filled 
with community name pills: "m/The Campus", "m/Casablanca Sports", 
"m/Engineering School", "m/Friday Night Squad", "m/Rabat FC", 
"m/Agadir Hoopers", "m/HassanII Students", etc. 

Above marquees, centered eyebrow:
  "[ TRUSTED BY COMMUNITIES ACROSS THE REGION ]"

Below marquees, three mono stat counters (animate on in-view):
  45,000+    ACTIVE PLAYERS
  12,000+    MATCHES THIS MONTH
  28         CITIES LIVE

========================================
SECTION 07 — DOWNLOAD
========================================

Chapter marker: "07 / DOWNLOAD"

Full viewport, centered composition.

3D phone model floating dead center, slowly rotating on Y axis 
(15s per full rotation). Phone screen displays a rendered texture 
of the app's home feed (Discover Matches screen). Subtle lime-yellow 
rim light on the phone edges.

Above phone: massive display headline (mask reveal on in-view):
  "YOUR NEXT MATCH
   IS ALREADY HAPPENING."

Below phone: subheadline (muted): "You just need to open the app."

CTA row (centered, 32px gap):
  - App Store badge (official SVG, magnetic hover, lime glow)
  - Google Play badge (official SVG, same behavior)

Beside the badges, a QR code block:
  Small mono label above: "OR SCAN TO DOWNLOAD"
  QR code itself styled with lime-yellow on black

Bottom corner of section: mono text "AVAILABLE ON iOS AND ANDROID"

========================================
SECTION 08 — FOOTER
========================================

Minimal, three-row structure.

Top row:
  Left: logo mark + tagline in mono: "SPORTS COORDINATION × MADE VISUAL"
  Right: social icons (Instagram, TikTok, X, YouTube) — line-icon 
    style, hover scales to 1.15 and turns lime

Middle row: a giant display-size word spanning full width, almost 
marquee-scale (Ousmane's footer pattern — an emotional sign-off):
  "PLAY MORE."

Bottom row, split:
  Left: mono "© 2026 [APP_NAME] · MADE IN CASABLANCA"
  Right: mono links "PRIVACY · TERMS · PRESS · CONTACT"

========================================
ANIMATION PRINCIPLES (LOCKED)
========================================

1. Preloader locks initial access. User clicks ENTER to start.
2. All pinned sections use GSAP ScrollTrigger with scrub: true and 
   ease: "none" on the timeline itself. Easing goes on individual 
   tweens inside the timeline, not the scrub.
3. Text reveals: GSAP SplitText, mask-clip animation (y: 100% → 0%, 
   duration 0.8s, stagger 0.08s, ease: "expo.out"). Split by lines, 
   not characters (cleaner for display type).
4. Color interpolation during sport morphs uses R3F useFrame with 
   gsap.utils.interpolate() on color values — smoother than 
   three.js built-in lerp for this use case.
5. Framer Motion is used only for:
   - Button hover (scale 1.02, lime glow)
   - Card lift on hover (y: -4, scale: 1.03)
   - Menu overlay open/close (y: -100% → 0%)
   - Pill auto-cycle highlight (layoutId + layout transition)
6. Respect prefers-reduced-motion: disable ALL scroll-linked 3D 
   animation, disable morphs, replace with simple fade-in on 
   in-view. Keep the scene static, just not moving.
7. No auto-playing audio. No popups. No intrusive cookie banners 
   (use a minimal non-blocking toast at first visit).

========================================
PERFORMANCE (LOCKED)
========================================

- Single R3F <Canvas> spans sections 04 (sport chapters). Do NOT 
  mount/unmount canvases between sports.
- Separate <Canvas> for hero (section 01), roadmap orbit (section 05), 
  and download phone (section 07). Each lazy-loaded with next/dynamic 
  + ssr: false, suspended with a pulsing lime dot fallback.
- Use InstancedMesh for players, crowd, particles.
- Textures compressed (KTX2 / BasisU if possible, WebP minimum).
- Preload ONLY: display font, hero textures. Everything else loads 
  on approach.
- Mobile: detect GPU tier with @react-three/drei's 
  usePerformanceMonitor. Low tier → replace sport morph section with 
  a scroll-driven slideshow of pre-rendered video frames.
- Lighthouse targets: Performance 88+, Accessibility 100, SEO 100.
- LCP under 2.8s on 4G throttle. Initial JS bundle under 220kb 
  gzipped.

========================================
RESPONSIVE
========================================

Desktop (1280+): full experience as described.
Tablet (768–1279): 
  - Pinned scrub sections reduce pin distance by 30%
  - Horizontal scroll in section 03 converts to vertical stacked 
    panels with fade-in per panel
  - Card orbit flattens to a 2D staggered scatter with parallax
  - Menu overlay scales down, chapter numbers smaller
Mobile (<768):
  - Sport morph becomes a scroll-driven slideshow (still morphs but 
    with fewer intermediate frames, simpler lighting)
  - Hero text scales to clamp(3rem, 13vw, 5rem)
  - CTAs become sticky bottom bar after hero
  - Menu overlay becomes full-screen with larger tap targets
  - All 3D canvases respect <576px breakpoint by reducing pixel 
    ratio to 1 and polygon counts by 50%

========================================
DELIVERABLES
========================================

- Deployable Next.js project, ready for Vercel
- File structure:
    /app
      layout.tsx, page.tsx, globals.css
    /components
      /sections  (Hero, Problem, HowItWorks, SportChapters, 
                  WhatsComing, SocialProof, Download, Footer)
      /three     (HeroScene, SportMorphScene, OrbitScene, PhoneScene, 
                  shared materials)
      /ui        (MagneticButton, PillTag, ChapterMarker, 
                  ScrollIndicator, MenuOverlay, Preloader)
    /hooks       (useLenis, useScrollProgress, useGPUTier, 
                  useSplitText)
    /lib         (animations.ts, constants.ts, easings.ts)
- README documenting:
    - Setup (npm install, npm run dev)
    - Where to swap placeholder assets: hero pitch textures 
      (/public/textures/), 3D models (/public/models/), app 
      screenshots (/public/screens/), font files (/public/fonts/)
    - How to tune the sport morph ranges (single constants file)
    - Performance testing notes

Placeholder assets are acceptable during scaffolding:
- Use Drei primitives (Sphere, Plane, Box) for balls, pitch, phone
- Use placeholder dummy images from picsum.photos for app screens 
  and player avatars
- Use free CC0 fonts from Google Fonts matching the typography 
  spec until final fonts are licensed

========================================
BUILD ORDER (DO IN THIS SEQUENCE)
========================================

1. Scaffold project, install deps, set up Lenis + GSAP + R3F
2. Implement typography, color tokens, grain overlay, grid system
3. Preloader + navigation shell
4. Section 01 hero (highest-impact, highest-risk — nail it first)
5. Section 04 sport morph (second-highest risk — build the 
   persistent canvas and morph logic early)
6. Section 05 roadmap orbit
7. Sections 02, 03 (problem, how it works)
8. Section 07 download
9. Sections 06, 08 (social proof, footer)
10. Responsive pass
11. Performance pass
12. Accessibility pass

Do NOT skip steps 4 and 5 to "come back later." They set the 
technical ceiling for everything else — if the persistent canvas 
doesn't work cleanly, the whole design collapses.

Show me the file structure first. Then the preloader + nav + hero 
as a working standalone. Then we iterate section by section.