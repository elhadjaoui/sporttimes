import type { Metadata } from 'next';
import BetaButton from '@/components/ui/BetaButton';
import MagneticButton from '@/components/ui/MagneticButton';
import RootShell from '@/components/ui/RootShell';

export const metadata: Metadata = {
  title: 'Page not found — SPORTTIMES',
  description:
    "This page doesn't exist. Head back to SPORTTIMES or join the iOS beta.",
};

export default function NotFound() {
  // This page sits outside every layout, so it renders the shell itself.
  return (
    <RootShell locale="en">
      <main
        className="relative w-full flex items-center"
        data-palette="hero"
        style={{
          minHeight: '100vh',
          padding: 'clamp(7rem, 12vh, 10rem) 0',
        }}
      >
        <div className="grid-12 relative z-[5]">
          <div className="col-span-12 md:col-start-2 md:col-span-8">
            <div className="mono-eyebrow mb-4">404 · Not found</div>
            <h1
              className="headline-display uppercase text-ink mb-6"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.03em',
              }}
            >
              Wrong pitch.
            </h1>
            <p
              className="font-body mb-9"
              style={{
                color: 'rgba(245,245,240,0.6)',
                fontSize: 17,
                lineHeight: 1.5,
                maxWidth: '46ch',
              }}
            >
              This page doesn&apos;t exist, or the link is out of date.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <MagneticButton href="/" variant="primary">
                Back to home
              </MagneticButton>
              <BetaButton location="not_found" variant="ghost" />
            </div>
          </div>
        </div>
      </main>
    </RootShell>
  );
}
