// The roadmap board and its mobile list (components/sections/LockerRoom.tsx).
// No dates: nothing here may promise a release the app hasn't scheduled.
const roadmap = {
  progressLabel: 'Roadmap',
  eyebrow: 'Roadmap',
  // The accent part is shown in lime.
  headline: { before: '', accent: 'Next', after: ' on the pitch.' },
  // Screen-reader label for each magnet on the board.
  magnetLabel: '{name} details',
  // Feature number and status, above the name in the board tooltip.
  tooltipMeta: '{seq} · {status}',
  // The same line on a mobile card. The status, shown in lime, sits
  // between the two parts.
  cardMeta: { before: '{seq} · ', after: '' },
  // Keyed by feature id (FEATURES in components/sections/LockerRoom.tsx).
  features: {
    'more-sports': {
      name: 'More sports',
      status: 'Coming soon',
      summary: 'The catalog keeps growing with the community.',
      bullets: [
        'Football is live today',
        'Six more sports listed as coming soon',
        'Basketball, Volleyball, Handball, Padel, Futsal, Rugby',
        'Same lineup engine, any format',
      ],
      statusNote: 'No dates yet.',
    },
    tournaments: {
      name: 'Tournaments',
      status: 'Planned',
      summary:
        'Run complete tournament brackets inside your community — no spreadsheets.',
      bullets: [
        'Single-elim, double-elim, round-robin',
        'Auto-seeding from match history',
        'Live bracket everyone can watch',
        'Shareable finals poster',
      ],
      statusNote: 'No date yet.',
    },
    'match-chat': {
      name: 'Match chat',
      status: 'Planned',
      summary:
        'A chat thread scoped to one match — goes quiet when the whistle blows.',
      bullets: [
        'Auto-opens when a match is set',
        'Auto-archives after full-time',
        'Drop-outs + confirmations live inline',
        'No group-chat bleed into your life',
      ],
      statusNote: 'No date yet.',
    },
  },
  // The line under the board: the label, then each item after a " · ".
  laterLabel: 'Later',
  later: ['AI Match Builder', 'AI Captain', 'SPORTTIMES Store', 'Venue booking'],
} as const;

export default roadmap;
