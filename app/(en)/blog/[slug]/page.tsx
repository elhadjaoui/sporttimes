import {
  articleMetadata,
  articleParams,
  ArticleRoute,
} from '@/components/blog/routes';

type Props = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return articleParams('en');
}

export function generateMetadata({ params }: Props) {
  return articleMetadata('en', params.slug);
}

export default function Page({ params }: Props) {
  return <ArticleRoute locale="en" slug={params.slug} />;
}
