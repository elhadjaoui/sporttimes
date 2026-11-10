import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import GrainOverlay from '@/components/ui/GrainOverlay';
import LenisProvider from '@/components/ui/LenisProvider';
import Nav from '@/components/ui/Nav';
import ProgressScrubber from '@/components/ui/ProgressScrubber';
import AmbientLayer from '@/components/ui/AmbientLayer';
import RevealObserver from '@/components/ui/RevealObserver';
import { Analytics } from '@vercel/analytics/next';
import { HOME_DESCRIPTION, HOME_TITLE } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site';

// Self-hosted copies of the Google Fonts files (latin subset, variable
// weight). Fetching them from Google at build time failed now and then,
// when Google answered with font URLs Next.js 14 can't parse.
// The display face only offers 800-900, so text using it without its
// own weight (like the nav wordmark) renders at 800.
const display = localFont({
  src: './fonts/inter-latin.woff2',
  weight: '800 900',
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Inter Fallback'],
});

const body = localFont({
  src: './fonts/inter-latin.woff2',
  weight: '100 900',
  variable: '--font-body',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Inter Fallback'],
});

const mono = localFont({
  src: './fonts/jetbrains-mono-latin.woff2',
  weight: '100 800',
  variable: '--font-mono',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['JetBrains Mono Fallback'],
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="bg-bg text-ink antialiased">
        <AmbientLayer />
        <LenisProvider>
          <Nav />
          <ProgressScrubber />
          {children}
        </LenisProvider>
        <GrainOverlay />
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}
