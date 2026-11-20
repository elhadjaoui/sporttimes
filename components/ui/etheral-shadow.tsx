'use client';

import React, {
  useRef,
  useId,
  useEffect,
  useState,
  type CSSProperties,
} from 'react';

// ===================================================================
//  Etheral Shadow — drifting masked blob with animated displacement.
//
//  An organic shape (via mask-image) is distorted in real time by an
//  SVG filter chain (turbulence → hue rotate → matrix → displacement).
//  The hue-rotate value loops from 0 to 360. The result reads
//  as a slow-morphing watercolor-style stain.
//
//  Use this as a section background — wrap it in an absolutely-positioned
//  parent and put content above it at a higher z-index.
// ===================================================================

interface ResponsiveImage {
  src: string;
  alt?: string;
  srcSet?: string;
}

interface AnimationConfig {
  preview?: boolean;
  scale: number;
  speed: number;
}

interface NoiseConfig {
  opacity: number;
  scale: number;
}

interface EtherealShadowProps {
  type?: 'preset' | 'custom';
  presetIndex?: number;
  customImage?: ResponsiveImage;
  sizing?: 'fill' | 'stretch';
  color?: string;
  animation?: AnimationConfig;
  noise?: NoiseConfig;
  style?: CSSProperties;
  className?: string;
}

const SCROLL_REST_MS = 200;
const NEAR_MARGIN = '100% 0px';

function mapRange(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
): number {
  if (fromLow === fromHigh) return toLow;
  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}

const useInstanceId = (): string => {
  const id = useId();
  const cleanId = id.replace(/:/g, '');
  return `shadowoverlay-${cleanId}`;
};

export function Component({
  sizing = 'fill',
  color = 'rgba(128, 128, 128, 1)',
  animation,
  noise,
  style,
  className,
}: EtherealShadowProps) {
  const id = useInstanceId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const animationEnabled = animation && animation.scale > 0;
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);

  const displacementScale = animation
    ? mapRange(animation.scale, 1, 100, 20, 100)
    : 0;
  const animationDuration = animation
    ? mapRange(animation.speed, 1, 100, 1000, 50)
    : 1;

  // The mask and noise images download as soon as their layers render,
  // even far off screen, so render the layers only once the section is
  // within a screen of the viewport.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: NEAR_MARGIN }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [near]);

  useEffect(() => {
    const root = rootRef.current;
    if (near && feColorMatrixRef.current && animationEnabled && root) {
      // A linear 0 to 360 loop that pauses and resumes where it stopped.
      const periodMs = (animationDuration / 25) * 1000;
      let elapsed = 0;
      let last = 0;
      let frame = 0;
      const tick = (now: number) => {
        elapsed += now - last;
        last = now;
        const hue = ((elapsed % periodMs) / periodMs) * 360;
        feColorMatrixRef.current?.setAttribute('values', String(hue));
        frame = requestAnimationFrame(tick);
      };
      const controls = {
        play() {
          if (frame) return;
          last = performance.now();
          frame = requestAnimationFrame(tick);
        },
        pause() {
          cancelAnimationFrame(frame);
          frame = 0;
        },
      };

      // Every hue change re-renders the whole filter chain, so only animate
      // while the section is on screen and the page is at rest.
      let onScreen = false;
      let scrolling = false;
      let resumeTimer: number | undefined;
      const sync = () => {
        if (onScreen && !scrolling) controls.play();
        else controls.pause();
      };

      const observer = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      });
      observer.observe(root);

      const onScroll = () => {
        scrolling = true;
        sync();
        window.clearTimeout(resumeTimer);
        resumeTimer = window.setTimeout(() => {
          scrolling = false;
          sync();
        }, SCROLL_REST_MS);
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.clearTimeout(resumeTimer);
        controls.pause();
      };
    }
  }, [near, animationEnabled, animationDuration]);

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {near && (
        <div
          style={{
            position: 'absolute',
            inset: -displacementScale,
            filter: animationEnabled ? `url(#${id}) blur(4px)` : 'none',
          }}
        >
          {animationEnabled && (
            <svg style={{ position: 'absolute' }}>
              <defs>
                <filter id={id}>
                  <feTurbulence
                    result="undulation"
                    numOctaves="2"
                    baseFrequency={`${mapRange(
                      animation.scale,
                      0,
                      100,
                      0.001,
                      0.0005
                    )},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`}
                    seed="0"
                    type="turbulence"
                  />
                  <feColorMatrix
                    ref={feColorMatrixRef}
                    in="undulation"
                    type="hueRotate"
                    values="180"
                  />
                  <feColorMatrix
                    in="dist"
                    result="circulation"
                    type="matrix"
                    values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="circulation"
                    scale={displacementScale}
                    result="dist"
                  />
                  <feDisplacementMap
                    in="dist"
                    in2="undulation"
                    scale={displacementScale}
                    result="output"
                  />
                </filter>
              </defs>
            </svg>
          )}
          <div
            style={{
              backgroundColor: color,
              maskImage: `url('/textures/shadow-mask.png')`,
              WebkitMaskImage: `url('/textures/shadow-mask.png')`,
              maskSize: sizing === 'stretch' ? '100% 100%' : 'cover',
              WebkitMaskSize: sizing === 'stretch' ? '100% 100%' : 'cover',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      )}

      {near && noise && noise.opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("/textures/noise.png")`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: 'repeat',
            opacity: noise.opacity / 2,
          }}
        />
      )}
    </div>
  );
}
