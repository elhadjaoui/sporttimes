# SportTimes Landing Page Design

## Overview

Pre-launch landing page for SportTimes — a mobile-first app that replaces WhatsApp/Discord chaos for amateur sports coordination with visual lineups.

**Goal:** Build hype, showcase the concept, drive social follows and app store anticipation.

**No email collection** — pure showcase with social CTAs.

---

## Target Audience

- Gen-Z and millennial amateur athletes in Morocco (Casablanca first)
- Football players frustrated with WhatsApp group coordination
- Campus sports communities

---

## Emotional Hooks (layered throughout)

1. **Frustration solved** — "No more WhatsApp chaos"
2. **FOMO** — "Be the first to play"
3. **Community belonging** — "Find your squad"

---

## Visual Direction

### Style: Glowing Neon + 3D Isometric

- **No app screenshots** — illustrations and visuals that communicate concepts
- Glowing orbs represent players
- 3D isometric pitch perspectives
- Neon yellow-green (#c8f542) on deep black (#0a0a0a)
- Energy trails, light effects, FIFA/sports broadcast aesthetic

### Design System (from existing app)

- Background: `#0a0a0a` (deep black)
- Surface: `#141414` (dark gray)
- Primary accent: `#c8f542` (neon yellow-green)
- Text: `#f0f0f0` (light gray)
- Typography: Outfit font, bold condensed headers
- Border radius: 16px for cards

---

## Page Structure

Full story scroll with **mixed horizontal + vertical scrolling**.

6 immersive sections, each full viewport.

---

## Section 1: Hero (Vertical)

**Layout:** Full viewport, centered content

**Elements:**
- Logo: "SPORTTIMES" in bold condensed type, neon yellow-green
- Headline: "STOP TEXTING. START PLAYING." (suggested copy — can be refined)
- Subheadline: "See who's in before you commit. Visual lineups for amateur football." (suggested copy)
- Hero Illustration: Animated 3D isometric pitch with glowing player orbs
- CTAs:
  - App Store "Coming Soon" badge
  - Play Store "Coming Soon" badge
- Scroll indicator: Animated down arrow

**Animations:**
- Player orbs glow/pulse
- Subtle floating motion on pitch
- Scroll indicator bounces

---

## Section 2: The Problem (Horizontal Scroll)

**Layout:** Full viewport, horizontal scroll through 4 pain cards

**Scroll behavior:** Vertical scroll triggers horizontal movement

**Cards:**
1. "The WhatsApp Chaos" — tangled message bubbles, notification overload
2. "Who's Actually Playing?" — question marks, ghosted messages
3. "Last-Minute Dropouts" — player silhouettes fading out
4. "No One Knows the Plan" — scattered people, no formation

**Visual style:**
- Dark cards with red/orange accent tints (problem = negative energy)
- Glowing elements maintain brand consistency
- Progress indicator showing which card is active

**Transition:** Final card fades/morphs into solution section

---

## Section 3: The Solution (Vertical)

**Layout:** Full viewport, split layout (can stack on mobile)

**Elements:**
- Headline: "SEE THE LINEUP. JOIN WITH ONE TAP."
- Left/Top: Large 3D isometric pitch with glowing player positions
- Right/Bottom:
  - "19/22" counter (animated)
  - Formation display (4-3-3)
  - "Your spot is waiting" text

**Animations:**
- Players appear one by one
- Orbs glow as they fill positions
- Counter increments in sync

---

## Section 4: How It Works (Horizontal Scroll)

**Layout:** Full viewport, horizontal scroll through 4 steps

**Scroll behavior:** Vertical scroll triggers horizontal movement

**Steps:**
1. "Join a Community" — glowing group icon, location pin (Casablanca/Campus)
2. "Find a Match" — calendar with highlighted date, field icons
3. "See Who's In" — 3D pitch filling with player orbs
4. "Show Up & Play" — football in motion, energy lines

**Visual style:**
- Number badges (01, 02, 03, 04) in neon yellow-green
- Glowing connecting line/path between steps
- Steps light up as user scrolls past

---

## Section 5: Features Grid (Vertical)

**Layout:** Full viewport, 2x3 grid (responsive: stacks on mobile)

**Features:**
1. **Visual Lineups** — See the formation in real-time
2. **Communities** — Campus groups, city squads, friend circles
3. **Match Types** — Team vs Team or pickup games
4. **Player Profiles** — Stats, feedback, reputation
5. **Notifications** — Never miss a match invite
6. **Share to Social** — Instagram-ready lineup graphics

**Visual style:**
- Dark cards with glowing neon icons
- Subtle hover/scroll reveal animations
- Icons in 3D isometric style with glow effects

---

## Section 6: Coming Soon + Social (Vertical)

**Layout:** Full viewport, centered content

**Elements:**
- Headline: "COMING SOON TO MOROCCO"
- Subheadline: "Casablanca first. Your city next."
- App Store badge (outlined/greyed with "Coming Soon" overlay)
- Play Store badge (outlined/greyed with "Coming Soon" overlay)
- Social links:
  - Instagram icon (glowing, links to profile)
  - TikTok icon (glowing, links to profile)
- "Follow for updates" text

**Footer:**
- Minimal: Privacy | Terms | © SportTimes 2026
- Dark, unobtrusive

---

## Technical Considerations

### Scroll Behavior

- Horizontal scroll sections (2 & 4) triggered by vertical scroll
- Use scroll-snapping for section boundaries
- Libraries to consider: GSAP ScrollTrigger, Locomotive Scroll, or native CSS scroll-snap

### Animations

- CSS animations for simple effects (pulse, glow)
- JavaScript/GSAP for scroll-triggered animations
- Optimize for performance (will-change, GPU acceleration)

### Responsive Design

- Mobile-first approach
- Horizontal scroll sections may simplify to vertical stack on small screens
- Touch-friendly interactions

### Assets Needed

- SVG illustrations for each section (or CSS/canvas-based)
- Glowing orb/player components (reusable)
- 3D isometric pitch illustration (SVG or CSS)
- App store badge assets
- Social icons (Instagram, TikTok)

---

## CTAs

| Location | CTA | Action |
|----------|-----|--------|
| Hero | App Store Coming Soon | Visual only (no link yet) |
| Hero | Play Store Coming Soon | Visual only (no link yet) |
| Section 6 | App Store Coming Soon | Visual only (no link yet) |
| Section 6 | Play Store Coming Soon | Visual only (no link yet) |
| Section 6 | Instagram | Links to Instagram profile (URL TBD) |
| Section 6 | TikTok | Links to TikTok profile (URL TBD) |

---

## Needs from User Before Implementation

- Instagram profile URL
- TikTok profile URL
- Final headline copy approval (or provide preferred text)

---

## Out of Scope

- Email waitlist collection
- Actual app screenshots
- Backend/API integration
- Multi-language support (single language for now)

---

## Success Criteria

- Page loads fast (<3s on 3G)
- Smooth scroll animations (60fps)
- Works on mobile and desktop
- Social links functional
- Communicates the app concept without showing UI
