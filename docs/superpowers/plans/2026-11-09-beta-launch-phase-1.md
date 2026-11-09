# Beta Launch Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the site's indexing problems and make it accurate for the iOS TestFlight beta.

**Architecture:** Links and dates live in `lib/site.ts`. Page metadata comes from one helper in `lib/metadata.ts`. `/beta` is a route handler so it can import the TestFlight constant. All other changes are copy edits in existing components.

**Tech Stack:** Next.js 14.2.35 App Router, React 18, TypeScript, styled-jsx, Tailwind.

**Spec:** `docs/superpowers/specs/2026-11-09-beta-launch-phase-1-design.md`

## Global Constraints

- Brand name in all new copy: `SPORTTIMES`. URLs stay lowercase.
- Do not change the visual design system. Do not touch mobile app or backend code.
- The only new dependencies are `eslint@^8` and `eslint-config-next@14.2.35`.
- One commit per task, on branch `feat/beta-launch-phase-1`. Stage only the files listed in the task.
- `npm run lint` exits 0 (warnings allowed) and `npm run build` succeeds before each commit.
- Do not push, merge, or deploy.
- The repo has no test runner and this plan adds none. Each task is verified with lint, build, `curl` and `grep`.
- Beta buttons link to `BETA_PATH`, never to testflight.apple.com, and are plain text with no App Store or TestFlight artwork.

## Pre-flight

- [ ] Run `git status --short`. Expected: only `?? sporttimes-website-brief.md`. If tracked files are modified, stop and ask the founder; task commits must not sweep in unrelated changes.
- [ ] Run `git branch --show-current`. Expected: `feat/beta-launch-phase-1`.

---

### Task 1: Lint setup (spec task 0)

**Files:**
- Create: `.eslintrc.json`
- Modify: `package.json`, `package-lock.json`, `components/sections/Problem.tsx:295`

**Interfaces:** Produces a working `npm run lint` for every later task.

- [ ] **Step 1: Install the dev dependencies**

Run: `npm i -D 'eslint@^8' eslint-config-next@14.2.35 --no-audit --no-fund`

- [ ] **Step 2: Create `.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 3: Confirm the known failure**

Run: `npm run lint`
Expected: one error at `components/sections/Problem.tsx:295` (`react/no-unescaped-entities`) and one warning at `components/sections/Sports.tsx:309`.

- [ ] **Step 4: Fix the error**

In `components/sections/Problem.tsx:295`, replace `See who's playing. See the lineup fill. Show up.` with:

```tsx
See who&apos;s playing. See the lineup fill. Show up.
```

Leave the `Sports.tsx:309` warning alone. It does not fail the build.

- [ ] **Step 5: Verify**

Run: `npm run lint && npm run build`
Expected: lint exits 0 with only the warning; build succeeds.

- [ ] **Step 6: Commit**

```bash
git add .eslintrc.json package.json package-lock.json components/sections/Problem.tsx
git commit -m "chore: add eslint with next core web vitals" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Single source of truth (spec 1.1)

**Files:**
- Create: `lib/site.ts`
- Modify: `lib/constants.ts:51-61`, `components/sections/Footer.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`

**Interfaces:** Produces `SITE_URL`, `TESTFLIGHT_URL`, `BETA_PATH`, `LAUNCH_LABEL`, `INSTAGRAM_URL`, `TIKTOK_URL`, `CONTACT_EMAIL`, all string constants exported from `@/lib/site`.

- [ ] **Step 1: Create `lib/site.ts`**

```ts
export const SITE_URL = 'https://www.sporttimes.app';
export const TESTFLIGHT_URL = 'https://testflight.apple.com/join/nzqBFXa8';
export const BETA_PATH = '/beta';
export const LAUNCH_LABEL = 'Q1 2027';
export const INSTAGRAM_URL = 'https://www.instagram.com/sporttimes.app/';
export const TIKTOK_URL = 'https://www.tiktok.com/@sporttimes.app';
export const CONTACT_EMAIL = 'contact@sporttimes.app';
```

- [ ] **Step 2: Remove the unused placeholders**

Delete the `SOCIAL` and `STORE_LINKS` exports (lines 51-61) from `lib/constants.ts`. Keep everything above them, and leave the file ending in a single newline after `] as const;`.

- [ ] **Step 3: Update `components/sections/Footer.tsx`**

After the `import { gsap } from 'gsap';` line add:

```tsx
import { CONTACT_EMAIL, INSTAGRAM_URL, TIKTOK_URL } from '@/lib/site';
```

Replace the social entries' `href` values:

```tsx
            {
              name: 'Instagram',
              href: INSTAGRAM_URL,
            },
            {
              name: 'TikTok',
              href: TIKTOK_URL,
            },
