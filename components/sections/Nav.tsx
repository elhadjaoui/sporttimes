'use client';

import { useEffect, useState } from 'react';
import { getLenis } from '@/hooks/useLenis';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToConnect = () => {
    const target = document.getElementById('stay-connected');
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 70,
        borderBottom: scrolled ? '1px solid var(--hairline)' : '1px solid transparent',
        background: scrolled ? 'rgba(11, 13, 16, 0.7)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 280ms ease, border-color 280ms ease, backdrop-filter 280ms ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px clamp(20px, 4vw, 64px)',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <a
          href="#top"
          aria-label="SportTimes — top of page"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: '-0.01em',
            color: 'var(--text)',
            textDecoration: 'none',
          }}
        >
          SportTimes
        </a>
        <button
          type="button"
          onClick={scrollToConnect}
          style={{
            background: 'transparent',
            border: '1px solid var(--hairline)',
            borderRadius: 100,
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            padding: '10px 18px',
            minHeight: 44,
            cursor: 'pointer',
            transition: 'color 200ms ease, border-color 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text)';
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-dim)';
            e.currentTarget.style.borderColor = 'var(--hairline)';
          }}
        >
          Get notified →
        </button>
      </div>
    </header>
  );
}
