'use client';

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ===================================================================
//  Problem — group-chat chaos vs confirmed lineup, controlled by drag.
//
//  Layout: one aligned column. Eyebrow · headline · sub · slider panel
//  · 3-up stat row.
//
//  Slider panel — two stacked layers:
//   - BASE  = calm: the real confirmed-lineup app screenshot.
//   - OVER  = chaos: a faux WhatsApp group chat with chaotic messages,
//             clipped to the left of the handle via
//             clip-path: inset(0 calc(100% - var(--x-pct)) 0 0).
//  A vertical handle with a lime knob sits at var(--x-pct). User drag
//  updates --x (0..1) and --x-pct (e.g. 54%). Stats cross-fade on --x.
//
//  No WebGL shader — concrete UI beats abstract noise for "show the
//  problem". The chat IS the problem.
//
//  ALL animated state lives in JS (GSAP / direct DOM writes). CSS holds
//  static styles only.
// ===================================================================

type Msg = {
  sender: string;
  color: string; // sender name accent (WhatsApp-style per-name colors)
  text: string;
  time: string;
};

// Chaotic group chat — multiple voices, contradictions, no answer.
const MESSAGES: Msg[] = [
  { sender: 'Karim',   color: '#06CF9C', text: "who's in tonight??",              time: '18:42' },
  { sender: 'Yassine', color: '#7DD7FA', text: 'thought it was Friday now',       time: '18:44' },
  { sender: 'Said',    color: '#FFB86C', text: "can't make it sorry 🙏",          time: '18:51' },
  { sender: '+212 6…', color: '#E48EFF', text: 'cancelled?',                      time: '19:02' },
  { sender: 'Mehdi',   color: '#FF8E8E', text: '+3?',                             time: '19:08' },
  { sender: 'Reda',    color: '#06CF9C', text: '🤷',                              time: '19:14' },
  { sender: 'Hicham',  color: '#FFB86C', text: 'who is captain again',            time: '19:23' },
  { sender: 'Karim',   color: '#06CF9C', text: 'still need 2 ppl ⚠️',             time: '19:31' },
  { sender: 'Anas',    color: '#7DD7FA', text: 'east field or south?',            time: '19:42' },
  { sender: 'Yassine', color: '#7DD7FA', text: 'wait — is it on?',                time: '20:01' },
];

const STATS = [
  { label: 'Messages',   before: '47 unread', after: '0' },
  { label: 'Lineup',     before: 'unknown',   after: '11 / 11' },
  { label: 'Organizers', before: 'exhausted', after: 'hands-free' },
];

