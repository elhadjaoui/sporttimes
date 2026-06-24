import Nav from '@/components/sections/Nav';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Solution from '@/components/sections/Solution';

function Phase2Placeholder({ id, label }: { id: string; label: string }) {
  return (
    <section
      id={id}
      data-palette="dark"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid var(--hairline)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.22em',
          color: 'var(--text-mute)',
        }}
      >
        {label}
      </span>
    </section>
  );
}

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Phase2Placeholder id="roadmap" label="// Phase 2 — roadmap" />
        <Phase2Placeholder id="launching-soon" label="// Phase 2 — launching-soon" />
        <Phase2Placeholder id="stay-connected" label="// Phase 2 — stay-connected" />
        <Phase2Placeholder id="footer" label="// Phase 2 — footer" />
      </main>
    </>
  );
}
