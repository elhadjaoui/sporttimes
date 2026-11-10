'use client';

import React, {
  useRef,
  useId,
  useEffect,
  useState,
  type CSSProperties,
} from 'react';
import {
  animate,
  useMotionValue,
  type AnimationPlaybackControls,
} from 'framer-motion';

// ===================================================================
//  Etheral Shadow — drifting masked blob with animated displacement.
//
//  An organic shape (via mask-image) is distorted in real time by an
//  SVG filter chain (turbulence → hue rotate → matrix → displacement).
//  The hue-rotate value is animated by framer-motion. The result reads
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
  const hueRotateMotionValue = useMotionValue(180);
  const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null);

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
      if (hueRotateAnimation.current) {
        hueRotateAnimation.current.stop();
      }
      hueRotateMotionValue.set(0);
      let lastHue: number | undefined;
      const controls = animate(hueRotateMotionValue, 360, {
        duration: animationDuration / 25,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        ease: 'linear',
        delay: 0,
        // A paused animation still calls this every frame, and rewriting
        // even the same value makes the browser re-render the filter.
        onUpdate: (value: number) => {
          if (value === lastHue) return;
          lastHue = value;
          if (feColorMatrixRef.current) {
            feColorMatrixRef.current.setAttribute('values', String(value));
          }
        },
      });
      hueRotateAnimation.current = controls;
      controls.pause();

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
        controls.stop();
      };
    }
  }, [near, animationEnabled, animationDuration, hueRotateMotionValue]);

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
              maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
              WebkitMaskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
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
            backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: 'repeat',
            opacity: noise.opacity / 2,
          }}
        />
      )}
    </div>
  );
}
