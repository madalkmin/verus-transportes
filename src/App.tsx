import Lenis from 'lenis'
import { useEffect } from 'react'
import About, { Marquee } from './components/About'
import Contact, { Careers } from './components/Contact'
import Footer, { ScrollProgress, WhatsAppFloat } from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Process from './components/Process'
import Services from './components/Services'
import Structure from './components/Structure'
import Testimonials from './components/Testimonials'

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -80 } })
    let id = requestAnimationFrame(function raf(t) {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    })
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])
}

export default function App() {
  useSmoothScroll()
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <About />
        <Marquee />
        <Services />
        <Process />
        <Structure />
        <Testimonials />
        <Contact />
        <Careers />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
