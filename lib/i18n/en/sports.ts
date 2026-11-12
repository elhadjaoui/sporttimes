const sports = {
  progressLabel: 'The Sports',
  eyebrow: 'one engine',
  // Desktop crossfades these by index: [0] first, then [1] after the
  // other sports appear.
  headlines: ['Built for football.', 'Engineered for every team sport.'],
  // Mobile and reduced motion show both headlines as one heading.
  headlineCombined: 'Built for football. Engineered for every team sport.',
  sub: 'From a five-a-side futsal to an 11v11 league. One engine adapts to every team sport.',
  engineLabel: 'engine',
  engineSpec: ['lineup builder', 'scheduling', 'check-in', 'real-time sync'],
  status: { live: 'Live', soon: 'Soon' },
  logoAlt: 'SPORTTIMES',
  // Keyed by sport id (SPORTS in components/sections/Sports.tsx).
  items: {
    football: { name: 'Football', formats: '5v5 · 7v7 · 9v9 · 11v11' },
    basketball: { name: 'Basketball', formats: '3v3 · 5v5' },
    volleyball: { name: 'Volleyball', formats: '4v4 · 6v6' },
    handball: { name: 'Handball', formats: '7v7' },
    padel: { name: 'Padel', formats: '2v2' },
    futsal: { name: 'Futsal', formats: '5v5' },
    rugby: { name: 'Rugby', formats: '7s · 15s' },
  },
} as const;

export default sports;
