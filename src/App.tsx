import { useEffect } from 'react'
import About, { Marquee } from './components/About'
import Careers from './components/Careers'
import Contact from './components/Contact'
import Footer, { ScrollProgress, WhatsAppFloat } from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Process from './components/Process'
import Services from './components/Services'
import Structure from './components/Structure'
import Testimonials from './components/Testimonials'
import { startSmoothScroll } from './lenis'

export default function App() {
  useEffect(startSmoothScroll, [])
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
