import { motion } from 'framer-motion'

export default function StoreBadge({ store = 'apple', comingSoon = true }) {
  const isApple = store === 'apple'

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 24px',
        borderRadius: 12,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        opacity: comingSoon ? 0.7 : 1,
        cursor: comingSoon ? 'default' : 'pointer',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--text)">
        {isApple ? (
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        ) : (
          <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5h-11c-.83 0-1.5-.67-1.5-1.5zm2-1h10v-15H5v15zm7.5-2.5l-2.5-4-2 2.5-1.5-2-2.5 3.5h8.5z M12 6c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z"/>
        )}
      </svg>
      <div>
        <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
          {comingSoon ? 'Coming Soon' : isApple ? 'Download on the' : 'Get it on'}
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 700 }}>
          {isApple ? 'App Store' : 'Google Play'}
        </div>
      </div>
    </motion.div>
  )
}
