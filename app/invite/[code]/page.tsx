import InviteFallback from '@/components/sections/InviteFallback';
import { inviteMetadata } from '@/lib/metadata';

export const metadata = inviteMetadata({
  title: "You've been invited",
  description: 'Open your invite in the SPORTTIMES app.',
});

export default function InviteCodePage() {
  return <InviteFallback kind="invite" />;
}
