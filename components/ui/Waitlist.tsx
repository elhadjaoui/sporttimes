'use client';

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';

type Source = 'hero' | 'download' | 'footer' | 'sticky' | 'inline';
type Variant = 'dark' | 'paper';
type State = 'idle' | 'loading' | 'success' | 'error' | 'invalid';

const FORMSUBMIT_EMAIL = process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL ?? '';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  /** Where on the page this form lives — included as a hidden field for inbox segmentation. */
  source: Source;
  /** Auto-derive from nearest data-palette ancestor by default. Pass to override. */
  variant?: Variant;
  /** Optional override for the submit button label in the idle state. */
  cta?: string;
  /** Optional override for the success message. */
  successMessage?: string;
  /** Optional className passthrough on the <form> root. */
  className?: string;
};

/**
 * Waitlist: reusable email-capture form.
 *
 * Submits via fetch (no page redirect) to Formsubmit.co's AJAX endpoint.
 * Six designed states (idle / loading / success / error / invalid + a silent
 * honeypot drop). No backend required — the email lives in the inbox of
 * whoever owns NEXT_PUBLIC_FORMSUBMIT_EMAIL.
 *
 * Spam mitigation:
 * - Hidden _honey text field (bots fill it; we silently show success).
 * - Client-side rate limit: 1 submit per 5s.
 *
 * Accessibility:
 * - <label> linked to input via htmlFor (visually hidden).
 * - aria-live="polite" wrapper announces state changes.
 * - Focus moves to the success message on submit success.
 */
export default function Waitlist({
  source,
  variant,
  cta = 'Join the waitlist',
  successMessage = "You're on the list. We'll email you when doors open.",
  className,
}: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [resolvedVariant, setResolvedVariant] = useState<Variant>(variant ?? 'dark');
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const honeyRef = useRef<HTMLInputElement>(null);
  const lastSubmitRef = useRef(0);

  // Auto-derive variant from the nearest data-palette ancestor unless caller forces one.
  useEffect(() => {
    if (variant) {
      setResolvedVariant(variant);
      return;
    }
    if (!formRef.current) return;
    const ancestor = formRef.current.closest<HTMLElement>('[data-palette]');
    const palette = ancestor?.dataset.palette;
    setResolvedVariant(palette === 'paper' ? 'paper' : 'dark');
  }, [variant]);

  // Focus the success message once when it appears (not on every render).
  useEffect(() => {
    if (state === 'success') successRef.current?.focus();
  }, [state]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === 'loading') return;

    // Honeypot — bots fill this; we pretend success to avoid leaking detection.
    if (honeyRef.current?.value) {
      setState('success');
      return;
    }

    // Rate limit
    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) return;
    lastSubmitRef.current = now;

    if (!EMAIL_RE.test(email)) {
      setState('invalid');
      return;
    }

    if (!FORMSUBMIT_EMAIL) {
      // Config not set — fail loudly in dev, generically in prod.
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error(
          'Waitlist: NEXT_PUBLIC_FORMSUBMIT_EMAIL is not configured. Set it in .env.local.'
        );
      }
      setState('error');
      return;
    }

    setState('loading');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          source,
          _subject: `SportTimes waitlist · ${source}`,
          _captcha: 'false',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState('success');
    } catch {
      setState('error');
    }
  };

  const isPaper = resolvedVariant === 'paper';

  const inputStyle: CSSProperties = {
    background: isPaper ? '#FFFFFF' : 'rgba(245, 245, 240, 0.04)',
    border: `1px solid ${isPaper ? 'var(--paper-line, rgba(11,13,16,0.07))' : 'rgba(245, 245, 240, 0.12)'}`,
    borderRadius: 100,
    color: isPaper ? 'var(--paper-ink, #0B0D10)' : 'var(--ink)',
    fontFamily: 'var(--font-body), Inter, system-ui, sans-serif',
    fontSize: 15,
    padding: '13px 18px',
    minHeight: 44,
    width: '100%',
    outline: 'none',
  };

  const buttonStyle: CSSProperties = {
    background: 'var(--lime)',
    color: '#0B0D10',
    border: 'none',
    borderRadius: 100,
    fontFamily: 'var(--font-body), Inter, system-ui, sans-serif',
    fontWeight: 700,
    fontSize: 14,
    padding: '12px 22px',
    minHeight: 44,
    cursor: state === 'loading' ? 'wait' : 'pointer',
    whiteSpace: 'nowrap',
    letterSpacing: '0.01em',
  };

  if (state === 'success') {
    return (
      <div
        aria-live="polite"
        className={className}
        ref={successRef}
        tabIndex={-1}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '13px 18px',
          borderRadius: 100,
          background: isPaper ? '#FFFFFF' : 'rgba(212, 255, 58, 0.10)',
          border: `1px solid ${isPaper ? 'var(--paper-line, rgba(11,13,16,0.07))' : 'rgba(212, 255, 58, 0.35)'}`,
          color: isPaper ? 'var(--paper-ink, #0B0D10)' : 'var(--ink)',
          fontFamily: 'var(--font-body), Inter, sans-serif',
          fontSize: 15,
          outline: 'none',
        }}
      >
        <span aria-hidden style={{ color: 'var(--lime)', fontWeight: 700 }}>
          ✓
        </span>
        {successMessage}
      </div>
    );
  }

  const errorMessage =
    state === 'invalid'
      ? "That doesn't look like an email."
      : state === 'error'
      ? 'Something went wrong. Try again?'
      : null;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      aria-live="polite"
      className={className}
      style={{ width: '100%' }}
      noValidate
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', width: '100%' }}>
        <label
          htmlFor={`waitlist-${source}`}
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          Your email
        </label>
        <input
          id={`waitlist-${source}`}
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === 'invalid' || state === 'error') setState('idle');
          }}
          disabled={state === 'loading'}
          style={{
            ...inputStyle,
            flex: '1 1 220px',
            borderColor: state === 'invalid' ? '#FF6B6B' : inputStyle.border as string,
          }}
        />
        {/* Honeypot — invisible to humans, attractive to bots */}
        <input
          ref={honeyRef}
          type="text"
          name="_honey"
          tabIndex={-1}
          aria-hidden
          autoComplete="off"
          style={{ display: 'none' }}
        />
        <button type="submit" disabled={state === 'loading'} style={buttonStyle}>
          {state === 'loading' ? 'Submitting…' : cta}
        </button>
      </div>
      {errorMessage && (
        <div
          role="alert"
          style={{
            marginTop: 8,
            fontSize: 13,
            color: '#FF6B6B',
            fontFamily: 'var(--font-body), Inter, sans-serif',
          }}
        >
          {errorMessage}
        </div>
      )}
    </form>
  );
}