```

Replace `<CopyableEmail email="contact@sporttimes.app" />` with:

```tsx
<CopyableEmail email={CONTACT_EMAIL} />
```

- [ ] **Step 4: Update both legal pages**

In `app/privacy/page.tsx` and `app/terms/page.tsx`, add below the existing imports:

```tsx
import { CONTACT_EMAIL } from '@/lib/site';
```

In each file replace `href="mailto:contact@sporttimes.app"` with:

```tsx
href={`mailto:${CONTACT_EMAIL}`}
```

and replace the link text line `contact@sporttimes.app` with:

```tsx
{CONTACT_EMAIL}
```

- [ ] **Step 5: Verify**

Run: `grep -rn 'contact@sporttimes\|instagram.com\|tiktok.com' app components lib`
Expected: matches only in `lib/site.ts`.

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add lib/site.ts lib/constants.ts components/sections/Footer.tsx app/privacy/page.tsx app/terms/page.tsx
git commit -m "refactor: centralize site links and dates in lib/site" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: `/beta` redirect (spec 1.2)

**Files:**
- Create: `app/beta/route.ts`

**Interfaces:** Consumes `TESTFLIGHT_URL` from `@/lib/site`.

- [ ] **Step 1: Create `app/beta/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { TESTFLIGHT_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.redirect(TESTFLIGHT_URL, 307);
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run lint && npm run build`
Then start the server in the background with `npm run start`, and run:

```bash
curl -sI --retry 30 --retry-connrefused --retry-delay 1 http://localhost:3000/beta | grep -iE '^(HTTP|location)'
```

Expected:

```
HTTP/1.1 307 Temporary Redirect
location: https://testflight.apple.com/join/nzqBFXa8
```

Stop the server with `lsof -ti tcp:3000 | xargs kill`.

- [ ] **Step 3: Commit**

```bash
git add app/beta/route.ts
git commit -m "feat: add /beta redirect to TestFlight" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Launch copy and sports status (spec 1.3)

**Files:**
- Create: `hooks/useCurrentYear.ts`
- Modify: `components/sections/Hero.tsx`, `components/sections/Download.tsx`, `components/sections/Footer.tsx`, `components/ui/MenuOverlay.tsx`, `components/sections/HowItWorks.tsx`, `components/sections/Sports.tsx`, `lib/constants.ts:28`

**Interfaces:** Consumes `BETA_PATH`, `LAUNCH_LABEL` from `@/lib/site`. Produces `useCurrentYear(): number`.

- [ ] **Step 1: Create `hooks/useCurrentYear.ts`**

```ts
import { useEffect, useState } from 'react';

const BASELINE_YEAR = 2026;

// Set after mount so a page prerendered in an earlier year neither
// mismatches on hydration nor shows a stale year.
export function useCurrentYear() {
  const [year, setYear] = useState(BASELINE_YEAR);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return year;
}
```

- [ ] **Step 2: Rename the section id**

In `components/sections/HowItWorks.tsx`, replace all three `id="how"` (lines 444, 937, 1105) with `id="how-it-works"`.

In `lib/constants.ts:28`, replace `anchor: 'how',` with `anchor: 'how-it-works',`.

In `components/sections/Hero.tsx:153`, replace `document.getElementById('how')` with `document.getElementById('how-it-works')`.

- [ ] **Step 3: Update the Hero buttons**

In `components/sections/Hero.tsx`, add after the `scrollState` import:

```tsx
import { BETA_PATH } from '@/lib/site';
```

Replace the button group (lines 231-238) with:

```tsx
          <div className="hero-fade flex flex-col xl:flex-row xl:flex-wrap items-stretch xl:items-center gap-3 w-full xl:w-auto">
            <MagneticButton href={BETA_PATH} variant="primary">
              Join the iOS beta ↗
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              href="#how-it-works"
              onClick={scrollToHow}
            >
              See how it works
            </MagneticButton>
          </div>

          <p className="hero-fade font-body text-ink/65 text-sm mt-4">
            iOS only for now. On Android?{' '}
            <a
              href="#download"
              className="text-lime underline underline-offset-2"
            >
              Join the waitlist
            </a>
            .
          </p>
```

- [ ] **Step 4: Update `components/sections/Download.tsx`**

Add after the `EtherealShadow` import:

```tsx
import { LAUNCH_LABEL } from '@/lib/site';
```

Delete the whole `SoonPill` function (lines 11-34) and the `<SoonPill />` line inside `StoreBadge`.

Replace the banner comment `Store badges — both greyed with "soon" label. No dead links.` with `Store badges — greyed, status label only. No dead links.`

Replace ``title={`${ariaLabel} — coming soon`}`` with:

```tsx
title={ariaLabel}
```

Replace the paragraph body (lines 277-278) with:

```tsx
            The iOS beta is open now. Public launch is planned for{' '}
            {LAUNCH_LABEL}. Drop your email and we&apos;ll send one note on
            launch day.
```

Replace `<WaitlistForm source="download" />` with:

```tsx
          <WaitlistForm source="download" />

          <p
            style={{
              marginTop: 10,
              fontFamily: 'var(--font-body), Inter, system-ui, sans-serif',
              fontSize: 13,
              color: 'var(--muted)',
            }}
          >
            We&apos;ll only email you about the launch.
          </p>
```

Replace `Launching summer 2026` with:

```tsx
            Public launch · {LAUNCH_LABEL}
```

Replace the comment `Store badges — greyed, "soon" pill, no links` with `Store badges — greyed, no links`, and replace both `<StoreBadge>` elements with:

```tsx
            <StoreBadge
              ariaLabel={`App Store — ${LAUNCH_LABEL}`}
              topLabel={LAUNCH_LABEL}
              bottomLabel="App Store"
              Icon={AppleIcon}
            />
            <StoreBadge
              ariaLabel="Google Play — coming soon"
              topLabel="Coming soon"
              bottomLabel="Google Play"
              Icon={PlayIcon}
            />
```

- [ ] **Step 5: Update `components/sections/Footer.tsx`**

Replace the `@/lib/site` import with:

```tsx
import { useCurrentYear } from '@/hooks/useCurrentYear';
import {
  BETA_PATH,
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  TIKTOK_URL,
} from '@/lib/site';
```

Add as the first line inside `export default function Footer() {`:

```tsx
  const year = useCurrentYear();
```

Replace the eyebrow text `The match before the match · 2026` with:

```tsx
                The match before the match · {year}
```

Replace the first two stats:

```tsx
                <div className="footer-play-stat">
                  <span className="footer-play-stat-num">01</span>
                  <span className="footer-play-stat-label">Sport live</span>
                </div>
                <div className="footer-play-stat">
                  <span className="footer-play-stat-num">06</span>
                  <span className="footer-play-stat-label">Coming soon</span>
                </div>
```

Replace the CTA:

```tsx
              <a
                href={BETA_PATH}

                className="footer-play-cta"
              >
                Join the beta ↗
              </a>
```

Replace `© 2026 SPORTTIMES · Made in Ben Guerir` with:

```tsx
          © {year} SPORTTIMES · Made in Ben Guerir
```

- [ ] **Step 6: Update `components/ui/MenuOverlay.tsx`**

Add after the `getLenis` import:

```tsx
import { LAUNCH_LABEL } from '@/lib/site';
```

Replace line 171 with:

```tsx
                  <span className="text-lime/70">Public launch {LAUNCH_LABEL} · iOS beta open</span>
```

- [ ] **Step 7: Add sports status in `components/sections/Sports.tsx`**

Add `status` to the type and a label map:

```tsx
type Sport = {
  id: string;
  name: string;
  formats: string;
  status: 'live' | 'soon';
  Icon: IconType;
};

const STATUS_LABEL = { live: 'Live', soon: 'Soon' } as const;
```

Replace the `SPORTS` array:

```tsx
const SPORTS: Sport[] = [
  { id: 'football',   name: 'Football',   formats: '5v5 · 7v7 · 9v9 · 11v11', status: 'live', Icon: MdOutlineSportsSoccer     },
  { id: 'basketball', name: 'Basketball', formats: '3v3 · 5v5',               status: 'soon', Icon: MdOutlineSportsBasketball },
  { id: 'volleyball', name: 'Volleyball', formats: '4v4 · 6v6',               status: 'soon', Icon: MdOutlineSportsVolleyball },
  { id: 'handball',   name: 'Handball',   formats: '7v7',                     status: 'soon', Icon: MdOutlineSportsHandball   },
  { id: 'padel',      name: 'Padel',      formats: '2v2',                     status: 'soon', Icon: MdOutlineSportsTennis     },
  { id: 'futsal',     name: 'Futsal',     formats: '5v5',                     status: 'soon', Icon: MdOutlineSportsSoccer     },
  { id: 'rugby',      name: 'Rugby',      formats: '7s · 15s',                status: 'soon', Icon: MdOutlineSportsRugby      },
];
```

In the desktop layout, after the closing `</div>` of the `sports-node-format` element (line 450), add. It has no `formatRefs` entry on purpose, so the status stays visible while the formats animate in:

```tsx
                      <div
                        className={`sports-node-format ${sport.status === 'live' ? 'sports-node-status-live' : ''}`}
                      >
                        {STATUS_LABEL[sport.status]}
                      </div>
```

After the `.sports-node-format { ... }` CSS rule add:

```css
        .sports-node-status-live {
          color: ${LIME};
        }
```

The rule must come after `.sports-node-format` so its color wins.

In the second layout, after the formats `</span>` (line 859), add:

```tsx
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: sport.status === 'live' ? LIME : DIM,
                  }}
                >
                  {STATUS_LABEL[sport.status]}
                </span>
```

In the third layout, after the formats `</span>` (line 1100), add:

```tsx
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: sport.status === 'live' ? LIME : DIM,
                  }}
                >
                  {STATUS_LABEL[sport.status]}
                </span>
```

- [ ] **Step 8: Verify the copy**

Run: `grep -rnE "summer 2026|Summer 2026|Get notified ↗|© 2026|getElementById\('how'\)|anchor: 'how'|id=\"how\"" app components lib`
Expected: no matches.

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 9: Check the layouts visually**

Start the site with `npm run start` and open http://localhost:3000 at desktop width and at 390px wide. Confirm:

- The Hero fits on screen with the new Android line.
- "See how it works" scrolls to the section.
- Every sport shows `Live` or `Soon`, football in lime, and no label overlaps a neighbouring node or the centre.
- The Download tiles and footer read as in the spec.

If labels overlap, stop and report before adjusting the layout. Stop the server with `lsof -ti tcp:3000 | xargs kill`.

- [ ] **Step 10: Commit**

```bash
git add hooks/useCurrentYear.ts components/sections/Hero.tsx components/sections/Download.tsx components/sections/Footer.tsx components/ui/MenuOverlay.tsx components/sections/HowItWorks.tsx components/sections/Sports.tsx lib/constants.ts
git commit -m "feat: update site copy for the iOS beta and Q1 2027 launch" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Metadata and social image (spec 1.4)

**Files:**
- Create: `lib/metadata.ts`, `app/opengraph-image.tsx`
- Modify: `app/layout.tsx:58-71`, `app/page.tsx`, `app/privacy/page.tsx:4-8`, `app/terms/page.tsx:4-8`

**Interfaces:** Consumes `SITE_URL` from `@/lib/site`. Produces `HOME_TITLE`, `HOME_DESCRIPTION`, and `pageMetadata({ path, title, description }): Metadata` from `@/lib/metadata`.

- [ ] **Step 1: Create `lib/metadata.ts`**

```ts
import type { Metadata } from 'next';

const OG_IMAGE_PATH = '/opengraph-image';

export const HOME_TITLE =
  'SPORTTIMES — Find and join football matches near you';
export const HOME_DESCRIPTION =
  "See who's playing before you commit. SPORTTIMES shows live lineups for football matches in your campus, city or club. iOS beta open now.";

// A page that sets its own openGraph or twitter object replaces the
// parent's entirely, so the shared image has to be listed on each page.
export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      siteName: 'SPORTTIMES',
      images: [OG_IMAGE_PATH],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}
