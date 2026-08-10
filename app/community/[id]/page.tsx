import type { Metadata } from 'next';
import InviteFallback from '@/components/sections/InviteFallback';

export const metadata: Metadata = {
  title: "You've been invited to a community — SportTimes",
  description: 'Open your community invite in the SportTimes app.',
  openGraph: {
    title: "You've been invited to a community",
    description: 'Open your community invite in the SportTimes app.',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export default function CommunityInvitePage() {
  return <InviteFallback kind="community" />;
}
