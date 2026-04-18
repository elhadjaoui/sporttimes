import { motion } from 'framer-motion'
import StoreBadge from '../ui/StoreBadge'
import SocialIcon from '../ui/SocialIcon'

export default function ComingSoon() {
  return (
    <section
      className="section"
      style={{
        flexDirection: 'column',
        gap: 32,
        padding: '100px 24px',
        position: 'relative',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(200,245,66,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          textAlign: 'center',
          color: 'var(--accent)',
        }}
      >
        COMING SOON
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        style={{
          fontSize: '1.3rem',
          color: 'var(--muted)',
          textAlign: 'center',
        }}
      >
        Get ready to play.
      </motion.p>

      {/* Store badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: 16,
        }}
      >
        <StoreBadge store="apple" comingSoon />
        <StoreBadge store="google" comingSoon />
      </motion.div>

      {/* Social */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          marginTop: 32,
        }}
      >
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Follow for updates</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <SocialIcon platform="instagram" href="#" />
          <SocialIcon platform="tiktok" href="#" />
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        style={{
          marginTop: 64,
          paddingTop: 32,
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          width: '100%',
          maxWidth: 600,
        }}
      >
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 16 }}>
          <a href="privacy.html" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
            Privacy
          </a>
          <a href="terms.html" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
            Terms
          </a>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
          © 2026 SportTimes. All rights reserved.
        </p>
      </motion.footer>
    </section>
  )
}