```

- [ ] **Step 2: Create `app/opengraph-image.tsx`**

```tsx
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'SPORTTIMES. See the lineup. Join the match.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const screenshot = await readFile(
    join(process.cwd(), 'public/screens/howitworks-lineup.png')
  );
  const screenshotSrc = `data:image/png;base64,${screenshot.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 96px',
          background: '#050505',
          color: '#F5F5F0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <div style={{ fontSize: 26, letterSpacing: 8, color: '#D4FF3A' }}>
            SPORTTIMES
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 28,
              fontSize: 76,
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            <span>See the lineup.</span>
            <span style={{ color: '#D4FF3A' }}>Join the match.</span>
          </div>
        </div>
        {/* The negative margin crops placeholder text off the top of the screenshot. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenshotSrc}
          alt=""
          width={370}
          height={777}
          style={{ marginTop: -104 }}
        />
      </div>
    ),
    size
  );
}
```

- [ ] **Step 3: Update `app/layout.tsx`**

Add below the existing `@vercel/analytics` import:

```tsx
import { HOME_DESCRIPTION, HOME_TITLE } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site';
```

Replace the `metadata` export with:

```tsx
export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  // Favicon + apple-touch icon are auto-wired via app/icon.png and
  // app/apple-icon.png — Next.js App Router detects them by filename.
  openGraph: {
    type: 'website',
    siteName: 'SPORTTIMES',
  },
};
```

