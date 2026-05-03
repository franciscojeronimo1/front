/** Link internacional (wa.me). */
export const WHATSAPP_PHONE_E164 = '5535999865637'

/** Número exibido no site (contato). */
export const WHATSAPP_DISPLAY = '35 99865637'

export const whatsappPrefillMessages = {
  pedido:
    'Olá! Vim pelo site da Claudia Delivery e quero fazer um pedido.',
  cardápio:
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
    title: 'Pizza quentinha na sua porta',
    subtitle:
      'Cardápio completo abaixo — escolha o sabor, o tamanho e finalize seu pedido pelo WhatsApp.',
    ctaPrimary: 'Pedir no WhatsApp',
    ctaSecondary: 'Ver cardápio',
  },
  cardapioNota:
    'Valores conforme cardápio. Em caso de dúvida ou alteração, confirme diretamente no WhatsApp.',
  footer: {
    hours: 'Horário: 18:00 às 22:00.',
    area: 'Atendimento em Santana do Jacaré.',
    instagramLabel: 'Instagram da Claudia Delivery',
    instagramHref: 'https://www.instagram.com/claudiaclementinodasilva/',
  },
} as const
