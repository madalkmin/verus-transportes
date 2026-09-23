import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { company, nav, tel } from '../data'
import { lockScroll } from '../lenis'
import { ease } from './ui'

export default function Header() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > prev && y > 400 && !open)
  })

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    nav.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  useEffect(() => lockScroll(open), [open])

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-110%' : 0 }}
        transition={{ duration: 0.4, ease }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-all duration-500 ${
            scrolled ? 'border-b border-white/5 bg-ink/70 py-3 backdrop-blur-xl' : 'py-6'
          }`}
        >
          <div className="container-x flex items-center justify-between gap-6">
            <a href="#top" aria-label="Verus Transportes, início" className="shrink-0">
              <img src="img/logo.png" alt="Verus Transportes" className="h-8 w-auto sm:h-9" />
            </a>

            <nav className="hidden items-center gap-1 lg:flex">
              {nav.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                    active === n.id ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {active === n.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                  )}
                  <span className="relative">{n.label}</span>
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a href={tel(company.phones[0])} className="hidden items-center gap-2 text-sm text-white/70 hover:text-white xl:flex">
                <Phone className="size-4 text-brand" /> {company.phones[0]}
              </a>
              <a
                href="#cotacao"
                className="hidden items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white sm:inline-flex"
              >
                Solicitar cotação <ArrowUpRight className="size-4" />
              </a>
              <button
                onClick={() => setOpen(true)}
                className="grid size-11 place-items-center rounded-full border border-white/15 lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-2xl lg:hidden"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="container-x flex items-center justify-between py-6">
              <img src="img/logo.png" alt="Verus Transportes" className="h-8" />
              <button onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full border border-white/15" aria-label="Fechar menu">
                <X className="size-5" />
              </button>
            </div>
            <nav className="container-x mt-8 flex flex-col">
              {[...nav, { id: 'cotacao', label: 'Solicitar cotação' }].map((n, i) => (
                <motion.a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease }}
                  className="flex items-center justify-between border-b border-white/10 py-5 font-display text-3xl"
                >
                  {n.label}
                  <ArrowUpRight className="size-6 text-brand" />
                </motion.a>
              ))}
            </nav>
            <div className="container-x mt-auto pb-10 text-sm text-mute">
              <a href={tel(company.phones[0])} className="block text-white">{company.phones[0]}</a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