- [ ] **Step 4: Update `app/page.tsx`**

Replace the first import block line `import dynamic from 'next/dynamic';` with:

```tsx
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
```

Add after the `Problem` import:

```tsx
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
});
```

- [ ] **Step 5: Update the legal page metadata**

In `app/privacy/page.tsx`, add `import { pageMetadata } from '@/lib/metadata';` below the imports and replace the `metadata` export with:

```tsx
export const metadata: Metadata = pageMetadata({
  path: '/privacy',
  title: 'Privacy Policy — SPORTTIMES',
  description:
    'How SPORTTIMES handles your data — communities, matches, and lineups.',
});
```

In `app/terms/page.tsx`, add the same import and replace the `metadata` export with:

```tsx
export const metadata: Metadata = pageMetadata({
  path: '/terms',
  title: 'Terms of Service — SPORTTIMES',
  description:
    'Terms of use for SPORTTIMES — communities, matches, conduct, and liability.',
});
```

- [ ] **Step 6: Verify**

Run: `npm run lint && npm run build`
Start the server in the background with `npm run start`, then run:

```bash
curl -s -o /dev/null --retry 30 --retry-connrefused --retry-delay 1 http://localhost:3000/
for p in / /privacy /terms; do echo "--- $p"; curl -s "http://localhost:3000$p" | grep -oE '<title>[^<]*</title>|<link rel="canonical"[^>]*>|<meta (property|name)="(og:title|og:image|twitter:image)"[^>]*>'; done
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' http://localhost:3000/opengraph-image
```

