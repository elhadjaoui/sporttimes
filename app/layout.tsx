import type { Metadata } from 'next';
import { HOME_DESCRIPTION, HOME_TITLE } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  // Favicon + apple-touch icon are auto-wired via app/icon.png and
  // app/apple-icon.png — Next.js App Router detects them by filename.
  openGraph: {
    type: 'website',
    siteName: 'SPORTTIMES',
  },
};

// Renders no <html> of its own: each layout below it renders RootShell
// with its own lang (app/(en)/layout.tsx for the English pages,
// app/fr/layout.tsx for the French homepage), and so does
// app/not-found.tsx, which sits outside them.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
