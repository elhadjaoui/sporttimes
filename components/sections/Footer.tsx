import Link from 'next/link';
import type { SVGProps } from 'react';

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.66a8.16 8.16 0 0 0 4.77 1.52v-3.45a4.85 4.85 0 0 1-1.84-.04z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS = [
  { label: 'Instagram', href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#', Icon: InstagramIcon },
  { label: 'TikTok',    href: process.env.NEXT_PUBLIC_TIKTOK_URL ?? '#',    Icon: TikTokIcon },
  { label: 'X',         href: process.env.NEXT_PUBLIC_X_URL ?? '#',         Icon: XIcon },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      data-palette="dark"
      style={{
        padding: '32px clamp(20px, 4vw, 64px)',
        borderTop: '1px solid var(--hairline)',
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--text-mute)',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text)',
        }}>
          SportTimes
        </span>
        <nav style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ color: 'var(--text-mute)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms"   style={{ color: 'var(--text-mute)', textDecoration: 'none' }}>Terms</Link>
          <a href="mailto:contact@…" style={{ color: 'var(--text-mute)', textDecoration: 'none' }}>contact@…</a>
        </nav>
        <div style={{ display: 'flex', gap: 12 }}>
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{ color: 'var(--text-mute)', display: 'inline-flex', minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon aria-hidden />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
