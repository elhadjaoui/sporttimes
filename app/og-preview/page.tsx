'use client';

import PitchFill from '@/components/ui/PitchFill';

export default function OgPreviewPage() {
  return (
    <div
      data-palette="dark"
      style={{
        width: 1200,
        height: 630,
        background: 'var(--bg)',
        color: 'var(--text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '80px',
      }}
    >
      <div style={{ maxWidth: 600 }}>
        <div className="mono-eyebrow" style={{ marginBottom: 20 }}>
          [ launching this summer · ben guerir ]
        </div>
        <h1
          className="headline-display"
          style={{ fontSize: 72, lineHeight: 1.05, color: 'var(--text)' }}
        >
          The match before the match.
        </h1>
        <div
          style={{
            marginTop: 40,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 28,
            color: 'var(--accent)',
          }}
        >
          SportTimes
        </div>
      </div>
      <div style={{ width: 380 }}>
        <PitchFill />
      </div>
    </div>
  );
}