Expected:

- Each page has its own title and `og:title`.
- Canonicals are `https://www.sporttimes.app`, `https://www.sporttimes.app/privacy` and `https://www.sporttimes.app/terms`.
- `og:image` and `twitter:image` are `https://www.sporttimes.app/opengraph-image` on all three.
- The last line prints `200 image/png`.

Open http://localhost:3000/opengraph-image and confirm no "Additional notes" placeholder text is visible. Stop the server with `lsof -ti tcp:3000 | xargs kill`.

- [ ] **Step 7: Commit**

```bash
git add lib/metadata.ts app/opengraph-image.tsx app/layout.tsx app/page.tsx app/privacy/page.tsx app/terms/page.tsx
git commit -m "feat: add per-page canonicals, social tags and share image" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: robots and sitemap (spec 1.5)

**Files:**
- Create: `app/robots.ts`, `app/sitemap.ts`

**Interfaces:** Consumes `SITE_URL` from `@/lib/site`.

- [ ] **Step 1: Create `app/robots.ts`**

```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Create `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/privacy', '/terms'].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`
Start the server in the background with `npm run start`, then run:

```bash
curl -s --retry 30 --retry-connrefused --retry-delay 1 http://localhost:3000/robots.txt
curl -s http://localhost:3000/sitemap.xml
for p in / /privacy /terms; do curl -sI "http://localhost:3000$p" | grep -ic 'x-robots-tag'; curl -s "http://localhost:3000$p" | grep -ic 'noindex'; done
```

