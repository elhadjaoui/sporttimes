import { motion } from 'framer-motion'

const ballStyles = {
  football: {
    background: 'linear-gradient(135deg, #fff 25%, #000 25%, #000 50%, #fff 50%, #fff 75%, #000 75%)',
    backgroundSize: '10px 10px',
  },
  basketball: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #d4501e 100%)',
    border: '2px solid #222',
  },
  volleyball: {
    background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 50%, #ddd 100%)',
    border: '2px solid #ccc',
  },
}

const animations = {
  football: {
    y: [0, -15, 0],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  basketball: {
    rotate: [0, 360],
    transition: { duration: 3, repeat: Infinity, ease: 'linear' },
  },
  volleyball: {
    rotate: [0, 15, -15, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
}

export default function AnimatedBall({ sport = 'football', size = 40 }) {
  return (
    <motion.div
      animate={animations[sport]}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        ...ballStyles[sport],
      }}
    />
  )
}
