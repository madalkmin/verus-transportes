import { animate, motion, useInView, useMotionValue, useSpring, type HTMLMotionProps } from 'motion/react'
import { useEffect, useRef, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'

export const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, delay = 0, y = 32, ...rest }: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function SplitWords({ text, className, delay = 0, animateOnMount }: { text: string; className?: string; delay?: number; animateOnMount?: boolean }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            {...(animateOnMount ? { animate: { y: 0 } } : { whileInView: { y: 0 }, viewport: { once: true } })}
            transition={{ duration: 1, delay: delay + i * 0.06, ease }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 2, ease, onUpdate: (n) => setV(Math.round(n)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>{prefix}{v}{suffix}</span>
}

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })
  return (
    <motion.div
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.25)
        y.set((e.clientY - r.top - r.height / 2) * 0.25)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}

type ButtonProps = { href: string; children: ReactNode; variant?: 'primary' | 'ghost' } & AnchorHTMLAttributes<HTMLAnchorElement>

export function Button({ href, children, variant = 'primary', className = '', ...rest }: ButtonProps) {
  const base = 'group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-semibold transition-colors'
  const styles = variant === 'primary'
    ? 'bg-brand text-black'
    : 'border border-white/15 bg-white/5 text-white backdrop-blur hover:border-white/40'
  return (
    <Magnetic className="inline-block">
      <a href={href} className={`${base} ${styles} ${className}`} {...rest}>
        {variant === 'primary' && (
          <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 ease-out group-hover:translate-x-0" />
        )}
        <span className="relative flex items-center gap-2">{children}</span>
      </a>
    </Magnetic>
  )
}

export function SectionHead({ eyebrow, title, text, center }: { eyebrow: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>
      <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
        <SplitWords text={title} />
      </h2>
      {text && <Reveal delay={0.2}><p className="mt-6 text-lg leading-relaxed text-mute">{text}</p></Reveal>}
    </div>
  )
}
