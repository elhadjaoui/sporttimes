import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import GrainOverlay from '@/components/ui/GrainOverlay';
import LenisProvider from '@/components/ui/LenisProvider';
import Preloader from '@/components/ui/Preloader';
import Nav from '@/components/ui/Nav';
import CustomCursor from '@/components/ui/CustomCursor';
import ProgressScrubber from '@/components/ui/ProgressScrubber';
import AmbientLayer from '@/components/ui/AmbientLayer';

const display = Inter({
  subsets: ['latin'],
  weight: ['800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SportTimes — See the lineup. Join the match.',
  description:
    'Stop chasing group chats. See exactly who is playing, what position, and how the team is shaping up — before you commit. Football, basketball, handball.',
  metadataBase: new URL('https://sporttimes.app'),
  openGraph: {
    title: 'SportTimes — See the lineup. Join the match.',
    description: 'Sports coordination, reimagined.',
    type: 'website',
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
          <Preloader />
          <Nav />
          <ProgressScrubber />
          {children}
        </LenisProvider>
        <GrainOverlay />
        <CustomCursor />
      </body>
    </html>
  );
}
