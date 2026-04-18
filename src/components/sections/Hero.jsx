import { useState } from 'react'
import { motion } from 'framer-motion'
import SportSelector from '../ui/SportSelector'
import StoreBadge from '../ui/StoreBadge'
import ScrollIndicator from '../ui/ScrollIndicator'
import IsometricField from '../illustrations/IsometricField'
import AnimatedBall from '../illustrations/AnimatedBall'

export default function Hero() {
  const [sport, setSport] = useState('football')

  return (
    <section
      className="section"
      style={{
        flexDirection: 'column',
        gap: 32,
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(200,245,66,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          letterSpacing: 2,
          color: 'var(--accent)',
          textTransform: 'uppercase',
        }}
      >
        SportTimes
      </motion.h2>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          textAlign: 'center',
          maxWidth: 700,
        }}
      >
        STOP TEXTING.
        <br />
        <span style={{ color: 'var(--accent)' }}>START PLAYING.</span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: '1.1rem',
          color: 'var(--muted)',
          textAlign: 'center',
          maxWidth: 480,
        }}
      >
        See who's in before you commit.
      </motion.p>

      {/* Sport selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SportSelector onSportChange={setSport} />
      </motion.div>

      {/* Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{ position: 'relative' }}
      >
        <IsometricField sport={sport} playerCount={sport === 'football' ? 11 : sport === 'basketball' ? 5 : 6} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <AnimatedBall sport={sport} size={30} />
        </div>
      </motion.div>

      {/* Store badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <StoreBadge store="apple" comingSoon />
        <StoreBadge store="google" comingSoon />
      </motion.div>

      <ScrollIndicator />
    </section>
  )
}
