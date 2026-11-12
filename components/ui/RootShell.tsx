import { Analytics } from '@vercel/analytics/next';
import { body, display, mono } from '@/app/fonts';
import '@/app/globals.css';
import GrainOverlay from '@/components/ui/GrainOverlay';
import LenisProvider from '@/components/ui/LenisProvider';
import Nav from '@/components/ui/Nav';
import ProgressScrubber from '@/components/ui/ProgressScrubber';
import AmbientLayer from '@/components/ui/AmbientLayer';
import RevealObserver from '@/components/ui/RevealObserver';

// The <html> and <body> every page shares. A nested layout can't change
// <html lang>, so each layout renders this itself with its own language.
export default function RootShell({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
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
