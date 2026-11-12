import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import FAQ from '@/components/sections/FAQ';
import type { Dictionary } from '@/lib/i18n';

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

// The homepage in one language: every section gets its own part of the
// dictionary.
export default function HomePage({
  dict,
  structuredData,
}: {
  dict: Dictionary;
  structuredData?: object;
}) {
  return (
    <main className="relative">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      <Hero t={dict.hero} />
      <Problem t={dict.problem} />
      <Film t={dict.film} />
      <HowItWorks t={dict.howItWorks} />
      <Sports t={dict.sports} />
      <LockerRoom t={dict.roadmap} />
      <FAQ t={dict.faq} />
      <Download t={dict.download} />
      <Footer t={dict.footer} />
    </main>
  );
}
