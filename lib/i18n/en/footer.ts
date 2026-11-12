// The homepage footer.
const footer = {
  progressLabel: 'Footer',
  tagline: 'See the lineup · Join the match',
  // aria-labels of the social icons, keyed by network (the list in Footer.tsx).
  social: {
    Instagram: 'Instagram',
    TikTok: 'TikTok',
    YouTube: 'YouTube — coming soon',
  },
  // Pill on the social icons that have no link yet.
  soon: 'soon',
  playMore: {
    // The headline as one phrase, for screen readers. Keep it matching lines.
    label: 'Play more.',
    // One item per line of the headline.
    lines: ['Play', 'more.'],
  },
  eyebrow: 'The match before the match · {year}',
  // The numbers above these labels stay in code.
  stats: {
    live: 'Sport live',
    soon: 'Coming soon',
    ahead: 'Matches ahead',
  },
  joinBeta: 'Join the beta ↗',
  copyright: '© {year} SPORTTIMES',
  links: {
    privacy: 'Privacy',
    terms: 'Terms',
  },
  email: {
    copyLabel: 'Copy {email} to clipboard',
    copied: 'Copied!',
    clickToCopy: 'Click to copy',
  },
} as const;

export default footer;
