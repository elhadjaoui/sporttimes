import { LAUNCH_LABEL } from '@/lib/site';

// The waitlist section at the bottom of the homepage.
const download = {
  progressLabel: 'Get notified',
  screenshotAlt: 'A SPORTTIMES match-day view showing your confirmed lineup',
  eyebrow: 'Get notified',
  headline: 'Be first on the pitch.',
  intro: `The iOS beta is open now. Public launch is planned for ${LAUNCH_LABEL}. Drop your email and we'll send one note on launch day.`,
  // The email form (components/ui/WaitlistForm.tsx).
  waitlist: {
    label: 'Your email',
    placeholder: 'your@email.com',
    cta: 'Join the waitlist',
    submitting: 'Submitting…',
    success: "You're on the list. We'll email you when doors open.",
    invalid: "That doesn't look like an email.",
    error: 'Something went wrong. Try again?',
  },
  emailNote: "We'll only email you about the launch.",
  launch: `Public launch · ${LAUNCH_LABEL}`,
  // Greyed-out store badges. The store names stay in code.
  badges: {
    appStore: { label: `App Store — ${LAUNCH_LABEL}`, status: LAUNCH_LABEL },
    googlePlay: { label: 'Google Play — coming soon', status: 'Coming soon' },
  },
} as const;

export default download;
