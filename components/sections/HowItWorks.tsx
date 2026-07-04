'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ===================================================================
//  How It Works — ONE pinned, scroll-scrubbed cinematic stage.
//
//  Scroll is the camera: a single 100vh stage is pinned for ~2600px;
//  during that window the device rotates in CSS 3D, three crossfaded
//  layers cycle through (community → lineup-fill → confirmed), and
//  three depth chips lift on Z to hover in front of the glass.
//
//  Stage tone breaks the dark body with a desaturated turf-at-dusk
//  slate-green (#161C18) easing in/out of the base #08090A via a
//  scroll-driven --stage-bg custom property — no white, no hard seam.
//
//  Performance: only transform + opacity are tweened. Aurora blur is
//  static. The stage-bg is the single full-bleed paint exception.
// ===================================================================

type Step = {
  num: string;
  head: string;
  sub: string;
  src: string;
  alt: string;
};

const STEPS: Step[] = [
  {
    num: '01',
    head: 'Open your community.',
    sub:
      'Campus, city, club, workplace — find the squad you actually play with.',
    src: '/screens/howitworks-community.png',
    alt:
      'A SportTimes community page showing nearby squads with public and private badges.',
  },
  {
    num: '02',
    head: 'See the lineup form.',
    sub:
      "Positions claim themselves in real time — who's playing, and where.",
    src: '/screens/howitworks-lineup.png',
    alt:
      'A live lineup view in the SportTimes app filling into a 4-3-3 formation.',
  },
  {
    num: '03',
    head: 'Confirmed.',
    sub:
      'One tap. Captain approves. Show up at the right field at the right time.',
    src: '/screens/howitworks-jumpin.png',
    alt:
      'A player profile in the SportTimes app showing the confirmed slot and match details.',
  },
];

// 11 avatar positions for the 4-3-3 fill (% of the pitch overlay area).
// Tuned to sit cleanly over the lineup screenshot's formation rows.
const FORMATION_433: Array<{ x: number; y: number; tone: 'lime' | 'paper' }> = [
  // Forwards
  { x: 22, y: 16, tone: 'lime' },
  { x: 50, y: 12, tone: 'lime' },
  { x: 78, y: 16, tone: 'lime' },
  // Midfield
  { x: 28, y: 36, tone: 'paper' },
  { x: 50, y: 40, tone: 'paper' },
  { x: 72, y: 36, tone: 'paper' },
  // Defense
  { x: 18, y: 60, tone: 'paper' },
  { x: 40, y: 62, tone: 'paper' },
  { x: 60, y: 62, tone: 'paper' },
  { x: 82, y: 60, tone: 'paper' },
  // Keeper
  { x: 50, y: 86, tone: 'lime' },
];

// Three depth chips — anchored to the device, lifted on translateZ
// so they hover in front of the glass when the device rotates.
type Chip = {
  eyebrow: string;
  title: string;
  tone: 'lime' | 'paper';
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  z: number; // px on Z
  rotate: number;
};

const CHIPS: Chip[] = [
  {
    eyebrow: 'Join request',
    title: 'Approved',
    tone: 'paper',
    top: '12%',
    right: '-22%',
    z: 80,
    rotate: 3,
  },
  {
    eyebrow: 'Slot filled',
    title: 'Karim · LB',
    tone: 'paper',
    bottom: '22%',
    left: '-22%',
    z: 90,
    rotate: -4,
  },
  {
    eyebrow: "You're in",
    title: 'Confirmed',
    tone: 'lime',
    top: '38%',
    right: '-26%',
    z: 88,
    rotate: 5,
  },
];

// Stage tones
const STAGE_DARK = '#08090A';
const STAGE_BREAK = '#161C18'; // turf-at-dusk

