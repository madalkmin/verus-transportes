import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { ease } from './ui'

type Props = {
  name: string
  options: string[]
  placeholder?: string
  defaultValue?: string
  required?: boolean
  className?: string
}

export default function Select({ name, options, placeholder = 'Selecione', defaultValue, required, className = '' }: Props) {
  const [value, setValue] = useState(defaultValue ?? '')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const openList = () => {
    setActive(Math.max(0, options.indexOf(value)))
    setOpen(true)
  }
  const choose = (v: string) => {
    setValue(v)
    setOpen(false)
  }

  const onKey = (e: KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openList() }
      return
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % options.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + options.length) % options.length) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(options[active]) }
    else if (e.key === 'Escape' || e.key === 'Tab') setOpen(false)
    else {
      const i = options.findIndex((o) => o.toLowerCase().startsWith(e.key.toLowerCase()))
      if (i >= 0) setActive(i)
    }
  }

  return (
    <div ref={root} className={`relative ${className}`}>
      {/* valor real enviado no FormData; a validação nativa aparece ancorada no botão */}
      <input
        tabIndex={-1}
        aria-hidden
        name={name}
        value={value}
        required={required}
        onChange={() => {}}
        onInvalid={openList}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0"
      />
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="listbox"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKey}
        className={`field flex items-center justify-between gap-3 text-left ${open ? 'border-brand bg-ink-3' : ''}`}
      >
        <span className={value ? 'text-white' : 'text-mute/70'}>{value || placeholder}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease }} className="grid size-6 place-items-center rounded-full bg-white/5">
          <ChevronDown className="size-4 text-brand" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={id}
            role="listbox"
            data-lenis-prevent
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease }}
            className="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-72 origin-top overflow-auto rounded-2xl border border-white/10 bg-ink-3/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            {options.map((o, i) => {
              const selected = o === value
              return (
                <li
                  key={o}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(o)}
                  className="relative flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-sm"
                >
                  {active === i && (
                    <motion.span layoutId={`${id}-hl`} className="absolute inset-0 rounded-xl bg-white/[0.07]" transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }} />
                  )}
                  <span className={`relative ${selected ? 'font-medium text-brand' : 'text-white/85'}`}>{o}</span>
                  {selected && <Check className="relative size-4 text-brand" />}
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
