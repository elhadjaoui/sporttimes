import { motion } from 'framer-motion'
import useHorizontalScroll from '../../hooks/useHorizontalScroll'

const problems = [
  {
    title: 'The WhatsApp Chaos',
    description: 'Endless message threads. Important info buried. Who even read the last message?',
    icon: '💬',
  },
  {
    title: "Who's Actually Playing?",
    description: '"I\'m in" ... "Maybe" ... "What time again?" — Sound familiar?',
    icon: '❓',
  },
  {
    title: 'Last-Minute Dropouts',
    description: '10 players confirmed. 6 show up. Match cancelled. Again.',
    icon: '👻',
  },
]

function ProblemCard({ problem, index }) {
  return (
    <div className="horizontal-panel">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: 48,
          maxWidth: 500,
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(255, 107, 107, 0.1)',
        }}
      >
        <div
          style={{
            fontSize: 64,
            marginBottom: 24,
            filter: 'drop-shadow(0 0 20px rgba(255, 107, 107, 0.5))',
          }}
        >
          {problem.icon}
        </div>
        <h3
          style={{
            fontSize: '1.8rem',
            marginBottom: 16,
            color: '#ff6b6b',
          }}
        >
          {problem.title}
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          {problem.description}
        </p>
        <div
          style={{
            marginTop: 32,
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {problems.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i === index ? '#ff6b6b' : 'var(--border)',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function Problem() {
  const { containerRef, trackRef } = useHorizontalScroll(problems.length)

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
          The Problem
        </h2>
      </div>
      <div ref={trackRef} className="horizontal-scroll-track">
        {problems.map((problem, i) => (
          <ProblemCard key={i} problem={problem} index={i} />
        ))}
      </div>
    </section>
  )
}
