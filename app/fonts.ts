import localFont from 'next/font/local';

// Self-hosted copies of the Google Fonts files (latin subset, variable
// weight). Fetching them from Google at build time failed now and then,
// when Google answered with font URLs Next.js 14 can't parse.
// The display face only offers 800-900, so text using it without its
// own weight (like the nav wordmark) renders at 800.
export const display = localFont({
  src: './fonts/inter-latin.woff2',
  weight: '800 900',
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Inter Fallback'],
});

export const body = localFont({
  src: './fonts/inter-latin.woff2',
  weight: '100 900',
  variable: '--font-body',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Inter Fallback'],
});

export const mono = localFont({
  src: './fonts/jetbrains-mono-latin.woff2',
  weight: '100 800',
  variable: '--font-mono',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['JetBrains Mono Fallback'],
});
