import { motion } from 'framer-motion'

const features = [
  {
    icon: '🏀',
    title: 'Multi-Sport',
    description: 'Football, basketball, volleyball, and more.',
  },
  {
    icon: '👁️',
    title: 'Visual Lineups',
    description: "See who's in before you commit.",
  },
  {
    icon: '👥',
    title: 'Communities',
    description: 'Campus groups, city squads, friend circles.',
  },
  {
    icon: '⚔️',
    title: 'Match Types',
    description: 'Open (random) or Versus (team vs team).',
  },
  {
    icon: '⭐',
    title: 'Player Feedback',
    description: 'Rate teamwork, attitude, attendance, skill.',
  },
  {
    icon: '📱',
    title: 'Share to Social',
    description: 'Instagram-ready lineup graphics.',
  },
]

function FeatureCard({ feature, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, boxShadow: '0 0 40px rgba(200, 245, 66, 0.2)' }}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: 32,
        cursor: 'default',
        transition: 'box-shadow 0.3s',
      }}
    >
      <div
        style={{
          fontSize: 40,
          marginBottom: 16,
          filter: 'drop-shadow(0 0 15px var(--accent))',
        }}
      >
        {feature.icon}
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: 8, color: 'var(--text)' }}>
        {feature.title}
      </h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
        {feature.description}
      </p>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section
      className="section"
      style={{
        padding: '100px 24px',
        flexDirection: 'column',
        gap: 48,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center' }}
      >
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 16 }}>
          EVERYTHING YOU NEED
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
          Built for players, by players.
        </p>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          maxWidth: 1000,
          width: '100%',
        }}
      >
        {features.map((feature, i) => (
          <FeatureCard key={i} feature={feature} index={i} />
        ))}
      </div>
    </section>
  )
}
