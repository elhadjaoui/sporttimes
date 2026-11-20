import { articleImage, articleParams } from '@/components/blog/routes';

// The article's link preview. A plain route rather than an
// opengraph-image file, whose address Next changes inside route groups.
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return articleParams('fr');
}

export function GET(_request: Request, { params }: { params: { slug: string } }) {
  return articleImage('fr', params.slug);
}
