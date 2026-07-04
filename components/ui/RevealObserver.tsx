'use client';

import { useEffect } from 'react';

/**
 * RevealObserver: page-level controller for the [data-reveal] scroll-reveal
 * utility defined in app/globals.css. Mounted once in app/layout.tsx.
 *
 * Behavior:
 * - Finds every [data-reveal] element in the document.
 * - On first viewport intersection, adds `.is-revealed` (CSS handles the
 *   opacity + translate + per-child stagger via [data-reveal-child]).
 * - Sets a `--reveal-i` index inline on each [data-reveal-child] for the
 *   60ms-per-step stagger.
 * - Observes nodes added later via MutationObserver so dynamic sections work.
 * - Reduced-motion: globals.css forces final state via media query;
 *   we still attach `.is-revealed` so downstream logic that keys on the
 *   class behaves consistently.
 */
export default function RevealObserver() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    const indexChildren = (root: ParentNode) => {
      const children = root.querySelectorAll<HTMLElement>('[data-reveal-child]');
      children.forEach((child, i) => {
        if (!child.style.getPropertyValue('--reveal-i')) {
          child.style.setProperty('--reveal-i', String(i));
        }
      });
    };

    const attach = (el: Element) => {
      io.observe(el);
      indexChildren(el);
    };

    // Initial pass
    document.querySelectorAll('[data-reveal]').forEach(attach);

    // Watch for late-mounted reveals (dynamic-imported sections)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches('[data-reveal]')) attach(node);
          node.querySelectorAll?.('[data-reveal]').forEach(attach);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
