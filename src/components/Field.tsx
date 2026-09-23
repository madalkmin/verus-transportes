import { useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

/* ---------- máscaras e normalização em tempo real ---------- */

const lower = new Set(['da', 'das', 'de', 'do', 'dos', 'e'])

const titleCase = (v: string) =>
  v.replace(/\p{L}+/gu, (w, i: number) =>
    i > 0 && lower.has(w.toLowerCase()) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
  )

export const masks = {
  phone: (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 2) return d.length ? `(${d}` : ''
    const ddd = `(${d.slice(0, 2)}) `
    const n = d.slice(2)
    if (n.length <= 4) return ddd + n
    // celular (9 dígitos) usa 5+4; fixo (8 dígitos) usa 4+4
    const split = n.length === 9 ? 5 : 4
    return `${ddd}${n.slice(0, split)}-${n.slice(split)}`
  },
  name: (v: string) => titleCase(v.replace(/[^\p{L}' -]/gu, '').replace(/ {2,}/g, ' ').replace(/^ /, '')),
  // UF em maiúsculas: "limeira/sp" vira "Limeira/SP"
  city: (v: string) =>
    titleCase(v.replace(/[^\p{L}' /.-]/gu, '').replace(/ {2,}/g, ' ').replace(/^ /, ''))
      .replace(/\/( ?)(\p{L}{1,2})$/u, (_, s: string, uf: string) => `/${s}${uf.toUpperCase()}`),
  company: (v: string) => v.replace(/[<>{}[\]\\^`|~]/g, '').replace(/ {2,}/g, ' ').replace(/^ /, ''),
  email: (v: string) => v.toLowerCase().replace(/[^a-z0-9.@_+-]/g, ''),
  measure: (v: string) => v.replace(/[^\p{L}\d ,./x³²-]/gu, '').replace(/ {2,}/g, ' ').replace(/^ /, ''),
  text: (v: string) => v.replace(/[<>]/g, '').replace(/\n{3,}/g, '\n\n').replace(/ {3,}/g, '  '),
}

export type Mask = keyof typeof masks

/* ---------- validação com mensagens em português ---------- */

const hasLink = (v: string) => /(https?:\/\/|www\.|\.(com|net|org|ru|xyz|io|br)\b\/?)/i.test(v)

const validators: Partial<Record<Mask, (v: string, full?: boolean) => string>> = {
  phone: (v) => {
    const d = v.replace(/\D/g, '')
    if (d.length < 10) return 'Informe o telefone com DDD.'
    if (d.length === 11 && d[2] !== '9') return 'Celular deve começar com 9 após o DDD.'
    return ''
  },
  name: (v, full) => {
    const t = v.trim()
    if (t.length < 3) return 'Informe seu nome.'
    if (full && t.split(/\s+/).length < 2) return 'Informe nome e sobrenome.'
    return ''
  },
  city: (v) => (v.trim().length < 3 ? 'Informe a cidade.' : ''),
  email: (v) => (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v) ? '' : 'Informe um e-mail válido.'),
  text: (v) => (hasLink(v) ? 'Por segurança, não inclua links na mensagem.' : ''),
}

const limits: Record<Mask, number> = {
  phone: 15, name: 80, city: 60, company: 80, email: 100, measure: 40, text: 500,
}

function applyMask(el: HTMLInputElement | HTMLTextAreaElement, mask: Mask) {
  const raw = el.value
  const caret = el.selectionStart ?? raw.length
  const next = masks[mask](raw)
  if (next === raw) return
  el.value = next
  // mantém o cursor no lugar ao editar no meio do texto
  let pos: number
  if (mask === 'phone') {
    const digits = raw.slice(0, caret).replace(/\D/g, '').length
    pos = 0
    for (let seen = 0; pos < next.length && seen < digits; pos++) if (/\d/.test(next[pos])) seen++
  } else {
    pos = Math.max(0, Math.min(next.length, caret - (raw.length - next.length)))
  }
  if (el.type !== 'email') el.setSelectionRange(pos, pos)
}

function validate(el: HTMLInputElement | HTMLTextAreaElement, mask: Mask, full?: boolean) {
  const v = el.value
  const msg = !v && !el.required ? '' : !v ? 'Campo obrigatório.' : validators[mask]?.(v, full) ?? ''
  el.setCustomValidity(msg)
  return msg
}

/* ---------- componentes ---------- */

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { mask: Mask; fullName?: boolean }

export function Input({ mask, fullName, className = '', onInput, ...rest }: InputProps) {
  const [error, setError] = useState('')
  const type = mask === 'phone' ? 'tel' : mask === 'email' ? 'email' : 'text'
  return (
    <div className={`relative ${className}`}>
      <input
        {...rest}
        type={type}
        inputMode={mask === 'phone' ? 'numeric' : mask === 'email' ? 'email' : undefined}
        autoCapitalize={mask === 'email' ? 'none' : 'words'}
        spellCheck={mask === 'email' ? false : undefined}
        maxLength={limits[mask]}
        className={`field ${error ? 'border-red-400/70' : ''}`}
        onInput={(e) => {
          applyMask(e.currentTarget, mask)
          const msg = validate(e.currentTarget, mask, fullName)
          if (error) setError(msg)
          onInput?.(e)
        }}
        onBlur={(e) => {
          e.currentTarget.value = e.currentTarget.value.trim()
          setError(e.currentTarget.value ? validate(e.currentTarget, mask, fullName) : '')
        }}
        onInvalid={(e) => { e.preventDefault(); setError(validate(e.currentTarget, mask, fullName)) }}
      />
      {error && <p className="mt-1.5 pl-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

type AreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { limit?: number }

export function TextArea({ limit = 500, className = '', ...rest }: AreaProps) {
  const [count, setCount] = useState(0)
  const [error, setError] = useState('')
  const near = count >= limit * 0.9
  return (
    <div className={className}>
      <div className="relative">
      <textarea
        {...rest}
        maxLength={limit}
        className={`field resize-none pb-8 ${error ? 'border-red-400/70' : ''}`}
        onInput={(e) => {
          applyMask(e.currentTarget, 'text')
          setCount(e.currentTarget.value.length)
          const msg = validate(e.currentTarget, 'text')
          if (error || msg) setError(msg)
        }}
        onBlur={(e) => { e.currentTarget.value = e.currentTarget.value.trim(); setCount(e.currentTarget.value.length) }}
        onInvalid={(e) => { e.preventDefault(); setError(validate(e.currentTarget, 'text')) }}
      />
      <span className={`pointer-events-none absolute bottom-3 right-4 text-[11px] tabular-nums transition-colors ${near ? 'text-brand' : 'text-mute/60'}`}>
        {count}/{limit}
      </span>
      </div>
      {error && <p className="mt-1.5 pl-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

/* ---------- anti-spam ---------- */

/** Campo invisível (honeypot) + tempo mínimo de preenchimento. Bots costumam preencher tudo na hora. */
export function useSpamGuard() {
  const [openedAt] = useState(() => Date.now())
  const honeypot = (
    <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px opacity-0" />
  )
  const isSpam = (form: HTMLFormElement) =>
    !!(new FormData(form).get('website') as string) || Date.now() - openedAt < 3000
  return { honeypot, isSpam }
}
