'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CornerBrackets from '@/components/ui/CornerBrackets';

// ===================================================================
//  Data
// ===================================================================

type Msg = { id: number; name: string; time: string; text: string };

const MESSAGE_POOL: Omit<Msg, 'id'>[] = [
  { name: 'MEHDI', time: '19:01', text: '???' },
  { name: 'YASSINE', time: '19:02', text: "who's in tonight?" },
  { name: 'AMINE', time: '19:15', text: 'bring a ball' },
  { name: 'YOUSSEF', time: '19:34', text: 'changed to 21:00' },
  { name: 'KARIM', time: '19:22', text: 'i might be late' },
  { name: 'REDA', time: '19:50', text: "who's coming??" },
  { name: 'IMAD', time: '19:55', text: 'cancelled?' },
  { name: 'HAMZA', time: '20:18', text: 'still on?' },
  { name: 'ALI', time: '20:23', text: "i'm out sorry" },
  { name: 'YASSINE', time: '20:25', text: 'only 5 of us' },
  { name: 'MEHDI', time: '20:31', text: 'need 3 more' },
  { name: 'SAID', time: '20:44', text: 'anyone?' },
  { name: 'NIZAR', time: '20:52', text: 'wallah I thought it was Thursday' },
  { name: 'YOUSSEF', time: '21:03', text: "we're still playing?" },
  { name: 'MEHDI', time: '21:15', text: 'forget it' },
  { name: 'OMAR', time: '21:22', text: 'last minute, I can come' },
  { name: 'HICHAM', time: '21:30', text: 'where is it again?' },
  { name: 'TARIK', time: '21:45', text: 'my car broke down' },
  { name: 'ADIL', time: '22:00', text: 'match next week?' },
];

const TOOL_CARDS = [
  {
    name: 'WhatsApp',
    body: 'Messages get buried under replies. No way to track who is actually coming. Organizers chase confirmations for hours.',
    tag: 'No structure',
    appearAt: 0.38,
  },
  {
    name: 'Discord',
    body: 'Built for gaming, not for sports. Notifications explode across servers. Nothing sticks long enough to matter.',
    tag: 'Wrong platform',
    appearAt: 0.46,
  },
  {
    name: 'Facebook Events',
    body: '"Interested" means nothing. "Going" means maybe. No sports-specific features. RSVPs don\'t translate to players on the pitch.',
    tag: 'Too generic',
    appearAt: 0.54,
  },
  {
    name: 'Just showing up',
    body: 'Hope there is a match today. Pray enough people came. Gamble your Sunday on whether a game will happen at all.',
    tag: 'Pure luck',
    appearAt: 0.62,
  },
];

const PROMISES = [
  'Discover matches you didn\u2019t know existed',
  'See who\u2019s actually committed',
  'Visual lineups that update in real time',
  'Zero wasted captain time',
  'No more collapsed matches',
  'Built for sports, not for chat',
];

const STATS_BEFORE = [
  { label: 'Messages', value: '47 unread' },
  { label: 'Confirmed', value: 'unknown' },
  { label: 'Organizers', value: 'exhausted' },
  { label: 'Matches', value: '50 / 50 chance' },
];
const STATS_AFTER = [
  { label: 'Messages', value: '0' },
  { label: 'Confirmed', value: '11 / 11' },
  { label: 'Organizers', value: 'hands-free' },
  { label: 'Matches', value: 'happening' },
];

// ===================================================================
//  Helpers
// ===================================================================

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const band = (v: number, e0: number, e1: number) =>
  e0 === e1 ? 0 : smoothstep(clamp01((v - e0) / (e1 - e0)));

// ===================================================================
//  Chat column — auto-scrolling accelerating message stack
// ===================================================================

