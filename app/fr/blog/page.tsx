import { blogIndexMetadata, BlogIndexRoute } from '@/components/blog/routes';

export const metadata = blogIndexMetadata('fr');

export default function Page() {
  return <BlogIndexRoute locale="fr" />;
}
