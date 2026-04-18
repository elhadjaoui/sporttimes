import { motion } from 'framer-motion'

export default function GlowingOrb({
  size = 20,
  color = 'var(--accent)',
  delay = 0,
  x = 0,
  y = 0
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}80`,
      }}
    >
      <motion.div
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: color,
        }}
      />
    </motion.div>
  )
}
