'use client';

interface AppStoreBadgeProps {
  soon?: boolean;
}

export function AppStoreBadge({ soon = false }: AppStoreBadgeProps) {
  const commonInner = (
    <>
      <svg
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill={soon ? 'rgba(245,245,240,0.55)' : '#F5F5F0'}
        style={soon ? { opacity: 0.7 } : undefined}
      >
        <path d="M17.5 14.1c0-2.5 2-3.7 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.1-.8-1.6 0-3 .9-3.8 2.4-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2-.1 1.6-.8 3.1-.8 1.4 0 1.8.8 3.1.7 1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.4zM14.8 7.1c.7-.8 1.1-1.9 1-3-.9.1-2 .6-2.7 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2-.5 2.7-1.3z" />
      </svg>
      <div style={{ textAlign: 'left', lineHeight: 1 }}>
        <div
          style={{
            fontSize: 9,
            letterSpacing: '0.08em',
            color: soon
              ? 'rgba(245,245,240,0.5)'
              : 'rgba(245,245,240,0.75)',
          }}
        >
          Download on the
        </div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            marginTop: 2,
          }}
        >
          App&nbsp;Store
        </div>
      </div>
      {soon && <SoonPill />}
    </>
  );

  const commonStyle = {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    gap: 10,
    padding: '10px 18px',
    background: '#0A0A0A',
    borderRadius: 10,
    fontFamily: 'var(--font-body), Inter, sans-serif',
    minWidth: 170,
    position: 'relative' as const,
    textDecoration: 'none' as const,
  };

  if (soon) {
    return (
      <span
        aria-label="App Store — coming soon"
        className="store-badge store-badge-soon"
        style={{
          ...commonStyle,
          border: '1px solid rgba(245,245,240,0.12)',
          color: 'rgba(245,245,240,0.55)',
          cursor: 'help',
        }}
      >
        {commonInner}
      </span>
    );
  }

  return (
    <a
      href="#"
      data-cursor="hover"
      className="store-badge"
      aria-label="Download on the App Store"
      style={{
        ...commonStyle,
        border: '1px solid rgba(245,245,240,0.22)',
        color: '#F5F5F0',
        transition:
          'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1), border-color 280ms ease',
        willChange: 'transform',
      }}
    >
      {commonInner}
    </a>
  );
}

export function PlayStoreBadge() {
  return (
    <span
      aria-label="Google Play — coming soon"
      className="store-badge store-badge-soon"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
        background: '#0A0A0A',
        border: '1px solid rgba(245,245,240,0.12)',
        borderRadius: 10,
        color: 'rgba(245,245,240,0.55)',
        textDecoration: 'none',
        fontFamily: 'var(--font-body), Inter, sans-serif',
        minWidth: 170,
        position: 'relative',
        cursor: 'help',
      }}
    >
      <svg
        width="22"
        height="26"
        viewBox="0 0 512 512"
        style={{ opacity: 0.55 }}
      >
        <defs>
          <linearGradient id="p1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD400" />
            <stop offset="1" stopColor="#FF3A44" />
          </linearGradient>
          <linearGradient id="p2" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#00A0FF" />
            <stop offset="1" stopColor="#33BBFF" />
          </linearGradient>
          <linearGradient id="p3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00C853" />
            <stop offset="1" stopColor="#B2FF59" />
          </linearGradient>
        </defs>
        <path
          d="M66 44c-8 4-12 11-12 21v382c0 10 4 17 12 21l224-210L66 44z"
          fill="url(#p2)"
        />
        <path
          d="M290 258L66 468c8 3 17 2 26-3l268-152-70-55z"
          fill="url(#p1)"
        />
        <path
          d="M360 313l-70-55 70-55 88 50c18 10 18 28 0 38l-88 22z"
          fill="url(#p3)"
        />
        <path
          d="M290 258L360 203 92 51c-9-5-18-6-26-3l224 210z"
          fill="#00A0FF"
          opacity="0.9"
        />
      </svg>
      <div style={{ textAlign: 'left', lineHeight: 1 }}>
        <div
          style={{
            fontSize: 9,
            letterSpacing: '0.08em',
            color: 'rgba(245,245,240,0.5)',
          }}
        >
          GET IT ON
        </div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            marginTop: 2,
          }}
        >
          Google&nbsp;Play
        </div>
      </div>
      <SoonPill />
    </span>
  );
}

function SoonPill() {
  return (
    <span
      className="store-badge-soon-pill"
      style={{
        position: 'absolute',
        top: -8,
        right: -6,
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 8,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--lime, #d4ff3a)',
        background: 'rgba(212, 255, 58, 0.12)',
        border: '1px solid rgba(212, 255, 58, 0.45)',
        padding: '2px 6px',
        borderRadius: 100,
        pointerEvents: 'none',
        lineHeight: 1,
      }}
    >
      Soon
    </span>
  );
}
