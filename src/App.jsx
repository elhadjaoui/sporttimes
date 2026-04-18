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
