import type { Metadata } from 'next';
import InviteFallback from '@/components/sections/InviteFallback';

export const metadata: Metadata = {
  title: "You've been invited — SportTimes",
  description: 'Open your invite in the SportTimes app.',
  openGraph: {
    title: "You've been invited",
    description: 'Open your invite in the SportTimes app.',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export default function InviteCodePage() {
  return <InviteFallback kind="invite" />;
}
