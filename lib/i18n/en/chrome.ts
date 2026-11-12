import { APP_NAME_DISPLAY } from '@/lib/constants';
import { LAUNCH_LABEL } from '@/lib/site';

// The nav bar and the full-screen menu, shown on every page.
const chrome = {
  homeLabel: `${APP_NAME_DISPLAY} — home`,
  menu: 'Menu',
  close: 'Close',
  navigation: 'Navigation · {count} chapters',
  defaultTagline: 'Pick a chapter to jump to.',
  nowShowing: 'Now showing',
  madeIn: 'Made for players',
  launchStatus: `Public launch ${LAUNCH_LABEL} · iOS beta open`,
  chapterRange: 'Chapters · 01 — {count}',
  pressEsc: { before: 'Press ', key: 'Esc', after: ' to close' },
  // The link to the French homepage, written in French.
  languageSwitch: { short: 'FR', label: 'Version française' },
  // Keyed by section id (CHAPTERS in lib/constants.ts).
  chapters: {
    problem: {
      name: 'THE PROBLEM',
      tagline: 'It’s not the players. It’s the chat.',
    },
    'how-it-works': {
      name: 'HOW IT WORKS',
      tagline: 'Open. See. Confirmed.',
    },
    sports: {
      name: 'THE SPORTS',
      tagline: 'One engine, every team sport.',
    },
    'roadmap-features': {
      name: 'ROADMAP',
      tagline: 'Next on the pitch.',
    },
    download: {
      name: 'WAITLIST',
      tagline: 'Be first on the pitch.',
    },
  },
} as const;

export default chrome;
