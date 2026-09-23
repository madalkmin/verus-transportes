import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Briefcase, Check, FileText, Share2, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { wa } from '../data'
import { lockScroll } from '../lenis'
import { WhatsApp } from './icons'
import Select from './Select'
import { Reveal, ease } from './ui'

const areas = ['Motorista', 'Ajudante / operador de carga', 'Armazém e logística', 'Administrativo', 'Outra área']
const accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
const maxMb = 10

const fmtSize = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`)

function Dropzone({ file, onFile }: { file: File | null; onFile: (f: File | null) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState('')

  const pick = (f?: File) => {
    if (!f) return
    if (f.size > maxMb * 1e6) return setError(`Arquivo acima de ${maxMb} MB.`)
    setError('')
    onFile(f)
  }
  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDrag(false)
    pick(e.dataTransfer.files[0])
  }

  return (
    <div className="sm:col-span-2">
      <input ref={input} type="file" accept={accept} className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      {file ? (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 rounded-2xl border border-brand/40 bg-brand/[0.06] p-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand text-black"><FileText className="size-6" /></span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{file.name}</div>
            <div className="text-xs text-mute">{fmtSize(file.size)} · pronto para envio</div>
          </div>
          <button type="button" onClick={() => { onFile(null); if (input.current) input.current.value = '' }} className="grid size-9 place-items-center rounded-full bg-white/5 hover:bg-white/10" aria-label="Remover arquivo">
            <X className="size-4" />
          </button>
        </motion.div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={`group flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-8 text-center transition ${
            drag ? 'border-brand bg-brand/10' : 'border-white/15 bg-ink-3/40 hover:border-brand/60 hover:bg-ink-3'
          }`}
        >
          <motion.span animate={drag ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }} className="grid size-12 place-items-center rounded-full bg-brand/10 text-brand">
            <Upload className="size-5" />
          </motion.span>
          <span className="text-sm"><span className="font-semibold text-brand">Clique para anexar</span> ou arraste seu currículo *</span>
          <span className="text-xs text-mute">PDF, DOC, DOCX ou imagem · até {maxMb} MB</span>
        </button>
      )}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  )
}

function CareersModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [missingFile, setMissingFile] = useState(false)
  const [sent, setSent] = useState(false)
  const canShare = !!file && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })

  useEffect(() => {
    lockScroll(true)
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => { lockScroll(false); window.removeEventListener('keydown', k) }
  }, [onClose])

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return setMissingFile(true)
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const text = [
      '*Trabalhe conosco: candidatura pelo site*',
      `Nome: ${f.nome}`, `E-mail: ${f.email}`, `Telefone: ${f.telefone}`, `Área de interesse: ${f.area}`,
      f.obs ? `Mensagem: ${f.obs}` : '',
      '', `Currículo: ${file.name} (envio em anexo nesta conversa)`,
    ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n')
    window.open(wa(text), '_blank', 'noopener')
    setSent(true)
  }

  const shareFile = () => file && navigator.share({ files: [file], title: 'Currículo', text: 'Currículo para a Verus Transportes' }).catch(() => {})

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal
        aria-labelledby="careers-title"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.5, ease }}
        className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-t-[2rem] border border-white/10 bg-ink-2 p-6 shadow-2xl sm:rounded-[2rem] sm:p-10"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-brand/20 blur-3xl" />
        <button onClick={onClose} className="absolute right-5 top-5 z-10 grid size-10 place-items-center rounded-full bg-white/5 hover:bg-white/10" aria-label="Fechar">
          <X className="size-5" />
        </button>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative py-4">
              <div className="grid size-14 place-items-center rounded-full bg-[#25D366] text-white"><WhatsApp className="size-7" /></div>
              <h3 className="mt-6 font-display text-3xl font-semibold">Falta só um passo!</h3>
              <p className="mt-2 text-mute">O WhatsApp da Verus abriu com seus dados preenchidos. O WhatsApp não permite que sites anexem arquivos automaticamente, então:</p>
              <ol className="mt-6 space-y-3">
                {[
                  'Toque em enviar na mensagem com seus dados.',
                  <>Na mesma conversa, toque no clipe 📎 e anexe <b className="text-white">{file?.name}</b>.</>,
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 rounded-2xl border border-white/10 bg-ink/50 p-4 text-sm text-white/80">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-black">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-3">
                {canShare && (
                  <button onClick={shareFile} className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-black hover:bg-white">
                    <Share2 className="size-4" /> Compartilhar currículo no WhatsApp
                  </button>
                )}
                <button onClick={onClose} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold hover:border-white/40">
                  <Check className="size-4" /> Concluir
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="relative">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand"><Briefcase className="size-4" /> Trabalhe conosco</span>
              <h3 id="careers-title" className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Envie seu currículo</h3>
              <p className="mt-2 text-sm text-mute">Preencha seus dados e anexe o currículo. O envio é feito pelo WhatsApp direto para o nosso RH.</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <input name="nome" required placeholder="Nome completo *" className="field sm:col-span-2" autoComplete="name" />
                <input name="email" required type="email" placeholder="E-mail *" className="field" autoComplete="email" />
                <input name="telefone" required type="tel" placeholder="Telefone / WhatsApp *" className="field" autoComplete="tel" />
                <Select name="area" options={areas} placeholder="Área de interesse *" required className="sm:col-span-2" />
                <Dropzone file={file} onFile={(f) => { setFile(f); setMissingFile(false) }} />
                {missingFile && <p className="-mt-2 text-xs text-red-400 sm:col-span-2">Anexe seu currículo para continuar.</p>}
                <textarea name="obs" rows={3} placeholder="Conte um pouco sobre você (opcional)" className="field resize-none sm:col-span-2" />
                <button className="group relative mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-full bg-brand px-6 py-4 font-semibold text-black sm:col-span-2">
                  <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />
                  <span className="relative flex items-center gap-2"><WhatsApp className="size-5" /> Enviar pelo WhatsApp</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function Careers() {
  const [open, setOpen] = useState(false)
  return (
    <section className="py-24">
      <div className="container-x">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[2rem] bg-brand p-10 text-black sm:p-16">
            <motion.div
              className="absolute -right-10 -top-10 size-72 rounded-full border-[40px] border-black/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em]"><Briefcase className="size-4" /> Trabalhe conosco</span>
                <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">Faça parte do time Verus.</h2>
                <p className="mt-4 max-w-xl text-black/70">Motoristas, operadores e equipe administrativa: envie seu currículo e venha rodar com a gente.</p>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-black px-7 py-4 font-semibold text-white transition hover:bg-ink-3"
              >
                Enviar currículo <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
      <AnimatePresence>{open && <CareersModal onClose={() => setOpen(false)} />}</AnimatePresence>
    </section>
  )
}
