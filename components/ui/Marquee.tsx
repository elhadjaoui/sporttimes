// Single-row infinite-scroll mono ticker. Constant linear speed (no easing).
// Kept very subtle (40% opacity) so it doesn't fight the headline.

const ITEMS = [
  'Football',
  'Basketball',
  'Handball',
  'Tonight · Casablanca',
  '1 slot open',
  '4 · 3 · 3',
  '⚪ Live',
  'Find a match',
  'Made in Casablanca',
  'Pre-launch · 2026',
];

export default function Marquee({
  speed = 60,
  className = '',
}: {
  speed?: number; // seconds per full loop
  className?: string;
}) {
  // Duplicate the items so the loop is seamless
  const row = [...ITEMS, ...ITEMS];

  return (
    <div
      aria-hidden
      className={`relative w-full overflow-hidden border-y border-ink/10 ${className}`}
    >
      <div
        className="flex whitespace-nowrap"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {row.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 py-3 font-mono text-[10px] tracking-[0.25em] uppercase text-ink/40"
          >
            {item}
            <span className="text-lime/60">·</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
