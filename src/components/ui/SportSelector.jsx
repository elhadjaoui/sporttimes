import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const sports = ['Football', 'Basketball', 'Volleyball']

export default function SportSelector({ onSportChange, autoRotate = true }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!autoRotate) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sports.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [autoRotate])

  useEffect(() => {
    onSportChange?.(sports[activeIndex].toLowerCase())
  }, [activeIndex, onSportChange])

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {sports.map((sport, i) => (
        <motion.button
          key={sport}
          onClick={() => setActiveIndex(i)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '10px 20px',
            borderRadius: 100,
            border: 'none',
            background: i === activeIndex ? 'var(--accent)' : 'var(--surface)',
            color: i === activeIndex ? 'var(--bg)' : 'var(--text)',
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'background 0.3s, color 0.3s',
          }}
        >
          {sport}
        </motion.button>
      ))}
    </div>
  )
}
