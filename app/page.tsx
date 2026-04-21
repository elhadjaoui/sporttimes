import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import HowItWorks from '@/components/sections/HowItWorks';
import Sports from '@/components/sections/Sports';
import LockerRoom from '@/components/sections/LockerRoom';
import Download from '@/components/sections/Download';
import Footer from '@/components/sections/Footer';

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
