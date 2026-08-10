import type { Metadata } from 'next';
import InviteFallback from '@/components/sections/InviteFallback';

export const metadata: Metadata = {
  title: "You've been invited to a team — SportTimes",
  description: 'Open your team invite in the SportTimes app.',
  openGraph: {
    title: "You've been invited to a team",
    description: 'Open your team invite in the SportTimes app.',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export default function TeamInvitePage() {
  return <InviteFallback kind="team" />;
}
