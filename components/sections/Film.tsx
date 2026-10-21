'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import Image from 'next/image';
import {
  MdPlayArrow,
  MdPause,
  MdReplay,
  MdVolumeUp,
  MdVolumeOff,
  MdFullscreen,
  MdFullscreenExit,
} from 'react-icons/md';

// ===================================================================
//  Film — the launch cut, played natively.
//
//  Sits between The Problem and How It Works: the film opens on
//  "Finding a game shouldn't be the hard part", picking up the thread
//  the Problem headline leaves hanging.
//
//  Self-hosted <video> (public/film) instead of a YouTube iframe so the
//  chrome is ours end to end:
//   - At rest: the 1080p poster with a lower-third play control.
//   - Playing: a minimal control bar that tucks away while you watch.
//   - Under the frame: a chapter rail that doubles as a match timeline.
//     Segments are sized by beat length and fill lime as the film plays.
//
//  Progress is painted from a rAF loop straight into CSS vars (--p) —
//  React only re-renders when play state or the active chapter changes.
// ===================================================================

const SRC = '/film/sporttimes-launch.mp4';
const POSTER = '/film/sporttimes-launch-poster.jpg';
const YOUTUBE_URL = 'https://youtu.be/MgtT_ZJWX5U';
// Real media length — used until the element reports its own metadata.
const FALLBACK_DURATION = 92.5;
const SEEK_STEP = 5;
const CHROME_IDLE_MS = 2400;

type Chapter = { num: string; title: string; start: number };

// Beat boundaries read off the cut itself.
const CHAPTERS: Chapter[] = [
  { num: '01', title: 'Kick-off', start: 0 },
  { num: '02', title: 'Find a match', start: 11 },
  { num: '03', title: 'Host or challenge', start: 33 },
  { num: '04', title: 'Player ratings', start: 48 },
  { num: '05', title: 'Your community', start: 57 },
  { num: '06', title: 'What’s next', start: 79 },
];

const chapterEnd = (i: number, duration: number) =>
  CHAPTERS[i + 1]?.start ?? duration;

// Desktop rail columns are proportional to each beat's runtime, so the
// rail reads as one continuous timeline.
const RAIL_COLUMNS = CHAPTERS.map(
  (c, i) => `${(chapterEnd(i, FALLBACK_DURATION) - c.start).toFixed(1)}fr`
).join(' ');

type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'ended';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function fmt(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(
    s % 60
  ).padStart(2, '0')}`;
}

function spoken(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m} minute${m === 1 ? '' : 's'} ${r} seconds` : `${r} seconds`;
}

const RUNTIME_LABEL = fmt(Math.ceil(FALLBACK_DURATION));

type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

// ===================================================================
//  Section
// ===================================================================

