import InviteFallback from '@/components/sections/InviteFallback';
import { inviteMetadata } from '@/lib/metadata';

export const metadata = inviteMetadata({
  title: "You've been invited to a match",
  description: 'Open your match invite in the SPORTTIMES app.',
});

export default function MatchInvitePage() {
  return <InviteFallback kind="match" />;
}
