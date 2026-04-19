import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import HowItWorks from '@/components/sections/HowItWorks';

export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <Problem />
      <HowItWorks />

      {/* Placeholder for remaining sections (04 Sport Chapters, 05 Roadmap,
          06 Social Proof, 07 Download, 08 Footer) */}
      <section
        id="sports"
        data-progress-section
        data-progress-label="04 · Sports"
        className="relative min-h-screen w-full grid-12 section-pad"
      >
        <div className="col-span-12 md:col-start-2 md:col-span-10">
          <div className="mono-eyebrow mb-6">[ Next up · Section 04 ]</div>
          <h2 className="headline-display uppercase text-ink text-[clamp(2rem,6vw,4.5rem)]">
            Sport chapters land next.
          </h2>
        </div>
      </section>
    </main>
  );
}