// ===================================================================
//  Component
// ===================================================================

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const msgRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [reducedMotion, setReducedMotion] = useState(false);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const upd = () => setReducedMotion(rm.matches);
    upd();
    rm.addEventListener('change', upd);
    return () => rm.removeEventListener('change', upd);
  }, []);

  // ---- Write --x and --x-pct + ARIA + stat opacities (one place) ----
  const writeX = useCallback((x01: number) => {
    const clamped = Math.max(0.04, Math.min(0.96, x01));
    const stage = sliderRef.current;
    if (!stage) return;
    stage.style.setProperty('--x', String(clamped));
    stage.style.setProperty('--x-pct', `${clamped * 100}%`);
    if (handleRef.current) {
      handleRef.current.setAttribute('aria-valuenow', String(Math.round(clamped * 100)));
    }
    statRefs.current.forEach((el) => {
      if (!el) return;
      const before = el.querySelector<HTMLElement>('[data-state="before"]');
      const after = el.querySelector<HTMLElement>('[data-state="after"]');
      if (before) before.style.opacity = String(clamped);
      if (after) after.style.opacity = String(1 - clamped);
    });
  }, []);

  // ---- Drag ----
  const cachedRectRef = useRef<DOMRect | null>(null);
  const draggingRef = useRef(false);
  const cancelHintRef = useRef<(() => void) | null>(null);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!trackRef.current) return;
      draggingRef.current = true;
      userInteractedRef.current = true;
      cancelHintRef.current?.();
      cachedRectRef.current = trackRef.current.getBoundingClientRect();
      trackRef.current.setPointerCapture(e.pointerId);
      const rect = cachedRectRef.current;
      writeX((e.clientX - rect.left) / rect.width);
    },
    [writeX]
  );
  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      const rect = cachedRectRef.current;
      if (!rect) return;
      writeX((e.clientX - rect.left) / rect.width);
    },
    [writeX]
  );
  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    try { trackRef.current?.releasePointerCapture(e.pointerId); } catch {}
  }, []);

  // ---- Keyboard ----
  const onKey = useCallback(
    (e: ReactKeyboardEvent<HTMLButtonElement>) => {
      const stage = sliderRef.current;
      if (!stage) return;
      const current = parseFloat(stage.style.getPropertyValue('--x') || '0.54') || 0.54;
      let next = current;
      const step = e.shiftKey ? 0.1 : 0.04;
      switch (e.key) {
        case 'ArrowLeft':  next = current - step; break;
        case 'ArrowRight': next = current + step; break;
        case 'Home':       next = 0.04; break;
        case 'End':        next = 0.96; break;
        case 'PageDown':   next = current - 0.2; break;
        case 'PageUp':     next = current + 0.2; break;
        default: return;
      }
      e.preventDefault();
      userInteractedRef.current = true;
      cancelHintRef.current?.();
      writeX(next);
    },
    [writeX]
  );

  // ---- Init position, auto-hint sweep, message reveal ----
  useEffect(() => {
    if (!sliderRef.current) return;

    // Initial position — slightly favoring chaos so the contrast reads.
    writeX(0.54);

    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Messages fade in with stagger when slider enters viewport — feels
      // like the chat is actively filling with noise.
      gsap.set(msgRefs.current.filter(Boolean), { opacity: 0, y: 8 });
      ScrollTrigger.create({
        trigger: sliderRef.current!,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(msgRefs.current.filter(Boolean) as HTMLDivElement[], {
            opacity: 1,
            y: 0,
            duration: 0.32,
            stagger: 0.07,
            ease: 'power2.out',
          });
        },
      });

      // Auto-hint sweep — once on view; killed on first user interaction.
      const proxy = { x: 0.54 };
      let hintTl: gsap.core.Timeline | null = null;
      const fire = () => {
        if (userInteractedRef.current || hintTl) return;
        hintTl = gsap.timeline({
          delay: 0.8,
          onComplete: () => { hintTl = null; },
        });
        hintTl.to(proxy, {
          x: 0.78,
          duration: 0.9,
          ease: 'power2.inOut',
          onUpdate: () => writeX(proxy.x),
        });
        hintTl.to(proxy, {
          x: 0.30,
          duration: 1.3,
          ease: 'power2.inOut',
          onUpdate: () => writeX(proxy.x),
        });
        hintTl.to(proxy, {
          x: 0.54,
          duration: 0.9,
          ease: 'power2.inOut',
          onUpdate: () => writeX(proxy.x),
        });
      };
      cancelHintRef.current = () => {
        if (hintTl) { hintTl.kill(); hintTl = null; }
      };

      const hintTrigger = ScrollTrigger.create({
        trigger: sliderRef.current!,
        start: 'top 65%',
        once: true,
        onEnter: fire,
      });

      return () => {
        hintTrigger.kill();
      };
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion, writeX]);

  return (
    <section
      ref={sectionRef}
      id="problem"
      data-progress-section
      data-progress-label="The Problem"
      data-palette="problem"
      className="relative"
      style={{
        background: 'transparent',
        padding: 'clamp(6rem, 12vh, 10rem) 0 clamp(5rem, 10vh, 8rem)',
        overflow: 'hidden',
      }}
    >
      <div className="problem-grid">
        <div className="problem-eyebrow" data-reveal>the problem</div>
        <h2 className="problem-headline" data-reveal>
          Matches die in the{' '}
          <span style={{ color: 'var(--lime)' }}>chat</span>, not on the
          pitch.
        </h2>
        <p className="problem-sub" data-reveal>
          Group chats weren&apos;t built for this. Drag to see what should
          have been there.
        </p>

        {/* SLIDER PANEL */}
        <div
          ref={sliderRef}
          className="problem-slider"
          style={
            {
              '--x': 0.54,
              '--x-pct': '54%',
            } as CSSProperties
          }
        >
          {/* BASE — calm: the solution, framed clearly */}
          <div className="problem-calm" aria-hidden>
            <div className="problem-calm-tint" />

            {/* Big in-panel banner — names the side so the comparison is
                obvious without reading the surrounding copy. */}
            <div className="side-banner side-banner-calm">
              <div className="side-banner-eyebrow">
                <span className="side-banner-dot side-banner-dot-lime" />
                the sporttimes way
              </div>
              <div className="side-banner-title">
                11/11 in seconds.
              </div>
              <div className="side-banner-sub">
                See who's playing. See the lineup fill. Show up.
              </div>
            </div>

            <div className="calm-stage">
              <div className="calm-info">
                <div className="calm-info-eyebrow">
                  <span className="calm-info-check" aria-hidden>✓</span>
                  match confirmed
                </div>
                <div className="calm-info-big">11/11</div>
                <ul className="calm-info-list">
                  <li>
                    <span className="calm-info-key">when</span>
                    <span className="calm-info-val">Sunday · 18:30</span>
                  </li>
                  <li>
                    <span className="calm-info-key">where</span>
                    <span className="calm-info-val">East Field</span>
                  </li>
                  <li>
                    <span className="calm-info-key">format</span>
                    <span className="calm-info-val">4-3-3 · 11v11</span>
                  </li>
                </ul>
              </div>
              <div className="calm-phone">
                <Image
                  src="/screens/problem-lineup.png"
                  alt=""
                  fill
                  sizes="(max-width: 880px) 220px, 360px"
                  quality={92}
                  priority
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
            </div>
          </div>

          {/* OVERLAY — chaos: faux WhatsApp group chat, clipped left */}
          <div className="problem-chaos" aria-hidden>
            {/* Big in-panel banner — names this side so the comparison
                is obvious without reading the surrounding copy. */}
            <div className="side-banner side-banner-chaos">
              <div className="side-banner-eyebrow">
                <span className="side-banner-dot side-banner-dot-red" />
                the group chat way
              </div>
              <div className="side-banner-title">
                47 messages. No lineup.
              </div>
              <div className="side-banner-sub">
                Plans live inside threads nobody can actually read.
              </div>
            </div>

            {/* Chat header */}
            <div className="wa-header">
              <div className="wa-header-avatar">
                UG
                <span className="wa-header-badge" aria-hidden>47</span>
              </div>
              <div className="wa-header-meta">
                <div className="wa-header-name">United Group</div>
                <div className="wa-header-sub wa-header-sub-alert">
                  47 unread · still no lineup
                </div>
              </div>
              <div className="wa-header-icons">
                <span className="wa-header-icon" aria-hidden>⋮</span>
              </div>
            </div>

            {/* Chat body with messages */}
            <div className="wa-body">
              {/* Date divider */}
              <div className="wa-divider">
                <span>TODAY</span>
              </div>

              {MESSAGES.map((m, i) => (
                <div
                  key={i}
                  ref={(el) => { msgRefs.current[i] = el; }}
                  className="wa-msg"
                >
                  <div className="wa-msg-bubble">
                    <div className="wa-msg-sender" style={{ color: m.color }}>
                      {m.sender}
                    </div>
                    <div className="wa-msg-text">{m.text}</div>
                    <div className="wa-msg-time">{m.time}</div>
                  </div>
                </div>
              ))}

              {/* Typing indicator — three dots, conveys the chat is still alive */}
              <div className="wa-typing" aria-hidden>
                <span /><span /><span />
              </div>
            </div>

            {/* Composer (visual only) */}
            <div className="wa-composer" aria-hidden>
              <div className="wa-composer-input">Type a message…</div>
              <div className="wa-composer-send">→</div>
            </div>

          </div>

          {/* TRACK + HANDLE — pointer area + keyboard slider */}
          <div
            ref={trackRef}
            className="problem-track"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className="problem-divider" aria-hidden />
            <button
              ref={handleRef}
              type="button"
              className="problem-handle"
              role="slider"
              aria-label="Reveal the calm by dragging the handle"
              aria-valuemin={4}
              aria-valuemax={96}
              aria-valuenow={54}
              aria-orientation="vertical"
              onKeyDown={onKey}
            >
              <span className="problem-knob" aria-hidden>
                <span className="problem-knob-arrow">‹</span>
                <span className="problem-knob-arrow">›</span>
              </span>
            </button>
          </div>
        </div>

        {/* STATS — cross-fade with --x */}
        <div className="problem-stats" role="group" aria-label="Before vs after at a glance">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              ref={(el) => { statRefs.current[i] = el; }}
              className="problem-stat"
            >
              <div className="problem-stat-label">{s.label}</div>
              <div className="problem-stat-values">
                <span data-state="before" className="problem-stat-before">
                  {s.before}
                </span>
                <span data-state="after" className="problem-stat-after">
                  {s.after}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .problem-grid {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 56px);
          display: flex;
          flex-direction: column;
          gap: clamp(20px, 3vh, 32px);
        }
        .problem-eyebrow {
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--lime);
        }
        .problem-headline {
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 900;
          font-size: clamp(2rem, 4.4vw, 3.6rem);
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--ink, #F5F5F0);
          margin: 0;
          max-width: 16ch;
        }
        .problem-sub {
          font-family: var(--font-body), Inter, sans-serif;
          font-size: 16px;
          line-height: 1.55;
          color: rgba(245, 245, 240, 0.62);
          margin: 0 0 8px;
          max-width: 60ch;
        }

        /* ---- Slider panel ---- */
        .problem-slider {
          position: relative;
          width: 100%;
          height: clamp(520px, 72vh, 740px);
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(245, 245, 240, 0.10);
          background: #0F1410;
          touch-action: pan-y;
          user-select: none;
          isolation: isolate;
        }

        /* Calm base — flex column: side banner (problem/solution label)
           on top, calm-stage (phone + info) filling the rest. */
        .problem-calm {
          position: absolute;
          inset: 0;
          z-index: 1;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(ellipse 60% 70% at 78% 50%,
              rgba(212, 255, 58, 0.07) 0%,
              transparent 60%),
            linear-gradient(180deg, #0F1410 0%, #0B1310 100%);
        }
        .problem-calm-tint {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(11,19,16,0.0) 0%, rgba(11,19,16,0.35) 100%);
          pointer-events: none;
          z-index: 1;
        }
        /* Pack info + phone together on the RIGHT of the calm panel.
           Reasons:
           1. The handle's default position is ~54%, so the right 46% of
              the panel is calm. Anchoring the content there means the
              user always sees a composed group, never empty space.
           2. As the user drags the handle leftward, the info card is the
              first thing to emerge beside the phone — that IS the reveal
              payoff for the interaction.
           3. The empty left of calm-stage stays dark and is covered by
              chaos at any reasonable handle position. */
        .calm-stage {
          position: relative;
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: clamp(20px, 2.5vw, 36px);
          padding: clamp(8px, 1.5vh, 18px) clamp(24px, 4vw, 56px) clamp(18px, 3vh, 32px);
        }
        .calm-info {
          flex-shrink: 0;
          width: clamp(220px, 24vw, 300px);
          display: flex;
          flex-direction: column;
          gap: 14px;
          color: #F5F5F0;
        }
        .calm-info-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--lime);
        }
        .calm-info-check {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: var(--lime);
          color: #0A0A0A;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 11px;
          line-height: 1;
        }
        .calm-info-big {
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 900;
          font-size: clamp(3rem, 6vw, 4.8rem);
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: #F5F5F0;
        }
        .calm-info-list {
          list-style: none;
          padding: 0;
          margin: 4px 0 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid rgba(245, 245, 240, 0.08);
          padding-top: 16px;
        }
        .calm-info-list li {
          display: flex;
          align-items: baseline;
          gap: 14px;
        }
        .calm-info-key {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245, 245, 240, 0.4);
          min-width: 56px;
        }
        .calm-info-val {
          font-family: var(--font-body), Inter, sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: rgba(245, 245, 240, 0.88);
        }
        .calm-phone {
          position: relative;
          height: 100%;
          max-height: 100%;
          aspect-ratio: 9 / 19.5;
          flex-shrink: 0;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(245, 245, 240, 0.10);
          box-shadow:
            0 0 0 1px rgba(212, 255, 58, 0.06),
            0 30px 70px rgba(0, 0, 0, 0.55);
          background: #060707;
        }
        .calm-phone :global(img) {
          padding: 0; /* fully cover the framed area, no inner letterbox */
        }

        /* Chaos overlay — clipped to the left of the handle */
        .problem-chaos {
          position: absolute;
          inset: 0;
          z-index: 2; /* always above calm; clipped via clip-path */
          isolation: isolate;
          background: #0B141A; /* WhatsApp dark backdrop */
          clip-path: inset(0 calc(100% - var(--x-pct)) 0 0);
          -webkit-clip-path: inset(0 calc(100% - var(--x-pct)) 0 0);
          display: flex;
          flex-direction: column;
          /* subtle wallpaper — quiet diagonal noise, scoped, static */
          background-image:
            radial-gradient(circle at 25% 30%, rgba(255,255,255,0.012) 0 1.5px, transparent 2px),
            radial-gradient(circle at 75% 70%, rgba(255,255,255,0.012) 0 1.5px, transparent 2px),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.008) 0 1px, transparent 2px);
          background-size: 24px 24px, 32px 32px, 18px 18px;
        }

        /* WhatsApp header */
        .wa-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: #1F2C34;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
        }
        .wa-header-avatar {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          background: linear-gradient(135deg, #6B7280 0%, #374151 100%);
          color: #E9EDEF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.04em;
        }
        .wa-header-meta {
          flex: 1;
          min-width: 0;
        }
        .wa-header-name {
          color: #E9EDEF;
          font-family: var(--font-body), Inter, sans-serif;
          font-weight: 600;
          font-size: 15px;
          line-height: 1.1;
        }
        .wa-header-sub {
          color: #8696A0;
          font-family: var(--font-body), Inter, sans-serif;
          font-size: 12px;
          margin-top: 3px;
        }
        .wa-header-icons {
          display: flex;
          gap: 16px;
          color: #AEBAC1;
          font-size: 18px;
        }

        /* Body */
        .wa-body {
          flex: 1;
          overflow: hidden;
          padding: 14px 16px 6px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }
        .wa-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 4px 0 10px;
        }
        .wa-divider span {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          color: #8696A0;
          background: rgba(31, 44, 52, 0.85);
          padding: 4px 12px;
          border-radius: 999px;
        }

        .wa-msg {
          display: flex;
          justify-content: flex-start;
        }
        .wa-msg-bubble {
          max-width: 78%;
          background: #1F2C34;
          color: #E9EDEF;
          padding: 7px 10px 6px 11px;
          border-radius: 8px;
          border-top-left-radius: 2px;
          box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
          position: relative;
          min-width: 60px;
        }
        .wa-msg-sender {
          font-family: var(--font-body), Inter, sans-serif;
          font-weight: 600;
          font-size: 12.5px;
          line-height: 1.1;
          margin-bottom: 2px;
        }
        .wa-msg-text {
          font-family: var(--font-body), Inter, sans-serif;
          font-size: 14px;
          line-height: 1.3;
          color: #E9EDEF;
          padding-right: 44px;
          word-wrap: break-word;
        }
        .wa-msg-time {
          position: absolute;
          right: 8px;
          bottom: 4px;
          font-family: var(--font-body), Inter, sans-serif;
          font-size: 10.5px;
          color: rgba(233, 237, 239, 0.45);
        }

        /* Typing indicator */
        .wa-typing {
          align-self: flex-start;
          background: #1F2C34;
          padding: 9px 12px;
          border-radius: 12px;
          border-top-left-radius: 2px;
          display: inline-flex;
          gap: 4px;
          margin-top: 2px;
        }
        .wa-typing span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(233, 237, 239, 0.55);
          display: inline-block;
        }

        /* Composer */
        .wa-composer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #1F2C34;
          flex-shrink: 0;
        }
        .wa-composer-input {
          flex: 1;
          background: #2A3942;
          color: #8696A0;
          font-family: var(--font-body), Inter, sans-serif;
          font-size: 13px;
          padding: 9px 14px;
          border-radius: 999px;
        }
        .wa-composer-send {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          background: #00A884;
          color: #E9EDEF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
        }

        /* Side banners — name each half of the slider in a real flex
           strip at the top, so the comparison reads at a glance even
           without any drag interaction.

           Lives inside the chaos / calm panel, so the clip-path naturally
           reveals each side's banner together with its content. */
        .side-banner {
          flex-shrink: 0;
          padding: clamp(14px, 2vh, 22px) clamp(18px, 3vw, 28px);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .side-banner-chaos {
          background: linear-gradient(180deg, rgba(60, 14, 14, 0.55) 0%, rgba(28, 10, 10, 0.0) 100%);
          border-bottom: 1px solid rgba(255, 100, 100, 0.14);
        }
        .side-banner-calm {
          align-items: flex-end;
          text-align: right;
          background: linear-gradient(180deg, rgba(15, 30, 22, 0.6) 0%, rgba(10, 18, 14, 0.0) 100%);
          border-bottom: 1px solid rgba(212, 255, 58, 0.18);
        }
        .side-banner-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono), monospace;
          font-size: 10.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }
        .side-banner-chaos .side-banner-eyebrow { color: #FF8B8B; }
        .side-banner-calm  .side-banner-eyebrow { color: var(--lime); }
        .side-banner-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 999px;
        }
        .side-banner-dot-red  { background: #FF6B6B; box-shadow: 0 0 10px rgba(255, 107, 107, 0.6); }
        .side-banner-dot-lime { background: var(--lime); box-shadow: 0 0 10px rgba(212, 255, 58, 0.6); }
        .side-banner-title {
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 900;
          font-size: clamp(1.4rem, 2vw, 1.9rem);
          line-height: 1.05;
          letter-spacing: -0.025em;
          color: #F5F5F0;
        }
        .side-banner-sub {
          font-family: var(--font-body), Inter, sans-serif;
          font-size: 13px;
          line-height: 1.4;
          color: rgba(245, 245, 240, 0.62);
          max-width: 34ch;
        }

        /* Red unread badge on the WhatsApp avatar — visceral chaos cue */
        .wa-header-avatar { position: relative; }
        .wa-header-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          min-width: 22px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: #FF3B30;
          color: #FFFFFF;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow: 0 0 0 2px #1F2C34;
        }
        .wa-header-sub-alert {
          color: #FFB4B4 !important;
        }

        /* Drag track + handle */
        .problem-track {
          position: absolute;
          inset: 0;
          z-index: 10;
          cursor: ew-resize;
        }
        .problem-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          left: var(--x-pct);
          width: 2px;
          margin-left: -1px;
          background: linear-gradient(180deg,
            rgba(212, 255, 58, 0.0) 0%,
            rgba(212, 255, 58, 0.6) 50%,
            rgba(212, 255, 58, 0.0) 100%);
          pointer-events: none;
        }
        .problem-handle {
          position: absolute;
          top: 50%;
          left: var(--x-pct);
          width: 56px;
          height: 56px;
          margin: -28px 0 0 -28px;
          padding: 0;
          border-radius: 999px;
          background: transparent;
          border: none;
          color: inherit;
          cursor: ew-resize;
          outline: none;
          touch-action: none;
        }
        .problem-handle:focus-visible .problem-knob {
          box-shadow:
            0 0 0 3px rgba(212, 255, 58, 0.35),
            0 8px 22px rgba(0, 0, 0, 0.45);
        }
        .problem-knob {
          position: absolute;
          inset: 6px;
          border-radius: 999px;
          background: #0E1512;
          border: 2px solid var(--lime);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6px;
          color: var(--lime);
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 900;
          line-height: 1;
          font-size: 18px;
          box-shadow:
            0 0 0 6px rgba(212, 255, 58, 0.10),
            0 12px 28px rgba(0, 0, 0, 0.55);
        }
        .problem-knob-arrow {
          opacity: 0.85;
        }

        /* Stats row */
        .problem-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 3vw, 40px);
          padding: 18px 0 0;
          border-top: 1px solid rgba(245, 245, 240, 0.08);
        }
        .problem-stat-label {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245, 245, 240, 0.45);
          margin-bottom: 8px;
        }
        .problem-stat-values {
          position: relative;
          min-height: 26px;
          font-family: var(--font-mono), monospace;
          font-size: 17px;
          font-weight: 600;
        }
        .problem-stat-before,
        .problem-stat-after {
          position: absolute;
          left: 0;
          top: 0;
          white-space: nowrap;
        }
        .problem-stat-before {
          color: rgba(245, 245, 240, 0.55);
          text-decoration: line-through;
          text-decoration-color: rgba(245, 245, 240, 0.25);
        }
        .problem-stat-after {
          color: var(--lime);
          font-weight: 700;
        }

        @media (max-width: 880px) {
          .problem-slider { height: clamp(440px, 64vh, 600px); }
          .wa-msg-bubble { max-width: 86%; padding: 6px 10px 6px 10px; }
          .wa-msg-text { font-size: 13px; padding-right: 38px; }
          .wa-header { padding: 12px 14px; }
          .wa-header-avatar { width: 34px; height: 34px; font-size: 11px; }
          .wa-header-name { font-size: 14px; }
          .wa-body { padding: 12px 12px 4px; gap: 6px; }
          .calm-stage { padding: 14px; gap: 12px; }
          .calm-info { width: 150px; gap: 10px; }
          .calm-info-big { font-size: 2.4rem; }
          .calm-info-list { gap: 6px; padding-top: 10px; }
          .calm-info-val { font-size: 12px; }
          .calm-info-key { min-width: 40px; font-size: 9px; }
          .problem-stats {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .problem-stat-values { min-height: 22px; font-size: 15px; }
        }
      `}</style>
    </section>
  );
}
