import type { PizzaSizeId } from '../content/pizzaSizes'

export type PizzaRef = {
  sectionId: string
  sectionLabel: string
  itemName: string
}

export type PizzaOrderLine = {
  id: string
  type: 'pizza'
  kind: 'whole' | 'half'
  flavor1: PizzaRef
  flavor2?: PizzaRef
  size: PizzaSizeId
  price: number
  quantity: number
  note?: string
}

export type SimpleOrderLine = {
  id: string
  type: 'simple'
  productId: string
  name: string
  description?: string
  unitPrice: number
  price: number
  quantity: number
  note?: string
}

export type OrderLineItem = PizzaOrderLine | SimpleOrderLine

export type Fulfillment = 'entrega' | 'retirada'

export type PaymentMethod = 'pix' | 'cartao' | 'dinheiro'

export type CheckoutInfo = {
  name: string
  fulfillment: Fulfillment
  street: string
  neighborhood: string
  reference: string
  payment: PaymentMethod | ''
  /** Valor em reais para troco, só quando paga em dinheiro. */
  changeFor: string
}

export type CheckoutField = 'name' | 'street' | 'payment'