Expected: robots allows `/` and names `https://www.sporttimes.app/sitemap.xml`. The sitemap lists exactly three URLs on `www`. The loop prints `0` for every count. Stop the server with `lsof -ti tcp:3000 | xargs kill`.

- [ ] **Step 4: Commit**

```bash
git add app/robots.ts app/sitemap.ts
git commit -m "feat: add robots and sitemap" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Legal pages (spec 1.7)

**Files:**
- Modify: `app/privacy/page.tsx`, `app/terms/page.tsx`

**Interfaces:** Consumes `CONTACT_EMAIL` from `@/lib/site`.

- [ ] **Step 1: Get the edit date**

Run: `date '+%-d %B %Y'`. Use that value as `{EDIT_DATE}` in the next steps, written literally into the JSX.

- [ ] **Step 2: Update `app/privacy/page.tsx`**

Replace `Last updated · 21 April 2026.` with `Last updated · {EDIT_DATE}.`

Replace the body of section 1 with:

```tsx
          <Section title="1 · What we collect">
            <p>
              When you create a SPORTTIMES account we store the minimum needed
              to run a match: your display name, your email address, the
              communities you join, and the matches you RSVP to. You sign in
              with Apple, Google, or a one-time code sent to your email. If
              you use Sign in with Apple and hide your email, we only see
              Apple&rsquo;s private relay address. We never ask for anything
              we don&rsquo;t need to put you on a pitch.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              We also store a profile photo if you add one, your preferred
              sport, your notification settings, a device token so we can send
              push notifications, and the ratings players give each other
              after a match.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              If you join the waitlist on our website, your email goes into a
              Google Form. We only use it to email you about the launch.
            </p>
          </Section>
```

In section 3, after the existing `</p>`, add:

```tsx
            <p style={{ marginTop: '0.75rem' }}>
              We use a few service providers to run SPORTTIMES: Supabase
              (sign-in and file storage), Firebase (push notifications),
              PostHog (product analytics, linked to your account ID), Render
              (app servers), and Vercel (website hosting and visitor
              analytics). Apple and Google handle sign-in if you choose them.
            </p>
