import InviteFallback from '@/components/sections/InviteFallback';
import { inviteMetadata } from '@/lib/metadata';

export const metadata = inviteMetadata({
  title: "You've been invited to a community",
  description: 'Open your community invite in the SPORTTIMES app.',
});

export default function CommunityInvitePage() {
  return <InviteFallback kind="community" />;
}
