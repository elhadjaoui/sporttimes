import { motion } from 'framer-motion'
import GlowingOrb from './GlowingOrb'

const formations = {
  football: [
    { x: '50%', y: '85%' },
    { x: '20%', y: '65%' }, { x: '40%', y: '65%' }, { x: '60%', y: '65%' }, { x: '80%', y: '65%' },
    { x: '30%', y: '45%' }, { x: '50%', y: '45%' }, { x: '70%', y: '45%' },
    { x: '25%', y: '25%' }, { x: '50%', y: '20%' }, { x: '75%', y: '25%' },
  ],
  basketball: [
    { x: '50%', y: '80%' },
    { x: '25%', y: '60%' }, { x: '75%', y: '60%' },
    { x: '35%', y: '35%' }, { x: '65%', y: '35%' },
  ],
  volleyball: [
    { x: '20%', y: '75%' }, { x: '50%', y: '75%' }, { x: '80%', y: '75%' },
    { x: '20%', y: '35%' }, { x: '50%', y: '35%' }, { x: '80%', y: '35%' },
  ],
}

export default function IsometricField({ sport = 'football', showPlayers = true, playerCount = 11 }) {
  const positions = formations[sport] || formations.football
  const visiblePositions = positions.slice(0, playerCount)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 400,
        aspectRatio: '1 / 1.2',
        transform: 'perspective(800px) rotateX(35deg) rotateZ(-5deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      <svg
        viewBox="0 0 100 120"
        style={{
          width: '100%',
          height: '100%',
          filter: 'drop-shadow(0 0 10px var(--accent))',
        }}
      >
        <rect
          x="5" y="5" width="90" height="110" rx="3"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.5"
          opacity="0.6"
        />
        <line x1="5" y1="60" x2="95" y2="60" stroke="var(--accent)" strokeWidth="0.3" opacity="0.4" />
        <circle cx="50" cy="60" r="15" fill="none" stroke="var(--accent)" strokeWidth="0.3" opacity="0.4" />
        <rect x="30" y="5" width="40" height="15" fill="none" stroke="var(--accent)" strokeWidth="0.3" opacity="0.4" />
        <rect x="30" y="100" width="40" height="15" fill="none" stroke="var(--accent)" strokeWidth="0.3" opacity="0.4" />
      </svg>

      {showPlayers && visiblePositions.map((pos, i) => (
        <GlowingOrb
          key={i}
          size={16}
          x={pos.x}
          y={pos.y}
          delay={i * 0.1}
        />
      ))}
    </div>
  )
}
