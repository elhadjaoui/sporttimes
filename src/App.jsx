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
