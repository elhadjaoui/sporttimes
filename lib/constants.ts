export const APP_NAME = 'SPORTTIMES';
export const APP_NAME_DISPLAY = 'SportTimes';
export const APP_LOCATION = 'CASABLANCA';
export const APP_TIMEZONE = 'Africa/Casablanca';

export const COLORS = {
  bg: '#050505',
  ink: '#F5F5F0',
  muted: 'rgba(245, 245, 240, 0.6)',
  lime: '#D4FF3A',
  pitch: '#0F2E1A',
  court: '#FF6B1A',
  wood: '#1A0F08',
  cyan: '#00E5FF',
  navy: '#050A1F',
} as const;

export const CHAPTERS = [
  { num: '01', name: 'THE PROBLEM', anchor: 'problem' },
  { num: '02', name: 'HOW IT WORKS', anchor: 'how' },
  { num: '03', name: 'FOOTBALL', anchor: 'football' },
  { num: '04', name: 'BASKETBALL', anchor: 'basketball' },
  { num: '05', name: 'HANDBALL', anchor: 'handball' },
  { num: '06', name: "WHAT'S COMING", anchor: 'roadmap' },
  { num: '07', name: 'DOWNLOAD', anchor: 'download' },
] as const;

export const SOCIAL = {
  instagram: '#',
  tiktok: '#',
  x: '#',
  youtube: '#',
} as const;

export const STORE_LINKS = {
  appStore: '#',
  playStore: '#',
} as const;
