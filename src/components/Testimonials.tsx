import { motion, useInView } from 'motion/react'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { testimonials } from '../data'
import { SectionHead, ease } from './ui'

export default function Testimonials() {
  const [i, setI] = useState(0)
  const [hover, setHover] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-20% 0px' })
  const paused = hover || !inView
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

        <div className="lg:col-span-8" ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <div className="relative rounded-[2rem] border border-white/10 bg-ink-2 p-8 sm:p-14">
            <Quote className="size-12 text-brand" />
            {/* todos os depoimentos ocupam a mesma célula do grid: a altura fica fixa na do maior, sem empurrar a página ao trocar */}
            <div className="grid">
              {testimonials.map((t, k) => (
                <motion.blockquote
                  key={t.name}
                  aria-hidden={k !== i}
                  className="[grid-area:1/1]"
                  initial={false}
                  animate={k === i ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 16, filter: 'blur(6px)' }}
                  transition={{ duration: 0.6, ease, delay: k === i ? 0.25 : 0 }}
                  style={{ pointerEvents: k === i ? 'auto' : 'none' }}
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
              ))}
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
