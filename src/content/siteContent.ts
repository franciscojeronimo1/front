/** Configuração geral de SEO/local. */
export const SEO_CITY = 'Santana do Jacaré'
export const SEO_STATE = 'MG'
export const SEO_COUNTRY = 'BR'
export const SEO_SITE_URL = 'https://pizzariadeliverysj.com'

export const SEO_OG_IMAGE = `${SEO_SITE_URL}/og-image.jpg`

export const SEO_OG_IMAGE_ALT =
  'Claudia Delivery — pizzaria em Santana do Jacaré, MG'

export const SEO_ADDRESS = {
  locality: SEO_CITY,
  region: SEO_STATE,
  country: SEO_COUNTRY,
  display: `${SEO_CITY}, ${SEO_STATE}`,
  serviceNote: 'Atendimento por delivery em Santana do Jacaré e região.',
} as const

export const WHATSAPP_PHONE_E164 = '5535999865637'
export const WHATSAPP_DISPLAY = '(35) 99865-5637'

export const whatsappPrefillMessages = {
  pedido: 'Olá! Vim pelo site da Claudia Delivery e quero fazer um pedido.',
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

export const siteContent = {
  brandName: 'Claudia Delivery',
  locationShort: 'Santana do Jacaré — MG',
  hero: {
    eyebrow: 'Pizza todos os dias • Esfihas de segunda a quinta',
    titleLead: 'Pizza e esfiha em ',
    titleAccent: 'Santana do Jacaré.',
    subtitle:
      'Escolha os sabores, monte o pedido e finalize pelo WhatsApp — simples e rápido.',
    cta: 'Ver cardápio',
  },
  /** Textos quando o site abre pelo QR na pizzaria (?local=1). */
  heroLocal: {
    eyebrow: 'Você está na pizzaria',
    titleLead: 'Nosso cardápio, ',
    titleAccent: 'na sua mesa.',
    subtitle:
      'Escolha com calma e peça ao garçom. Aqui é só para olhar sabores, preços e detalhes.',
    cta: 'Ver cardápio',
  },
  cardapio: {
    label: 'Cardápio',
    title: 'Escolha sem complicação',
    note: 'Tamanhos: pequena, média, grande e família. Meia a meia em média, grande e família (valor do sabor mais caro).',
    searchPlaceholder: 'Buscar sabor ou ingrediente',
    photoDisclaimer: 'Fotos das pizzas e esfihas são meramente ilustrativas.',
    localHint: 'Escolheu? Chame o garçom e faça o pedido na mesa.',
  },
  footer: {
    hours: 'Todos os dias, das 18h às 22h',
    esfihasNote: 'Esfihas: segunda a quinta',
    area: SEO_ADDRESS.serviceNote,
    locationLabel: SEO_ADDRESS.display,
    instagramLabel: 'Instagram da Claudia Delivery',
    instagramHref: 'https://www.instagram.com/claudiaclementinodasilva/',
  },
} as const

/** Link do QR único (todas as mesas) — gerar o código com esta URL. */
export const LOCAL_MENU_QR_URL = `${SEO_SITE_URL}/?local=1`