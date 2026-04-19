import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';

export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <Problem />

      {/* Placeholder for remaining sections (03 How It Works, 04 Sport
          Chapters, 05 Roadmap, 06 Social Proof, 07 Download, 08 Footer) */}
      <section
        id="how"
        className="relative min-h-screen w-full grid-12 section-pad"
      >
        <div className="col-span-12 md:col-start-2 md:col-span-10">
          <div className="mono-eyebrow mb-6">[ Next up · Section 03 ]</div>
          <h2 className="headline-display uppercase text-ink text-[clamp(2rem,6vw,4.5rem)]">
            How it works lands next.
          </h2>
        </div>
      </section>
    </main>
  );
}
