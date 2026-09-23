import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { wa } from '../data'
import { Button, Counter, SplitWords, ease } from './ui'

const stats = [
  { n: 15, suffix: '+', label: 'anos de estrada' },
  { n: 24, suffix: 'h', label: 'para agendar sua coleta' },
  { n: 100, suffix: '%', label: 'de clientes satisfeitos' },
  { n: 3, suffix: '', label: 'soluções logísticas integradas' },
]

function Routes() {
  const paths = [
    'M-50 520 C 300 480, 420 300, 760 320 S 1200 160, 1500 120',
    'M-50 680 C 260 640, 520 560, 820 520 S 1240 440, 1500 380',
    'M-50 360 C 200 380, 460 220, 700 200 S 1100 80, 1500 40',
  ]
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="rg" x1="0" x2="1">
          <stop offset="0" stopColor="#f58220" stopOpacity="0" />
          <stop offset=".5" stopColor="#f58220" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffd2a8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <g key={i}>
          <path d={d} stroke="white" strokeOpacity=".06" strokeWidth="1" fill="none" />
          <motion.path
            d={d}
            stroke="url(#rg)"
            strokeWidth={i === 1 ? 2.5 : 1.5}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0.15, pathOffset: 0 }}
            animate={{ pathOffset: [0, 1] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear', delay: i * 1.3 }}
          />
        </g>
      ))}
    </svg>
  )
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.3])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section id="top" ref={ref} className="grain relative flex min-h-[100svh] flex-col overflow-hidden">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <motion.img
          src="img/carga-fechada.webp"
          alt=""
          className="h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <Routes />
      <div className="pointer-events-none absolute -left-40 top-1/3 size-[36rem] rounded-full bg-brand/20 blur-[140px]" />

      <motion.div style={{ opacity: fade }} className="container-x relative z-10 flex flex-1 flex-col justify-center pb-16 pt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="mb-8 inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4 text-xs text-white/80 backdrop-blur"
        >
          <span className="rounded-full bg-brand px-2.5 py-1 font-semibold text-black">Limeira · SP</span>
          Transporte rodoviário de cargas e logística
        </motion.div>

        <h1 className="max-w-6xl font-display text-[clamp(2.6rem,5.6vw,5.75rem)] font-semibold leading-[0.98] tracking-tight">
          <SplitWords text="Sua carga protegida," animateOnMount delay={0.4} />
          <br />
          <SplitWords text="do primeiro contato à entrega." animateOnMount delay={0.6} className="text-gradient" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/70"
        >
          Há mais de 15 anos movimentando cargas fechadas, fretes expressos e armazenagem com seriedade,
          pontualidade e caminhão dedicado para o seu negócio.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button href="#cotacao">
            Solicitar cotação <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </Button>
          <Button href={wa('Olá! Gostaria de falar com a Verus Transportes.')} variant="ghost" target="_blank" rel="noreferrer">
            Falar no WhatsApp
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="relative z-10 border-t border-white/10 bg-ink/40 backdrop-blur-md"
      >
        <div className="container-x grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`py-6 lg:py-8 ${i % 2 ? 'pl-6' : ''} ${i > 0 ? 'lg:border-l lg:border-white/10 lg:pl-8' : ''} ${i === 1 ? 'border-l border-white/10' : ''} ${i === 3 ? 'border-l border-white/10' : ''} ${i < 2 ? 'border-b border-white/10 lg:border-b-0' : ''}`}>
              <div className="font-display text-3xl font-semibold sm:text-4xl">
                <Counter to={s.n} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-sm text-mute">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <a href="#sobre" aria-label="Rolar para baixo" className="absolute bottom-40 right-8 z-10 hidden flex-col items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50 lg:flex">
        <span className="[writing-mode:vertical-rl]">Role</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ArrowDown className="size-4" />
        </motion.span>
      </a>
    </section>
  )
}
