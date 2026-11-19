import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { getDictionary } from '@/lib/i18n';
import {
  HOME_DESCRIPTION,
  HOME_LANGUAGES,
  HOME_TITLE,
  homeStructuredData,
  pageMetadata,
} from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  languages: HOME_LANGUAGES,
});

export default function Page() {
  return (
    <HomePage
      dict={getDictionary('en')}
      structuredData={homeStructuredData('en')}
    />
  );
}
