import Hero from '@/components/sections/Hero';

export default function Page() {
  return (
    <main className="relative">
      <Hero />

      {/* Placeholder anchor for "See how it works" CTA scroll-to. Will be replaced by HowItWorks section in next phase. */}
      <section
        id="how"
        className="relative min-h-screen w-full grid-12 section-pad"
      >
        <div className="col-span-12 md:col-start-2 md:col-span-10">
          <div className="mono-eyebrow mb-6">[ Next up · Section 02 ]</div>
          <h2 className="headline-display text-ink text-[clamp(2rem,7vw,5rem)]">
            Sections 02 – 08 land in the next iteration.
          </h2>
          <p className="mt-6 text-ink/60 max-w-prose50">
            This standalone deliverable covers the preloader, nav, and hero
            per the spec&apos;s build order. Approve the direction and the
            sport-morph centerpiece (section 04) ships next.
          </p>
        </div>
      </section>
    </main>
  );
}
