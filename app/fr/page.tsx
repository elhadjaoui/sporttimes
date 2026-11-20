import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { blogHome } from '@/lib/blog';
import { getDictionary } from '@/lib/i18n';
import {
  HOME_DESCRIPTION_FR,
  HOME_LANGUAGES,
  HOME_TITLE_FR,
  homeStructuredData,
  pageMetadata,
} from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  path: '/fr',
  title: HOME_TITLE_FR,
  description: HOME_DESCRIPTION_FR,
  image: '/fr/opengraph-image',
  languages: HOME_LANGUAGES,
});

export default function Page() {
  return (
    <HomePage
      dict={getDictionary('fr')}
      structuredData={homeStructuredData('fr')}
      blogPath={blogHome('fr')}
    />
  );
}
