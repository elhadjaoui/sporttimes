# Invite Link Fallback — Design

**Date:** 2026-07-11
**Status:** Approved for planning

## Problem

App invite links (e.g. `https://sporttimes.app/matches/{id}`) rely on iOS Universal Links to open the app. When a recipient doesn't have the app installed — or opens the link in an in-app browser (Instagram, WhatsApp) where Universal Links are unreliable, or on desktop — they currently hit a Next.js 404. We need a web fallback that explains what happened and points them at the app.

## Scope

### In scope
- Four invite URL shapes: `/matches/{id}`, `/teams/{id}`, `/invite/{code}`, `/community/{id}`
- One shared generic fallback UI (no per-invite personalization, no data fetch)
- Consistent visual language with the existing landing page (dark bg, lime accent, mono eyebrows)
- Store CTAs mirrored from the existing landing `Download` section, both marked **Soon**

### Out of scope
- API integration to fetch specific match/team details
- Android-specific behavior beyond showing the same "Soon" Play Store badge
- `assetlinks.json` / Android App Links config
- Deferred deep linking on the app side (app team owns this post-install)
- Any interactive account creation / waitlist form (not requested)

## Behavior

| Context | Result |
|---|---|
| iOS with app installed, tapped from Safari/Mail/Messages | Universal Links opens the app (already working via `apple-app-site-association`, `paths: ["*"]`) |
| iOS without app | Renders the fallback page |
| iOS with app installed, tapped inside an in-app browser (Instagram, WhatsApp) | Renders the fallback page — user can tap "Already have the app? Open it" to retry the URL as a user gesture |
| Desktop / Android | Renders the fallback page |

## Architecture

### Routes

Four thin Next.js App Router server components, each rendering the shared fallback:

```
app/
  matches/[id]/page.tsx      → <InviteFallback kind="match" />
  teams/[id]/page.tsx        → <InviteFallback kind="team" />
  invite/[code]/page.tsx     → <InviteFallback kind="invite" />
  community/[id]/page.tsx    → <InviteFallback kind="community" />
```

Each `page.tsx` also exports `metadata` with a kind-specific `<title>` and OG tags so link previews in messaging apps look clean.

The `[id]` / `[code]` params are **not** read on the server — they're not needed for the generic experience. They stay in the URL so the app can consume them after install.

### Shared component

`components/sections/InviteFallback.tsx` — a client component (needs the "Open it" click handler and matches the pattern used by other section components).

Props:
```ts
type Kind = 'match' | 'team' | 'invite' | 'community';
interface InviteFallbackProps { kind: Kind; }
```

Internally, a small `COPY` map keyed by `kind`:
```ts
const COPY: Record<Kind, { eyebrow: string; headline: string }> = {
  match:     { eyebrow: "You've been invited", headline: 'Someone saved a spot for you.' },
  team:      { eyebrow: "You've been invited", headline: 'Your team is on the app.' },
  invite:    { eyebrow: "You've been invited", headline: "You're one tap from the group." },
  community: { eyebrow: "You've been invited", headline: 'The community is waiting.' },
};
```

Sub-copy is identical across all four kinds:
> "SportTimes is launching in Ben Guerir this summer. Grab the app when it drops and this invite will open right up."

### Store badges

Import and reuse the existing `AppStoreBadge` and `PlayStoreBadge` from `components/sections/Download.tsx`. Currently they're private to that file — extract them into `components/ui/StoreBadges.tsx` and re-import from both `Download.tsx` and `InviteFallback.tsx` to avoid duplication.

Both badges show **Soon** in the fallback (the `PlayStoreBadge` already renders "Soon"; `AppStoreBadge` needs a `soon` prop or a "Soon" variant added to match).

### "Already have the app?" secondary link

Small subtle button under the store row. On click:

```ts
window.location.href = window.location.href;
```

Assigning to `location.href` from a click handler is a user gesture, which gives iOS a fresh chance to hand off to the app. If the app is installed and Universal Links are healthy, this opens the app; otherwise the same fallback page reloads (harmless).

### Layout

- Full viewport height, dark bg (`#050505`), no nav (keep it focused)
- Centered single column, max width ~640px
- Vertical rhythm: eyebrow → headline → sub-copy → store row → secondary link → back-to-landing footer link
- Reuse existing font variables (`--font-display`, `--font-mono`, `--font-body`) and lime color token (`--lime`)
- Respect `prefers-reduced-motion`; no gsap animations required (page is already static)

### Metadata / OG

Per-route metadata so shared links in messaging apps render nicely:

```ts
export const metadata = {
  title: "You've been invited — SportTimes",
  description: 'Open your invite in the SportTimes app.',
  openGraph: {
    title: "You've been invited",
    description: 'Open your invite in the SportTimes app.',
    type: 'website',
  },
  robots: { index: false, follow: false }, // invite URLs shouldn't be indexed
};
```

## File changes

**New:**
- `app/matches/[id]/page.tsx`
- `app/teams/[id]/page.tsx`
- `app/invite/[code]/page.tsx`
- `app/community/[id]/page.tsx`
- `components/sections/InviteFallback.tsx`
- `components/ui/StoreBadges.tsx` (extracted from `Download.tsx`)

**Modified:**
- `components/sections/Download.tsx` — remove inline `AppStoreBadge` / `PlayStoreBadge`, import from `components/ui/StoreBadges.tsx`

## Testing

- Visual check in `next dev`: hit `/matches/foo`, `/teams/foo`, `/invite/foo`, `/community/foo` — each renders the correct kind-specific headline
- Landing page (`/`) still renders correctly with badges pulled from the new shared module
- Mobile viewport: layout collapses cleanly, badges wrap
- "Already have the app? Open it" reloads the page (can't fully test Universal Links from dev, but behavior is inspectable)
- Existing typography and grid tokens still resolve

## Non-goals / deferred

- Personalized invite preview (needs an API — defer until the app has a public invite metadata endpoint)
- Android App Links (`assetlinks.json`) — add when the Android app ships
- Analytics on fallback hits — could add later to measure invite→install funnel
- Localization (French/Arabic for the Ben Guerir launch market) — the current landing page is English-only, so we match that for now
