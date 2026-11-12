// The "How it works" section: desktop pinned stage, mobile stack and
// reduced-motion view share these strings.
const howItWorks = {
  progressLabel: 'How It Works',
  // {n} is the 1-based step number (1–3), so this reads "step 01 — 03".
  stepLabel: 'step 0{n} — 03',
  // One item per step, in timeline order (same order as STEPS in
  // components/sections/HowItWorks.tsx).
  steps: [
    {
      head: 'Open your community.',
      sub: 'Campus, city, club, workplace — find the squad you actually play with.',
      alt: 'A SPORTTIMES community page showing nearby squads with public and private badges.',
    },
    {
      head: 'See the lineup form.',
      sub: "Positions claim themselves in real time — who's playing, and where.",
      alt: 'A live lineup view in the SPORTTIMES app filling into a 4-3-3 formation.',
    },
    {
      head: 'Confirmed.',
      sub: 'One tap. Captain approves. Show up at the right field at the right time.',
      alt: 'A player profile in the SPORTTIMES app showing the confirmed slot and match details.',
    },
  ],
  // Screen-reader heading for each step. {num} is "01", "02" or "03".
  srHeading: '{num}. {head} {sub}',
  // One item per depth chip, same order as CHIPS in HowItWorks.tsx.
  chips: [
    { eyebrow: 'Join request', title: 'Approved' },
    { eyebrow: 'Slot filled', title: 'Karim · LB' },
    { eyebrow: "You're in", title: 'Confirmed' },
  ],
  // A chip title with its tick (mobile badge and reduced-motion badge).
  ticked: '{title} ✓',
  // The 0 → 11 counter on the lineup screen.
  counter: { eyebrow: 'lineup', of: '/11' },
  mobile: {
    eyebrow: 'how it works',
    heading: 'From group chat to a confirmed 11.',
  },
  reducedMotion: {
    heading: "You're in the lineup.",
    body: 'One tap. Captain approves. Your face appears in the lineup and you show up ready to play.',
  },
} as const;

export default howItWorks;