```

Delete section 4 (`4 · Messages + match chat`) entirely.

Replace the "Your controls" section with:

```tsx
          <Section title="4 · Your controls">
            <p>
              Email{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                style={{ color: 'var(--lime)', textDecoration: 'underline' }}
              >
                {CONTACT_EMAIL}
              </a>{' '}
              to request a copy of your data. Delete your account at any time
              — we purge your profile within 30 days, keeping only anonymized
              match stats so community averages stay accurate.
            </p>
          </Section>
```

Replace the "Security" section with:

```tsx
          <Section title="5 · Security">
            <p>Data at rest is encrypted. Data in transit is TLS 1.3.</p>
          </Section>
```

Replace the "Kids" section with:

```tsx
          <Section title="6 · Kids">
            <p>
              SPORTTIMES is 13+. We do not knowingly collect data from
              children under 13.
            </p>
          </Section>
```

Renumber the last two section titles to `7 · Changes` and `8 · Contact`.

- [ ] **Step 3: Update `app/terms/page.tsx`**

Replace `Last updated · 21 April 2026.` with `Last updated · {EDIT_DATE}.`

Replace the body of section 1 with:

```tsx
            <p>
              SPORTTIMES is currently in beta. Features may change and data
              may be reset.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              SPORTTIMES helps communities organize matches, visualize
              lineups, and coordinate players. We provide the software;
              communities run their own matches. We are not a party to any
              agreement you make with a community or its members.
            </p>
```

Replace the body of section 6 with:

```tsx
            <p>The core app is free.</p>
```

- [ ] **Step 4: Verify**

Run: `grep -nEi 'match.?chat|Settings → Data|phone number|salted|vouch|venue booking|kit store|tournament hosting|21 April' app/privacy/page.tsx app/terms/page.tsx`
Expected: no matches.

Run: `grep -c 'title="' app/privacy/page.tsx`
Expected: `8`.

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add app/privacy/page.tsx app/terms/page.tsx
git commit -m "fix: align privacy policy and terms with the current product" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Full local check and report

**Files:** none changed.

- [ ] **Step 1: Run the production build**

Run: `npm run lint && npm run build`, then start the server in the background with `npm run start`.

- [ ] **Step 2: Run the brief's checks that work locally**

```bash
curl -sI --retry 30 --retry-connrefused --retry-delay 1 http://localhost:3000/beta | grep -iE '^(HTTP|location)'
curl -s http://localhost:3000/ | grep -iE -o 'rel="canonical"[^>]*|og:image"[^>]*|<title>[^<]*|noindex'
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/sitemap.xml
curl -sI http://localhost:3000/privacy/ | grep -iE '^(HTTP|location)'
```

Expected: `/beta` returns 307 to TestFlight; the homepage has the www canonical and image, and no `noindex`; `/privacy/` redirects to `/privacy`.

- [ ] **Step 3: Click every button on the page**

At desktop width and at 390px: both Hero buttons, the Android waitlist link, the menu links, the footer CTA, socials and legal links. Stop the server with `lsof -ti tcp:3000 | xargs kill`.

- [ ] **Step 4: Report to the founder**

Report in the brief's format: what changed per task, the command output, every open item, and anything not verified. Include:

- **New dependencies:** `eslint`, `eslint-config-next` (dev only).
- **Open claims left unchanged:** data at rest and TLS 1.3; the extended admin view; visibility of player ratings.
- **Founder actions:**
  - Save the Vercel domain change for task 1.6, then re-run the section 6 checks (301 or 308 both pass).
  - Confirm the waitlist test email reached the responses sheet, once deployed.
  - Have the legal text checked against Moroccan data-protection requirements.
- **Not done until asked:** push, merge, deploy, and the production checks.
