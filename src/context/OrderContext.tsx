import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { formatPrecoBRL } from '../content/cardapio'
import {
  defaultSizeForKind,
  isHalfAllowedSize,
  pizzaSizeLabel,
  type PizzaSizeId,
} from '../content/pizzaSizes'
import { WHATSAPP_PHONE_E164 } from '../content/siteContent'
import type { OrderLineItem, PizzaRef } from '../types/order'
import { calculateLinePrice } from '../utils/pizzaPricing'

type OrderContextValue = {
  items: OrderLineItem[]
  modalOpen: boolean
  selectedPizza: PizzaRef | null
  cartOpen: boolean
  orderNote: string
  total: number
  itemCount: number
  openOrderModal: (pizza: PizzaRef) => void
  closeOrderModal: () => void
  setCartOpen: (open: boolean) => void
  setOrderNote: (note: string) => void
  addItem: (item: Omit<OrderLineItem, 'id' | 'price'> & { price?: number }) => void
  removeItem: (id: string) => void
  clearCart: () => void
  whatsappCheckoutHref: string
}

const OrderContext = createContext<OrderContextValue | null>(null)

function formatLineDescription(item: OrderLineItem): string {
  const size = pizzaSizeLabel(item.size)

  if (item.kind === 'whole') {
    return `Pizza inteira *${item.flavor1.itemName}* (${item.flavor1.sectionLabel}) — ${size}`
  }

  const second = item.flavor2
  if (!second) return `Pizza meia a meia — ${size}`

  return `Pizza meia a meia *${item.flavor1.itemName}* (${item.flavor1.sectionLabel}) + *${second.itemName}* (${second.sectionLabel}) — ${size}`
}

function buildWhatsAppMessage(
  items: OrderLineItem[],
  total: number,
  orderNote: string
): string {
  const lines = items.flatMap((item, index) => {
    const base = `${index + 1}. ${formatLineDescription(item)} — ${formatPrecoBRL(item.price)}`
    const note = item.note?.trim()
    return note ? [base, `   Obs: ${note}`] : [base]
  })

  const generalNote = orderNote.trim()
  const footer = [
    '',
    `*Total estimado: ${formatPrecoBRL(total)}*`,
    ...(generalNote ? ['', `*Observações do pedido:* ${generalNote}`] : []),
    '',
    'Endereço e forma de pagamento envio na sequência.',
  ]

  return ['Olá! Vim pelo site da Claudia Delivery e quero fazer um pedido:', '', ...lines, ...footer].join(
    '\n'
  )
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderLineItem[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPizza, setSelectedPizza] = useState<PizzaRef | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [orderNote, setOrderNote] = useState('')

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  )

  const openOrderModal = useCallback((pizza: PizzaRef) => {
    setSelectedPizza(pizza)
    setModalOpen(true)
  }, [])

  const closeOrderModal = useCallback(() => {
    setModalOpen(false)
    setSelectedPizza(null)
  }, [])

  const addItem = useCallback(
    (draft: Omit<OrderLineItem, 'id' | 'price'> & { price?: number }) => {
      const price =
        draft.price ??
        calculateLinePrice(draft.kind, draft.flavor1, draft.flavor2, draft.size)

      setItems((current) => [
        ...current,
        {
          ...draft,
          id: crypto.randomUUID(),
          price,
        },
      ])
      setCartOpen(true)
      closeOrderModal()
    },
    [closeOrderModal]
  )

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setOrderNote('')
    setCartOpen(false)
  }, [])

  const whatsappCheckoutHref = useMemo(() => {
    const text = buildWhatsAppMessage(items, total, orderNote)
    return `https://wa.me/${WHATSAPP_PHONE_E164}?${new URLSearchParams({ text })}`
  }, [items, total, orderNote])

  const value = useMemo(
    () => ({
      items,
      modalOpen,
      selectedPizza,
      cartOpen,
      orderNote,
      total,
      itemCount: items.length,
      openOrderModal,
      closeOrderModal,
      setCartOpen,
      setOrderNote,
      addItem,
      removeItem,
      clearCart,
      whatsappCheckoutHref,
    }),
    [
      items,
      modalOpen,
      selectedPizza,
      cartOpen,
      orderNote,
      total,
      openOrderModal,
      closeOrderModal,
      addItem,
      removeItem,
      clearCart,
      whatsappCheckoutHref,
    ]
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder deve ser usado dentro de OrderProvider')
  }
  return context
}

export { formatLineDescription, isHalfAllowedSize, defaultSizeForKind }
export type { PizzaSizeId }
