// Four corner brackets — viewfinder/HUD frame for a section.
// Pure decorative chrome. 1px lime, sized 32px arms.

const Bracket = ({
  position,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
}) => {
  const map = {
    tl: { top: 24, left: 24, deg: 0 },
    tr: { top: 24, right: 24, deg: 90 },
    br: { bottom: 24, right: 24, deg: 180 },
    bl: { bottom: 24, left: 24, deg: 270 },
  } as const;
  const { deg, ...arms } = map[position];

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      style={{
        position: 'absolute',
        ...arms,
        transform: `rotate(${deg}deg)`,
      }}
      aria-hidden
    >
      <path
        d="M0 1 L1 1 L1 28"
        stroke="#D4FF3A"
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M1 1 L28 1"
        stroke="#D4FF3A"
        strokeWidth="1"
        opacity="0.7"
      />
    </svg>
  );
};

export default function CornerBrackets() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30"
    >
      <Bracket position="tl" />
      <Bracket position="tr" />
      <Bracket position="bl" />
      <Bracket position="br" />
    </div>
  );
}
