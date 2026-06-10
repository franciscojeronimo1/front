import {
  type CardapioItem,
  type CardapioSecao,
  cardapioSecoes,
} from '../content/cardapio'
import { PIZZA_SIZES, type PizzaSizeId } from '../content/pizzaSizes'
import type { PizzaRef } from '../types/order'

export type PizzaCatalogEntry = PizzaRef & {
  item: CardapioItem
  secao: CardapioSecao
}

function sizeIndex(size: PizzaSizeId): number {
  return PIZZA_SIZES.find((entry) => entry.id === size)?.index ?? 0
}

export function getAllPizzas(): PizzaCatalogEntry[] {
  return cardapioSecoes.flatMap((secao) =>
    secao.itens.map((item) => ({
      sectionId: secao.id,
      sectionLabel: secao.subtitulo,
      itemName: item.name,
      item,
      secao,
    }))
  )
}

export function findPizza(ref: Pick<PizzaRef, 'sectionId' | 'itemName'>): PizzaCatalogEntry | null {
  const secao = cardapioSecoes.find((section) => section.id === ref.sectionId)
  const item = secao?.itens.find((pizza) => pizza.name === ref.itemName)
  if (!secao || !item) return null

  return {
    sectionId: secao.id,
    sectionLabel: secao.subtitulo,
    itemName: item.name,
    item,
    secao,
  }
}

export function getItemPriceAtSize(
  item: CardapioItem,
  secao: CardapioSecao,
  size: PizzaSizeId
): number {
  const prices = item.prices ?? secao.faixaPreco
  if (!prices) return 0
  return prices[sizeIndex(size)]
}

export function calculateWholePrice(flavor: PizzaRef, size: PizzaSizeId): number {
  const pizza = findPizza(flavor)
  if (!pizza) return 0
  return getItemPriceAtSize(pizza.item, pizza.secao, size)
}

export function calculateHalfPrice(
  flavor1: PizzaRef,
  flavor2: PizzaRef,
  size: PizzaSizeId
): number {
  const price1 = calculateWholePrice(flavor1, size)
  const price2 = calculateWholePrice(flavor2, size)
  return Math.max(price1, price2)
}

export function calculateLinePrice(
  kind: 'whole' | 'half',
  flavor1: PizzaRef,
  flavor2: PizzaRef | undefined,
  size: PizzaSizeId
): number {
  if (kind === 'whole') return calculateWholePrice(flavor1, size)
  if (!flavor2) return 0
  return calculateHalfPrice(flavor1, flavor2, size)
}
