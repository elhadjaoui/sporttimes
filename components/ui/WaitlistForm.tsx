'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react';

type Source = 'hero' | 'download' | 'footer' | 'sticky' | 'inline';
type Variant = 'dark' | 'paper';
type State = 'idle' | 'loading' | 'success' | 'error' | 'invalid';

// Env config — set these in .env.local. See .env.example for docs.
const GOOGLE_FORM_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ?? '';
const EMAIL_ENTRY = process.env.NEXT_PUBLIC_GOOGLE_FORM_EMAIL_ENTRY ?? '';
const SOURCE_ENTRY = process.env.NEXT_PUBLIC_GOOGLE_FORM_SOURCE_ENTRY ?? '';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  /** Where on the page this form lives — sent as a hidden field so Google
   *  Form responses can be segmented by placement. */
  source: Source;
  /** Auto-derive from nearest data-palette ancestor by default. Pass to override. */
  variant?: Variant;
  /** Optional override for the submit button label. */
  cta?: string;
  /** Optional override for the success message. */
  successMessage?: string;
  /** Optional className passthrough on the <form> root. */
  className?: string;
};

/**
 * Waitlist: reusable inline email form that POSTs to a Google Form.
 *
 * Submits via fetch with `mode: 'no-cors'` so the user stays on the app.
 * Google's formResponse endpoint doesn't return CORS headers, so we
 * can't read the response — we assume success if the request doesn't
 * throw. In practice this is reliable: Google accepts anything and
 * writes it to the responses spreadsheet.
 *
 * Config: set these three env vars in .env.local:
 *   NEXT_PUBLIC_GOOGLE_FORM_URL          — the /formResponse URL
 *   NEXT_PUBLIC_GOOGLE_FORM_EMAIL_ENTRY  — the email field's entry.XXXXXXX ID
 *   NEXT_PUBLIC_GOOGLE_FORM_SOURCE_ENTRY — (optional) source field entry ID
 *
 * Getting the entry IDs:
 *   1. In the Google Forms editor: ⋮ menu → "Get pre-filled link".
 *   2. Fill any dummy values, then click "Get link".
 *   3. The URL contains &entry.NNNNNN=DUMMY — copy each entry.NNNNNN.
 */
export default function WaitlistForm({
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
  const lastSubmitRef = useRef(0);

  // Auto-derive variant from nearest data-palette ancestor.
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

  // Move focus to the success message when it appears.
  useEffect(() => {
    if (state === 'success') successRef.current?.focus();
  }, [state]);

  // Dev warnings if the form isn't wired up.
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      process.env.NODE_ENV === 'production'
    ) return;
    if (!GOOGLE_FORM_URL) {
      // eslint-disable-next-line no-console
      console.warn(
        'Waitlist: NEXT_PUBLIC_GOOGLE_FORM_URL is not set. Submissions will error.'
      );
    }
    if (!EMAIL_ENTRY) {
      // eslint-disable-next-line no-console
      console.warn(
        'Waitlist: NEXT_PUBLIC_GOOGLE_FORM_EMAIL_ENTRY is not set. Submissions will error.'
      );
    }
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === 'loading') return;

    // 5-second rate limit.
    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) return;
    lastSubmitRef.current = now;

    if (!EMAIL_RE.test(email)) {
      setState('invalid');
      return;
    }
    if (!GOOGLE_FORM_URL || !EMAIL_ENTRY) {
      setState('error');
      return;
    }

    setState('loading');

    // Convert viewform → formResponse if the user pasted the viewform URL.
    const submitUrl = GOOGLE_FORM_URL.includes('/formResponse')
      ? GOOGLE_FORM_URL
      : GOOGLE_FORM_URL.replace('/viewform', '/formResponse');

    const formData = new FormData();
    formData.append(EMAIL_ENTRY, email);
    if (SOURCE_ENTRY) formData.append(SOURCE_ENTRY, source);

    try {
      // Google's formResponse endpoint doesn't return CORS headers, so
      // we submit with `no-cors` and treat any non-throwing response as
      // success. Google accepts the write regardless.
      await fetch(submitUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });
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
            borderColor: state === 'invalid' ? '#FF6B6B' : (inputStyle.border as string),
          }}
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
