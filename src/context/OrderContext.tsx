import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import type {
  CheckoutField,
  CheckoutInfo,
  OrderLineItem,
  PaymentMethod,
  PizzaOrderLine,
  PizzaRef,
  SimpleOrderLine,
} from '../types/order'
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
  checkout: CheckoutInfo
  updateCheckout: (patch: Partial<CheckoutInfo>) => void
  missingCheckoutFields: CheckoutField[]
  whatsappCheckoutHref: string
}

export const paymentLabels: Record<PaymentMethod, string> = {
  pix: 'Pix',
  cartao: 'Cartão',
  dinheiro: 'Dinheiro',
}

const emptyCheckout: CheckoutInfo = {
  name: '',
  fulfillment: 'entrega',
  street: '',
  neighborhood: '',
  reference: '',
  payment: '',
  changeFor: '',
}

export function getMissingCheckoutFields(checkout: CheckoutInfo): CheckoutField[] {
  const missing: CheckoutField[] = []
  if (!checkout.name.trim()) missing.push('name')
  if (checkout.fulfillment === 'entrega') {
    if (!checkout.street.trim()) missing.push('street')
  }
  if (!checkout.payment) missing.push('payment')
  return missing
}

function parseChangeFor(value: string): number | null {
  const n = Number(value.replace(/[^\d,.]/g, '').replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : null
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

function buildCheckoutLines(checkout: CheckoutInfo, total: number): string[] {
  const lines = [`*Nome:* ${checkout.name.trim()}`]

  if (checkout.fulfillment === 'retirada') {
    lines.push('*Retirada no local*')
  } else {
    const neighborhood = checkout.neighborhood.trim()
    lines.push(`*Entrega:* ${checkout.street.trim()}${neighborhood ? ` — ${neighborhood}` : ''}`)
    const reference = checkout.reference.trim()
    if (reference) lines.push(`*Referência:* ${reference}`)
  }

  if (checkout.payment === 'dinheiro') {
    const changeFor = parseChangeFor(checkout.changeFor)
    lines.push(
      changeFor && changeFor > total
        ? `*Pagamento:* Dinheiro (troco para ${formatPrecoBRL(changeFor)})`
        : '*Pagamento:* Dinheiro (sem troco)'
    )
  } else if (checkout.payment) {
    lines.push(`*Pagamento:* ${paymentLabels[checkout.payment]}`)
  }

  return lines
}

function buildWhatsAppMessage(
  items: OrderLineItem[],
  total: number,
  orderNote: string,
  checkout: CheckoutInfo
): string {
  const lines = items.flatMap((item, index) => {
    const base = `${index + 1}. ${formatLineDescription(item)} — ${formatPrecoBRL(item.price)}`
    const note = item.note?.trim()
    return note ? [base, `   Obs: ${note}`] : [base]
  })

  const generalNote = orderNote.trim()

  return [
    'Olá! Vim pelo site da Claudia Delivery e quero fazer um pedido:',
    '',
    ...lines,
    '',
    `*Total: ${formatPrecoBRL(total)}*`,
    '',
    ...buildCheckoutLines(checkout, total),
    ...(generalNote ? ['', `*Observações:* ${generalNote}`] : []),
  ].join('\n')
}

function lineUnitPrice(item: OrderLineItem): number {
  if (item.type === 'simple') return item.unitPrice
  return item.price / Math.max(item.quantity, 1)
}

const CART_STORAGE_KEY = 'claudia-delivery:pedido'
/** Carrinhos antigos são descartados para não reaproveitar preços desatualizados. */
const CART_MAX_AGE_MS = 12 * 60 * 60 * 1000

type StoredCart = { items: OrderLineItem[]; orderNote: string; savedAt: number }

function loadStoredCart(): StoredCart | null {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredCart>
    if (!Array.isArray(parsed.items) || typeof parsed.savedAt !== 'number') return null
    if (Date.now() - parsed.savedAt > CART_MAX_AGE_MS) {
      window.localStorage.removeItem(CART_STORAGE_KEY)
      return null
    }
    return {
      items: parsed.items,
      orderNote: typeof parsed.orderNote === 'string' ? parsed.orderNote : '',
      savedAt: parsed.savedAt,
    }
  } catch {
    return null
  }
}

function saveStoredCart(items: OrderLineItem[], orderNote: string) {
  try {
    if (items.length === 0 && !orderNote.trim()) {
      window.localStorage.removeItem(CART_STORAGE_KEY)
      return
    }
    const data: StoredCart = { items, orderNote, savedAt: Date.now() }
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Modo privado ou armazenamento cheio: o carrinho segue só na memória.
  }
}

const CHECKOUT_STORAGE_KEY = 'claudia-delivery:cliente'

function loadStoredCheckout(): CheckoutInfo {
  try {
    const raw = window.localStorage.getItem(CHECKOUT_STORAGE_KEY)
    if (!raw) return emptyCheckout
    const parsed = JSON.parse(raw) as Partial<CheckoutInfo>
    const merged = { ...emptyCheckout, ...parsed }
    return {
      ...merged,
      fulfillment: merged.fulfillment === 'retirada' ? 'retirada' : 'entrega',
      payment: merged.payment && merged.payment in paymentLabels ? merged.payment : '',
    }
  } catch {
    return emptyCheckout
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [storedCart] = useState(loadStoredCart)
  const [items, setItems] = useState<OrderLineItem[]>(() => storedCart?.items ?? [])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPizza, setSelectedPizza] = useState<PizzaRef | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [orderNote, setOrderNote] = useState(() => storedCart?.orderNote ?? '')

  const [checkout, setCheckout] = useState<CheckoutInfo>(loadStoredCheckout)

  useEffect(() => {
    saveStoredCart(items, orderNote)
  }, [items, orderNote])

  useEffect(() => {
    try {
      window.localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkout))
    } catch {
      // Sem armazenamento disponível: os dados valem só nesta visita.
    }
  }, [checkout])

  const updateCheckout = useCallback((patch: Partial<CheckoutInfo>) => {
    setCheckout((current) => ({ ...current, ...patch }))
  }, [])

  const missingCheckoutFields = useMemo(() => getMissingCheckoutFields(checkout), [checkout])

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
    const text = buildWhatsAppMessage(items, total, orderNote, checkout)
    return `https://wa.me/${WHATSAPP_PHONE_E164}?${new URLSearchParams({ text })}`
  }, [items, total, orderNote, checkout])

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
      checkout,
      updateCheckout,
      missingCheckoutFields,
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
      checkout,
      updateCheckout,
      missingCheckoutFields,
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
