'use client';

import Link from 'next/link';
import { AppStoreBadge, PlayStoreBadge } from '@/components/ui/StoreBadges';

type Kind = 'match' | 'team' | 'invite' | 'community';

interface InviteFallbackProps {
  kind: Kind;
}

const COPY: Record<Kind, { eyebrow: string; headline: string }> = {
  match: {
    eyebrow: "You've been invited",
    headline: 'Someone saved a spot for you.',
  },
  team: {
    eyebrow: "You've been invited",
    headline: 'Your team is on the app.',
  },
  invite: {
    eyebrow: "You've been invited",
    headline: "You're one tap from the group.",
  },
  community: {
    eyebrow: "You've been invited",
    headline: 'The community is waiting.',
  },
};

const SUB_COPY =
  'SportTimes is launching in Ben Guerir this summer. Grab the app when it drops and this invite will open right up.';

export default function InviteFallback({ kind }: InviteFallbackProps) {
  const { eyebrow, headline } = COPY[kind];

  const handleOpenApp = () => {
    if (typeof window === 'undefined') return;
    window.location.href = window.location.href;
  };

  return (
    <main className="invite-fallback">
      <div className="invite-fallback-inner">
        <div className="mono-eyebrow invite-eyebrow">[ {eyebrow} ]</div>

        <h1 className="headline-display invite-headline">{headline}</h1>

        <p className="invite-subcopy">{SUB_COPY}</p>

        <div className="invite-badges">
          <AppStoreBadge soon />
          <PlayStoreBadge />
        </div>

        <button
          type="button"
          onClick={handleOpenApp}
          className="invite-open-link"
          data-cursor="hover"
        >
          Already have the app? Open it →
        </button>

        <Link href="/" className="invite-back" data-cursor="hover">
          ← Back to sporttimes.app
        </Link>
      </div>

      <style jsx>{`
        .invite-fallback {
          min-height: 100vh;
          width: 100%;
          background: #050505;
          color: #f5f5f0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(4rem, 12vh, 8rem) 24px 3rem;
          position: relative;
          z-index: 1;
        }
        .invite-fallback-inner {
          width: 100%;
          max-width: 640px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
        }
        .invite-eyebrow {
          margin-bottom: 24px;
        }
        .invite-headline {
          text-transform: uppercase;
          font-size: clamp(2rem, 6vw, 3.75rem);
          line-height: 1;
          letter-spacing: -0.03em;
          margin: 0 0 20px;
          color: #f5f5f0;
        }
        .invite-subcopy {
          font-family: var(--font-body), Inter, sans-serif;
          font-size: 17px;
          line-height: 1.5;
          color: rgba(245, 245, 240, 0.65);
          margin: 0 0 36px;
          max-width: 48ch;
        }
        .invite-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 28px;
        }
        .invite-open-link {
          background: transparent;
          border: none;
          padding: 0;
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--lime, #d4ff3a);
          cursor: pointer;
          margin-bottom: 48px;
          transition: opacity 200ms ease, transform 200ms ease;
        }
        .invite-open-link:hover {
          opacity: 0.8;
          transform: translateX(2px);
        }
        .invite-back {
          font-family: var(--font-mono), monospace;
          font-size: 10.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245, 245, 240, 0.45);
          text-decoration: none;
          transition: color 200ms ease;
        }
        .invite-back:hover {
          color: rgba(245, 245, 240, 0.85);
        }

        @media (prefers-reduced-motion: reduce) {
          .invite-open-link,
          .invite-back {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
