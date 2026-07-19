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

/** Imagem ilustrativa do hero (Unsplash — termos da plataforma). */
export const imagery = {
  hero:
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2000&q=80',
} as const

export const siteContent = {
  brandName: 'Claudia Delivery',
  hero: {
    title: 'Pizzaria e esfihas em Santana do Jacaré',
    subtitle:
      'Peça pizza ou combos de esfiha: monte o pedido em segundos e finalize pelo WhatsApp.',
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
      description: 'Monte pizza ou peça combos de esfiha e envie tudo no WhatsApp.',
    },
    {
      icon: 'flavors' as const,
      title: 'Pizza e esfiha',
      description: '+20 sabores de pizza e combos de esfiha — inclusive 10 à escolha.',
    },
    {
      icon: 'hours' as const,
      title: 'Todos os dias',
      description: 'Pizza todos os dias. Esfihas de segunda a quinta.',
    },
  ],
  orderSteps: [
    {
      title: 'Monte cada pizza',
      description: 'Escolha inteira ou meia a meia, o tamanho e adicione quantas pizzas quiser.',
    },
    {
      title: 'Revise o pedido',
      description: 'Veja o total estimado na barra inferior antes de enviar.',
    },
    {
      title: 'Envie no WhatsApp',
      description: 'Confirme endereço e pagamento direto com a Claudia Delivery.',
    },
  ],
  featuredPizzas: [
    {
      sectionId: 'bacon-alho',
      itemName: 'PORTUGUESA COMPLETA',
      tag: 'Clássica da casa',
      image:
        'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    },
    {
      sectionId: 'bacon-alho',
      itemName: 'FRANGOLINO',
      tag: 'Mais pedida',
      image:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    },
    {
      sectionId: 'queijos',
      itemName: '4 QUEIJOS',
      tag: 'Cremosa',
      image:
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    },
    {
      sectionId: 'carnes',
      itemName: 'COSTELA',
      tag: 'Premium',
      image:
        'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    },
  ],
  cardapioNota:
    'Meia a meia em Média, Grande e Família (valor do sabor mais caro). Pode misturar sabores de qualquer seção.',
  footer: {
    hours: 'Horário: 18:00 às 22:00.',
    area: SEO_ADDRESS.serviceNote,
    locationLabel: SEO_ADDRESS.display,
    instagramLabel: 'Instagram da Claudia Delivery',
    instagramHref: 'https://www.instagram.com/claudiaclementinodasilva/',
  },
} as const