// ===================================================================
//  Component
// ===================================================================

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const stepLabelRef = useRef<HTMLSpanElement>(null);
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const subRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mb = window.matchMedia('(max-width: 879px)');
    const updateRm = () => setReducedMotion(rm.matches);
    const updateMb = () => setIsMobile(mb.matches);
    updateRm();
    updateMb();
    rm.addEventListener('change', updateRm);
    mb.addEventListener('change', updateMb);
    return () => {
      rm.removeEventListener('change', updateRm);
      mb.removeEventListener('change', updateMb);
    };
  }, []);

  // ---------------- Desktop: pinned scrubbed timeline ----------------
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const device = deviceRef.current;
    if (!section || !stage || !device) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Initial state — step 1 visible, others hidden.
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { opacity: i === 0 ? 1 : 0 });
      });
      chipRefs.current.forEach((el, i) => {
        if (!el) return;
        const chip = CHIPS[i];
        // Establish the 3D pose via GSAP so it owns the transform matrix
        // (avoids the inline-transform vs. .scale tween clash).
        gsap.set(el, {
          z: chip.z,
          rotation: chip.rotate,
          opacity: i === 0 ? 1 : 0,
          scale: i === 0 ? 1 : 0.9,
        });
      });
      gsap.set('.htw-avatar', { opacity: 0, scale: 0 });
      gsap.set(headingRefs.current.filter(Boolean), { opacity: 0, y: 10 });
      gsap.set(subRefs.current.filter(Boolean), { opacity: 0, y: 10 });
      // Step 1 copy is visible at start.
      if (headingRefs.current[0]) gsap.set(headingRefs.current[0], { opacity: 1, y: 0 });
      if (subRefs.current[0]) gsap.set(subRefs.current[0], { opacity: 1, y: 0 });

      gsap.set(device, {
        rotateY: -16,
        rotateX: 8,
        scale: 0.94,
        transformPerspective: 1700,
      });
      // Stage no longer paints its own bg — the global AmbientLayer
      // (data-palette="how") handles section colour, so seams between
      // sections are a single smooth ambient tween, not stacked paints.

      // Counter proxy — driven by the timeline and written to DOM each tick.
      const counter = { val: 0 };

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=2600',
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const step = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
            if (railRef.current) {
              const segments = railRef.current.querySelectorAll<HTMLDivElement>(
                '[data-rail-fill]'
              );
              segments.forEach((seg, i) => {
                let local: number;
                if (i === 0) local = Math.min(1, p / 0.34);
                else if (i === 1) local = Math.min(1, Math.max(0, (p - 0.34) / 0.34));
                else local = Math.min(1, Math.max(0, (p - 0.68) / 0.32));
                seg.style.transform = `scaleX(${local})`;
              });
            }
            if (stepLabelRef.current) {
              stepLabelRef.current.textContent = `step 0${step + 1} — 03`;
            }
            setActiveStep((prev) => (prev === step ? prev : step));
          },
        },
      });

      // Continuous camera drift across the full scrub window.
      tl.to(
        device,
        {
          rotateY: 10,
          rotateX: 2,
          scale: 1,
          duration: 1,
        },
        0
      );

      // Aurora — gentle drift + opacity sigh across the scrub.
      if (auroraRef.current) {
        tl.fromTo(
          auroraRef.current,
          { xPercent: -4, opacity: 0.85 },
          { xPercent: 6, opacity: 1, duration: 1 },
          0
        );
      }

      // ---- Step boundary transitions ----
      const B1 = 0.32; // step 1 → 2
      const B2 = 0.66; // step 2 → 3
      const CROSSFADE = 0.05;

      // Layer crossfade 1 → 2
      tl.to(layerRefs.current[0]!, { opacity: 0, duration: CROSSFADE }, B1);
      tl.to(layerRefs.current[1]!, { opacity: 1, duration: CROSSFADE }, B1);

      // Layer crossfade 2 → 3
      tl.to(layerRefs.current[1]!, { opacity: 0, duration: CROSSFADE }, B2);
      tl.to(layerRefs.current[2]!, { opacity: 1, duration: CROSSFADE }, B2);

      // Copy crossfades (left column)
      // Step 1 → 2
      tl.to(headingRefs.current[0]!, { opacity: 0, y: -8, duration: CROSSFADE }, B1);
      tl.to(subRefs.current[0]!, { opacity: 0, y: -8, duration: CROSSFADE }, B1);
      tl.fromTo(
        headingRefs.current[1]!,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: CROSSFADE },
        B1 + CROSSFADE
      );
      tl.fromTo(
        subRefs.current[1]!,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: CROSSFADE },
        B1 + CROSSFADE
      );
      // Step 2 → 3
      tl.to(headingRefs.current[1]!, { opacity: 0, y: -8, duration: CROSSFADE }, B2);
      tl.to(subRefs.current[1]!, { opacity: 0, y: -8, duration: CROSSFADE }, B2);
      tl.fromTo(
        headingRefs.current[2]!,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: CROSSFADE },
        B2 + CROSSFADE
      );
      tl.fromTo(
        subRefs.current[2]!,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: CROSSFADE },
        B2 + CROSSFADE
      );

      // ---- Avatar stagger + counter (step 2 only) ----
      tl.to('.htw-avatar', {
        opacity: 1,
        scale: 1,
        ease: 'back.out(1.5)',
        duration: 0.04,
        stagger: 0.012,
      }, B1 + CROSSFADE);

      tl.to(
        counter,
        {
          val: 11,
          duration: 0.18,
          ease: 'power1.out',
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(counter.val));
            }
          },
        },
        B1 + CROSSFADE
      );

      // Avatars + counter fade out as step 3 takes over
      tl.to('.htw-avatar', { opacity: 0, duration: CROSSFADE }, B2);

      // ---- Depth chips per step ----
      // Chip 1 — out at B1
      tl.to(
        chipRefs.current[0]!,
        { opacity: 0, scale: 0.9, duration: CROSSFADE },
        B1
      );
      // Chip 2 — in just after B1, out at B2
      tl.fromTo(
        chipRefs.current[1]!,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: CROSSFADE },
        B1 + CROSSFADE
      );
      tl.to(
        chipRefs.current[1]!,
        { opacity: 0, scale: 0.9, duration: CROSSFADE },
        B2
      );
      // Chip 3 — in just after B2, hold to end
      tl.fromTo(
        chipRefs.current[2]!,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: CROSSFADE },
        B2 + CROSSFADE
      );

      // Manage will-change lifecycle — only on while the trigger is active.
      ScrollTrigger.create({
        trigger: stage,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => {
          if (device) device.style.willChange = 'transform';
          chipRefs.current.forEach((c) => {
            if (c) c.style.willChange = 'transform, opacity';
          });
        },
        onLeave: () => {
          if (device) device.style.willChange = 'auto';
          chipRefs.current.forEach((c) => {
            if (c) c.style.willChange = 'auto';
          });
        },
        onEnterBack: () => {
          if (device) device.style.willChange = 'transform';
        },
        onLeaveBack: () => {
          if (device) device.style.willChange = 'auto';
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion, isMobile]);

  // ---------------- Mobile: stacked blocks, IntersectionObserver ----------------
  useEffect(() => {
    if (!isMobile || reducedMotion) return;
    const blocks = sectionRef.current?.querySelectorAll<HTMLElement>(
      '[data-mobile-step]'
    );
    if (!blocks || blocks.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = parseInt(
              (e.target as HTMLElement).dataset.mobileStep || '0',
              10
            );
            setActiveStep(idx);
          }
        });
      },
      { threshold: 0.55 }
    );
    blocks.forEach((b) => obs.observe(b));
    return () => obs.disconnect();
  }, [isMobile, reducedMotion]);

  // ===================================================================
  //  Render
  // ===================================================================

  // Reduced motion + mobile share simpler markup that skips pin/scrub.
  if (reducedMotion) {
    return <StaticConfirmedView />;
  }

  if (isMobile) {
    return <MobileStack activeStep={activeStep} />;
  }

  return (
    <section
      ref={sectionRef}
      id="how"
      data-progress-section
      data-progress-label="How It Works"
      data-palette="how"
      className="relative"
      style={{
        // Fully transparent — the global AmbientLayer paints the
        // background and tweens between sections smoothly, eliminating
        // the per-section seams we were creating with stage-local paints.
        background: 'transparent',
        overflow: 'visible',
      }}
    >
      {/* Pinned cinematic stage (no bg, no bridges — ambient handles it) */}
      <div
        ref={stageRef}
        className="htw-stage"
      >
        {/* Masked grid — subtle structural lines, radial-faded toward edges */}
        <div aria-hidden className="htw-grid" />

        {/* Aurora — soft lime radial glow, blur is STATIC */}
        <div ref={auroraRef} aria-hidden className="htw-aurora" />

        {/* Stage content — two columns */}
        <div className="htw-stage-grid">
          {/* LEFT — copy + progress rail */}
          <div className="htw-copy">
            <span ref={stepLabelRef} className="htw-step-label">
              step 01 — 03
            </span>

            <div className="htw-headlines">
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className="htw-headline-slot"
                  aria-hidden={activeStep !== i}
                >
                  <h2
                    ref={(el) => {
                      headingRefs.current[i] = el;
                    }}
                    className="htw-headline"
                  >
                    {step.head}
                  </h2>
                  <p
                    ref={(el) => {
                      subRefs.current[i] = el;
                    }}
                    className="htw-sub"
                  >
                    {step.sub}
                  </p>
                </div>
              ))}
            </div>

            <div ref={railRef} className="htw-rail" aria-hidden>
              {[0, 1, 2].map((i) => (
                <div key={i} className="htw-rail-seg">
                  <div data-rail-fill className="htw-rail-fill" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — perspective scene with device + chips */}
          <div className="htw-scene">
            <div className="htw-perspective">
              <div ref={deviceRef} className="htw-device">
                {/* Screen layers — crossfaded by the timeline */}
                {STEPS.map((step, i) => (
                  <div
                    key={step.num}
                    ref={(el) => {
                      layerRefs.current[i] = el;
                    }}
                    className="htw-layer"
                  >
                    <Image
                      src={step.src}
                      alt={step.alt}
                      fill
                      sizes="(max-width: 1100px) 30vw, 340px"
                      priority={i === 0}
                      className="htw-shot"
                    />
                    {/* Step 2 — formation overlay + counter */}
                    {i === 1 && (
                      <>
                        <div className="htw-counter" aria-hidden>
                          <span className="htw-counter-eyebrow">lineup</span>
                          <span className="htw-counter-num">
                            <span ref={counterRef}>0</span>
                            <span className="htw-counter-of">/11</span>
                          </span>
                        </div>
                        <div className="htw-pitch" aria-hidden>
                          {FORMATION_433.map((p, idx) => (
                            <div
                              key={idx}
                              className={`htw-avatar htw-avatar-${p.tone}`}
                              style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Depth chips — parented to the device with translateZ */}
                {CHIPS.map((chip, i) => (
                  <div
                    key={i}
                    ref={(el) => {
                      chipRefs.current[i] = el;
                    }}
                    className={`htw-chip htw-chip-${chip.tone}`}
                    style={{
                      top: chip.top,
                      bottom: chip.bottom,
                      left: chip.left,
                      right: chip.right,
                    }}
                    aria-hidden
                  >
                    <span className="htw-chip-eyebrow">{chip.eyebrow}</span>
                    <span className="htw-chip-title">{chip.title}</span>
                    {chip.tone === 'lime' && (
                      <span className="htw-chip-tick" aria-hidden>
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SR-only semantic headings so the section is understandable
                without motion. Visible headings are tracked by the timeline. */}
            <div className="sr-only">
              {STEPS.map((s) => (
                <h2 key={s.num}>
                  {s.num}. {s.head} {s.sub}
                </h2>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scoped styles. Keep all paint to transform/opacity/static-blur. */}
      <style jsx>{`
        .htw-stage {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: visible;
          color: #F5F5F0;
          isolation: isolate;
        }

        /* Masked grid lines */
        .htw-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(245, 245, 240, 0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(245, 245, 240, 0.045) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask-image: radial-gradient(
            ellipse 70% 60% at 60% 50%,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.5) 55%,
            transparent 85%
          );
          mask-image: radial-gradient(
            ellipse 70% 60% at 60% 50%,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.5) 55%,
            transparent 85%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* Aurora — soft lime glow, blurred once. NEVER animate the blur. */
        .htw-aurora {
          position: absolute;
          top: -220px;          /* bleed up into the top bridge */
          right: -10%;
          width: 90%;
          height: calc(100% + 440px); /* bleed down into the bottom bridge */
          background: radial-gradient(
            ellipse 55% 50% at 55% 45%,
            rgba(212, 255, 58, 0.32) 0%,
            rgba(150, 200, 80, 0.16) 40%,
            transparent 70%
          );
          filter: blur(60px);
          will-change: transform, opacity;
          pointer-events: none;
          mix-blend-mode: screen;
          z-index: 2;
        }

        .htw-stage-grid {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1440px;
          height: 100%;
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 64px);
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          align-items: center;
          gap: clamp(40px, 5vw, 96px);
        }

        /* ---- LEFT — copy ---- */
        .htw-copy {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: clamp(20px, 3vh, 36px);
          max-width: 540px;
        }

        .htw-step-label {
          font-family: var(--font-mono), 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.28em;
          text-transform: lowercase;
          color: var(--lime);
        }

        .htw-headlines {
          position: relative;
          min-height: 280px;
        }
        .htw-headline-slot {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        }
        .htw-headline {
          font-family: var(--font-display), 'Inter', system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(2.25rem, 4.8vw, 4rem);
          line-height: 1;
          letter-spacing: -0.035em;
          color: #F5F5F0;
          margin: 0 0 24px;
          max-width: 14ch;
          will-change: transform, opacity;
        }
        .htw-sub {
          font-family: var(--font-body), Inter, system-ui, sans-serif;
          font-size: 17px;
          line-height: 1.55;
          color: rgba(245, 245, 240, 0.7);
          max-width: 40ch;
          margin: 0;
          will-change: transform, opacity;
        }

        .htw-rail {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          max-width: 360px;
        }
        .htw-rail-seg {
          position: relative;
          height: 2px;
          background: rgba(245, 245, 240, 0.08);
          overflow: hidden;
          border-radius: 1px;
        }
        .htw-rail-fill {
          position: absolute;
          inset: 0;
          background: var(--lime);
          transform-origin: left center;
          transform: scaleX(0);
        }

        /* ---- RIGHT — perspective scene ---- */
        .htw-scene {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .htw-perspective {
          perspective: 1700px;
          perspective-origin: 50% 50%;
          width: clamp(260px, 28vw, 340px);
        }
        .htw-device {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 19.5;
          transform-style: preserve-3d;
          will-change: transform;
          border-radius: 36px;
          background: #060707;
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(212, 255, 58, 0.08),
            inset 0 0 0 1px rgba(245, 245, 240, 0.04);
        }

        .htw-layer {
          position: absolute;
          inset: 0;
          border-radius: 32px;
          overflow: hidden;
          backface-visibility: hidden;
          transform: translateZ(0.1px); /* avoid Z-fighting with bezel */
        }
        .htw-shot {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* Step 2 — formation overlay. A subtle dark wash sits between the
           screenshot and the animated dots so the fill reads as the
           foreground action, not noise on top of the existing UI dots. */
        .htw-pitch {
          position: absolute;
          left: 6%;
          right: 6%;
          top: 22%;
          bottom: 16%;
          pointer-events: none;
          background: radial-gradient(
            ellipse 80% 70% at 50% 50%,
            rgba(8, 9, 10, 0.62) 0%,
            rgba(8, 9, 10, 0.45) 60%,
            transparent 100%
          );
          border-radius: 18px;
        }
        .htw-avatar {
          position: absolute;
          width: 22px;
          height: 22px;
          margin-left: -11px;
          margin-top: -11px;
          border-radius: 50%;
          transform: scale(0);
          opacity: 0;
          box-shadow:
            0 0 0 2px #0E1110,
            0 6px 14px rgba(0, 0, 0, 0.55);
        }
        .htw-avatar-lime {
          background: linear-gradient(180deg, var(--lime) 0%, #b3da30 100%);
        }
        .htw-avatar-paper {
          background: linear-gradient(180deg, #F5F5F0 0%, #c8c9c0 100%);
        }

        .htw-counter {
          position: absolute;
          top: 6%;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 14px;
          background: rgba(8, 9, 10, 0.78);
          border: 1px solid rgba(212, 255, 58, 0.25);
          border-radius: 999px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .htw-counter-eyebrow {
          font-family: var(--font-mono), monospace;
          font-size: 8px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(245, 245, 240, 0.55);
        }
        .htw-counter-num {
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 800;
          font-size: 16px;
          color: var(--lime);
          letter-spacing: -0.02em;
        }
        .htw-counter-of {
          color: rgba(245, 245, 240, 0.6);
          font-weight: 700;
          margin-left: 1px;
        }

        /* ---- Depth chips ---- */
        .htw-chip {
          position: absolute;
          min-width: 140px;
          padding: 10px 14px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .htw-chip-paper {
          background: #F5F5F0;
          color: #0B0D10;
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(0, 0, 0, 0.04);
        }
        .htw-chip-lime {
          background: var(--lime);
          color: #0A0A0A;
          box-shadow:
            0 24px 60px rgba(212, 255, 58, 0.28),
            0 24px 60px rgba(0, 0, 0, 0.35);
        }
        .htw-chip-eyebrow {
          font-family: var(--font-mono), monospace;
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          opacity: 0.6;
        }
        .htw-chip-title {
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: -0.01em;
          line-height: 1.15;
        }
        .htw-chip-tick {
          position: absolute;
          top: 8px;
          right: 10px;
          font-size: 12px;
          font-weight: 900;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (max-width: 1100px) {
          .htw-stage-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .htw-headline { font-size: clamp(2rem, 4.4vw, 3rem); }
        }
      `}</style>
    </section>
  );
}

// ===================================================================
//  Mobile fallback — stacked blocks, swapped by IntersectionObserver.
//  No pin, no 3D, no scrub. Chips become flat badges.
// ===================================================================

function MobileStack({ activeStep }: { activeStep: number }) {
  void activeStep; // observer drives section state in parent (reserved for future)
  return (
    <section
      id="how"
      data-progress-section
      data-progress-label="How It Works"
      data-palette="how"
      className="relative"
      style={{
        padding: 'clamp(5rem, 12vh, 9rem) 0',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="grid-12"
        style={{ position: 'relative', zIndex: 2, marginBottom: '3rem' }}
      >
        <div className="col-span-12">
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 11,
              letterSpacing: '0.28em',
              color: 'var(--lime)',
              marginBottom: 16,
              textTransform: 'lowercase',
            }}
          >
            how it works
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display), Inter, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 8vw, 3rem)',
              lineHeight: 1,
              letterSpacing: '-0.035em',
              color: '#F5F5F0',
              margin: 0,
              maxWidth: '16ch',
            }}
          >
            From group chat to a confirmed 11.
          </h2>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(3rem, 8vh, 5rem)',
        }}
      >
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            data-mobile-step={i}
            className="grid-12"
            style={{ alignItems: 'center' }}
          >
            <div
              className="col-span-12"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                alignItems: 'flex-start',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 10,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'rgba(212, 255, 58, 0.8)',
                }}
              >
                step 0{i + 1} — 03
              </span>

              <div
                style={{
                  position: 'relative',
                  width: '70%',
                  maxWidth: 260,
                  aspectRatio: '9 / 19.5',
                  borderRadius: 28,
                  overflow: 'hidden',
                  background: '#060707',
                  border: '1px solid rgba(245, 245, 240, 0.06)',
                  boxShadow: '0 28px 60px rgba(0, 0, 0, 0.55)',
                  alignSelf: 'center',
                }}
              >
                <Image
                  src={step.src}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 879px) 70vw, 260px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 999,
                  background:
                    CHIPS[i].tone === 'lime' ? 'var(--lime)' : '#F5F5F0',
                  color: '#0A0A0A',
                  fontFamily: 'var(--font-display), Inter, sans-serif',
                  fontWeight: 800,
                  fontSize: 12,
                  alignSelf: 'center',
                }}
              >
                {CHIPS[i].title}
                {CHIPS[i].tone === 'lime' ? ' ✓' : ''}
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-display), Inter, sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(1.6rem, 6vw, 2rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  color: '#F5F5F0',
                  margin: 0,
                  maxWidth: '14ch',
                  alignSelf: 'flex-start',
                }}
              >
                {step.head}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body), Inter, sans-serif',
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: 'rgba(245, 245, 240, 0.7)',
                  maxWidth: '36ch',
                  margin: 0,
                }}
              >
                {step.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ===================================================================
//  Reduced-motion fallback — render step 3 (confirmed) statically.
//  No pin, no scrub, no 3D rotation. Source of truth for content.
// ===================================================================

function StaticConfirmedView() {
  return (
    <section
      id="how"
      data-progress-section
      data-progress-label="How It Works"
      data-palette="how"
      className="relative"
      style={{
        background: 'transparent',
        padding: 'clamp(6rem, 14vh, 10rem) 0',
        overflow: 'hidden',
      }}
    >
      <div
        className="grid-12 items-center"
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div className="col-span-12 xl:col-start-2 xl:col-span-5">
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12,
              letterSpacing: '0.28em',
              color: 'var(--lime)',
              marginBottom: 18,
              textTransform: 'lowercase',
            }}
          >
            step 03 — 03
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display), Inter, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2.25rem, 4.8vw, 4rem)',
              lineHeight: 1,
              letterSpacing: '-0.035em',
              color: '#F5F5F0',
              margin: '0 0 24px',
              maxWidth: '14ch',
            }}
          >
            You&apos;re in the lineup.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body), Inter, sans-serif',
              fontSize: 17,
              lineHeight: 1.55,
              color: 'rgba(245, 245, 240, 0.7)',
              maxWidth: '40ch',
              margin: 0,
            }}
          >
            One tap. Captain approves. Your face appears in the lineup and you
            show up ready to play.
          </p>
        </div>
        <div
          className="col-span-12 xl:col-start-8 xl:col-span-4"
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            marginTop: 'clamp(3rem, 6vh, 4rem)',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 320,
              aspectRatio: '9 / 19.5',
              borderRadius: 32,
              overflow: 'hidden',
              background: '#060707',
              boxShadow: '0 30px 70px rgba(0, 0, 0, 0.5)',
            }}
          >
            <Image
              src={STEPS[2].src}
              alt={STEPS[2].alt}
              fill
              sizes="(max-width: 1280px) 60vw, 320px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <span
            style={{
              position: 'absolute',
              top: '38%',
              right: '-2%',
              padding: '10px 14px',
              borderRadius: 12,
              background: 'var(--lime)',
              color: '#0A0A0A',
              fontFamily: 'var(--font-display), Inter, sans-serif',
              fontWeight: 800,
              fontSize: 14,
              boxShadow: '0 20px 50px rgba(212, 255, 58, 0.3)',
            }}
          >
            Confirmed ✓
          </span>
        </div>
      </div>
    </section>
  );
}
