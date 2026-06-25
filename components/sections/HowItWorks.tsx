'use client';

import {
  useEffect,
  useRef,
  type CSSProperties,
  type RefObject,
} from 'react';

// ===================================================================
//  Data — 3 steps. Step 04 ("Jump in") absorbs the original "Discover"
//  into the lineup step + a single "you're in" close. Verbs stay sharp.
//  Drop the screenshots at the listed paths in /public/screens/.
// ===================================================================

type FloatingCard = {
  eyebrow: string;
  title: string;
  sub?: string;
  accent: 'lime' | 'paper';
  /** Position anchors (use any pair: top/right, top/left, bottom/right, bottom/left). */
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  /** Base rotation in degrees (composed with the scroll parallax translate). */
  rotate: number;
};

type Step = {
  num: string;
  verb: string;
  body: string;
  src: string;
  alt: string;
  /** Image side on desktop. Mobile always stacks image-above-copy. */
  imageRight: boolean;
  card: FloatingCard;
};

const STEPS: Step[] = [
  {
    num: '01',
    verb: 'Join your community.',
    body:
      'Campus, city, club, workplace. Public groups open in a tap; private squads gated by admin approval.',
    src: '/screens/howitworks-community.png',
    alt: 'A SportTimes community page showing members and the week\u2019s upcoming matches.',
    imageRight: false,
    card: {
      eyebrow: 'Join request',
      title: 'Approved',
      sub: 'You\u2019re in the squad',
      accent: 'lime',
      top: '10%',
      right: '-8%',
      rotate: 4,
    },
  },
  {
    num: '02',
    verb: 'Watch the lineup fill.',
    body:
      'Positions claim themselves in real time. You see exactly who is playing, and where, before the whistle.',
    src: '/screens/howitworks-lineup.png',
    alt: 'A live lineup view filling with player slots in a 4-3-3 formation.',
    imageRight: true,
    card: {
      eyebrow: 'Slot filled',
      title: 'Karim · LB',
      sub: '7 of 11 confirmed',
      accent: 'lime',
      bottom: '14%',
      left: '-8%',
      rotate: -5,
    },
  },
  {
    num: '03',
    verb: 'Jump in.',
    body:
      'One tap. Captain approves. Your face appears in the lineup and you show up ready to play.',
    src: '/screens/howitworks-jumpin.png',
    alt: 'A "you\u2019re in the lineup" confirmation card with the match details.',
    imageRight: false,
    card: {
      eyebrow: 'You\u2019re in',
      title: 'Sunday match',
      sub: '11/11 · 18:30 · East Field',
      accent: 'paper',
      top: '12%',
      right: '-10%',
      rotate: 5,
    },
  },
];

// Per-card scroll-parallax multipliers (signed so cards drift in
// different directions). Small magnitudes — gentle.
const PARALLAX_MULTS = [0.07, -0.06, 0.08];

