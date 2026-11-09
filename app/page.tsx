import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import FAQ from '@/components/sections/FAQ';
import {
  HOME_DESCRIPTION,
  HOME_STRUCTURED_DATA,
  HOME_TITLE,
  pageMetadata,
} from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
});

// Below-the-fold sections — code-split so the initial JS payload
// stays lean. Each has a height-preserving fallback to avoid layout
// shift while its chunk loads on approach.
const Film = dynamic(() => import('@/components/sections/Film'), {
  loading: () => <SectionFallback minH="100vh" />,
});
const HowItWorks = dynamic(
  () => import('@/components/sections/HowItWorks'),
  {
    loading: () => <SectionFallback minH="100vh" />,
  }
);
const Sports = dynamic(() => import('@/components/sections/Sports'), {
  loading: () => <SectionFallback minH="100vh" />,
});
const LockerRoom = dynamic(
  () => import('@/components/sections/LockerRoom'),
  {
    loading: () => <SectionFallback minH="100vh" />,
  }
);
const Download = dynamic(() => import('@/components/sections/Download'), {
  loading: () => <SectionFallback minH="100vh" />,
});
const Footer = dynamic(() => import('@/components/sections/Footer'), {
  loading: () => <SectionFallback minH="60vh" />,
});

function SectionFallback({ minH }: { minH: string }) {
  return (
    <div
      aria-hidden
      style={{
        minHeight: minH,
        width: '100%',
      }}
    />
  );
}

export default function Page() {
  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(HOME_STRUCTURED_DATA),
        }}
      />
      <Hero />
      <Problem />
      <Film />
      <HowItWorks />
      <Sports />
      <LockerRoom />
      <FAQ />
      <Download />
      <Footer />
    </main>
  );
}
