const hero = {
  progressLabel: 'Welcome',
  eyebrow: 'Made for players · by players',
  // One item per line of the headline.
  headline: ['The match before', 'the match.'],
  subheadline: 'Find and join football matches near you.',
  lede: "See who's playing before you commit. Claim your spot. Show up ready.",
  joinBeta: 'Join the iOS beta ↗',
  seeHow: 'See how it works',
  android: {
    before: 'iOS only for now. On Android?',
    link: 'Join the waitlist',
    after: '.',
  },
  scroll: 'Scroll to explore',
} as const;

export default hero;
