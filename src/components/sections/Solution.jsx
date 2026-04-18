import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import IsometricField from '../illustrations/IsometricField'
import AnimatedBall from '../illustrations/AnimatedBall'

export default function Solution() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [playerCount, setPlayerCount] = useState(0)
  const maxPlayers = 22
  const currentPlayers = 19

  useEffect(() => {
    if (!isInView) return
    let count = 0
    const interval = setInterval(() => {
      count++
      setPlayerCount(Math.min(count, currentPlayers))
      if (count >= currentPlayers) clearInterval(interval)
    }, 100)
    return () => clearInterval(interval)
  }, [isInView])

  return (
    <section
      ref={ref}
      className="section"
      style={{
        padding: '80px 24px',
        flexDirection: 'column',
        gap: 48,
      }}
    >
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center' }}
      >
        <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: 16 }}>
          SEE THE LINEUP.
          <br />
          <span style={{ color: 'var(--accent)' }}>JOIN WITH ONE TAP.</span>
        </h2>
      </motion.div>

      {/* Content */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 64,
          flexWrap: 'wrap',
        }}
      >
        {/* Field */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative' }}
        >
          <IsometricField sport="football" playerCount={Math.min(playerCount, 11)} />
          <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <AnimatedBall sport="football" size={24} />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 'clamp(4rem, 10vw, 6rem)',
              fontWeight: 800,
              color: 'var(--accent)',
              lineHeight: 1,
              textShadow: '0 0 40px rgba(200, 245, 66, 0.5)',
            }}
          >
            {playerCount}/{maxPlayers}
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '1.2rem' }}>
            Your spot is waiting
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '16px 32px',
              borderRadius: 12,
              border: 'none',
              background: 'var(--accent)',
              color: 'var(--bg)',
              fontFamily: 'inherit',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Join Match →
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
