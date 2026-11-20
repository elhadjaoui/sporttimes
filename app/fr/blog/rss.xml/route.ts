import { feedResponse } from '@/components/blog/routes';

export const dynamic = 'force-static';

export function GET() {
  return feedResponse('fr');
}
