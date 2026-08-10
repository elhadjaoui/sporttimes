
'use client';

import WaitlistForm from '@/components/ui/WaitlistForm';
import { Component as EtherealShadow } from '@/components/ui/etheral-shadow';

// ===================================================================
//  Store badges — both greyed with "soon" label. No dead links.
// ===================================================================

function SoonPill() {
  return (
    <span
      style={{
        position: 'absolute',
        top: -8,
        right: -6,
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 8,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--lime)',
        background: 'rgba(212, 255, 58, 0.10)',
        border: '1px solid rgba(212, 255, 58, 0.45)',
        padding: '2px 6px',
        borderRadius: 100,
        lineHeight: 1,
        pointerEvents: 'none',
      }}
    >
      Soon
    </span>
  );
}

function StoreBadge({
  ariaLabel,
  topLabel,
  bottomLabel,
  Icon,
}: {
  ariaLabel: string;
  topLabel: string;
  bottomLabel: string;
  Icon: React.ComponentType;
}) {
  return (
    <span
      aria-label={ariaLabel}
      title={`${ariaLabel} — coming soon`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
        background: '#0A0A0A',
        border: '1px solid rgba(245, 245, 240, 0.10)',
        borderRadius: 'var(--card-radius)',
        color: 'rgba(245, 245, 240, 0.5)',
        fontFamily: 'var(--font-body), Inter, sans-serif',
        minWidth: 168,
        cursor: 'help',
      }}
    >
      <Icon />
      <span style={{ textAlign: 'left', lineHeight: 1 }}>
        <span
          style={{
            display: 'block',
            fontSize: 9,
            letterSpacing: '0.08em',
            color: 'rgba(245, 245, 240, 0.4)',
          }}
        >
          {topLabel}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            marginTop: 2,
          }}
        >
          {bottomLabel}
        </span>
      </span>
      <SoonPill />
    </span>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="rgba(245,245,240,0.45)" aria-hidden>
      <path d="M17.5 14.1c0-2.5 2-3.7 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.1-.8-1.6 0-3 .9-3.8 2.4-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2-.1 1.6-.8 3.1-.8 1.4 0 1.8.8 3.1.7 1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.4zM14.8 7.1c.7-.8 1.1-1.9 1-3-.9.1-2 .6-2.7 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2-.5 2.7-1.3z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 512 512"
      style={{ opacity: 0.45 }}
      aria-hidden
    >
      <path
        d="M66 44c-8 4-12 11-12 21v382c0 10 4 17 12 21l224-210L66 44z"
        fill="rgba(245,245,240,0.45)"
      />
      <path
        d="M290 258L66 468c8 3 17 2 26-3l268-152-70-55z"
        fill="rgba(245,245,240,0.45)"
      />
      <path
        d="M360 313l-70-55 70-55 88 50c18 10 18 28 0 38l-88 22z"
        fill="rgba(245,245,240,0.45)"
      />
      <path
        d="M290 258L360 203 92 51c-9-5-18-6-26-3l224 210z"
        fill="rgba(245,245,240,0.45)"
      />
    </svg>
  );
}

// ===================================================================
//  Phone frame — hover lifts 1.5%
// ===================================================================

function PhoneFrame() {
  return (
    <div
      className="dl-phone"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 360,
        aspectRatio: '9 / 19.5',
        borderRadius: 'var(--card-radius)',
        overflow: 'hidden',
        background: '#0A0A0A',
        border: '1px solid rgba(245, 245, 240, 0.08)',
        boxShadow: '0 30px 70px rgba(0, 0, 0, 0.35)',
        margin: '0 auto',
        transition:
          'transform 320ms cubic-bezier(.22,.61,.36,1), box-shadow 320ms cubic-bezier(.22,.61,.36,1)',
      }}
    >
      {/* Drop the PNG at public/screens/download-app.png to fill the frame. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/screens/download-app.png"
        alt="A SportTimes match-day view showing your confirmed lineup"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
        loading="lazy"
      />
      <style jsx>{`
        .dl-phone:hover {
          transform: translateY(-6px);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.45);
        }
      `}</style>
    </div>
  );
}

// ===================================================================
//  Section
// ===================================================================

export default function Download() {
  return (
    <section
      id="download"
      data-progress-section
      data-progress-label="Get notified"
      data-palette="hero"
      className="relative"
      style={{
        padding: 'clamp(7rem, 14vh, 11rem) 0 clamp(7rem, 13vh, 10rem)',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      {/* Etheral Shadow background — drifting masked shape with animated
          SVG displacement filter (hue-rotate via framer-motion). */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      >
        <EtherealShadow
          color="rgba(212, 255, 58, 0.55)"
          animation={{ scale: 80, speed: 60 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      <div
        className="grid-12 items-center"
        data-reveal
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* ============================================================
            LEFT — phone screenshot
            ============================================================ */}
        <div
          className="col-span-12 xl:col-start-2 xl:col-span-5"
          data-reveal-child
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'clamp(2.5rem, 6vh, 4rem)',
          }}
        >
          <PhoneFrame />
        </div>

        {/* ============================================================
            RIGHT — eyebrow, headline, sub, form, launch line, badges
            ============================================================ */}
        <div
          className="col-span-12 xl:col-start-8 xl:col-span-4"
          data-reveal-child
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div className="mono-eyebrow" style={{ marginBottom: 24 }}>
            Get notified
          </div>

          <h2
            className="headline-display"
            style={{
              fontSize: 'clamp(2rem, 4.6vw, 3.4rem)',
              color: 'var(--ink)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              textTransform: 'none',
              marginBottom: 22,
              maxWidth: '14ch',
            }}
          >
            Be first on the pitch.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body), Inter, system-ui, sans-serif',
              fontSize: 17,
              lineHeight: 1.55,
              color: 'var(--muted)',
              maxWidth: '42ch',
              marginBottom: 28,
            }}
          >
            We&apos;re putting the finishing touches on it. Drop your email
            and we&apos;ll send one note: the day the first match goes live.
          </p>

          <WaitlistForm source="download" />

          <div
            className="mono-eyebrow"
            style={{
              marginTop: 18,
              color: 'rgba(245, 245, 240, 0.4)',
              letterSpacing: '0.22em',
            }}
          >
            Launching summer 2026
          </div>

          {/* Store badges — greyed, "soon" pill, no links */}
          <div
            style={{
              marginTop: 36,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
            }}
          >
            <StoreBadge
              ariaLabel="App Store — coming soon"
              topLabel="Coming to the"
              bottomLabel="App Store"
              Icon={AppleIcon}
            />
            <StoreBadge
              ariaLabel="Google Play — coming soon"
              topLabel="Coming to"
              bottomLabel="Google Play"
              Icon={PlayIcon}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
