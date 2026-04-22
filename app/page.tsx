import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';

// Below-the-fold sections — code-split so the initial JS payload
// stays lean. Each has a height-preserving fallback to avoid layout
// shift while its chunk loads on approach.
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
      <Hero />
      <Problem />
      <HowItWorks />
      <Sports />
      <LockerRoom />
      <Download />
      <Footer />
    </main>
  );
}
