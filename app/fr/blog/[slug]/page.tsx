import {
  articleMetadata,
  articleParams,
  ArticleRoute,
} from '@/components/blog/routes';

type Props = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return articleParams('fr');
}

export function generateMetadata({ params }: Props) {
  return articleMetadata('fr', params.slug);
}

export default function Page({ params }: Props) {
  return <ArticleRoute locale="fr" slug={params.slug} />;
}
