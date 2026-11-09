import type { Metadata } from 'next';
import InviteFallback from '@/components/sections/InviteFallback';

export const metadata: Metadata = {
  title: "You've been invited — SPORTTIMES",
  description: 'Open your invite in the SPORTTIMES app.',
  openGraph: {
    title: "You've been invited",
    description: 'Open your invite in the SPORTTIMES app.',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export default function InviteCodePage() {
  return <InviteFallback kind="invite" />;
}
