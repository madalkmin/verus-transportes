import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Clock, Mail, MapPin, Navigation, Phone, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { company, tel, wa } from '../data'
import { WhatsApp } from './icons'
import Select from './Select'
import { Reveal, SectionHead, ease } from './ui'

const tabs = ['Cotação de frete', 'Mensagem'] as const
const cargo = ['Carga fechada', 'Frete expresso', 'Armazenagem', 'Outro']

export function Quote() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Cotação de frete')
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const lines =
      tab === 'Cotação de frete'
        ? [
            '*Solicitação de cotação pelo site*',
            `Nome: ${f.nome}`, `Empresa: ${f.empresa || '-'}`, `Telefone: ${f.telefone}`, `E-mail: ${f.email}`,
            `Serviço: ${f.servico}`, `Origem: ${f.origem}`, `Destino: ${f.destino}`,
            `Peso/volume: ${f.peso || '-'}`, `Observações: ${f.obs || '-'}`,
          ]
        : ['*Mensagem pelo site*', `Nome: ${f.nome}`, `Telefone: ${f.telefone}`, `E-mail: ${f.email}`, '', f.obs]
    window.open(wa(lines.join('\n')), '_blank', 'noopener')
    setSent(true)
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-ink-2 p-6 sm:p-10">
      <div className="relative flex rounded-full border border-white/10 bg-ink p-1">
        {tabs.map((t) => (
          <button key={t} onClick={() => { setTab(t); setSent(false) }} className="relative flex-1 rounded-full px-4 py-2.5 text-sm font-medium">
            {tab === t && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-brand" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />}
            <span className={`relative ${tab === t ? 'text-black' : 'text-white/70'}`}>{t}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-16 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-brand text-black"><WhatsApp className="size-8" /></div>
            <h3 className="mt-6 font-display text-2xl font-semibold">Quase lá!</h3>
            <p className="mx-auto mt-2 max-w-sm text-mute">Abrimos o WhatsApp com sua solicitação preenchida. É só tocar em enviar que nossa equipe responde.</p>
            <button onClick={() => setSent(false)} className="mt-6 text-sm text-brand underline-offset-4 hover:underline">Enviar outra solicitação</button>
          </motion.div>
        ) : (
          <motion.form key={tab} onSubmit={submit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease }} className="mt-8 grid gap-4 sm:grid-cols-2">
            <input name="nome" required placeholder="Seu nome *" className="field" autoComplete="name" />
            {tab === 'Cotação de frete' && <input name="empresa" placeholder="Empresa" className="field" autoComplete="organization" />}
            <input name="telefone" required placeholder="Telefone / WhatsApp *" className="field" type="tel" autoComplete="tel" />
            <input name="email" required placeholder="E-mail *" className="field" type="email" autoComplete="email" />
            {tab === 'Cotação de frete' && (
              <>
                <Select name="servico" options={cargo} defaultValue={cargo[0]} className="sm:col-span-2" />
                <input name="origem" required placeholder="Cidade de origem *" className="field" />
                <input name="destino" required placeholder="Cidade de destino *" className="field" />
                <input name="peso" placeholder="Peso / volume aproximado" className="field sm:col-span-2" />
              </>
            )}
            <textarea name="obs" required={tab === 'Mensagem'} rows={4} placeholder={tab === 'Mensagem' ? 'Sua mensagem *' : 'Observações (tipo de carga, data desejada...)'} className="field resize-none sm:col-span-2" />
            <button className="group relative mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-full bg-brand px-6 py-4 font-semibold text-black sm:col-span-2">
              <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative flex items-center gap-2">Enviar pelo WhatsApp <Send className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </button>
            <p className="text-center text-xs text-mute sm:col-span-2">
              Prefere e-mail? Escreva para <a className="text-white hover:text-brand" href={`mailto:${company.email}`}>{company.email}</a>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Contact() {
  const info = [
    { Icon: Phone, label: 'Telefones', body: company.phones.map((p) => <a key={p} href={tel(p)} className="block hover:text-brand">{p}</a>) },
    { Icon: Mail, label: 'E-mail', body: <a href={`mailto:${company.email}`} className="break-all hover:text-brand">{company.email}</a> },
    { Icon: MapPin, label: 'Endereço', body: <>{company.address}<br />{company.district}<br />CEP {company.cep}</> },
    { Icon: Clock, label: 'Atendimento', body: company.hours },
  ]

  return (
    <section id="contato" className="relative border-t border-white/5 bg-ink-2/40 py-28 lg:py-40">
      <span id="cotacao" className="absolute -top-20" />
      <div className="container-x">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead
              eyebrow="Fale conosco"
              title="Vamos colocar sua carga na estrada?"
              text="Peça uma cotação em menos de 1 minuto. Nossa equipe retorna rapidamente com a melhor solução para sua operação."
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {info.map(({ Icon, label, body }, i) => (
                <Reveal key={label} delay={i * 0.08}>
                  <div className="flex gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><Icon className="size-5" /></span>
                    <div className="text-sm leading-relaxed text-white/80">
                      <div className="mb-1 text-xs uppercase tracking-[0.2em] text-mute">{label}</div>
                      {body}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.15} className="lg:col-span-7">
            <Quote />
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
            <iframe
              src={company.mapEmbed}
              title="Localização Verus Transportes"
              className="h-[420px] w-full grayscale invert-[0.92] hue-rotate-180 contrast-[0.9]"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-ink/80 p-5 backdrop-blur-xl sm:right-auto sm:max-w-sm">
              <div className="font-display text-lg font-semibold">Verus Transportes</div>
              <div className="text-sm text-mute">{company.address}, {company.district}</div>
              <div className="flex gap-2">
                <a href={company.maps} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-black hover:bg-white">
                  <Navigation className="size-3.5" /> Google Maps
                </a>
                <a href={company.waze} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold hover:border-white/40">
                  Waze <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
