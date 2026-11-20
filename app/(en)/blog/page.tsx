import { blogIndexMetadata, BlogIndexRoute } from '@/components/blog/routes';

export const metadata = blogIndexMetadata('en');

export default function Page() {
  return <BlogIndexRoute locale="en" />;
}
