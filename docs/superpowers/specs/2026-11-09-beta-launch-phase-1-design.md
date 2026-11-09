# Beta launch, Phase 1: design

Date: 2026-11-09
Source: Phase 1 of `sporttimes-website-brief.md`

## Goal

Fix the site's indexing problems and make it accurate for the iOS TestFlight beta. Public launch is Q1 2027. The visual design system does not change.

## Decisions

| Topic | Decision |
|---|---|
| Sign-in described in the policy | Apple, Google, and a one-time code sent by email |
| Features that are not built | Legal pages describe only what exists today; features are added when they ship |
| Google Play tile | "Coming soon", no date |
| Sports | Only football is live. Basketball, volleyball, handball, padel, futsal and rugby stay on the page, each labelled "Soon" |
| `/beta` | A route handler, not a `next.config.mjs` redirect (see task 1.2) |
| Social image | `app/opengraph-image.tsx`, using `next/og`, which ships with Next |

## Work order

Branch: `feat/beta-launch-phase-1`. One commit per task. Lint and build pass before each commit.

### 0. Lint setup

ESLint is neither installed nor configured, so `next lint` cannot run.

- Add dev dependencies `eslint@^8` and `eslint-config-next@14.2.35`.
- Add `.eslintrc.json` extending `next/core-web-vitals`.
- `next build` runs lint once ESLint is installed and fails on errors. Fix existing errors in this commit so Vercel builds keep passing.

### 1.1 `lib/site.ts`

```ts
export const SITE_URL = 'https://www.sporttimes.app';
export const TESTFLIGHT_URL = 'https://testflight.apple.com/join/nzqBFXa8';
export const BETA_PATH = '/beta';
export const LAUNCH_LABEL = 'Q1 2027';
export const INSTAGRAM_URL = 'https://www.instagram.com/sporttimes.app/';
export const TIKTOK_URL = 'https://www.tiktok.com/@sporttimes.app';
export const CONTACT_EMAIL = 'contact@sporttimes.app';
```

- `components/sections/Footer.tsx` uses these for socials and contact email.
- `app/privacy/page.tsx` and `app/terms/page.tsx` use `CONTACT_EMAIL`.
- Remove `SOCIAL` and `STORE_LINKS` from `lib/constants.ts`. Both are unused placeholders.

### 1.2 `/beta`

`next.config.mjs` cannot import `lib/site.ts`: `allowJs` is off and Next 14 has no TypeScript config. A config redirect would need a second copy of the link.

- Add `app/beta/route.ts` with a `GET` handler returning `NextResponse.redirect(TESTFLIGHT_URL, 307)`.
- Set `export const dynamic = 'force-dynamic'`.
- Every beta button links to `BETA_PATH`, never to testflight.apple.com.
- Done when `curl -sI` on `/beta` returns 307 with the TestFlight `location`.

### 1.3 Copy

| Location | New text | Link |
|---|---|---|
| Hero primary button | `Join the iOS beta ↗` | `BETA_PATH` |
| Hero secondary button | `See how it works` (unchanged) | `#how-it-works`, keeping the smooth-scroll click handler |
| Hero, under the buttons | `iOS only for now. On Android? Join the waitlist.` | "Join the waitlist" links to `#download` |
| Download badge | `Public launch · Q1 2027` (from `LAUNCH_LABEL`) | |
| Download paragraph | `The iOS beta is open now. Public launch is planned for Q1 2027. Drop your email and we'll send one note on launch day.` (date from `LAUNCH_LABEL`) | |
| Under the waitlist form | `We'll only email you about the launch.` | |
| App Store tile | Top label `Q1 2027`, bottom label `App Store` | No link |
| Google Play tile | Top label `Coming soon`, bottom label `Google Play` | No link |
| Footer CTA | `Join the beta ↗` | `BETA_PATH` |
| Footer copyright | `© {current year} SportTimes · Made in Ben Guerir` | |
| Footer eyebrow | `The match before the match · {current year}` | |
| Footer stats | `01 Sport live`, `06 Coming soon`, `∞ Matches ahead` (third unchanged) | |
| Menu overlay (`MenuOverlay.tsx:171`) | `Public launch Q1 2027 · iOS beta open` (date from `LAUNCH_LABEL`) | |

Details:

- Remove `SoonPill` from `components/sections/Download.tsx`. It would repeat the tile labels. Tile `aria-label` and `title` become `App Store — Q1 2027` and `Google Play — coming soon`.
- `components/ui/StoreBadges.tsx` does not change.
- Beta buttons are plain text. No App Store badge artwork or TestFlight logo.
- The current year comes from a new `hooks/useCurrentYear.ts`: state starts at `2026` and an effect sets the real year after mount. This avoids a hydration mismatch and stays correct without a redeploy.
- Rename the section id from `how` to `how-it-works` at `HowItWorks.tsx:444`, `:937` and `:1105`, `Hero.tsx:153`, and `lib/constants.ts:28`.
- The `Get notified` eyebrow and progress label in `Download.tsx` stay. The section is still the waitlist.
- Add `status: 'live' | 'soon'` to the `Sport` type in `components/sections/Sports.tsx`. Football is `live`; the other six are `soon`. Show `Live` or `Soon` next to the formats line in all three layouts (`Sports.tsx:449`, `:858`, `:1099`), using the section's existing type styles.
- The `Built for football. Engineered for every team sport.` headline stays. It describes the product's direction, and the labels show what is available today.