function ChatColumn({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const p = progressRef.current;
      // Accelerating spawn rate driven by scroll:
      //   Beat 1 (0.00 → 0.30): 800 ms → 150 ms (peak chaos)
      //   Transition (0.32–0.38): ramps back up to 600 ms (calm)
      let interval: number;
      if (p < 0.30) {
        interval = lerp(800, 150, clamp01(p / 0.30));
      } else if (p < 0.38) {
        interval = lerp(150, 600, clamp01((p - 0.30) / 0.08));
      } else {
        interval = 600;
      }
      if (now - last > interval) {
        last = now;
        counterRef.current += 1;
        const msg: Msg = {
          id: counterRef.current,
          ...MESSAGE_POOL[counterRef.current % MESSAGE_POOL.length],
        };
        setMessages((prev) => [...prev, msg].slice(-12));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div
      ref={rootRef}
      className="chat-column absolute"
      style={{
        left: '7%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 'min(380px, 32vw)',
        maxHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gap: 10,
        willChange: 'opacity',
      }}
    >
      <AnimatePresence initial={false}>
        {messages.map((m) => (
          <motion.div
            key={m.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <ChatBubble msg={m} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ChatBubble({ msg }: { msg: Msg }) {
  return (
    <div
      style={{
        background: '#141414',
        border: '1px solid rgba(245,245,240,0.08)',
        borderRadius: 14,
        padding: '10px 14px',
        boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 10,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,240,0.6)',
          }}
        >
          {msg.name}
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            color: 'rgba(245,245,240,0.35)',
          }}
        >
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: '#e63946',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#e63946',
              }}
            />
            NEW
          </motion.span>
          {msg.time}
        </div>
      </div>
      <div
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 14,
          color: 'rgba(245,245,240,0.85)',
          lineHeight: 1.35,
        }}
      >
        {msg.text}
      </div>
    </div>
  );
}

// ===================================================================
//  MobileProblem — renders all 3 beats as stacked static sections
//  on tablet + phone. No pin, no scrub. Same copy as desktop.
// ===================================================================

