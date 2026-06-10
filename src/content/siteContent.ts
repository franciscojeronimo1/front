/** Configuração geral de SEO/local. */
export const SEO_CITY = 'Santana do Jacaré'
export const SEO_STATE = 'MG'
export const SEO_COUNTRY = 'BR'
export const SEO_SITE_URL = 'https://pizzariadeliverysj.com'

/** Imagem para compartilhamento (Open Graph / Twitter). Proporção 1.91:1. */
export const SEO_OG_IMAGE = `${SEO_SITE_URL}/og-image.jpg`

export const SEO_OG_IMAGE_ALT =
  'Claudia Delivery — pizzaria em Santana do Jacaré, MG'

/** Localização para SEO local (sem endereço físico de balcão). */
export const SEO_ADDRESS = {
  locality: SEO_CITY,
  region: SEO_STATE,
  country: SEO_COUNTRY,
  /** Texto exibido no rodapé e em blocos de contato. */
  display: `${SEO_CITY}, ${SEO_STATE}`,
  serviceNote: 'Atendimento por delivery em Santana do Jacaré e região.',
} as const

/** Link internacional (wa.me). */
export const WHATSAPP_PHONE_E164 = '5535999865637'

/** Número exibido no site (contato). */
export const WHATSAPP_DISPLAY = '35 99865637'

export const whatsappPrefillMessages = {
  pedido:
    'Olá! Vim pelo site da Claudia Delivery e quero fazer um pedido.',
  cardapio:
    'Olá! Vim pelo site e gostaria de confirmar sabores e tamanhos disponíveis.',
} as const

export function whatsappHref(
  messageKey: keyof typeof whatsappPrefillMessages = 'pedido'
): string {
  const params = new URLSearchParams({
    text: whatsappPrefillMessages[messageKey],
  })
  return `https://wa.me/${WHATSAPP_PHONE_E164}?${params}`
}

export function whatsappHrefPedidoPizza(
  nomePizza: string,
  categoriaLabel: string
): string {
  const text = `Olá! Quero pedir a pizza *${nomePizza}* (${categoriaLabel}).`
  return `https://wa.me/${WHATSAPP_PHONE_E164}?${new URLSearchParams({ text })}`
}

/** Imagem ilustrativa do hero (Unsplash — termos da plataforma). */
export const imagery = {
  hero:
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2000&q=80',
} as const

export const siteContent = {
  brandName: 'Claudia Delivery',
  hero: {
    title: 'Pizzaria em Santana do Jacaré com entrega rápida',
    subtitle:
      'Escolha entre dezenas de sabores, monte seu pedido em segundos e finalize pelo WhatsApp.',
    ctaPrimary: 'Pedir no WhatsApp',
    ctaSecondary: 'Ver cardápio',
  },
  trustHighlights: [
    {
      icon: 'delivery' as const,
      title: 'Delivery local',
      description: 'Entrega em Santana do Jacaré e região, com confirmação rápida no WhatsApp.',
    },
    {
      icon: 'click' as const,
      title: 'Pedido em 1 clique',
      description: 'Cada sabor tem botão direto — sem app, sem cadastro, sem complicação.',
    },
    {
      icon: 'flavors' as const,
      title: '+20 sabores',
      description: 'Tradicional, bacon, queijos, carnes e opções vegetarianas no cardápio.',
    },
    {
      icon: 'hours' as const,
      title: 'Todos os dias',
      description: 'Funcionamento das 18:00 às 22:00, de segunda a domingo.',
    },
  ],
  orderSteps: [
    {
      title: 'Escolha o sabor',
      description: 'Navegue pelo cardápio e veja ingredientes, tamanhos e valores.',
    },
    {
      title: 'Toque em Pedir',
      description: 'O WhatsApp abre com a pizza já selecionada — é só confirmar o tamanho.',
    },
    {
      title: 'Receba em casa',
      description: 'Combine entrega e pagamento direto com a Claudia Delivery.',
    },
  ],
  featuredPizzas: [
    { sectionId: 'bacon-alho', itemName: 'PORTUGUESA COMPLETA', tag: 'Clássica da casa' },
    { sectionId: 'bacon-alho', itemName: 'FRANGOLINO', tag: 'Mais pedida' },
    { sectionId: 'queijos', itemName: '4 QUEIJOS', tag: 'Cremosa' },
    { sectionId: 'carnes', itemName: 'COSTELA', tag: 'Premium' },
  ],
  cardapioNota:
    'Valores conforme cardápio. Em caso de dúvida ou alteração, confirme diretamente no WhatsApp.',
  footer: {
    hours: 'Horário: 18:00 às 22:00.',
    area: SEO_ADDRESS.serviceNote,
    locationLabel: SEO_ADDRESS.display,
    instagramLabel: 'Instagram da Claudia Delivery',
    instagramHref: 'https://www.instagram.com/claudiaclementinodasilva/',
  },
} as const
