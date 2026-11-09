import type { Metadata } from 'next';
import InviteFallback from '@/components/sections/InviteFallback';

export const metadata: Metadata = {
  title: "You've been invited to a team — SPORTTIMES",
  description: 'Open your team invite in the SPORTTIMES app.',
  openGraph: {
    title: "You've been invited to a team",
    description: 'Open your team invite in the SPORTTIMES app.',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export default function TeamInvitePage() {
  return <InviteFallback kind="team" />;
}
