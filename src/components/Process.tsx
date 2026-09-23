import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { steps } from '../data'
import { Reveal, SectionHead } from './ui'

export default function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const line = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })

  return (
    <section id="processo" className="relative overflow-hidden border-y border-white/5 bg-ink-2 py-28 lg:py-40">
      <div className="grid-bg absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
      <div className="container-x relative">
        <SectionHead
          center
          eyebrow="Como funciona"
          title="Da solicitação à entrega em 4 etapas."
          text="Um processo simples e transparente, com uma equipe que acompanha sua carga em cada quilômetro."
        />

        <div ref={ref} className="relative mx-auto mt-20 max-w-5xl">
          <div className="absolute left-6 top-0 h-full w-px bg-white/10 md:left-1/2" />
          <motion.div style={{ scaleY: line }} className="absolute left-6 top-0 h-full w-px origin-top bg-gradient-to-b from-brand to-brand-2 shadow-[0_0_20px_2px] shadow-brand/60 md:left-1/2" />

          <div className="space-y-16">
            {steps.map((s, i) => {
              const right = i % 2 === 1
              return (
                <div key={s.title} className="relative grid items-center gap-6 pl-16 md:grid-cols-2 md:gap-16 md:pl-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-40% 0px -40% 0px' }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="absolute left-6 top-1/2 z-10 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-ink-2 bg-brand font-display font-bold text-black md:left-1/2"
                  >
                    {i + 1}
                  </motion.div>
                  <Reveal className={right ? 'md:col-start-2' : 'md:text-right'}>
                    <div className="rounded-3xl border border-white/10 bg-ink/60 p-8 backdrop-blur">
                      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Etapa {String(i + 1).padStart(2, '0')}</span>
                      <h3 className="mt-3 font-display text-3xl font-semibold">{s.title}</h3>
                      <p className="mt-3 leading-relaxed text-mute">{s.text}</p>
                    </div>
                  </Reveal>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