function MobileProblem() {
  return (
    <div style={{ width: '100%' }}>
      {/* BEAT 1 — The Chaos */}
      <div
        style={{
          minHeight: '100vh',
          padding: 'clamp(5rem, 10vh, 7rem) 20px 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        <div
          className="mono-eyebrow"
          style={{ color: '#ff6b6b', letterSpacing: '0.25em' }}
        >
          [ 01 / 03 · The Chaos ]
        </div>
        <h2
          className="headline-display uppercase text-ink"
          style={{
            fontSize: 'clamp(2rem, 8vw, 3rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.025em',
            margin: 0,
          }}
        >
          This is how most matches get organized.
        </h2>
        <blockquote
          style={{
            borderLeft: '2px solid #D4FF3A',
            paddingLeft: 14,
            margin: '6px 0',
            fontFamily: 'var(--font-display), Inter, sans-serif',
            fontStyle: 'italic',
            fontSize: 16,
            lineHeight: 1.35,
            color: 'rgba(245,245,240,0.82)',
          }}
        >
          <span style={{ color: '#D4FF3A' }}>“</span>I want to play
          football today, but I don&apos;t know if there&apos;s a match.
          <span style={{ color: '#D4FF3A' }}>”</span>
        </blockquote>
        <p
          className="font-body"
          style={{
            color: 'rgba(245,245,240,0.62)',
            fontSize: 15,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          Every week, in every city. Students on campus. People new to
          town. Anyone who just wants to play. The plan lives inside a
          group chat nobody can actually read.
        </p>

        {/* Auto-scrolling chat chaos */}
        <div
          aria-hidden
          style={{
            marginTop: 10,
            width: '100%',
            height: 320,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(245,245,240,0.08)',
            borderRadius: 12,
            background: 'rgba(15,10,10,0.6)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: '14px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              animation: 'mp-chat-scroll 18s linear infinite',
            }}
          >
            {[...MESSAGE_POOL, ...MESSAGE_POOL].slice(0, 14).map(
              (m, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(245,245,240,0.06)',
                    borderRadius: 10,
                    fontFamily: 'var(--font-body), Inter, sans-serif',
                    fontSize: 12,
                    lineHeight: 1.3,
                    color: 'rgba(245,245,240,0.85)',
                    maxWidth: '82%',
                    alignSelf:
                      i % 3 === 1 ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 9,
                      letterSpacing: '0.18em',
                      color: 'rgba(255,107,107,0.85)',
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}
                  >
                    {m.name} · {m.time}
                  </div>
                  {m.text}
                </div>
              )
            )}
          </div>
          {/* Top + bottom fade masks */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 30,
              background:
                'linear-gradient(to bottom, rgba(15,10,10,0.95), transparent)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 30,
              background:
                'linear-gradient(to top, rgba(15,10,10,0.95), transparent)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* BEAT 2 — The Diagnosis */}
      <div
        style={{
          minHeight: '100vh',
          padding: 'clamp(4rem, 8vh, 6rem) 20px 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 18,
        }}
      >
        <div
          className="mono-eyebrow"
          style={{ color: '#D4FF3A', letterSpacing: '0.25em' }}
        >
          [ 02 / 03 · The Diagnosis ]
        </div>
        <h2
          className="headline-display uppercase text-ink"
          style={{
            fontSize: 'clamp(2rem, 7.5vw, 3rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.025em',
            margin: 0,
          }}
        >
          Every tool fails the same way.
        </h2>
        <p
          className="font-body"
          style={{
            color: 'rgba(245,245,240,0.65)',
            fontSize: 15,
            lineHeight: 1.55,
            margin: 0,
            marginBottom: 8,
          }}
        >
          Different platforms. Same broken outcome. The tools people
          reach for were never built for organizing sports.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {TOOL_CARDS.map((c) => (
            <article
              key={c.name}
              style={{
                background: 'rgba(15,10,10,0.75)',
                border: '1px solid rgba(245,245,240,0.08)',
                borderRadius: 14,
                padding: '18px 18px 20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginBottom: 10,
                  flexWrap: 'wrap',
                }}
              >
                <h3
                  className="headline-display uppercase text-ink"
                  style={{
                    fontSize: 18,
                    letterSpacing: '-0.02em',
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {c.name}
                </h3>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#ff6b6b',
                    border: '1px solid rgba(255,107,107,0.45)',
                    padding: '3px 8px',
                    borderRadius: 100,
                  }}
                >
                  [ {c.tag} ]
                </span>
              </div>
              <p
                className="font-body"
                style={{
                  color: 'rgba(245,245,240,0.72)',
                  fontSize: 13,
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* BEAT 3 — The Verdict */}
      <div
        style={{
          minHeight: '100vh',
          padding: 'clamp(4rem, 8vh, 6rem) 20px 5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 22,
          textAlign: 'center',
        }}
      >
        <div
          className="mono-eyebrow"
          style={{
            color: '#D4FF3A',
            letterSpacing: '0.25em',
            alignSelf: 'center',
          }}
        >
          [ 03 / 03 · The Verdict ]
        </div>
        <h2
          className="headline-display uppercase text-ink"
          style={{
            fontSize: 'clamp(3.5rem, 18vw, 6rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            margin: 0,
            color: '#F5F5F0',
          }}
        >
          ENOUGH.
        </h2>
        <span
          aria-hidden
          style={{
            display: 'block',
            width: 60,
            height: 3,
            background: '#D4FF3A',
            alignSelf: 'center',
            borderRadius: 2,
          }}
        />

        {/* Stats grid — 2 columns */}
        <div
          style={{
            marginTop: 10,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            textAlign: 'left',
          }}
        >
          <div
            style={{
              background: 'rgba(40,10,10,0.4)',
              border: '1px solid rgba(255,107,107,0.18)',
              borderRadius: 12,
              padding: '14px 12px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 9,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,107,107,0.85)',
                marginBottom: 10,
              }}
            >
              Before
            </div>
            {STATS_BEFORE.map((s) => (
              <div
                key={s.label}
                style={{
                  marginBottom: 10,
                  borderBottom: '1px dashed rgba(255,107,107,0.18)',
                  paddingBottom: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,245,240,0.4)',
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display), Inter, sans-serif',
                    fontWeight: 900,
                    fontSize: 14,
                    letterSpacing: '-0.01em',
                    color: 'rgba(245,245,240,0.85)',
                    marginTop: 2,
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: 'rgba(20,30,15,0.45)',
              border: '1px solid rgba(212,255,58,0.3)',
              borderRadius: 12,
              padding: '14px 12px',
              boxShadow: '0 0 20px rgba(212,255,58,0.08)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 9,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#D4FF3A',
                marginBottom: 10,
              }}
            >
              After
            </div>
            {STATS_AFTER.map((s) => (
              <div
                key={s.label}
                style={{
                  marginBottom: 10,
                  borderBottom: '1px dashed rgba(212,255,58,0.25)',
                  paddingBottom: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,245,240,0.4)',
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display), Inter, sans-serif',
                    fontWeight: 900,
                    fontSize: 14,
                    letterSpacing: '-0.01em',
                    color: '#D4FF3A',
                    marginTop: 2,
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6 promises */}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '14px 0 0',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {PROMISES.map((p) => (
            <li
              key={p}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                fontFamily: 'var(--font-body), Inter, sans-serif',
                fontSize: 14,
                lineHeight: 1.45,
                color: 'rgba(245,245,240,0.85)',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 1,
                  background: '#D4FF3A',
                  marginTop: 10,
                  flexShrink: 0,
                }}
              />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        @keyframes mp-chat-scroll {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}

// ===================================================================
//  Main section
// ===================================================================

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [, force] = useState(0);
  const [isPhone, setIsPhone] = useState(false);

  // Tablet + phone get the static stacked fallback
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 1279px)');
    setIsPhone(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsPhone(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Refs for quickSetters — avoid per-frame React re-renders
  const chatRef = useRef<HTMLDivElement>(null);
  const b1Ref = useRef<HTMLDivElement>(null);
  const b2Ref = useRef<HTMLDivElement>(null);
  const b3Ref = useRef<HTMLDivElement>(null);
  const redFlashRef = useRef<HTMLDivElement>(null);
  const statsBeforeRef = useRef<HTMLDivElement>(null);
  const statsAfterRef = useRef<HTMLDivElement>(null);
  const statsBarRef = useRef<HTMLDivElement>(null);
  const enoughRef = useRef<HTMLHeadingElement>(null);
  const limeLineRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const promisesRef = useRef<HTMLDivElement>(null);
  const nextPillRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // True desktop only (≥1280px) — pinned 3-beat scrub narrative.
      // Anything below (phone + tablet) collapses to a single 100vh
      // frame showing beat 1 statically. No pin, no scrub.
      ScrollTrigger.matchMedia({
        '(min-width: 1280px)': () => {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=250%',
            pin: pinRef.current,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              progressRef.current = p;
              applyScrollState(p);
            },
          });
        },
      });

      // Initial apply — beat 1 at opacity 1, others at 0
      applyScrollState(0);
    }, sectionRef);

    // Force re-render so refs are attached before first onUpdate
    force((n) => n + 1);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pure function — given scroll progress, write styles to all refs
  const applyScrollState = (p: number) => {
    // Chat opacity — 0.60 during B1, 0.20 during B2, 0 during B3
    const chatO =
      p < 0.32
        ? 0.6
        : p < 0.38
        ? lerp(0.6, 0.2, band(p, 0.32, 0.38))
        : p < 0.66
        ? 0.2
        : p < 0.72
        ? lerp(0.2, 0, band(p, 0.66, 0.72))
        : 0;
    if (chatRef.current) chatRef.current.style.opacity = String(chatO);

    // Beat 1 visibility (text right column)
    const b1 = p < 0.32 ? 1 : 1 - band(p, 0.32, 0.38);
    if (b1Ref.current) {
      b1Ref.current.style.opacity = String(b1);
      b1Ref.current.style.transform = `translateY(${(1 - b1) * -18}px)`;
    }

    // Beat 2 visibility
    const b2 = p < 0.32 ? 0 : p < 0.66 ? band(p, 0.32, 0.38) : 1 - band(p, 0.66, 0.72);
    if (b2Ref.current) {
      b2Ref.current.style.opacity = String(b2);
      b2Ref.current.style.transform = `translateY(${(1 - b2) * 18}px)`;
    }

    // Beat 3 visibility
    const b3 = p < 0.66 ? 0 : band(p, 0.66, 0.72);
    if (b3Ref.current) b3Ref.current.style.opacity = String(b3);

    // Red flash — 0→1→0 over 0.28-0.33
    let red = 0;
    if (p >= 0.26 && p <= 0.30) red = band(p, 0.26, 0.30);
    else if (p > 0.30 && p <= 0.33) red = 1 - band(p, 0.30, 0.33);
    if (redFlashRef.current) redFlashRef.current.style.opacity = String(red);

    // Cards individual reveal
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const info = TOOL_CARDS[i];
      const t = band(p, info.appearAt, info.appearAt + 0.04);
      el.style.opacity = String(t);
      el.style.transform = `translateY(${(1 - t) * 24}px)`;
    });

    // Stats bar — appears at 0.40, stays through B2 + B3 (with inverted values)
    const statsVis = p < 0.38 ? 0 : p < 0.42 ? band(p, 0.38, 0.42) : 1;
    if (statsBarRef.current) {
      statsBarRef.current.style.opacity = String(statsVis);
      statsBarRef.current.style.transform = `translateY(${
        (1 - statsVis) * 40
      }px)`;
    }

    // Stats inversion — "after" values take over starting 0.78
    const inv = band(p, 0.78, 0.84);
    if (statsBeforeRef.current) {
      statsBeforeRef.current.style.opacity = String(1 - inv);
      statsBeforeRef.current.style.transform = `translateY(${inv * -10}px)`;
    }
    if (statsAfterRef.current) {
      statsAfterRef.current.style.opacity = String(inv);
      statsAfterRef.current.style.transform = `translateY(${(1 - inv) * 10}px)`;
    }

    // ENOUGH characters
    if (enoughRef.current) {
      const chars = enoughRef.current.querySelectorAll<HTMLSpanElement>(
        '.enough-char'
      );
      chars.forEach((c, i) => {
        const start = 0.72 + i * 0.008;
        const end = start + 0.04;
        const t = band(p, start, end);
        // back.out-style ease (overshoot then settle)
        const back = 1 + Math.pow(t - 1, 3) * 2 + Math.pow(t - 1, 2) * 3;
        const scale = t === 0 ? 0 : back;
        c.style.opacity = String(t);
        c.style.transform = `translateY(${(1 - t) * 40}px) scale(${
          Math.max(0, scale)
        })`;
      });
    }

    // Lime line under ENOUGH — scale X 0→1 at 0.80
    const lineT = band(p, 0.80, 0.84);
    if (limeLineRef.current) {
      limeLineRef.current.style.transform = `scaleX(${lineT})`;
      limeLineRef.current.style.opacity = String(lineT);
    }

    // Supporting statement at 0.85
    const subT = band(p, 0.85, 0.89);
    if (subRef.current) {
      subRef.current.style.opacity = String(subT);
      subRef.current.style.transform = `translateY(${(1 - subT) * 20}px)`;
    }

    // 6 promises stagger 0.88
    if (promisesRef.current) {
      const items = promisesRef.current.querySelectorAll<HTMLDivElement>(
        '.promise'
      );
      items.forEach((el, i) => {
        const start = 0.88 + i * 0.008;
        const end = start + 0.03;
        const t = band(p, start, end);
        el.style.opacity = String(t);
        el.style.transform = `translateY(${(1 - t) * 10}px)`;
      });
    }

    // NEXT pill 0.95
    const nextT = band(p, 0.95, 0.99);
    if (nextPillRef.current) {
      nextPillRef.current.style.opacity = String(nextT);
      nextPillRef.current.style.transform = `scale(${0.9 + nextT * 0.1})`;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="problem"
      data-progress-section
      data-progress-label="02 · The Problem"
      data-palette="problem"
      className="problem-section relative w-full"
      style={
        isPhone
          ? { minHeight: '100vh' }
          : { height: 'var(--problem-height, 350vh)' }
      }
    >
      {isPhone && <MobileProblem />}
      {!isPhone && (
      <div
        ref={pinRef}
        className="relative w-full h-screen overflow-hidden"
      >

        {/* Chat column — left side, dims across beats. Desktop-only.
            Tablet + phone render the beat text column full-width. */}
        <div
          ref={chatRef}
          className="hidden xl:block absolute inset-0 z-[5] pointer-events-none"
          style={{ opacity: 0.6 }}
        >
          <ChatColumn progressRef={progressRef} />
        </div>

        {/* RED FLASH full-viewport vignette (peak chaos) */}
        <div
          ref={redFlashRef}
          aria-hidden
          className="absolute inset-0 z-[20] pointer-events-none"
          style={{
            opacity: 0,
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(180, 30, 30, 0.28) 100%)',
            willChange: 'opacity',
          }}
        />

        {/* Chapter marker (persistent, top-left) */}
        <ChapterMarker progressRef={progressRef} />

        {/* ============================================================
            BEAT 1 — THE CHAOS (right column text block)
            ============================================================ */}
        <div
          ref={b1Ref}
          className="absolute inset-0 z-[30] grid-12 items-center pointer-events-none"
        >
          <div className="col-span-12 xl:col-start-7 xl:col-span-5 pointer-events-auto px-4 xl:px-0">
            <div className="mono-eyebrow mb-6 text-[#ff6b6b]">
              01 ── The Chaos
            </div>

            <blockquote
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(1.25rem, 1.8vw, 1.6rem)',
                lineHeight: 1.3,
                fontStyle: 'italic',
                color: 'rgba(245,245,240,0.85)',
                maxWidth: '38ch',
                marginBottom: '2rem',
                borderLeft: '2px solid #D4FF3A',
                paddingLeft: 18,
              }}
            >
              <span style={{ color: '#D4FF3A' }}>“</span>I want to play football
              today, but I don&apos;t know if there&apos;s a match.
              <span style={{ color: '#D4FF3A' }}>”</span>
            </blockquote>

            <h2
              className="headline-display uppercase text-ink mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 5.2vw, 4.75rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
              }}
            >
              This is how
              <br />
              most matches
              <br />
              get organized.
            </h2>

            <p
              className="font-body"
              style={{
                color: 'rgba(245,245,240,0.6)',
                fontSize: 16,
                lineHeight: 1.55,
                maxWidth: '42ch',
              }}
            >
              Every week, in every city. Students on campus. People new to
              town. Anyone who just wants to play. The plan lives inside a
              group chat that nobody can actually read — 47 unread messages,
              half-confirmations, last-minute cancellations. By kickoff,
              nobody knows who&apos;s actually showing up. Sometimes half the
              team doesn&apos;t.
            </p>
          </div>
        </div>

        {/* ============================================================
            BEAT 2 — THE DIAGNOSIS
            ============================================================ */}
        <div
          ref={b2Ref}
          className="absolute inset-0 z-[30] grid-12 items-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="col-span-12 xl:col-start-2 xl:col-span-4 pointer-events-auto px-4 xl:px-0">
            <div className="mono-eyebrow mb-6 text-lime">02 ── The Diagnosis</div>
            <h2
              className="headline-display uppercase text-ink mb-5"
              style={{
                fontSize: 'clamp(2.5rem, 5.2vw, 4.75rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
              }}
            >
              Every tool
              <br />
              fails the
              <br />
              same way.
            </h2>
            <p
              className="font-body"
              style={{
                color: 'rgba(245,245,240,0.6)',
                fontSize: 16,
                lineHeight: 1.55,
                maxWidth: '38ch',
              }}
            >
              Different platforms. Same broken outcome. The tools people reach
              for were never built for organizing sports.
            </p>
          </div>

          <div className="col-span-12 xl:col-start-7 xl:col-span-5 pointer-events-auto px-4 xl:px-0">
            <div className="flex flex-col gap-5">
              {TOOL_CARDS.map((c, i) => (
                <div
                  key={c.name}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  style={{
                    opacity: 0,
                    padding: '18px 20px',
                    borderRadius: 14,
                    background:
                      'linear-gradient(140deg, #141414 0%, #0e0e0e 100%)',
                    border: '1px solid rgba(245,245,240,0.08)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className="headline-display uppercase"
                      style={{
                        fontSize: 22,
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                      }}
                    >
                      {c.name}
                    </h3>
                    <span
                      style={{
                        height: 1,
                        flex: 1,
                        background:
                          'linear-gradient(90deg, #D4FF3A, rgba(212,255,58,0) 90%)',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      color: 'rgba(245,245,240,0.65)',
                      fontSize: 13.5,
                      lineHeight: 1.45,
                      marginBottom: 10,
                    }}
                  >
                    {c.body}
                  </p>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 9,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#ff6b6b',
                    }}
                  >
                    [ {c.tag} ]
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            BEAT 3 — THE VERDICT (centered)
            ============================================================ */}
        <div
          ref={b3Ref}
          className="absolute inset-0 z-[35] flex flex-col items-center justify-center pointer-events-none px-6"
          style={{ opacity: 0 }}
        >
          <div className="mono-eyebrow mb-6 text-lime">03 ── The Verdict</div>
          <h2
            ref={enoughRef}
            className="headline-display uppercase text-ink"
            style={{
              fontSize: 'clamp(5rem, 13vw, 12rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              textAlign: 'center',
              display: 'inline-flex',
              gap: 0,
            }}
          >
            {'ENOUGH.'.split('').map((c, i) => (
              <span
                key={i}
                className="enough-char"
                style={{
                  display: 'inline-block',
                  opacity: 0,
                  transform: 'translateY(40px) scale(0)',
                  willChange: 'transform, opacity',
                }}
              >
                {c}
              </span>
            ))}
          </h2>

          <span
            ref={limeLineRef}
            className="block mt-4 mb-7"
            style={{
              height: 2,
              width: '28%',
              background: '#D4FF3A',
              transformOrigin: 'center',
              transform: 'scaleX(0)',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          />

          <div
            ref={subRef}
            className="headline-display text-ink mb-10 text-center"
            style={{
              fontSize: 'clamp(1.5rem, 3.2vw, 2.6rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              opacity: 0,
              willChange: 'transform, opacity',
              maxWidth: '22ch',
            }}
          >
            The game deserves better tools.
          </div>

          <div
            ref={promisesRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 w-full max-w-[720px]"
          >
            {PROMISES.map((p, i) => (
              <div
                key={i}
                className="promise flex items-center gap-3"
                style={{
                  opacity: 0,
                  willChange: 'transform, opacity',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 14,
                    height: 1.5,
                    background: '#D4FF3A',
                    flex: '0 0 auto',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'rgba(245,245,240,0.85)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.25,
                  }}
                >
                  {p}
                </span>
              </div>
            ))}
          </div>

          <div
            ref={nextPillRef}
            className="mt-10"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#D4FF3A',
              padding: '8px 16px',
              border: '1px solid rgba(212,255,58,0.4)',
              borderRadius: 100,
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            [ Next: what we built ↓ ]
          </div>
        </div>

        {/* ============================================================
            STATS BAR — bottom of pinned viewport
            ============================================================ */}
        <div
          ref={statsBarRef}
          className="absolute left-0 right-0 z-[40] pointer-events-none"
          style={{
            bottom: 0,
            opacity: 0,
            borderTop: '1px solid rgba(245,245,240,0.08)',
            background: 'rgba(5,5,5,0.85)',
            backdropFilter: 'blur(6px)',
            willChange: 'transform, opacity',
          }}
        >
          <div
            className="grid-12 py-4 items-center"
            style={{ position: 'relative' }}
          >
            <div
              className="col-span-12 md:col-start-2 md:col-span-10 flex items-center gap-6"
              style={{ position: 'relative' }}
            >
              {/* Live status dot */}
              <StatusDot />

              {/* Two stacked rows cross-fade (before → after) */}
              <div style={{ position: 'relative', flex: 1 }}>
                <div
                  ref={statsBeforeRef}
                  className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {STATS_BEFORE.map((s) => (
                    <div key={s.label}>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 9,
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          color: 'rgba(245,245,240,0.45)',
                          display: 'block',
                          marginBottom: 2,
                        }}
                      >
                        {s.label}
                      </span>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 12,
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: '#F5F5F0',
                        }}
                      >
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  ref={statsAfterRef}
                  className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    willChange: 'transform, opacity',
                  }}
                >
                  {STATS_AFTER.map((s) => (
                    <div key={s.label}>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 9,
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          color: 'rgba(245,245,240,0.45)',
                          display: 'block',
                          marginBottom: 2,
                        }}
                      >
                        {s.label}
                      </span>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 12,
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: '#D4FF3A',
                        }}
                      >
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <CornerBrackets />
      </div>
      )}
    </section>
  );
}

// ===================================================================
//  Status dot — red in chaos/diagnosis, lime in verdict
// ===================================================================

function StatusDot() {
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <span
      className="flex items-center gap-2 shrink-0"
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(245,245,240,0.55)',
      }}
    >
      <span
        ref={dotRef}
        style={{
          display: 'inline-block',
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#ff6b6b',
          boxShadow: '0 0 10px rgba(255,107,107,0.55)',
          animation: 'statusPulse 1.4s ease-in-out infinite',
        }}
      />
      <span ref={labelRef}>Live status</span>
      <style jsx>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
      `}</style>
    </span>
  );
}

// ===================================================================
//  Chapter marker — top-left, sticky across beats
// ===================================================================

function ChapterMarker({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (ref.current) {
        const p = progressRef.current;
        const label =
          p < 0.35 ? '01 · The Chaos' : p < 0.70 ? '02 · The Diagnosis' : '03 · The Verdict';
        ref.current.textContent = `[ Chapter 02 · ${label} ]`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);
  return (
    <div
      ref={ref}
      className="absolute z-[45] top-20 left-6 md:left-10 pointer-events-none font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-lime"
    >
      [ Chapter 02 · The Chaos ]
    </div>
  );
}
