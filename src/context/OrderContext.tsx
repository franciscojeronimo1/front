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
import type { OrderLineItem, PizzaOrderLine, PizzaRef, SimpleOrderLine } from '../types/order'
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
  toggleCart: () => void
  setOrderNote: (note: string) => void
  addPizza: (item: Omit<PizzaOrderLine, 'id' | 'price' | 'type' | 'quantity'> & { quantity?: number }) => void
  addSimple: (item: {
    productId: string
    name: string
    description?: string
    unitPrice: number
    quantity?: number
  }) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  whatsappCheckoutHref: string
}

const OrderContext = createContext<OrderContextValue | null>(null)

export function formatLineDescription(item: OrderLineItem): string {
  if (item.type === 'simple') {
    const qty = item.quantity > 1 ? `${item.quantity}x ` : ''
    return `${qty}${item.name}${item.description ? ` — ${item.description}` : ''}`
  }

  const size = pizzaSizeLabel(item.size)
  const qty = item.quantity > 1 ? `${item.quantity}x ` : ''

  if (item.kind === 'whole') {
    return `${qty}Pizza inteira *${item.flavor1.itemName}* (${item.flavor1.sectionLabel}) — ${size}`
  }

  const second = item.flavor2
  if (!second) return `${qty}Pizza meia a meia — ${size}`

  return `${qty}Pizza meia a meia *${item.flavor1.itemName}* (${item.flavor1.sectionLabel}) + *${second.itemName}* (${second.sectionLabel}) — ${size}`
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

  return [
    'Olá! Vim pelo site da Claudia Delivery e quero fazer um pedido:',
    '',
    ...lines,
    ...footer,
  ].join('\n')
}

function lineUnitPrice(item: OrderLineItem): number {
  if (item.type === 'simple') return item.unitPrice
  return item.price / Math.max(item.quantity, 1)
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

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
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

  const toggleCart = useCallback(() => {
    setCartOpen((open) => !open)
  }, [])

  const addPizza = useCallback(
    (
      draft: Omit<PizzaOrderLine, 'id' | 'price' | 'type' | 'quantity'> & {
        quantity?: number
      }
    ) => {
      const quantity = draft.quantity ?? 1
      const unit = calculateLinePrice(
        draft.kind,
        draft.flavor1,
        draft.flavor2,
        draft.size
      )

      setItems((current) => [
        ...current,
        {
          ...draft,
          type: 'pizza',
          id: crypto.randomUUID(),
          quantity,
          price: unit * quantity,
        },
      ])
      setCartOpen(true)
      closeOrderModal()
    },
    [closeOrderModal]
  )

  const addSimple = useCallback(
    (draft: {
      productId: string
      name: string
      description?: string
      unitPrice: number
      quantity?: number
    }) => {
      const quantity = draft.quantity ?? 1
      setItems((current) => {
        const existing = current.find(
          (item): item is SimpleOrderLine =>
            item.type === 'simple' && item.productId === draft.productId
        )
        if (existing) {
          return current.map((item) => {
            if (item.id !== existing.id || item.type !== 'simple') return item
            const nextQty = item.quantity + quantity
            return {
              ...item,
              quantity: nextQty,
              price: item.unitPrice * nextQty,
            }
          })
        }

        return [
          ...current,
          {
            type: 'simple' as const,
            id: crypto.randomUUID(),
            productId: draft.productId,
            name: draft.name,
            description: draft.description,
            unitPrice: draft.unitPrice,
            quantity,
            price: draft.unitPrice * quantity,
          },
        ]
      })
      setCartOpen(true)
    },
    []
  )

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((item) => item.id !== id))
      return
    }

    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        const unit = lineUnitPrice(item)
        return { ...item, quantity, price: unit * quantity }
      })
    )
  }, [])

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
      itemCount,
      openOrderModal,
      closeOrderModal,
      setCartOpen,
      toggleCart,
      setOrderNote,
      addPizza,
      addSimple,
      updateQuantity,
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
      itemCount,
      openOrderModal,
      closeOrderModal,
      toggleCart,
      addPizza,
      addSimple,
      updateQuantity,
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

export { isHalfAllowedSize, defaultSizeForKind }
export type { PizzaSizeId }
