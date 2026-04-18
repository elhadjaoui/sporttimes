import type { Metadata } from 'next';
import { Anton, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import GrainOverlay from '@/components/ui/GrainOverlay';
import LenisProvider from '@/components/ui/LenisProvider';
import Preloader from '@/components/ui/Preloader';
import Nav from '@/components/ui/Nav';

const display = Anton({
  subsets: ['latin'],
  weight: '400',
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
        <LenisProvider>
          <Preloader />
          <Nav />
          {children}
        </LenisProvider>
        <GrainOverlay />
      </body>
    </html>
  );
}
