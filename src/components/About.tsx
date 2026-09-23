import { motion, useScroll, useTransform } from 'motion/react'
import { Compass, Eye, Gem, MapPin } from 'lucide-react'
import { useRef } from 'react'
import { values } from '../data'
import { Reveal, SectionHead } from './ui'

const pillars = [
  {
    Icon: Compass,
    title: 'Missão',
    text: 'Transportar, armazenar e distribuir os produtos de nossos clientes com qualidade, seriedade e pontualidade.',
  },
  {
    Icon: Eye,
    title: 'Visão',
    text: 'Ser uma empresa reconhecida em seu segmento, que preza pelo respeito ao meio ambiente e à sociedade, evoluindo com uma estrutura sólida e eficaz.',
  },
  {
    Icon: Gem,
    title: 'Valores',
    text: values.join(' · '),
  },
]

export function Marquee() {
  const items = [...values, ...values]
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-brand py-5 text-black">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-display text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
        {items.map((v, i) => (
          <span key={i} className="flex items-center gap-10">
            {v}
            <svg viewBox="0 0 24 24" className="size-5"><path d="M4 6l8 13 8-13" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" /></svg>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const clip = useTransform(scrollYProgress, [0, 0.35], ['inset(18% 12% 18% 12% round 28px)', 'inset(0% 0% 0% 0% round 28px)'])

  return (
    <section id="sobre" className="relative py-28 lg:py-40">
      <div className="container-x">
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead
              eyebrow="Quem somos"
              title="Só quem acumula milhares de quilômetros pode oferecer o melhor para o seu negócio."
            />
          </div>
          <Reveal delay={0.2} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-mute">
              Estrategicamente localizada em <span className="text-white">Limeira, no interior de São Paulo</span>, a Verus
              Transportes atua com seriedade e responsabilidade no transporte rodoviário de cargas e na logística dos mais
              variados tipos de carga.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-mute">
              Nossa estrutura é completa e nossos colaboradores são treinados e atualizados para atender às suas
              expectativas, do primeiro contato à entrega.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-20">
          <motion.div style={{ clipPath: clip }} className="relative aspect-[16/10] overflow-hidden sm:aspect-[21/9]">
            <motion.img style={{ y, scale: 1.25 }} src="img/sobre.webp" alt="Frota Verus Transportes" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-full border border-white/15 bg-ink/60 px-4 py-2 text-sm backdrop-blur-md sm:bottom-10 sm:left-10">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-brand" />
              </span>
              <MapPin className="size-4 text-brand" /> Base operacional · Limeira-SP
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {pillars.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.12}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-ink-2 p-8 transition-colors duration-500 hover:border-brand/50">
                <div className="absolute -right-20 -top-20 size-56 rounded-full bg-brand/0 blur-3xl transition-colors duration-700 group-hover:bg-brand/20" />
                <div className="relative grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="size-6" />
                </div>
                <h3 className="relative mt-8 font-display text-2xl font-semibold">{title}</h3>
                <p className="relative mt-3 leading-relaxed text-mute">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