export default function Film() {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const durationRef = useRef(FALLBACK_DURATION);
  const lastSecondRef = useRef(-1);
  const activeRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const hideTimerRef = useRef<number | undefined>(undefined);

  const [status, setStatus] = useState<Status>('idle');
  const [active, setActive] = useState<number | null>(null);
  const [duration, setDuration] = useState(FALLBACK_DURATION);
  const [muted, setMuted] = useState(false);
  const [chromeAwake, setChromeAwake] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);

  // ---- Paint progress into CSS vars (no React render per frame) ----
  const paint = useCallback((t: number) => {
    const d = durationRef.current;

    CHAPTERS.forEach((c, i) => {
      const el = chapterRefs.current[i];
      if (!el) return;
      const p = clamp01((t - c.start) / (chapterEnd(i, d) - c.start));
      el.style.setProperty('--p', p.toFixed(4));
    });

    const scrub = scrubRef.current;
    if (scrub) {
      scrub.style.setProperty('--p', clamp01(t / d).toFixed(4));
      scrub.setAttribute('aria-valuenow', String(Math.floor(t)));
      scrub.setAttribute('aria-valuetext', `${spoken(t)} of ${spoken(d)}`);
    }

    const sec = Math.floor(t);
    if (timeRef.current && sec !== lastSecondRef.current) {
      lastSecondRef.current = sec;
      timeRef.current.textContent = fmt(sec);
    }

    let idx = 0;
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (t >= CHAPTERS[i].start) idx = i;
    }
    if (activeRef.current !== idx) {
      activeRef.current = idx;
      setActive(idx);
    }
  }, []);

  // rAF loop only while the film is actually running.
  useEffect(() => {
    if (status !== 'playing') return;
    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v) paint(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, paint]);

  // ---- Control-bar visibility: tuck away after a few idle seconds ----
  const wake = useCallback(() => {
    setChromeAwake(true);
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(
      () => setChromeAwake(false),
      CHROME_IDLE_MS
    );
  }, []);

  useEffect(() => () => window.clearTimeout(hideTimerRef.current), []);

  // ---- Playback actions ----
  const play = useCallback((from?: number) => {
    const v = videoRef.current;
    if (!v) return;
    if (from !== undefined) {
      if (v.readyState === 0) {
        // No metadata yet (preload="none") — seek once it lands.
        v.addEventListener(
          'loadedmetadata',
          () => {
            v.currentTime = from;
          },
          { once: true }
        );
      } else {
        v.currentTime = from;
      }
      paint(from);
    } else if (v.ended) {
      v.currentTime = 0;
    }
    setStatus((s) => (s === 'idle' || s === 'ended' ? 'loading' : s));
    v.play()?.catch(() => {
      setStatus((s) => (s === 'loading' ? 'idle' : s));
    });
  }, [paint]);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) play();
    else v.pause();
  }, [play]);

  const seekTo = useCallback(
    (t: number) => {
      const v = videoRef.current;
      if (!v) return;
      const next = Math.min(durationRef.current, Math.max(0, t));
      v.currentTime = next;
      paint(next);
    },
    [paint]
  );

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (v) v.muted = !v.muted;
  }, []);

  const toggleFullscreen = useCallback(() => {
    const frame = frameRef.current;
    const v = videoRef.current as FullscreenVideo | null;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    if (frame && document.fullscreenEnabled) {
      frame.requestFullscreen().catch(() => {});
    } else {
      // iOS Safari: only the <video> itself can go fullscreen.
      v?.webkitEnterFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const v = videoRef.current as FullscreenVideo | null;
    setCanFullscreen(
      Boolean(document.fullscreenEnabled || v?.webkitEnterFullscreen)
    );
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Pause when the frame scrolls mostly out of view — never auto-resume.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v || v.paused || document.fullscreenElement) return;
        if (entry.intersectionRatio < 0.25) v.pause();
      },
      { threshold: [0, 0.25] }
    );
    io.observe(frame);
    return () => io.disconnect();
  }, []);

  // ---- Scrub bar (pointer + keyboard) ----
  const seekFromPointer = (clientX: number) => {
    const el = scrubRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    seekTo(clamp01((clientX - r.left) / r.width) * durationRef.current);
  };

  const onScrubDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    seekFromPointer(e.clientX);
  };
  const onScrubMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) seekFromPointer(e.clientX);
  };
  const onScrubUp = () => {
    draggingRef.current = false;
  };

  const onScrubKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const handled: Record<string, () => void> = {
      ArrowLeft: () => seekTo(v.currentTime - SEEK_STEP),
      ArrowDown: () => seekTo(v.currentTime - SEEK_STEP),
      ArrowRight: () => seekTo(v.currentTime + SEEK_STEP),
      ArrowUp: () => seekTo(v.currentTime + SEEK_STEP),
      Home: () => seekTo(0),
      End: () => seekTo(durationRef.current),
    };
    const fn = handled[e.key];
    if (!fn) return;
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  // Player-style shortcuts while focus is inside the frame.
  const onFrameKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || status === 'idle') return;
    const key = e.key.toLowerCase();
    if (key === 'k') toggle();
    else if (key === 'm') toggleMute();
    else if (key === 'f' && canFullscreen) toggleFullscreen();
    else if (key === 'arrowleft') seekTo(v.currentTime - SEEK_STEP);
    else if (key === 'arrowright') seekTo(v.currentTime + SEEK_STEP);
    else return;
    e.preventDefault();
    wake();
  };

  // ---- Video element events ----
  const onLoadedMetadata = () => {
    const v = videoRef.current;
    if (v && Number.isFinite(v.duration) && v.duration > 0) {
      durationRef.current = v.duration;
      setDuration(v.duration);
    }
  };
  const onPlaying = () => {
    setStatus('playing');
    wake();
  };
  const onPause = () => {
    const v = videoRef.current;
    if (!v || v.ended) return;
    setStatus('paused');
    setChromeAwake(true);
    window.clearTimeout(hideTimerRef.current);
    paint(v.currentTime);
  };
  const onEnded = () => {
    setStatus('ended');
    paint(durationRef.current);
  };
  const onSeeked = () => {
    const v = videoRef.current;
    if (v) paint(v.currentTime);
  };
  const onVolumeChange = () => {
    const v = videoRef.current;
    if (v) setMuted(v.muted);
  };

  const posterVisible =
    status === 'idle' || status === 'loading' || status === 'ended';
  const chromeHidden = status === 'playing' && !chromeAwake;
  const started = status !== 'idle';

  return (
    <section
      id="film"
      data-progress-section
      data-progress-label="The Film"
      data-palette="film"
      className="relative"
      style={{
        background: 'transparent',
        padding: 'clamp(5rem, 10vh, 8rem) 0 clamp(6rem, 12vh, 10rem)',
        overflow: 'hidden',
      }}
    >
      <div className="film-grid">
        {/* ============================================================
            HEAD — eyebrow + headline left, sub + meta right (desktop)
            ============================================================ */}
        {/* This chunk can hydrate after RevealObserver has already tagged
            the SSR markup (.is-revealed, --reveal-i). --reveal-i is pinned
            so it never changes; the class is allowed to differ. */}
        <div className="film-head" data-reveal suppressHydrationWarning>
          <div data-reveal-child style={{ '--reveal-i': 0 } as CSSProperties}>
            <div className="film-eyebrow">the launch film</div>
            <h2 className="film-headline">
              <span className="film-nowrap">Ninety-three</span> seconds to{' '}
              <span className="film-nowrap" style={{ color: 'var(--lime)' }}>
                kick-off.
              </span>
            </h2>
          </div>
          <div
            className="film-aside"
            data-reveal-child
            style={{ '--reveal-i': 1 } as CSSProperties}
          >
            <p className="film-sub">
              Find a game. See who&apos;s playing. Host your own, or
              challenge another team. The whole app, start to finish.
            </p>
            <div className="film-meta">
              <span>
                Runtime <span className="film-meta-val">{RUNTIME_LABEL}</span>
              </span>
              <span className="film-meta-sep" aria-hidden />
              <a
                className="film-meta-link"
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube ↗
              </a>
            </div>
          </div>
        </div>

        {/* ============================================================
            STAGE — frame + chapter rail
            ============================================================ */}
        <div
          className="film-stage"
          data-status={status}
          data-reveal
          suppressHydrationWarning
        >
          <div
            ref={frameRef}
            className="film-frame"
            data-chrome={chromeHidden ? 'hidden' : 'shown'}
            data-fullscreen={isFullscreen ? 'true' : undefined}
            onPointerMove={started ? wake : undefined}
            onPointerLeave={() => {
              if (status === 'playing') setChromeAwake(false);
            }}
            onKeyDown={onFrameKey}
          >
            <video
              ref={videoRef}
              className="film-video"
              src={SRC}
              preload="none"
              playsInline
              aria-label="SportTimes launch film"
              onClick={() => {
                toggle();
                wake();
              }}
              onLoadedMetadata={onLoadedMetadata}
              onPlaying={onPlaying}
              onPause={onPause}
              onEnded={onEnded}
              onSeeked={onSeeked}
              onVolumeChange={onVolumeChange}
            />

            {/* POSTER — our own still + lower-third. Fades out on the
                first decoded frame, returns when the film ends. */}
            <button
              type="button"
              className="film-poster"
              data-visible={posterVisible ? 'true' : 'false'}
              data-loading={status === 'loading' ? 'true' : undefined}
              tabIndex={posterVisible ? 0 : -1}
              aria-hidden={!posterVisible}
              aria-label={`${
                status === 'ended' ? 'Replay' : 'Play'
              } the SportTimes launch film, ${spoken(Math.ceil(duration))}`}
              onClick={() => play(status === 'ended' ? 0 : undefined)}
            >
              <span className="film-poster-img" aria-hidden>
                <Image
                  src={POSTER}
                  alt=""
                  fill
                  sizes="(max-width: 1240px) 100vw, 1200px"
                  quality={85}
                  style={{ objectFit: 'cover' }}
                />
              </span>
              <span className="film-poster-shade" aria-hidden />
              <span className="film-lower-third" aria-hidden>
                <span className="film-knob">
                  {status === 'ended' ? <MdReplay /> : <MdPlayArrow />}
                </span>
                <span className="film-lt-copy">
                  <span className="film-lt-title">
                    {status === 'ended' ? 'Watch again' : 'Watch the film'}
                  </span>
                  <span className="film-lt-meta">
                    {RUNTIME_LABEL} · Sound on
                  </span>
                </span>
              </span>
            </button>

            {/* CONTROL BAR — only once the film has started */}
            {(status === 'playing' || status === 'paused') && (
              <div className="film-controls">
                <button
                  type="button"
                  className="film-ctl"
                  onClick={toggle}
                  aria-label={status === 'playing' ? 'Pause' : 'Play'}
                >
                  {status === 'playing' ? <MdPause /> : <MdPlayArrow />}
                </button>

                <span className="film-time" aria-hidden>
                  <span
                    ref={(el) => {
                      // Control bar remounts after the film ends — force
                      // the next paint to rewrite the timecode.
                      timeRef.current = el;
                      lastSecondRef.current = -1;
                    }}
                  >
                    00:00
                  </span>
                  <span className="film-time-total">
                    {' / '}
                    {fmt(Math.ceil(duration))}
                  </span>
                </span>

                <div
                  ref={scrubRef}
                  className="film-scrub"
                  role="slider"
                  tabIndex={0}
                  aria-label="Seek"
                  aria-valuemin={0}
                  aria-valuemax={Math.floor(duration)}
                  aria-valuenow={0}
                  onPointerDown={onScrubDown}
                  onPointerMove={onScrubMove}
                  onPointerUp={onScrubUp}
                  onPointerCancel={onScrubUp}
                  onKeyDown={onScrubKey}
                >
                  <span className="film-scrub-track" aria-hidden>
                    <span className="film-scrub-fill" />
                  </span>
                  <span className="film-scrub-head" aria-hidden />
                </div>

                <button
                  type="button"
                  className="film-ctl"
                  onClick={toggleMute}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                  aria-pressed={muted}
                >
                  {muted ? <MdVolumeOff /> : <MdVolumeUp />}
                </button>

                {canFullscreen && (
                  <button
                    type="button"
                    className="film-ctl"
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
                  >
                    {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* CHAPTER RAIL — a match timeline under the frame */}
          <ol
            className="film-rail"
            aria-label="Film chapters"
            style={{ '--film-cols': RAIL_COLUMNS } as CSSProperties}
          >
            {CHAPTERS.map((c, i) => (
              <li key={c.num}>
                <button
                  ref={(el) => {
                    chapterRefs.current[i] = el;
                  }}
                  type="button"
                  className="film-chapter"
                  data-active={started && active === i ? 'true' : undefined}
                  aria-current={started && active === i ? 'step' : undefined}
                  aria-label={`Play from ${fmt(c.start)}: ${c.title}`}
                  onClick={() => play(c.start)}
                >
                  <span className="film-chapter-bar" aria-hidden />
                  <span className="film-chapter-meta" aria-hidden>
                    <span className="film-chapter-num">{c.num}</span>
                    <span>{fmt(c.start)}</span>
                  </span>
                  <span className="film-chapter-title" aria-hidden>
                    {c.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style jsx>{`
        /* ---- Layout — same column as The Problem above ---- */
        .film-grid {
          /* On short screens the frame narrows so the whole picture fits
             in the viewport; the head narrows with it to keep one edge. */
          --film-w: max(560px, calc((100vh - 220px) * 16 / 9));
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 56px);
        }
        .film-head {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 20px;
          max-width: var(--film-w);
          margin: 0 auto clamp(28px, 4.5vh, 48px);
        }
        @media (min-width: 1024px) {
          .film-head {
            grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
            align-items: end;
            gap: 48px;
          }
        }
        .film-eyebrow {
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--lime);
          margin-bottom: clamp(20px, 3vh, 32px);
        }
        .film-headline {
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 900;
          font-size: clamp(2rem, 4.4vw, 3.6rem);
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--ink, #f5f5f0);
          margin: 0;
          max-width: 16ch;
        }
        .film-nowrap {
          white-space: nowrap;
        }
        .film-sub {
          font-family: var(--font-body), Inter, sans-serif;
          font-size: 16px;
          line-height: 1.55;
          color: rgba(245, 245, 240, 0.62);
          margin: 0 0 16px;
          max-width: 46ch;
        }
        .film-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px 14px;
          font-family: var(--font-mono), monospace;
          font-size: 10.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245, 245, 240, 0.45);
        }
        .film-meta-val {
          color: var(--ink);
        }
        .film-meta-sep {
          width: 18px;
          height: 1px;
          background: rgba(245, 245, 240, 0.2);
        }
        .film-meta-link {
          position: relative;
          color: var(--lime);
          text-decoration: none;
        }
        .film-meta-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -4px;
          height: 1px;
          background: var(--lime);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 300ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .film-meta-link:hover::after,
        .film-meta-link:focus-visible::after {
          transform: scaleX(1);
        }
        .film-meta-link:focus-visible {
          outline: none;
        }

        /* ---- Stage: frame + rail ---- */
        .film-stage {
          position: relative;
          isolation: isolate;
          width: 100%;
          max-width: var(--film-w);
          margin: 0 auto;
        }
        /* Screen spill — the picture faintly lights the room, a touch
           brighter once it's running. */
        .film-stage::before {
          content: '';
          position: absolute;
          left: -6%;
          right: -6%;
          top: 4%;
          bottom: 12%;
          z-index: -1;
          pointer-events: none;
          background: radial-gradient(
            ellipse 55% 60% at 50% 55%,
            rgba(212, 255, 58, 0.1) 0%,
            rgba(212, 255, 58, 0) 70%
          );
          opacity: 0.6;
          transition: opacity 900ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .film-stage[data-status='playing']::before,
        .film-stage[data-status='paused']::before {
          opacity: 1;
        }

        .film-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 18px;
          overflow: hidden;
          isolation: isolate;
          background: #000;
          border: 1px solid rgba(245, 245, 240, 0.1);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
        }
        .film-frame[data-chrome='hidden'] {
          cursor: none;
        }
        .film-frame[data-fullscreen='true'] {
          border: 0;
          border-radius: 0;
          aspect-ratio: auto;
          height: 100%;
          box-shadow: none;
        }
        .film-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
          background: #000;
        }

        /* ---- Poster ---- */
        .film-poster {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: block;
          width: 100%;
          padding: 0;
          border: 0;
          background: #000;
          color: inherit;
          cursor: pointer;
          opacity: 1;
          visibility: visible;
          transition:
            opacity 450ms cubic-bezier(0.22, 0.61, 0.36, 1),
            visibility 0s linear 0s;
        }
        .film-poster[data-visible='false'] {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity 450ms cubic-bezier(0.22, 0.61, 0.36, 1),
            visibility 0s linear 450ms;
        }
        .film-poster:focus-visible {
          outline: none;
        }
        .film-poster-img {
          position: absolute;
          inset: 0;
          transform: scale(1);
          transition: transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .film-poster:hover .film-poster-img {
          transform: scale(1.015);
        }
        .film-poster-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            20deg,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0) 38%
          );
        }
        .film-lower-third {
          position: absolute;
          left: clamp(14px, 2.4vw, 28px);
          bottom: clamp(14px, 2.4vw, 28px);
          display: flex;
          align-items: center;
          gap: clamp(10px, 1.4vw, 16px);
          text-align: left;
        }
        .film-knob {
          flex-shrink: 0;
          display: grid;
          place-items: center;
          width: clamp(44px, 4.4vw, 58px);
          height: clamp(44px, 4.4vw, 58px);
          border-radius: 999px;
          background: rgba(14, 21, 18, 0.82);
          border: 2px solid var(--lime);
          color: var(--lime);
          font-size: clamp(22px, 2.2vw, 28px);
          box-shadow:
            0 0 0 6px rgba(212, 255, 58, 0.1),
            0 12px 28px rgba(0, 0, 0, 0.55);
          transition:
            background 320ms cubic-bezier(0.22, 0.61, 0.36, 1),
            color 320ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 320ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .film-poster:hover .film-knob,
        .film-poster:focus-visible .film-knob {
          background: var(--lime);
          color: #0a0a0a;
          box-shadow:
            0 0 0 8px rgba(212, 255, 58, 0.14),
            0 0 36px rgba(212, 255, 58, 0.45);
        }
        .film-poster[data-loading='true'] .film-knob {
          animation: filmKnobPulse 1.1s ease-in-out infinite;
        }
        @keyframes filmKnobPulse {
          0%,
          100% {
            box-shadow:
              0 0 0 6px rgba(212, 255, 58, 0.1),
              0 12px 28px rgba(0, 0, 0, 0.55);
          }
          50% {
            box-shadow:
              0 0 0 12px rgba(212, 255, 58, 0.04),
              0 12px 28px rgba(0, 0, 0, 0.55);
          }
        }
        .film-lt-copy {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .film-lt-title {
          font-family: var(--font-display), Inter, sans-serif;
          font-weight: 900;
          font-size: clamp(0.95rem, 1.5vw, 1.2rem);
          letter-spacing: -0.02em;
          line-height: 1;
          color: var(--ink);
        }
        .film-lt-meta {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(245, 245, 240, 0.6);
        }
        /* Phones: the poster's own type fills the frame — knob only. */
        @media (max-width: 559px) {
          .film-lt-copy {
            display: none;
          }
        }

        /* ---- Control bar ---- */
        .film-controls {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: clamp(2px, 0.8vw, 10px);
          padding: 36px clamp(8px, 1.6vw, 18px) clamp(6px, 1.2vw, 14px);
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.72) 100%
          );
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .film-frame[data-chrome='hidden'] .film-controls {
          opacity: 0;
          transform: translateY(6px);
          pointer-events: none;
        }
        .film-frame:has(:focus-visible) .film-controls {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .film-ctl {
          flex-shrink: 0;
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: rgba(245, 245, 240, 0.88);
          font-size: 22px;
          cursor: pointer;
          transition:
            color 200ms ease,
            background 200ms ease;
        }
        .film-ctl:hover {
          color: var(--lime);
          background: rgba(245, 245, 240, 0.06);
        }
        .film-ctl:focus-visible {
          outline: 2px solid var(--lime);
          outline-offset: 1px;
        }
        .film-time {
          flex-shrink: 0;
          padding: 0 4px;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          font-variant-numeric: tabular-nums;
          color: var(--ink);
        }
        .film-time-total {
          color: rgba(245, 245, 240, 0.5);
        }
        @media (max-width: 479px) {
          .film-time-total {
            display: none;
          }
        }

        .film-scrub {
          --p: 0;
          position: relative;
          flex: 1;
          min-width: 0;
          height: 28px;
          margin: 0 6px;
          cursor: pointer;
          touch-action: none;
          outline: none;
        }
        .film-scrub-track {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 3px;
          margin-top: -1.5px;
          border-radius: 3px;
          overflow: hidden;
          background: rgba(245, 245, 240, 0.22);
          transition:
            height 200ms ease,
            margin-top 200ms ease;
        }
        .film-scrub-fill {
          position: absolute;
          inset: 0;
          background: var(--lime);
          transform-origin: left center;
          transform: scaleX(var(--p));
        }
        .film-scrub-head {
          position: absolute;
          top: 50%;
          left: calc(var(--p) * 100%);
          width: 12px;
          height: 12px;
          margin: -6px 0 0 -6px;
          border-radius: 999px;
          background: var(--lime);
          box-shadow: 0 0 0 4px rgba(212, 255, 58, 0.18);
          opacity: 0;
          transform: scale(0.6);
          transition:
            opacity 200ms ease,
            transform 200ms ease;
        }
        .film-scrub:hover .film-scrub-track,
        .film-scrub:focus-visible .film-scrub-track {
          height: 5px;
          margin-top: -2.5px;
        }
        .film-scrub:hover .film-scrub-head,
        .film-scrub:focus-visible .film-scrub-head {
          opacity: 1;
          transform: scale(1);
        }

        /* ---- Chapter rail ---- */
        .film-rail {
          list-style: none;
          margin: 20px 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px 4px;
        }
        @media (min-width: 640px) {
          .film-rail {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .film-rail {
            grid-template-columns: var(--film-cols);
          }
        }
        .film-chapter {
          --p: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          padding: 0 8px 4px 0;
          border: 0;
          background: none;
          color: inherit;
          text-align: left;
          cursor: pointer;
        }
        .film-chapter:focus-visible {
          outline: 2px solid var(--lime);
          outline-offset: 4px;
          border-radius: 2px;
        }
        .film-chapter-bar {
          position: relative;
          display: block;
          width: 100%;
          height: 2px;
          border-radius: 2px;
          overflow: hidden;
          background: rgba(245, 245, 240, 0.14);
          transition: background 240ms ease;
        }
        .film-chapter-bar::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--lime);
          transform-origin: left center;
          transform: scaleX(var(--p));
        }
        .film-chapter:hover .film-chapter-bar {
          background: rgba(245, 245, 240, 0.3);
        }
        .film-chapter-meta {
          display: flex;
          gap: 10px;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245, 245, 240, 0.4);
        }
        .film-chapter-num {
          transition: color 240ms ease;
        }
        .film-chapter-title {
          font-family: var(--font-body), Inter, sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.01em;
          line-height: 1.25;
          color: rgba(245, 245, 240, 0.62);
          transition: color 240ms ease;
        }
        .film-chapter:hover .film-chapter-title {
          color: var(--ink);
        }
        .film-chapter[data-active='true'] .film-chapter-num {
          color: var(--lime);
        }
        .film-chapter[data-active='true'] .film-chapter-title {
          color: var(--ink);
        }
      `}</style>
    </section>
  );
}
