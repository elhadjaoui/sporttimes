'use client';

import { useEffect, useState } from 'react';
import NotifyForm from './NotifyForm';

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  // Body scroll-lock while the sheet is open
  useEffect(() => {
    if (sheetOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [sheetOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const heroSentinel = document.getElementById('top');
    const footerSentinel = document.getElementById('footer');

    let heroOut = false;
    let footerIn = false;

    const heroObs = new IntersectionObserver(([entry]) => {
      heroOut = !entry.isIntersecting;
      setVisible(heroOut && !footerIn);
    }, { threshold: 0 });
    if (heroSentinel) heroObs.observe(heroSentinel);

    const footerObs = new IntersectionObserver(([entry]) => {
      footerIn = entry.isIntersecting;
      setVisible(heroOut && !footerIn);
    }, { threshold: 0 });
    if (footerSentinel) footerObs.observe(footerSentinel);

    return () => {
      heroObs.disconnect();
      footerObs.disconnect();
    };
  }, []);

  const baseStyle = {
    position: 'fixed' as const,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 60,
    background: 'var(--accent)',
    color: '#0B0D10',
    padding: '14px 20px',
    minHeight: 56,
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: 16,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 -12px 40px rgba(0,0,0,0.18)',
  };

  return (
    <div className="sticky-mobile-cta" style={{ display: 'none' }}>
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        style={{
          ...baseStyle,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: reducedMotion ? 'none' : 'transform 240ms ease-out',
        }}
      >
        Get notified →
      </button>

      {sheetOpen && (
        <>
          <div
            role="presentation"
            onClick={() => setSheetOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(11, 13, 16, 0.6)', zIndex: 80,
            }}
          />
          <div
            role="dialog"
            aria-label="Get notified"
            data-palette="lime"
            style={{
              position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 90,
              background: 'var(--bg)', color: 'var(--text)',
              padding: '24px 20px 40px',
              borderTopLeftRadius: 20, borderTopRightRadius: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <h3 className="headline-display" style={{ fontSize: 20, color: 'var(--text)' }}>
                Get the launch email.
              </h3>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close"
                style={{
                  background: 'transparent', border: 'none', color: 'var(--text)',
                  fontSize: 24, cursor: 'pointer', minWidth: 44, minHeight: 44,
                }}
              >×</button>
            </div>
            <NotifyForm source="sticky-mobile" variant="lime" />
          </div>
        </>
      )}

      <style jsx>{`
        @media (max-width: 1023px) {
          .sticky-mobile-cta { display: block !important; }
        }
      `}</style>
    </div>
  );
}
