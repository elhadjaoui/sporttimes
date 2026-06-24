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
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="antialiased" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
