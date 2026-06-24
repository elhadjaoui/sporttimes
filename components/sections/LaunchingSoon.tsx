'use client';

import PitchGrid from '@/components/ui/PitchGrid';
import Reveal from '@/components/ui/Reveal';
import NotifyForm from '@/components/ui/NotifyForm';

export default function LaunchingSoon() {
  return (
    <section
      id="launching-soon"
      data-palette="lime"
      style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 'clamp(5rem, 10vh, 8rem) 0',
      }}
    >
      <PitchGrid parallax={0.3} />
      <div className="grid-12" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <div style={{ gridColumn: '1 / span 12', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <Reveal stagger={80}>
            <div className="mono-eyebrow" style={{ marginBottom: 24, color: 'var(--text-mute)' }}>
              [ summer · ben guerir ]
            </div>
            <h2
              className="headline-display"
              style={{
                fontSize: 'clamp(36px, 6vw, 64px)',
                color: 'var(--text)',
                marginBottom: 24,
              }}
            >
              Doors open this summer.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 17,
                lineHeight: 1.55,
                color: 'var(--text-dim)',
                marginBottom: 36,
                maxWidth: '40ch',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              We&apos;re in the final stretch. Be there when the first match goes live.
            </p>
            <div style={{ maxWidth: 460, margin: '0 auto' }}>
              <NotifyForm source="launch" variant="lime" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
