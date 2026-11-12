// [REVIEW] Draft French copy: the founder reviews it before it ships.
import { SHARE_IMAGE_SIZE, shareImage } from '@/lib/shareImage';

export const alt = 'SPORTTIMES. Vois la compo. Rejoins le match.';
export const size = SHARE_IMAGE_SIZE;
export const contentType = 'image/png';

export default function OpengraphImage() {
  return shareImage(['Vois la compo.', 'Rejoins le match.']);
}
