export const PIZZA_SIZES = [
  { id: 'pequena', label: 'Pequena', index: 0, halfAllowed: false },
  { id: 'media', label: 'Média', index: 1, halfAllowed: true },
  { id: 'grande', label: 'Grande', index: 2, halfAllowed: true },
  { id: 'familia', label: 'Família', index: 3, halfAllowed: true },
] as const

export type PizzaSizeId = (typeof PIZZA_SIZES)[number]['id']

export function pizzaSizeLabel(id: PizzaSizeId): string {
  return PIZZA_SIZES.find((size) => size.id === id)?.label ?? id
}

export function isHalfAllowedSize(id: PizzaSizeId): boolean {
  return PIZZA_SIZES.find((size) => size.id === id)?.halfAllowed ?? false
}

export function defaultSizeForKind(kind: 'whole' | 'half'): PizzaSizeId {
  return kind === 'half' ? 'media' : 'media'
}
