/**
 * Dados dos ingredientes para o Monte sua pizza
 * 
 * Baseado no protótipo aprovado pelo dono, com 27 pizzas do cardápio.
 */

export type IngredientCategory =
  | 'Molho'
  | 'Queijos'
  | 'Carnes'
  | 'Vegetais'
  | 'Toque final'

export interface Ingredient {
  id: string
  name: string
  cat: IngredientCategory
  /** Base = não conta no limite de 6 adicionais */
  base?: boolean
  /** Grupo exclusivo (ex.: só um molho por vez) */
  group?: string
  /** Tipo de molho (red/white) */
  sauce?: 'red' | 'white'
  /** Tipo especial (cheese = muçarela) */
  kind?: 'cheese'
  /** Ativado por padrão */
  defaultOn?: boolean
  /** Número de pedaços que caem (para animação) */
  count?: number
  /** Tamanho dos pedaços em % da pizza */
  size?: number
  /** Caminho do swatch (miniatura) */
  swatch?: string
}

export const INGREDIENTS: Ingredient[] = [
  // Molhos (base, não contam no limite)
  {
    id: 'molho-vermelho',
    name: 'Molho vermelho',
    cat: 'Molho',
    base: true,
    group: 'sauce',
    sauce: 'red',
    defaultOn: true,
    swatch: '/pizza-builder/assets/base/sauce-red.png',
  },
  {
    id: 'molho-branco',
    name: 'Molho branco',
    cat: 'Molho',
    base: true,
    group: 'sauce',
    sauce: 'white',
    swatch: '/pizza-builder/assets/base/sauce-white.png',
  },

  // Muçarela (base, não conta no limite)
  {
    id: 'mucarela',
    name: 'Muçarela',
    cat: 'Queijos',
    base: true,
    kind: 'cheese',
    defaultOn: true,
    swatch: '/pizza-builder/assets/base/cheese.png',
  },

  // Queijos
  {
    id: 'catupiry',
    name: 'Catupiry',
    cat: 'Queijos',
    count: 7,
    size: 11,
  },
  {
    id: 'cheddar',
    name: 'Cheddar',
    cat: 'Queijos',
    count: 6,
    size: 11,
  },
  {
    id: 'provolone',
    name: 'Provolone',
    cat: 'Queijos',
    count: 6,
    size: 11,
  },
  {
    id: 'parmesao',
    name: 'Parmesão',
    cat: 'Queijos',
    count: 3,
    size: 20,
  },
  {
    id: 'queijo-prato',
    name: 'Queijo prato',
    cat: 'Queijos',
    count: 5,
    size: 12,
  },
  {
    id: 'creme-de-queijo',
    name: 'Creme de queijo',
    cat: 'Queijos',
    count: 6,
    size: 11,
  },

  // Carnes
  {
    id: 'calabresa',
    name: 'Calabresa',
    cat: 'Carnes',
    count: 8,
    size: 13,
  },
  {
    id: 'calabresa-ralada',
    name: 'Calabresa ralada',
    cat: 'Carnes',
    count: 5,
    size: 16,
  },
  {
    id: 'bacon',
    name: 'Bacon',
    cat: 'Carnes',
    count: 7,
    size: 16,
  },
  {
    id: 'frango',
    name: 'Frango',
    cat: 'Carnes',
    count: 7,
    size: 15,
  },
  {
    id: 'presunto',
    name: 'Presunto',
    cat: 'Carnes',
    count: 6,
    size: 15,
  },
  {
    id: 'lombinho',
    name: 'Lombinho',
    cat: 'Carnes',
    count: 6,
    size: 15,
  },
  {
    id: 'costela',
    name: 'Costela',
    cat: 'Carnes',
    count: 6,
    size: 15,
  },
  {
    id: 'camarao',
    name: 'Camarão',
    cat: 'Carnes',
    count: 6,
    size: 13,
  },

  // Vegetais
  {
    id: 'cebola',
    name: 'Cebola',
    cat: 'Vegetais',
    count: 7,
    size: 13,
  },
  {
    id: 'cebola-caramelizada',
    name: 'Cebola caramelizada',
    cat: 'Vegetais',
    count: 7,
    size: 16,
  },
  {
    id: 'milho',
    name: 'Milho',
    cat: 'Vegetais',
    count: 9,
    size: 8,
  },
  {
    id: 'tomate',
    name: 'Tomate',
    cat: 'Vegetais',
    count: 6,
    size: 12,
  },
  {
    id: 'tomate-seco',
    name: 'Tomate seco',
    cat: 'Vegetais',
    count: 6,
    size: 12,
  },
  {
    id: 'tomate-confit',
    name: 'Tomate confit',
    cat: 'Vegetais',
    count: 5,
    size: 12,
  },
  {
    id: 'brocolis',
    name: 'Brócolis',
    cat: 'Vegetais',
    count: 6,
    size: 12,
  },
  {
    id: 'palmito',
    name: 'Palmito',
    cat: 'Vegetais',
    count: 6,
    size: 11,
  },
  {
    id: 'azeitona',
    name: 'Azeitona',
    cat: 'Vegetais',
    count: 8,
    size: 8,
  },
  {
    id: 'abacaxi',
    name: 'Abacaxi',
    cat: 'Vegetais',
    count: 5,
    size: 12,
  },
  {
    id: 'champignon',
    name: 'Champignon',
    cat: 'Vegetais',
    count: 6,
    size: 12,
  },

  // Toque final
  {
    id: 'alho-frito',
    name: 'Alho frito',
    cat: 'Toque final',
    count: 10,
    size: 7,
  },
  {
    id: 'ovo',
    name: 'Ovo',
    cat: 'Toque final',
    count: 5,
    size: 13,
  },
  {
    id: 'barbecue',
    name: 'Barbecue',
    cat: 'Toque final',
    count: 2,
    size: 28,
  },
]

