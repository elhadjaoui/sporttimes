import { motion } from 'framer-motion'
import useHorizontalScroll from '../../hooks/useHorizontalScroll'

const steps = [
  {
    number: '01',
    title: 'Join a Community',
    description: 'Find your squad — campus groups, city leagues, or friend circles.',
    icon: '👥',
  },
  {
    number: '02',
    title: 'Create a Match',
    description: 'Pick your sport, set the time, choose Open or Versus mode.',
    icon: '📅',
  },
  {
    number: '03',
    title: "See Who's In",
    description: 'Watch the lineup fill up in real-time. No more guessing.',
    icon: '⚽',
  },
  {
    number: '04',
    title: 'Show Up & Play',
    description: 'Everyone knows the plan. Just bring your game.',
    icon: '🎯',
  },
]

function StepCard({ step, index }) {
  return (
    <div className="horizontal-panel">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        {/* Number badge */}
        <div
          style={{
            fontSize: '5rem',
            fontWeight: 800,
            color: 'var(--accent)',
            opacity: 0.2,
            lineHeight: 1,
            marginBottom: -20,
          }}
        >
          {step.number}
        </div>

        {/* Icon */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 24,
            filter: 'drop-shadow(0 0 30px var(--accent))',
          }}
        >
          {step.icon}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.8rem', marginBottom: 16, color: 'var(--accent)' }}>
          {step.title}
        </h3>

        {/* Description */}
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          {step.description}
        </p>

        {/* Progress dots */}
        <div style={{ marginTop: 40, display: 'flex', gap: 8 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === index ? 'var(--accent)' : 'var(--border)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function HowItWorks() {
  const { containerRef, trackRef } = useHorizontalScroll(steps.length)

  return (
    <section ref={containerRef} className="horizontal-scroll-container">
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <h2 style={{ fontSize: '0.9rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 3 }}>
          How It Works
        </h2>
      </div>
      <div ref={trackRef} className="horizontal-scroll-track">
        {steps.map((step, i) => (
          <StepCard key={i} step={step} index={i} />
        ))}
      </div>
    </section>
  )
}
