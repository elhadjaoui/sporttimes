import { track } from '@vercel/analytics';

// Beta funnel events for Vercel Web Analytics. Event properties must never
// carry personal data such as emails or names.

export type BetaButtonLocation = 'hero' | 'footer' | 'not_found' | 'invite';

export function trackBetaClick(location: BetaButtonLocation) {
  track('beta_click', { location });
}

export function trackWaitlistSubmit(source: string) {
  track('waitlist_submit', { source });
}
