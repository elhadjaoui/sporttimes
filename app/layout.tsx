import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';
import LenisProvider from '@/components/ui/LenisProvider';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sporttimes.app'),
  title: 'SportTimes — The match before the match',
  description:
    'The app that turns group-chat chaos into a confirmed 11-a-side. Launching this summer in Ben Guerir.',
  openGraph: {
    title: 'SportTimes — The match before the match',
    description:
      'The app that turns group-chat chaos into a confirmed 11-a-side. Launching this summer in Ben Guerir.',
    type: 'website',
    images: [{ url: '/og/sporttimes-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportTimes — The match before the match',
    description:
      'The app that turns group-chat chaos into a confirmed 11-a-side. Launching this summer in Ben Guerir.',
    images: ['/og/sporttimes-og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="antialiased" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
