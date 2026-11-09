import InviteFallback from '@/components/sections/InviteFallback';
import { inviteMetadata } from '@/lib/metadata';

export const metadata = inviteMetadata({
  title: "You've been invited to a team",
  description: 'Open your team invite in the SPORTTIMES app.',
});

export default function TeamInvitePage() {
  return <InviteFallback kind="team" />;
}
