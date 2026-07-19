import { formatPrecoBRL } from './cardapio'
import { WHATSAPP_PHONE_E164 } from './siteContent'

export type EsfihaCombo = {
  id: string
  name: string
  items: readonly string[]
  price: number
}

/** Combos conforme cardápio da Esfiharia da Cláudia Delivery. */
export const esfihaCombos: readonly EsfihaCombo[] = [
  {
    id: 'combo-1',
    name: 'Combo 1',
    items: ['10 Carne', '10 Mussarela'],
    price: 75,
  },
  {
    id: 'combo-2',
    name: 'Combo 2',
    items: ['10 Carne', '5 Calabresa', '5 Mussarela'],
    price: 75,
  },
  {
    id: 'combo-3',
    name: 'Combo 3',
    items: ['5 Carne', '5 Queijo', '5 Calabresa', '5 Frango com cheddar'],
    price: 85,
  },
  {
    id: 'combo-4',
    name: 'Combo 4',
    items: ['4 Camarão', '4 Calabresa', '4 Mussarela', '4 Frango'],
    price: 65,
  },
  {
    id: 'combo-5',
    name: 'Combo 5',
    items: ['5 Brócolis', '5 Mussarela', '10 Carne'],
    price: 75,
  },
] as const

/** Opção avulsa: 10 esfihas com sabores à escolha. */
export const esfihaCustomPack = {
  id: 'dez-sabores',
  name: '10 sabores à escolha',
  description:
    'Escolha 10 esfihas nos sabores que preferir — carne, mussarela, calabresa, frango, brócolis e mais.',
  price: 40,
  quantity: 10,
} as const

export const esfihasContent = {
  title: 'Esfihas e combos',
  subtitle: 'Esfiharia da Cláudia Delivery',
  note: 'Entrega de esfihas de segunda a quinta. Peça pelo WhatsApp e confirme sabores e endereço.',
  deliveryDays: 'Segunda a quinta',
} as const

export function esfihaComboWhatsAppHref(combo: EsfihaCombo): string {
  const sabores = combo.items.join(', ')
  const text = [
    'Olá! Vim pelo site da Claudia Delivery e quero pedir esfiha:',
    '',
    `*${combo.name}* — ${sabores}`,
    `Valor: ${formatPrecoBRL(combo.price)}`,
    '',
    'Endereço e forma de pagamento envio na sequência.',
  ].join('\n')

  return `https://wa.me/${WHATSAPP_PHONE_E164}?${new URLSearchParams({ text })}`
}

export function esfihaCustomPackWhatsAppHref(): string {
  const text = [
    'Olá! Vim pelo site da Claudia Delivery e quero pedir esfiha:',
    '',
    `*${esfihaCustomPack.name}* — ${esfihaCustomPack.quantity} unidades`,
    `Valor: ${formatPrecoBRL(esfihaCustomPack.price)}`,
    '',
    'Meus sabores à escolha:',
    '(escreva aqui os sabores)',
    '',
    'Endereço e forma de pagamento envio na sequência.',
  ].join('\n')

  return `https://wa.me/${WHATSAPP_PHONE_E164}?${new URLSearchParams({ text })}`
}
