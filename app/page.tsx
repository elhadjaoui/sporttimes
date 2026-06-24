import dynamic from 'next/dynamic';
import Nav from '@/components/sections/Nav';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Solution from '@/components/sections/Solution';
import StickyMobileCTA from '@/components/ui/StickyMobileCTA';

const Roadmap = dynamic(() => import('@/components/sections/Roadmap'), {
  loading: () => <div style={{ minHeight: '100vh' }} aria-hidden />,
});
const LaunchingSoon = dynamic(() => import('@/components/sections/LaunchingSoon'), {
  loading: () => <div style={{ minHeight: '90vh' }} aria-hidden />,
});
const StayConnected = dynamic(() => import('@/components/sections/StayConnected'), {
  loading: () => <div style={{ minHeight: '80vh' }} aria-hidden />,
});
const Footer = dynamic(() => import('@/components/sections/Footer'), {
  loading: () => <div style={{ minHeight: '120px' }} aria-hidden />,
});

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Roadmap />
        <LaunchingSoon />
        <StayConnected />
        <Footer />
      </main>
      <StickyMobileCTA />
    </>
  );
}
