import { SHARE_IMAGE_SIZE, shareImage } from '@/lib/shareImage';

export const alt = 'SPORTTIMES. See the lineup. Join the match.';
export const size = SHARE_IMAGE_SIZE;
export const contentType = 'image/png';

export default function OpengraphImage() {
  return shareImage(['See the lineup.', 'Join the match.']);
}
