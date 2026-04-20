import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import HowItWorks from '@/components/sections/HowItWorks';
import Sports from '@/components/sections/Sports';

export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <Problem />
      <HowItWorks />
      <Sports />

      {/* Placeholder for remaining sections (05 Roadmap, 06 Social Proof,
          07 Download, 08 Footer) */}
      <section
        id="roadmap"
        data-progress-section
        data-progress-label="05 · Roadmap"
        className="relative min-h-screen w-full grid-12 section-pad"
        style={{ background: '#050505' }}
      >
        <div className="col-span-12 md:col-start-2 md:col-span-10">
          <div className="mono-eyebrow mb-6">[ Next up · Section 05 ]</div>
          <h2 className="headline-display uppercase text-ink text-[clamp(2rem,6vw,4.5rem)]">
            Roadmap lands next.
          </h2>
        </div>
      </section>
    </main>
  );
}
