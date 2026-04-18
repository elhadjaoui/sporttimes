# SportTimes Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an immersive pre-launch landing page with 6 full-viewport sections, mixed horizontal/vertical scroll animations, glowing neon + 3D isometric illustrations, and multi-sport support.

**Architecture:** Vite + React for fast development, Framer Motion for component animations, GSAP ScrollTrigger for scroll-driven horizontal sections. CSS variables maintain the existing design system. SVG-based illustrations with CSS animations for glowing effects.

**Tech Stack:** Vite, React 18, Framer Motion, GSAP + ScrollTrigger, CSS (with existing design tokens)

---

## File Structure

```
/sporttimes
├── index.html              # Vite entry point
├── package.json            # Dependencies
├── vite.config.js          # Vite config
├── src/
│   ├── main.jsx            # React entry
│   ├── App.jsx             # Main app with all sections
│   ├── styles/
│   │   └── globals.css     # Global styles + design tokens
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.jsx
│   │   │   ├── Problem.jsx
│   │   │   ├── Solution.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Features.jsx
│   │   │   └── ComingSoon.jsx
│   │   ├── illustrations/
│   │   │   ├── IsometricField.jsx
│   │   │   ├── GlowingOrb.jsx
│   │   │   └── AnimatedBall.jsx
│   │   └── ui/
│   │       ├── SportSelector.jsx
│   │       ├── StoreBadge.jsx
│   │       ├── SocialIcon.jsx
│   │       └── ScrollIndicator.jsx
│   └── hooks/
│       └── useHorizontalScroll.js
├── public/
│   └── (static assets)
├── privacy.html            # Keep existing
└── terms.html              # Keep existing
```

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/styles/globals.css`
- Modify: `index.html`

- [ ] **Step 1: Initialize package.json**

```json
{
  "name": "sporttimes-landing",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^11.0.0",
    "gsap": "^3.12.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

Write this to `package.json`.

- [ ] **Step 2: Create vite.config.js**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Write this to `vite.config.js`.

- [ ] **Step 3: Create src/styles/globals.css**

```css
:root {
  --bg: #0a0a0a;
  --surface: #141414;
  --accent: #c8f542;
  --text: #f0f0f0;
  --muted: #888;
  --border: #222;
  --problem-accent: #ff6b6b;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Outfit', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* Section base */
.section {
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Glow effect */
.glow {
  filter: drop-shadow(0 0 8px var(--accent)) drop-shadow(0 0 20px rgba(200, 245, 66, 0.4));
}

.glow-pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Typography */
h1, h2, h3 {
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.1;
}

/* Horizontal scroll container */
.horizontal-scroll-container {
  position: relative;
  height: 100vh;
}

.horizontal-scroll-track {
  display: flex;
  height: 100vh;
  width: fit-content;
}

.horizontal-panel {
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
```

Write this to `src/styles/globals.css`.

- [ ] **Step 4: Create src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

Write this to `src/main.jsx`.

- [ ] **Step 5: Create src/App.jsx (placeholder)**

```jsx
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function App() {
  return (
    <main>
      <section className="section" style={{ background: 'var(--bg)' }}>
        <h1 style={{ color: 'var(--accent)' }}>SportTimes</h1>
      </section>
    </main>
  )
}

export default App
```

Write this to `src/App.jsx`.

- [ ] **Step 6: Update index.html for Vite**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SportTimes — Find Your Game</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

Write this to `index.html`.

- [ ] **Step 7: Install dependencies**

Run: `npm install`

Expected: Dependencies installed successfully, node_modules created.

- [ ] **Step 8: Verify dev server starts**

Run: `npm run dev`

Expected: Vite dev server starts, shows "SportTimes" heading in browser at localhost:5173.

- [ ] **Step 9: Commit**

```bash
git add package.json vite.config.js src/ index.html
git commit -m "feat: setup Vite + React project with GSAP and Framer Motion"
```

---

## Task 2: Reusable Illustration Components

**Files:**
- Create: `src/components/illustrations/GlowingOrb.jsx`
- Create: `src/components/illustrations/AnimatedBall.jsx`
- Create: `src/components/illustrations/IsometricField.jsx`

- [ ] **Step 1: Create GlowingOrb component**

```jsx
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
```

Write this to `src/components/illustrations/GlowingOrb.jsx`.

- [ ] **Step 2: Create AnimatedBall component**

```jsx
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
```

Write this to `src/components/illustrations/AnimatedBall.jsx`.

- [ ] **Step 3: Create IsometricField component**

```jsx
import { motion } from 'framer-motion'
import GlowingOrb from './GlowingOrb'

const formations = {
  football: [
    { x: '50%', y: '85%' }, // GK
    { x: '20%', y: '65%' }, { x: '40%', y: '65%' }, { x: '60%', y: '65%' }, { x: '80%', y: '65%' }, // DEF
    { x: '30%', y: '45%' }, { x: '50%', y: '45%' }, { x: '70%', y: '45%' }, // MID
    { x: '25%', y: '25%' }, { x: '50%', y: '20%' }, { x: '75%', y: '25%' }, // FWD
  ],
  basketball: [
    { x: '50%', y: '80%' }, // PG
    { x: '25%', y: '60%' }, { x: '75%', y: '60%' }, // SG, SF
    { x: '35%', y: '35%' }, { x: '65%', y: '35%' }, // PF, C
  ],
  volleyball: [
    { x: '20%', y: '75%' }, { x: '50%', y: '75%' }, { x: '80%', y: '75%' }, // Back row
    { x: '20%', y: '35%' }, { x: '50%', y: '35%' }, { x: '80%', y: '35%' }, // Front row
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
      {/* Field outline */}
      <svg
        viewBox="0 0 100 120"
        style={{
          width: '100%',
          height: '100%',
          filter: 'drop-shadow(0 0 10px var(--accent))',
        }}
      >
        {/* Outer boundary */}
        <rect
          x="5" y="5" width="90" height="110" rx="3"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.5"
          opacity="0.6"
        />
        {/* Center line */}
        <line x1="5" y1="60" x2="95" y2="60" stroke="var(--accent)" strokeWidth="0.3" opacity="0.4" />
        {/* Center circle */}
        <circle cx="50" cy="60" r="15" fill="none" stroke="var(--accent)" strokeWidth="0.3" opacity="0.4" />
        {/* Goal areas */}
        <rect x="30" y="5" width="40" height="15" fill="none" stroke="var(--accent)" strokeWidth="0.3" opacity="0.4" />
        <rect x="30" y="100" width="40" height="15" fill="none" stroke="var(--accent)" strokeWidth="0.3" opacity="0.4" />
      </svg>

      {/* Player orbs */}
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
```

Write this to `src/components/illustrations/IsometricField.jsx`.

- [ ] **Step 4: Verify components render**

Update `src/App.jsx` temporarily:

```jsx
import IsometricField from './components/illustrations/IsometricField'
import AnimatedBall from './components/illustrations/AnimatedBall'

function App() {
  return (
    <main>
      <section className="section" style={{ background: 'var(--bg)', flexDirection: 'column', gap: 40 }}>
        <IsometricField sport="football" playerCount={11} />
        <div style={{ display: 'flex', gap: 20 }}>
          <AnimatedBall sport="football" />
          <AnimatedBall sport="basketball" />
          <AnimatedBall sport="volleyball" />
        </div>
      </section>
    </main>
  )
}

export default App
```

Run: `npm run dev`

Expected: See isometric field with glowing player orbs and three animated balls.

- [ ] **Step 5: Commit**

```bash
git add src/components/illustrations/
git commit -m "feat: add GlowingOrb, AnimatedBall, IsometricField components"
```

---

## Task 3: UI Components

**Files:**
- Create: `src/components/ui/SportSelector.jsx`
- Create: `src/components/ui/StoreBadge.jsx`
- Create: `src/components/ui/SocialIcon.jsx`
- Create: `src/components/ui/ScrollIndicator.jsx`

- [ ] **Step 1: Create SportSelector component**

```jsx
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
```

Write this to `src/components/ui/SportSelector.jsx`.

- [ ] **Step 2: Create StoreBadge component**

```jsx
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
```

Write this to `src/components/ui/StoreBadge.jsx`.

- [ ] **Step 3: Create SocialIcon component**

```jsx
import { motion } from 'framer-motion'

const icons = {
  instagram: (
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  ),
  tiktok: (
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  ),
}

export default function SocialIcon({ platform, href = '#', size = 48 }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 12,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 20px var(--accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="var(--text)">
        {icons[platform]}
      </svg>
    </motion.a>
  )
}
```

Write this to `src/components/ui/SocialIcon.jsx`.

- [ ] **Step 4: Create ScrollIndicator component**

```jsx
import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2 }}>
        Scroll
      </span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </motion.div>
  )
}
```

Write this to `src/components/ui/ScrollIndicator.jsx`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add SportSelector, StoreBadge, SocialIcon, ScrollIndicator components"
```

---

## Task 4: Horizontal Scroll Hook

**Files:**
- Create: `src/hooks/useHorizontalScroll.js`

- [ ] **Step 1: Create useHorizontalScroll hook**

```javascript
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useHorizontalScroll(panelCount) {
  const containerRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const panels = track.children
    const totalWidth = Array.from(panels).reduce((acc, panel) => acc + panel.offsetWidth, 0)

    const scrollTween = gsap.to(track, {
      x: -(totalWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalWidth - window.innerWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    })

    return () => {
      scrollTween.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [panelCount])

  return { containerRef, trackRef }
}
```

Write this to `src/hooks/useHorizontalScroll.js`.

- [ ] **Step 2: Commit**

```bash
git add src/hooks/
git commit -m "feat: add useHorizontalScroll hook for GSAP ScrollTrigger"
```

---

## Task 5: Hero Section

**Files:**
- Create: `src/components/sections/Hero.jsx`

- [ ] **Step 1: Create Hero section**

```jsx
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
```

Write this to `src/components/sections/Hero.jsx`.

- [ ] **Step 2: Update App.jsx to use Hero**

```jsx
import Hero from './components/sections/Hero'

function App() {
  return (
    <main>
      <Hero />
    </main>
  )
}

export default App
```

Write this to `src/App.jsx`.

- [ ] **Step 3: Verify Hero renders**

Run: `npm run dev`

Expected: Hero section displays with animated sport selector, isometric field with glowing orbs, bouncing ball, and store badges.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.jsx src/App.jsx
git commit -m "feat: add Hero section with sport selector and animated field"
```

---

## Task 6: Problem Section (Horizontal Scroll)

**Files:**
- Create: `src/components/sections/Problem.jsx`

- [ ] **Step 1: Create Problem section**

```jsx
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
```

Write this to `src/components/sections/Problem.jsx`.

- [ ] **Step 2: Update App.jsx**

```jsx
import Hero from './components/sections/Hero'
import Problem from './components/sections/Problem'

function App() {
  return (
    <main>
      <Hero />
      <Problem />
    </main>
  )
}

export default App
```

Write this to `src/App.jsx`.

- [ ] **Step 3: Verify horizontal scroll works**

Run: `npm run dev`

Expected: Scrolling past Hero triggers horizontal scroll through 3 problem cards.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Problem.jsx src/App.jsx
git commit -m "feat: add Problem section with horizontal scroll"
```

---

## Task 7: Solution Section

**Files:**
- Create: `src/components/sections/Solution.jsx`

- [ ] **Step 1: Create Solution section**

```jsx
import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
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
```

Write this to `src/components/sections/Solution.jsx`.

- [ ] **Step 2: Update App.jsx**

```jsx
import Hero from './components/sections/Hero'
import Problem from './components/sections/Problem'
import Solution from './components/sections/Solution'

function App() {
  return (
    <main>
      <Hero />
      <Problem />
      <Solution />
    </main>
  )
}

export default App
```

Write this to `src/App.jsx`.

- [ ] **Step 3: Verify Solution section**

Run: `npm run dev`

Expected: Solution section shows with animated player counter incrementing to 19/22.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Solution.jsx src/App.jsx
git commit -m "feat: add Solution section with animated player counter"
```

---

## Task 8: How It Works Section (Horizontal Scroll)

**Files:**
- Create: `src/components/sections/HowItWorks.jsx`

- [ ] **Step 1: Create HowItWorks section**

```jsx
import { motion } from 'framer-motion'
import useHorizontalScroll from '../../hooks/useHorizontalScroll'

const steps = [
  {
    number: '01',
    title: 'Join a Community',
    description: 'Find your squad — campus groups, city leagues, or friend circles.',
    icon: '👥',
  },
  {
    number: '02',
    title: 'Create a Match',
    description: 'Pick your sport, set the time, choose Open or Versus mode.',
    icon: '📅',
  },
  {
    number: '03',
    title: "See Who's In",
    description: 'Watch the lineup fill up in real-time. No more guessing.',
    icon: '⚽',
  },
  {
    number: '04',
    title: 'Show Up & Play',
    description: 'Everyone knows the plan. Just bring your game.',
    icon: '🎯',
  },
]

function StepCard({ step, index }) {
  return (
    <div className="horizontal-panel">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        {/* Number badge */}
        <div
          style={{
            fontSize: '5rem',
            fontWeight: 800,
            color: 'var(--accent)',
            opacity: 0.2,
            lineHeight: 1,
            marginBottom: -20,
          }}
        >
          {step.number}
        </div>

        {/* Icon */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 24,
            filter: 'drop-shadow(0 0 30px var(--accent))',
          }}
        >
          {step.icon}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.8rem', marginBottom: 16, color: 'var(--accent)' }}>
          {step.title}
        </h3>

        {/* Description */}
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          {step.description}
        </p>

        {/* Progress dots */}
        <div style={{ marginTop: 40, display: 'flex', gap: 8 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === index ? 'var(--accent)' : 'var(--border)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function HowItWorks() {
  const { containerRef, trackRef } = useHorizontalScroll(steps.length)

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
          How It Works
        </h2>
      </div>
      <div ref={trackRef} className="horizontal-scroll-track">
        {steps.map((step, i) => (
          <StepCard key={i} step={step} index={i} />
        ))}
      </div>
    </section>
  )
}
```

Write this to `src/components/sections/HowItWorks.jsx`.

- [ ] **Step 2: Update App.jsx**

```jsx
import Hero from './components/sections/Hero'
import Problem from './components/sections/Problem'
import Solution from './components/sections/Solution'
import HowItWorks from './components/sections/HowItWorks'

function App() {
  return (
    <main>
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
    </main>
  )
}

export default App
```

Write this to `src/App.jsx`.

- [ ] **Step 3: Verify horizontal scroll**

Run: `npm run dev`

Expected: How It Works section scrolls horizontally through 4 steps.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/HowItWorks.jsx src/App.jsx
git commit -m "feat: add HowItWorks section with horizontal scroll"
```

---

## Task 9: Features Section

**Files:**
- Create: `src/components/sections/Features.jsx`

- [ ] **Step 1: Create Features section**

```jsx
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
```

Write this to `src/components/sections/Features.jsx`.

- [ ] **Step 2: Update App.jsx**

```jsx
import Hero from './components/sections/Hero'
import Problem from './components/sections/Problem'
import Solution from './components/sections/Solution'
import HowItWorks from './components/sections/HowItWorks'
import Features from './components/sections/Features'

function App() {
  return (
    <main>
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
    </main>
  )
}

export default App
```

Write this to `src/App.jsx`.

- [ ] **Step 3: Verify Features grid**

Run: `npm run dev`

Expected: 2x3 grid of feature cards with hover glow effects.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Features.jsx src/App.jsx
git commit -m "feat: add Features section with 6 feature cards"
```

---

## Task 10: Coming Soon Section

**Files:**
- Create: `src/components/sections/ComingSoon.jsx`

- [ ] **Step 1: Create ComingSoon section**

```jsx
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
```

Write this to `src/components/sections/ComingSoon.jsx`.

- [ ] **Step 2: Update App.jsx (final)**

```jsx
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Hero from './components/sections/Hero'
import Problem from './components/sections/Problem'
import Solution from './components/sections/Solution'
import HowItWorks from './components/sections/HowItWorks'
import Features from './components/sections/Features'
import ComingSoon from './components/sections/ComingSoon'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // Refresh ScrollTrigger after all components mount
    ScrollTrigger.refresh()
  }, [])

  return (
    <main>
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <ComingSoon />
    </main>
  )
}

export default App
```

Write this to `src/App.jsx`.

- [ ] **Step 3: Verify complete page**

Run: `npm run dev`

Expected: All 6 sections render with proper scroll behavior.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ComingSoon.jsx src/App.jsx
git commit -m "feat: add ComingSoon section with social links and footer"
```

---

## Task 11: Responsive Polish

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Add responsive styles**

Add to the end of `src/styles/globals.css`:

```css
/* Responsive */
@media (max-width: 768px) {
  .section {
    padding: 80px 20px;
  }

  .horizontal-panel {
    padding: 60px 20px;
  }

  /* Simplify horizontal scroll on mobile - stack vertically */
  .horizontal-scroll-container {
    height: auto;
  }

  .horizontal-scroll-track {
    flex-direction: column;
    width: 100%;
    height: auto;
  }

  .horizontal-panel {
    width: 100%;
    height: auto;
    min-height: 80vh;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.6rem;
  }
}
```

Append this to `src/styles/globals.css`.

- [ ] **Step 2: Test on mobile viewport**

Run: `npm run dev`

Open browser DevTools, toggle device toolbar, test at 375px width.

Expected: Sections stack vertically, text scales down, horizontal sections become vertical.

- [ ] **Step 3: Commit**

```bash
git add src/styles/globals.css
git commit -m "feat: add responsive styles for mobile"
```

---

## Task 12: Build and Verify Production

**Files:**
- None (verification only)

- [ ] **Step 1: Run production build**

Run: `npm run build`

Expected: Build completes without errors, `dist/` folder created.

- [ ] **Step 2: Preview production build**

Run: `npm run preview`

Expected: Production build serves at localhost:4173, all animations work.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete SportTimes landing page with all 6 sections"
```

---

## Summary

This plan implements:

1. **Hero** — Sport selector, animated isometric field, glowing orbs, store badges
2. **Problem** — Horizontal scroll through 3 pain point cards
3. **Solution** — Animated player counter, "Join Match" CTA
4. **How It Works** — Horizontal scroll through 4 steps
5. **Features** — 6-card grid with hover effects
6. **Coming Soon** — Store badges, social links, footer

**Tech:** Vite + React + Framer Motion + GSAP ScrollTrigger

**Total Tasks:** 12
**Estimated Steps:** ~45