// ===================================================================
//  Section
// ===================================================================

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const cardRefs: RefObject<HTMLDivElement>[] = [card0Ref, card1Ref, card2Ref];

  // Gentle scroll-tied parallax on each floating card. Reduced-motion off.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    let lastY = -1;
    const tick = () => {
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      if (scrolled !== lastY) {
        lastY = scrolled;
        cardRefs.forEach((ref, i) => {
          const el = ref.current;
          if (!el) return;
          const dy = (scrolled * PARALLAX_MULTS[i]).toFixed(2);
          el.style.transform = `translate3d(0, ${dy}px, 0) rotate(${STEPS[i].card.rotate}deg)`;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how"
      data-progress-section
      data-progress-label="How It Works"
      data-palette="paper"
      className="relative"
      style={{
        padding: 'clamp(7rem, 14vh, 11rem) 0 clamp(7rem, 13vh, 10rem)',
        overflow: 'hidden',
      }}
    >
      {/* Section heading */}
      <div className="grid-12" data-reveal>
        <div
          className="col-span-12 xl:col-start-2 xl:col-span-9"
          data-reveal-child
          style={{ marginBottom: 'clamp(5rem, 10vh, 8rem)' }}
        >
          <div className="mono-eyebrow" style={{ marginBottom: 24 }}>
            How it works
          </div>
          <h2
            className="headline-display"
            style={{
              fontSize: 'clamp(2.25rem, 5.4vw, 4.4rem)',
              color: 'var(--paper-ink)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              textTransform: 'none',
              maxWidth: '22ch',
            }}
          >
            From group chat chaos to a confirmed 11 — in three steps.
          </h2>
        </div>
      </div>

      {/* Alternating rows */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(5rem, 11vh, 9rem)',
        }}
      >
        {STEPS.map((step, i) => (
          <Row key={step.num} step={step} cardRef={cardRefs[i]} />
        ))}
      </div>
    </section>
  );
}

// ===================================================================
//  Row
// ===================================================================

function Row({
  step,
  cardRef,
}: {
  step: Step;
  cardRef: RefObject<HTMLDivElement>;
}) {
  const imageColClasses = step.imageRight
    ? 'col-span-12 xl:col-start-7 xl:col-span-5'
    : 'col-span-12 xl:col-start-2 xl:col-span-5';

  const textColClasses = step.imageRight
    ? 'col-span-12 xl:col-start-2 xl:col-span-4'
    : 'col-span-12 xl:col-start-8 xl:col-span-4';

  return (
    <div className="grid-12 items-center" data-reveal>
      {/* IMAGE side — phone frame + floating card.
          On mobile this comes first (image-above-copy). On desktop, grid
          column placement decides left/right; source order is irrelevant. */}
      <div
        className={imageColClasses}
        data-reveal-child
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'clamp(2rem, 5vh, 3rem)',
          // Reserve a little breathing room so the floating card can overhang
          // without the layout flexing during scroll parallax.
          paddingLeft: 'clamp(0px, 4vw, 36px)',
          paddingRight: 'clamp(0px, 4vw, 36px)',
        }}
      >
        <PhoneFrame src={step.src} alt={step.alt} />
        <FloatingCard cardRef={cardRef} card={step.card} />
      </div>

      {/* COPY side — number + verb + one sentence */}
      <div
        className={textColClasses}
        data-reveal-child
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 12,
            letterSpacing: '0.28em',
            color: 'var(--paper-dim)',
            marginBottom: 18,
          }}
        >
          {step.num}
        </div>
        <h3
          className="headline-display"
          style={{
            fontSize: 'clamp(1.75rem, 3.8vw, 2.8rem)',
            color: 'var(--paper-ink)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            textTransform: 'none',
            marginBottom: 18,
            maxWidth: '18ch',
          }}
        >
          {step.verb}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body), Inter, system-ui, sans-serif',
            fontSize: 17,
            lineHeight: 1.55,
            color: 'var(--paper-dim)',
            maxWidth: '40ch',
          }}
        >
          {step.body}
        </p>
      </div>
    </div>
  );
}

// ===================================================================
//  Phone frame — hover lifts 1.5%
// ===================================================================

function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="phone-frame"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 340,
        aspectRatio: '9 / 19.5',
        borderRadius: 'var(--card-radius)',
        overflow: 'hidden',
        background: '#0A0A0A',
        border: '1px solid var(--paper-line)',
        boxShadow: 'var(--shadow-soft)',
        transition:
          'transform 320ms cubic-bezier(.22,.61,.36,1), box-shadow 320ms cubic-bezier(.22,.61,.36,1)',
        zIndex: 1,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
        loading="lazy"
      />
      <style jsx>{`
        .phone-frame:hover {
          transform: scale(1.015);
        }
      `}</style>
    </div>
  );
}

// ===================================================================
//  Floating card — pulled-out UI fragment
// ===================================================================

function FloatingCard({
  cardRef,
  card,
}: {
  cardRef: RefObject<HTMLDivElement>;
  card: FloatingCard;
}) {
  const isLime = card.accent === 'lime';

  const positionStyle: CSSProperties = {
    position: 'absolute',
    top: card.top,
    bottom: card.bottom,
    left: card.left,
    right: card.right,
    transform: `rotate(${card.rotate}deg)`,
    willChange: 'transform',
    zIndex: 5,
  };

  return (
    <div
      ref={cardRef}
      aria-hidden
      style={{
        ...positionStyle,
        padding: '14px 18px',
        borderRadius: 'var(--card-radius)',
        background: isLime ? 'var(--lime)' : '#FFFFFF',
        color: isLime ? '#0A0A0A' : 'var(--paper-ink)',
        border: isLime ? 'none' : '1px solid var(--paper-line)',
        boxShadow: 'var(--shadow-soft)',
        minWidth: 160,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: isLime ? 'rgba(10,10,10,0.65)' : 'var(--paper-dim)',
          marginBottom: 4,
        }}
      >
        {card.eyebrow}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display), Inter, sans-serif',
          fontSize: 18,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
        }}
      >
        {card.title}
      </div>
      {card.sub && (
        <div
          style={{
            fontFamily: 'var(--font-body), Inter, sans-serif',
            fontSize: 11,
            color: isLime ? 'rgba(10,10,10,0.75)' : 'var(--paper-dim)',
            marginTop: 4,
            fontWeight: 600,
          }}
        >
          {card.sub}
        </div>
      )}
    </div>
  );
}
