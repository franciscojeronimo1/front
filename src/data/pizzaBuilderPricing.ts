/**
 * Configuração de preços do Monte sua pizza — Claudia Delivery
 * 
 * CENTRALIZE AQUI os valores de tamanhos, ingredientes premium e bordas.
 * Todos os valores em reais (R$).
 * 
 * REGRAS DE PREÇO:
 * - Base do tamanho já inclui massa + molho vermelho + muçarela
 * - Apenas 3 ingredientes têm preço adicional: costela, calabresa ralada e camarão
 * - Todos os outros ingredientes são INCLUSOS (preço R$ 0)
 * - Cada tamanho tem um TETO (valor máximo da pizza base + adicionais)
 * - Borda recheada é cobrada SEPARADAMENTE (não conta no teto)
 * - No meio a meia, o premium de cada metade é cobrado pela metade
 */

// ============================================================
// TAMANHOS E BASES
// ============================================================

export type PizzaSizeId = 'pequena' | 'media' | 'grande' | 'familia'

export interface SizePricing {
  /** Preço base (massa + molho + muçarela) */
  base: number
  /** Preço máximo permitido (base + adicionais premium) */
  ceiling: number
}

export const SIZE_PRICING: Record<PizzaSizeId, SizePricing> = {
  pequena: {
    base: 40,
    ceiling: 48,
  },
  media: {
    base: 50,
    ceiling: 58,
  },
  grande: {
    base: 60,
    ceiling: 70,
  },
  familia: {
    base: 72,
    ceiling: 84,
  },
}

// ============================================================
// INGREDIENTES PREMIUM
// ============================================================

/**
 * APENAS estes 3 ingredientes têm custo adicional.
 * Todos os outros ingredientes são INCLUSOS e não cobram nada.
 */
export const PREMIUM_INGREDIENTS: Record<string, number> = {
  costela: 4,
  'calabresa-ralada': 2,
  camarao: 4,
}

/**
 * Retorna o preço adicional de um ingrediente para o tamanho Grande.
 * Todos os ingredientes não listados em PREMIUM_INGREDIENTS custam R$ 0.
 */
export function getIngredientPrice(ingredientId: string): number {
  return PREMIUM_INGREDIENTS[ingredientId] ?? 0
}

// ============================================================
// BORDA RECHEADA
// ============================================================

export type CrustId = 'none' | 'catupiry' | 'cheddar'

export interface CrustOption {
  id: CrustId
  label: string
  /** Preço por tamanho (null = sem custo adicional) */
  pricing: Record<PizzaSizeId, number> | null
}

export const CRUST_OPTIONS: CrustOption[] = [
  {
    id: 'none',
    label: 'Sem borda',
    pricing: null, // sem custo
  },
  {
    id: 'catupiry',
    label: 'Borda de catupiry',
    pricing: {
      pequena: 7,
      media: 8,
      grande: 8,
      familia: 10,
    },
  },
  {
    id: 'cheddar',
    label: 'Borda de cheddar',
    pricing: {
      pequena: 8,
      media: 9,
      grande: 9,
      familia: 11,
    },
  },
]

/**
 * Retorna o preço da borda recheada para o tamanho especificado.
 */
export function getCrustPrice(crustId: CrustId, size: PizzaSizeId): number {
  const crust = CRUST_OPTIONS.find((c) => c.id === crustId)
  if (!crust || !crust.pricing) return 0
  return crust.pricing[size] ?? 0
}

// ============================================================
// CÁLCULO DE PREÇO FINAL
// ============================================================

/**
 * Fator aplicado aos ingredientes premium no modo meio a meia.
 * Cada metade cobra metade do valor do premium.
 */
export const HALF_EXTRA_FACTOR = 0.5

/**
 * Calcula o preço de uma pizza montada.
 * 
 * @param size Tamanho da pizza
 * @param mode 'inteira' ou 'meia' (meio a meia)
 * @param selectedWhole Ingredientes da pizza inteira (se mode = 'inteira')
 * @param selectedHalf1 Ingredientes da metade 1 (se mode = 'meia')
 * @param selectedHalf2 Ingredientes da metade 2 (se mode = 'meia')
 * @param crust ID da borda recheada
 * @returns Preço total em reais
 */
export function calculateBuilderPrice(
  size: PizzaSizeId,
  mode: 'inteira' | 'meia',
  selectedWhole: Set<string>,
  selectedHalf1: Set<string>,
  selectedHalf2: Set<string>,
  crust: CrustId
): number {
  const pricing = SIZE_PRICING[size]
  let pizzaPrice = pricing.base

  if (mode === 'inteira') {
    // Modo inteira: soma os preços dos premium
    for (const ingredientId of selectedWhole) {
      pizzaPrice += getIngredientPrice(ingredientId)
    }
  } else {
    // Modo meio a meia: soma cada metade com o fator 0.5
    for (const ingredientId of selectedHalf1) {
      pizzaPrice += getIngredientPrice(ingredientId) * HALF_EXTRA_FACTOR
    }
    for (const ingredientId of selectedHalf2) {
      pizzaPrice += getIngredientPrice(ingredientId) * HALF_EXTRA_FACTOR
    }
  }

  // Aplicar o teto (máximo permitido)
  if (pizzaPrice > pricing.ceiling) {
    pizzaPrice = pricing.ceiling
  }

  // Adicionar borda recheada (não conta no teto)
  const crustPrice = getCrustPrice(crust, size)

  return pizzaPrice + crustPrice
}
