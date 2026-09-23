export const company = {
  name: 'Verus Transportes',
  phones: ['(19) 3442-6303', '(19) 3442-6116', '(19) 3442-6123'],
  email: 'contato@verustransportes.com.br',
  whatsapp: '551934426303',
  address: 'Estrada Dr. Cassio de Freitas Levy, 2090',
  district: 'Jd. São Francisco, Limeira-SP',
  cep: '13.484-720',
  hours: 'Seg. a Sex. · 08h às 18h',
  waze: 'https://waze.com/ul/h6gyrbc0n4',
  maps: 'https://www.google.com/maps/search/?api=1&query=Estrada+Dr.+Cassio+de+Freitas+Levy+2090+Limeira+SP',
  mapEmbed:
    'https://maps.google.com/maps?q=Estrada%20Dr.%20Cassio%20de%20Freitas%20Levy%2C%202090%2C%20Limeira-SP&t=m&z=15&output=embed',
  video: 'q2hNNnkbz5Y',
  social: {
    instagram: 'https://www.instagram.com/verus.transportes/',
    facebook: 'https://www.facebook.com/verus.transportes/',
    linkedin: 'https://www.linkedin.com/company/verus-transportes',
  },
}

export const tel = (p: string) => `tel:+55${p.replace(/\D/g, '')}`
export const wa = (text = '') =>
  `https://wa.me/${company.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const nav = [
  { id: 'sobre', label: 'Quem somos' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'processo', label: 'Como funciona' },
  { id: 'estrutura', label: 'Estrutura' },
  { id: 'depoimentos', label: 'Clientes' },
  { id: 'contato', label: 'Contato' },
]

export const values = [
  'Determinação', 'Comprometimento', 'Respeito', 'Organização',
  'Segurança', 'Companheirismo', 'Honestidade', 'Humildade',
]

export const services = [
  {
    tag: '01',
    title: 'Cargas fechadas',
    text: 'Caminhão dedicado exclusivamente à sua carga, com agendamento em até 1 dia de antecedência. Sem transbordo e sem compartilhamento: sai da sua doca direto para o destino.',
    bullets: ['Veículo dedicado', 'Agendamento em até 24h', 'Porta a porta'],
    img: 'img/carga-fechada.webp',
  },
  {
    tag: '02',
    title: 'Fretes expressos',
    text: 'Fretes expressos programados para demandas urgentes, com acompanhamento próximo da equipe do primeiro contato até a entrega.',
    bullets: ['Programação sob demanda', 'Prioridade na rota', 'Contato direto com a operação'],
    img: 'img/galeria-3.webp',
  },
  {
    tag: '03',
    title: 'Armazenagem e logística',
    text: 'Armazenamento e movimentação de mercadorias em estrutura própria, com mão de obra treinada para carga e descarga.',
    bullets: ['Armazém próprio', 'Movimentação interna', 'Carga e descarga'],
    img: 'img/armazenagem.webp',
  },
]

export const steps = [
  { title: 'Solicitação', text: 'Você envia origem, destino e tipo de carga pelo site, WhatsApp ou telefone.' },
  { title: 'Cotação', text: 'Nossa equipe retorna com a proposta e o veículo ideal para a operação.' },
  { title: 'Coleta', text: 'Caminhão dedicado agendado com até 1 dia de antecedência, na hora combinada.' },
  { title: 'Entrega', text: 'Carga protegida do início ao fim, com acompanhamento até o destino final.' },
]

export const testimonials = [
  {
    quote:
      'Há cinco anos a Verus Transportes nos atende com alta qualidade e pontualidade no atendimento. Estamos satisfeitos com os valores oferecidos e serviços prestados. É uma honra a vossa empresa fazer parte da Família New.up!',
    name: 'Tatiana Euleoterio',
    role: 'Faturamento · New.up! Eletrodomésticos',
  },
  {
    quote:
      'Inicialmente trabalhamos com eles em serviços pontuais, mas a qualidade do atendimento e a eficiência nos impressionaram tanto que decidimos nomeá-los nosso fornecedor de frete terceirizado. Recomendamos a Verus para qualquer empresa que busque um parceiro confiável e eficiente.',
    name: 'Rodrigo Rochia',
    role: 'Coordenador de compras · PRO METAL',
  },
]

export const gallery = Array.from({ length: 8 }, (_, i) => `img/galeria-${i + 1}.webp`)
