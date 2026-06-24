'use client';

import { useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Variant = 'dark' | 'lime';
type Source = 'launch' | 'close' | 'sticky-mobile';
type State = 'idle' | 'loading' | 'success' | 'error' | 'invalid';

const FORMSUBMIT_EMAIL = process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL ?? '';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  source: Source;
  variant?: Variant;
};

export default function NotifyForm({ source, variant = 'dark' }: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const lastSubmitRef = useRef(0);
  const honeyRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === 'loading') return;

    // Honeypot — bots fill this, drop silently as success.
    if (honeyRef.current?.value) {
      setState('success');
      return;
    }

    // Client-side rate limit: 1 submit per 5s.
    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) return;
    lastSubmitRef.current = now;

    if (!EMAIL_RE.test(email)) {
      setState('invalid');
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
          _subject: `SportTimes notify · ${source}`,
          _captcha: 'false',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState('success');
    } catch {
      setState('error');
    }
  };

  const inputStyle = {
    background: variant === 'lime' ? 'transparent' : 'var(--surface)',
    border: '1px solid var(--hairline)',
    borderRadius: 100,
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    padding: '14px 18px',
    minHeight: 44,
    width: '100%',
    outline: 'none',
  } as const;

  const buttonStyle = {
    background: variant === 'lime' ? 'var(--text)' : 'var(--accent)',
    color: variant === 'lime' ? 'var(--accent)' : '#0B0D10',
    border: 'none',
    borderRadius: 100,
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: 14,
    padding: '12px 22px',
    minHeight: 44,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  };

  return (
    <form onSubmit={onSubmit} aria-live="polite" style={{ width: '100%' }}>
      <AnimatePresence mode="wait" initial={false}>
        {state === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '14px 18px',
              borderRadius: 100,
              background: 'var(--surface-2)',
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
            tabIndex={-1}
            ref={(el) => el?.focus()}
          >
            <span aria-hidden style={{ color: 'var(--accent)' }}>✓</span>
            You&apos;re on the list. We&apos;ll email you when doors open.
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
          >
            <label htmlFor={`notify-${source}`} style={{
              position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden',
              clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
            }}>
              Your email
            </label>
            <input
              id={`notify-${source}`}
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
                borderColor: state === 'invalid' ? '#FF6B6B' : 'var(--hairline)',
              }}
            />
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
              {state === 'loading' ? 'Submitting…' : 'Notify →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {state === 'invalid' && (
        <div style={{ marginTop: 8, fontSize: 13, color: '#FF6B6B', fontFamily: 'var(--font-body)' }}>
          That doesn&apos;t look right.
        </div>
      )}
      {state === 'error' && (
        <div style={{ marginTop: 8, fontSize: 13, color: '#FF6B6B', fontFamily: 'var(--font-body)' }}>
          Something went wrong. Try again?
        </div>
      )}
    </form>
  );
}
