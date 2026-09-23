import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import { useEffect, useState } from 'react'
import { testimonials } from '../data'
import { SectionHead, ease } from './ui'

export default function Testimonials() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const t = testimonials[i]
  const go = (d: number) => setI((v) => (v + d + testimonials.length) % testimonials.length)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(1), 8000)
    return () => clearInterval(id)
  }, [paused, i])

  return (
    <section id="depoimentos" className="relative overflow-hidden py-28 lg:py-40">
      <div className="pointer-events-none absolute right-0 top-0 size-[40rem] rounded-full bg-brand/10 blur-[160px]" />
      <div className="container-x relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHead eyebrow="Depoimentos" title="Quem viaja com a gente, recomenda." />
          <div className="mt-10 flex gap-3">
            <button onClick={() => go(-1)} className="grid size-14 place-items-center rounded-full border border-white/15 transition hover:border-brand hover:bg-brand hover:text-black" aria-label="Depoimento anterior">
              <ArrowLeft className="size-5" />
            </button>
            <button onClick={() => go(1)} className="grid size-14 place-items-center rounded-full border border-white/15 transition hover:border-brand hover:bg-brand hover:text-black" aria-label="Próximo depoimento">
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-8" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="relative rounded-[2rem] border border-white/10 bg-ink-2 p-8 sm:p-14">
            <Quote className="size-12 text-brand" />
            <div className="min-h-[260px] sm:min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                  transition={{ duration: 0.6, ease }}
                >
                  <p className="mt-8 font-display text-xl leading-relaxed sm:text-2xl lg:text-[1.7rem]">“{t.quote}”</p>
                  <footer className="mt-10 flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 font-display font-bold text-black">
                      {t.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </span>
                    <span>
                      <span className="block font-semibold">{t.name}</span>
                      <span className="text-sm text-mute">{t.role}</span>
                    </span>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>
            <div className="mt-10 flex gap-2">
              {testimonials.map((_, k) => (
                <button key={k} onClick={() => setI(k)} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10" aria-label={`Depoimento ${k + 1}`}>
                  {k === i && (
                    <motion.span
                      key={`${i}-${paused}`}
                      className="block h-full bg-brand"
                      initial={{ width: paused ? '100%' : '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: paused ? 0 : 8, ease: 'linear' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
