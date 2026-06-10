import type { PizzaSizeId } from '../content/pizzaSizes'

export type PizzaRef = {
  sectionId: string
  sectionLabel: string
  itemName: string
}

export type OrderLineItem = {
  id: string
  kind: 'whole' | 'half'
  flavor1: PizzaRef
  flavor2?: PizzaRef
  size: PizzaSizeId
  price: number
  note?: string
}