### 1.4 Metadata and social image

Root layout (`app/layout.tsx`):

- `metadataBase: new URL(SITE_URL)`.
- `title` and `description` use the homepage values below.
- `openGraph` keeps only `type: 'website'` and `siteName: 'SportTimes'`.
- No canonical in the root layout; children would inherit it.

Per page, each with its own `alternates.canonical`, `openGraph.title`, `openGraph.description`, `openGraph.url`, and `twitter` (`card: 'summary_large_image'`, title, description):

| Page | Canonical | Title | Description |
|---|---|---|---|
| `app/page.tsx` | `/` | `SportTimes — Find and join football matches near you` | `See who's playing before you commit. SportTimes shows live lineups for football matches in your campus, city or club. iOS beta open now.` |
| `app/privacy/page.tsx` | `/privacy` | `Privacy Policy — SportTimes` | `How SportTimes handles your data — communities, matches, and lineups.` |
| `app/terms/page.tsx` | `/terms` | `Terms of Service — SportTimes` | `Terms of use for SportTimes — communities, matches, conduct, and liability.` |

`app/opengraph-image.tsx`:

- 1200x630 PNG, background `#050505`, accent `#D4FF3A`.
- Tagline `See the lineup. Join the match.`
- `public/screens/howitworks-lineup.png`, read from disk and embedded as a data URL.
- Uses the default `next/og` font, so no font file is added.
- Done when `og:image` starts with `https://www.sporttimes.app/` on each page.

### 1.5 robots and sitemap

- `app/robots.ts`: allow all, `sitemap: ${SITE_URL}/sitemap.xml`. The noindex fallback routes must stay crawlable so their tag is seen.
- `app/sitemap.ts`: exactly `/`, `/privacy`, `/terms` on `SITE_URL`.
- Confirm no `noindex` tag or `X-Robots-Tag` on those three pages in the production build.

### 1.7 Legal pages

Checked against `matchat-api`. Set "Last updated" on both pages to the date of the edit.

**`app/privacy/page.tsx`**

Sections are renumbered 1 to 8 after section 4 is removed.

Section 1, What we collect, replaced with three paragraphs:

> When you create a SportTimes account we store the minimum needed to run a match: your display name, your email address, the communities you join, and the matches you RSVP to. You sign in with Apple, Google, or a one-time code sent to your email. If you use Sign in with Apple and hide your email, we only see Apple's private relay address. We never ask for anything we don't need to put you on a pitch.
>
> We also store a profile photo if you add one, your preferred sport, your notification settings, a device token so we can send push notifications, and the ratings players give each other after a match.
>
> If you join the waitlist on our website, your email goes into a Google Form. We only use it to email you about the launch.

Section 3, Who sees what: keep the existing paragraph and add:

> We use a few service providers to run SportTimes: Supabase (sign-in and file storage), Firebase (push notifications), PostHog (product analytics, linked to your account ID), Render (app servers), and Vercel (website hosting and visitor analytics). Apple and Google handle sign-in if you choose them.

Remove section 4, Messages + match chat.

Your controls, first sentence replaced:

> Email contact@sporttimes.app to request a copy of your data.

The rest of the paragraph stays. Account deletion anonymises the profile when requested, which meets "within 30 days".

Security: remove the salted-hash sentence. `User.email` is stored as plain text and the backend has no hashing code.

Kids: remove the sentence about school-team admins vouching for younger members. No such check exists and accounts hold no age data. Keep the 13+ statements.

**`app/terms/page.tsx`**

- Section 1, The app: begin with `SportTimes is currently in beta. Features may change and data may be reset.`
- Section 6, Payments: replace the whole text with `The core app is free.`

## Founder actions

- **Task 1.6, Vercel domains:** set `www.sporttimes.app` as primary and redirect `sporttimes.app` to it. Today `https://sporttimes.app` returns 200, which creates the duplicate in Search Console. Vercel issues 308s, which Google treats like 301s, so the section 6 checks accept 301 or 308.
- **Waitlist test:** one clearly labelled test email is submitted through the live form and the founder confirms it reached the responses sheet. The site shows success whatever Google returns, so the sheet is the only proof.
- **Legal review:** someone checks the final text against Moroccan data-protection requirements.

## Open items, text left unchanged

These claims could not be verified. Each stays as written until the founder confirms it.

- Privacy, Security: `Data at rest is encrypted. Data in transit is TLS 1.3.`
- Privacy, Who sees what: the extended admin view of joined date and match history.
- Privacy, Who sees what: whether individual player ratings are visible to others, and to whom.

## Out of scope

- Phases 2 to 4.
- Invite fallback pages (`/invite`, `/matches`, `/teams`, `/community`), which keep their current store badges. They do pick up the new social image.
- Mobile app and backend code.

## Verification

- Before each commit: `npm run lint` and `npm run build`.
- Before merge: the section 6 `curl` checks against a local production build (`npm run start`), adapted for localhost.
- After deploy: section 6 checks against production, a click through every button on the page, and the waitlist test.
- Nothing is pushed or merged until the founder asks.