/**
 * Combinações de ingredientes das 27 pizzas do cardápio.
 * Usadas para sugestões inteligentes baseadas no que o cliente já escolheu.
 */
export const MENU_COMBOS: string[][] = [
  ['presunto', 'bacon', 'calabresa', 'palmito', 'cebola', 'alho-frito', 'milho'],
  ['frango', 'bacon', 'palmito', 'milho', 'catupiry'],
  ['brocolis', 'bacon', 'milho'],
  ['bacon', 'palmito'],
  ['bacon', 'lombinho', 'palmito', 'cheddar'],
  ['provolone'],
  ['provolone', 'parmesao'],
  ['provolone', 'parmesao', 'catupiry'],
  ['provolone', 'parmesao', 'catupiry', 'cheddar'],
  ['provolone', 'parmesao', 'catupiry', 'cheddar', 'queijo-prato', 'creme-de-queijo'],
  ['barbecue', 'champignon', 'cebola-caramelizada', 'costela'],
  ['parmesao', 'creme-de-queijo', 'camarao'],
  ['calabresa-ralada', 'cebola'],
  ['tomate-confit'],
  ['milho', 'frango', 'catupiry'],
  ['cebola', 'calabresa'],
  ['cebola', 'lombinho'],
  ['presunto', 'cebola', 'ovo'],
  ['presunto', 'frango', 'milho', 'calabresa'],
  ['lombinho', 'abacaxi', 'creme-de-queijo'],
  ['tomate', 'cebola', 'milho', 'azeitona'],
  ['brocolis', 'tomate', 'catupiry'],
  ['alho-frito', 'bacon', 'ovo', 'tomate', 'milho'],
  ['tomate', 'alho-frito'],
  ['palmito', 'tomate', 'catupiry'],
  ['tomate-seco'],
]

/** Mapa de ingredientes por ID para acesso rápido */
export const INGREDIENTS_BY_ID = Object.fromEntries(
  INGREDIENTS.map((i) => [i.id, i])
)

/** IDs dos ingredientes padrão (ativados automaticamente) */
export const DEFAULT_INGREDIENT_IDS = INGREDIENTS.filter((i) => i.defaultOn).map(
  (i) => i.id
)

/** Tamanhos que permitem meio a meia */
export const HALF_ALLOWED_SIZES = new Set(['media', 'grande', 'familia'])

/** Limite máximo de adicionais (não conta molho e muçarela) */
export const MAX_EXTRAS = 6
