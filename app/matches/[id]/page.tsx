import type { Metadata } from 'next';
import InviteFallback from '@/components/sections/InviteFallback';

export const metadata: Metadata = {
  title: "You've been invited to a match — SportTimes",
  description: 'Open your match invite in the SportTimes app.',
  openGraph: {
    title: "You've been invited to a match",
    description: 'Open your match invite in the SportTimes app.',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export default function MatchInvitePage() {
  return <InviteFallback kind="match" />;
}
