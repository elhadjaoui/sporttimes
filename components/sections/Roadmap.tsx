'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Phase = 'live at launch' | 'coming next' | 'on the horizon';
type Feature = {
  seq: string;
  name: string;
  phase: Phase;
  summary: string;
  bullets: string[];
};

const FEATURES: Feature[] = [
  {
    seq: '01', phase: 'live at launch', name: 'Football pickup',
    summary: 'The day-one promise: organize and discover pickup football across formats.',
    bullets: ['5v5, 7v7, 9v9, 11v11', 'One-tap join', 'Visual lineup'],
  },
  {
    seq: '02', phase: 'live at launch', name: 'Communities',
    summary: 'Join the squads that match how you actually play — campus, city, club, workplace.',
    bullets: ['Public groups open in one tap', 'Private groups gated by admin approval', 'One feed across all your groups'],
  },
  {
    seq: '03', phase: 'live at launch', name: 'Live lineups',
    summary: 'The signature surface. Watch positions fill in real time before kickoff.',
    bullets: ['Real-time roster', 'Formation-aware (4-3-3, etc.)', 'Captain approves joins'],
  },
  {
    seq: '04', phase: 'coming next', name: 'Tournaments',
    summary: 'Run complete tournament brackets inside your community — no spreadsheets.',
    bullets: ['Single-elim, double-elim, round-robin', 'Auto-seeding from match history', 'Live bracket everyone can watch', 'Shareable finals poster'],
  },
  {
    seq: '05', phase: 'coming next', name: 'Match chat',
    summary: 'In-app messaging tied to the match, not the squad. No more buried plans, no more switching apps.',
    bullets: ['Conversation lives inside the match', 'Auto-archive after final whistle', 'Mentions + reactions'],
  },
  {
    seq: '06', phase: 'on the horizon', name: 'More sports',
    summary: 'The same visual lineup, community, and match tools — coming to the sports your people actually play.',
    bullets: ['Basketball (3v3, 5v5)', 'Handball (7v7)', 'Padel · Tennis · more'],
  },
  {
    seq: '07', phase: 'on the horizon', name: 'More cities',
    summary: 'After Ben Guerir: the cities your community lives in.',
    bullets: ['Player-requested city activation', 'Local admin onboarding'],
  },
  {
    seq: '08', phase: 'on the horizon', name: 'Player ratings',
    summary: 'Lightweight per-match peer ratings — captain reliability, sportsmanship, skill. Opt-in.',
    bullets: ['Post-match prompt only', 'Aggregated trends, never single-game scores', 'Players control visibility'],
  },
];

export default function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(-1);
  const [forceMobile, setForceMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (mq.matches) {
      setForceMobile(true);
      return;
    }
    if (!isDesktop) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const strip = stripRef.current;
      if (!strip) return;
      const stripWidth = strip.scrollWidth;
      const viewportWidth = window.innerWidth;
      const translatePx = Math.max(0, stripWidth - viewportWidth + 80);
      gsap.to(strip, {
        x: -translatePx,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${translatePx + 600}`,
          pin: true,
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="roadmap"
      data-palette="dark"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div
        style={{
          padding: 'clamp(5rem, 10vh, 8rem) clamp(20px, 4vw, 64px) clamp(3rem, 6vh, 5rem)',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <div className="mono-eyebrow" style={{ marginBottom: 16 }}>[ what&apos;s coming ]</div>
        <h2
          className="headline-display"
          style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', color: 'var(--text)', maxWidth: '20ch' }}
        >
          The roadmap, briefly.
        </h2>
      </div>

      <div
        className="roadmap-strip-wrap"
        style={{
          position: 'relative',
          display: forceMobile ? 'none' : undefined,
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
      >
        <div
          ref={stripRef}
          className="roadmap-strip"
          style={{
            display: 'flex',
            gap: 24,
            padding: '24px clamp(20px, 4vw, 64px) 48px',
            willChange: 'transform',
          }}
        >
          {FEATURES.map((f, i) => (
            <Card
              key={f.seq}
              feature={f}
              isPinned={pinned === i}
              onToggle={() => setPinned(pinned === i ? -1 : i)}
            />
          ))}
        </div>
      </div>

      {pinned >= 0 && (
        <Panel feature={FEATURES[pinned]} />
      )}

      <div
        className="roadmap-mobile"
        style={{ display: forceMobile ? 'block' : 'none' }}
      >
        {(['live at launch', 'coming next', 'on the horizon'] as Phase[]).map((phase) => (
          <div key={phase} style={{ padding: '32px clamp(20px, 4vw, 64px)' }}>
            <div className="mono-eyebrow" style={{ marginBottom: 16 }}>[ {phase} ]</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {FEATURES.filter((f) => f.phase === phase).map((f) => (
                <MobileCard key={f.seq} feature={f} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 1023px) {
          .roadmap-strip-wrap { display: none !important; }
          .roadmap-mobile { display: block !important; }
        }
      `}</style>
    </section>
  );
}

function Card({ feature, isPinned, onToggle }: { feature: Feature; isPinned: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        flex: '0 0 220px',
        height: 280,
        background: isPinned ? 'var(--surface-2)' : 'var(--surface)',
        border: `1px solid ${isPinned ? 'var(--accent)' : 'var(--hairline)'}`,
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        textAlign: 'left',
        color: 'var(--text)',
        transition: 'border-color 200ms ease, background 200ms ease',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.22em',
          color: 'var(--text-mute)',
        }}
      >
        {feature.seq}
      </div>
      <div
        className="headline-display"
        style={{ fontSize: 22, color: 'var(--text)', lineHeight: 1.1 }}
      >
        {feature.name}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
          color: 'var(--text-mute)', textTransform: 'lowercase',
        }}
      >
        [ {feature.phase} ]
      </div>
    </button>
  );
}

function Panel({ feature }: { feature: Feature }) {
  return (
    <div
      style={{
        margin: '0 auto 48px',
        maxWidth: 720,
        padding: '24px clamp(20px, 4vw, 32px)',
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
        <h3 className="headline-display" style={{ fontSize: 22, color: 'var(--text)' }}>{feature.name}</h3>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
          color: 'var(--accent)', textTransform: 'lowercase',
        }}>
          [ {feature.phase} ]
        </span>
      </div>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.55,
        color: 'var(--text-dim)', marginBottom: 16,
      }}>
        {feature.summary}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {feature.bullets.map((b) => (
          <li key={b} style={{
            fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text)',
            paddingLeft: 16, position: 'relative',
          }}>
            <span aria-hidden style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>·</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileCard({ feature }: { feature: Feature }) {
  return (
    <article style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 12, padding: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
        <h3 className="headline-display" style={{ fontSize: 20, color: 'var(--text)' }}>{feature.name}</h3>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', color: 'var(--text-mute)',
        }}>{feature.seq}</span>
      </div>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55,
        color: 'var(--text-dim)', marginBottom: 12,
      }}>{feature.summary}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {feature.bullets.map((b) => (
          <li key={b} style={{
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)',
            paddingLeft: 14, position: 'relative',
          }}>
            <span aria-hidden style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>·</span>
            {b}
          </li>
        ))}
      </ul>
    </article>
  );
}
