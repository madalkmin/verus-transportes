import { motion, useScroll, useSpring } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { company, nav, services, tel, wa } from '../data'
import { WhatsApp, social } from './icons'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[80] h-0.5 origin-left bg-gradient-to-r from-brand to-brand-2" />
}

export function WhatsAppFloat() {
  return (
    <motion.a
      href={wa('Olá! Vim pelo site e gostaria de mais informações.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Conversar no WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200, damping: 14 }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-black/50 sm:bottom-8 sm:right-8"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s]" />
      <WhatsApp className="relative size-7" />
    </motion.a>
  )
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 pt-20">
      <div className="container-x grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <img src="img/logo.png" alt="Verus Transportes" className="h-10" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-mute">
            Transporte rodoviário de cargas e logística. Transportar, armazenar e distribuir com qualidade, seriedade e pontualidade.
          </p>
          <div className="mt-6 flex gap-2">
            {social.map(({ key, label, Icon }) => (
              <a key={key} href={company.social[key]} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/10 text-white/70 transition hover:border-brand hover:bg-brand hover:text-black">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] text-mute">Navegação</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {nav.map((n) => <li key={n.id}><a href={`#${n.id}`} className="text-white/80 hover:text-brand">{n.label}</a></li>)}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <h4 className="text-xs uppercase tracking-[0.2em] text-mute">Serviços</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((s) => <li key={s.title}><a href="#servicos" className="text-white/80 hover:text-brand">{s.title}</a></li>)}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <h4 className="text-xs uppercase tracking-[0.2em] text-mute">Contato</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/80">
            {company.phones.map((p) => <li key={p}><a href={tel(p)} className="hover:text-brand">{p}</a></li>)}
            <li><a href={wa()} target="_blank" rel="noreferrer" className="hover:text-brand">WhatsApp</a></li>
            <li><a href={`mailto:${company.email}`} className="break-all hover:text-brand">{company.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="pointer-events-none select-none px-4 text-center font-display text-[22vw] font-bold leading-[0.8] tracking-tighter text-white/[0.03]">
        VERUS
      </div>

      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-mute sm:flex-row">
          <span>© {new Date().getFullYear()} Verus Transportes. Todos os direitos reservados.</span>
          <a href="#top" className="inline-flex items-center gap-2 hover:text-white">Voltar ao topo <ArrowUp className="size-3.5" /></a>
        </div>
      </div>
    </footer>
  )
}
