import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { company, gallery } from '../data'
import { lockScroll } from '../lenis'
import { Reveal, SectionHead, ease } from './ui'

function Lightbox({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (d: number) => void }) {
  useEffect(() => {
    lockScroll(true)
    return () => lockScroll(false)
  }, [])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose, onNav])

  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/90 p-4 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={gallery[index]}
          alt={`Estrutura Verus ${index + 1}`}
          className="max-h-[85vh] max-w-full rounded-2xl object-contain"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease }}
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>
      <button className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-white/10" onClick={onClose} aria-label="Fechar"><X /></button>
      <button className="absolute left-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-brand hover:text-black" onClick={(e) => { e.stopPropagation(); onNav(-1) }} aria-label="Anterior"><ChevronLeft /></button>
      <button className="absolute right-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-brand hover:text-black" onClick={(e) => { e.stopPropagation(); onNav(1) }} aria-label="Próxima"><ChevronRight /></button>
      <span className="absolute bottom-6 text-sm text-white/60">{index + 1} / {gallery.length}</span>
    </motion.div>
  )
}

export function Video() {
  const [play, setPlay] = useState(false)
  return (
    <Reveal className="container-x">
      <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-white/10 bg-ink-2">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${company.video}?autoplay=1&rel=0`}
            title="Vídeo institucional Verus Transportes"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label="Assistir vídeo institucional">
            <img src={`https://i.ytimg.com/vi/${company.video}/maxresdefault.jpg`} alt="" className="h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-80" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20" />
            <span className="absolute left-1/2 top-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-black transition-transform duration-500 group-hover:scale-110 sm:size-28">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand/40" />
              <Play className="relative size-8 fill-current" />
            </span>
            <span className="absolute bottom-6 left-6 text-left sm:bottom-10 sm:left-10">
              <span className="eyebrow">Vídeo institucional</span>
              <span className="mt-2 block font-display text-2xl font-semibold sm:text-4xl">Conheça a Verus por dentro</span>
            </span>
          </button>
        )}
      </div>
    </Reveal>
  )
}

export default function Structure() {
  const ref = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)
  const [lb, setLb] = useState<number | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])

  useEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 32))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section id="estrutura" className="relative pt-28 lg:pt-40">
      <div className="container-x">
        <SectionHead
          eyebrow="Nossa estrutura"
          title="Completa e feita sob medida para o seu negócio."
          text="Frota, armazém e equipe preparados para operar com segurança. Veja um pouco da nossa operação."
        />
      </div>

      <div ref={ref} style={{ height: `calc(100vh + ${dist}px)` }} className="relative mt-12">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div ref={track} style={{ x }} className="flex gap-5 pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {gallery.map((src, i) => (
              <button
                key={src}
                onClick={() => setLb(i)}
                className={`group relative shrink-0 overflow-hidden rounded-3xl border border-white/10 ${
                  i % 3 === 0 ? 'h-[62vh] w-[80vw] sm:w-[46vw]' : 'h-[50vh] w-[70vw] sm:w-[32vw]'
                }`}
                aria-label={`Ampliar foto ${i + 1}`}
              >
                <img src={src} alt={`Estrutura Verus ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-5 left-5 font-display text-5xl font-semibold text-white/20 transition-colors group-hover:text-brand">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </button>
            ))}
            <div className="grid w-[70vw] shrink-0 place-items-center sm:w-[30vw]">
              <div className="max-w-xs">
                <p className="font-display text-3xl font-semibold leading-tight">Verus Transportes: <span className="text-brand">sua carga protegida.</span></p>
                <a href="#cotacao" className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-white">Fale com a Verus</a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pb-28 lg:pb-40">
        <Video />
      </div>

      <AnimatePresence>
        {lb !== null && (
          <Lightbox
            index={lb}
            onClose={() => setLb(null)}
            onNav={(d) => setLb((v) => (v === null ? v : (v + d + gallery.length) % gallery.length))}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
