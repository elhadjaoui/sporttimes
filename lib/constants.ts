export const APP_NAME = 'SPORTTIMES';
export const APP_NAME_DISPLAY = 'SPORTTIMES';
export const APP_LOCATION = 'BEN GUERIR';
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

// Menu chapters; their names and taglines live in the dictionary
// (lib/i18n/en/chrome.ts), keyed by anchor.
export const CHAPTERS = [
  { num: '01', anchor: 'problem' },
  { num: '02', anchor: 'how-it-works' },
  { num: '03', anchor: 'sports' },
  { num: '04', anchor: 'roadmap-features' },
  { num: '05', anchor: 'download' },
] as const;
