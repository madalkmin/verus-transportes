import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowUpRight, Check } from 'lucide-react'
import { useRef } from 'react'
import { services, wa } from '../data'
import { SectionHead } from './ui'

type Service = (typeof services)[number]

function Card({ s, i, progress, total }: { s: Service; i: number; progress: MotionValue<number>; total: number }) {
  const start = i / total
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - i) * 0.04])
  const dim = useTransform(progress, [start, start + 1 / total], [0, i === total - 1 ? 0 : 0.5])

  return (
    <div className="sticky top-24 h-[calc(100svh-8rem)] min-h-[560px] py-4" style={{ paddingTop: `${i * 28}px` }}>
      <motion.article
        style={{ scale }}
        className="relative grid h-full origin-top overflow-hidden rounded-[2rem] border border-white/10 bg-ink-2 lg:grid-cols-2"
      >
        <div className="relative z-10 flex flex-col justify-between gap-8 p-8 sm:p-12">
          <div>
            <div className="flex items-center gap-4">
              <span className="font-display text-sm text-brand">{s.tag}</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <h3 className="mt-8 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{s.title}</h3>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-mute">{s.text}</p>
          </div>
          <div>
            <ul className="flex flex-wrap gap-2">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm">
                  <Check className="size-3.5 text-brand" /> {b}
                </li>
              ))}
            </ul>
            <a
              href={wa(`Olá! Tenho interesse no serviço de ${s.title.toLowerCase()}.`)}
              target="_blank"
              rel="noreferrer"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              Quero esse serviço
              <span className="grid size-8 place-items-center rounded-full bg-brand text-black transition-transform group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </a>
          </div>
        </div>
        <div className="absolute inset-0 lg:relative">
          <img src={s.img} alt={s.title} className="h-full w-full object-cover opacity-25 lg:opacity-100" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-2 via-ink-2/40 to-transparent" />
        </div>
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.article>
    </div>
  )
}

export default function Services() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section id="servicos" className="relative py-28 lg:py-40">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead eyebrow="Soluções Verus" title="Excelência de ponta a ponta." />
          <p className="max-w-sm text-mute">
            Do caminhão dedicado à armazenagem, cuidamos de cada etapa para que sua carga chegue inteira, no prazo.
          </p>
        </div>
        <div ref={ref} className="mt-16">
          {services.map((s, i) => (
            <Card key={s.title} s={s} i={i} progress={scrollYProgress} total={services.length} />
          ))}
        </div>
      </div>
    </section>
  )
}
