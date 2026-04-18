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
