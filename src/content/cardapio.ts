/**
 * Cardápio Claudia Delivery — conteúdo conforme material de referência.
 * Tamanhos: Pequena / Média / Grande / Família (valores na ordem).
 */

export type SizePrices = readonly [number, number, number, number]

export type CardapioItem = {
  name: string
  ingredients: string
  /** Quando a linha de preço é específica do sabor (ex.: Queijos). */
  prices?: SizePrices
  note?: string
}

export type CardapioSecao = {
  id: string
  /** Subtítulo estilo manuscrito (ex.: bacon/alho, queijos). */
  subtitulo: string
  /** Preço único para todos os sabores da seção, quando aplicável. */
  faixaPreco?: SizePrices
  itens: readonly CardapioItem[]
}

export const legendasTamanhos =
  'PEQUENA / MÉDIA / GRANDE / FAMÍLIA' as const

export function formatPrecoBRL(n: number): string {
  return `R$ ${n.toFixed(2).replace('.', ',')}`
}

export function formatFaixaPrecos(valores: SizePrices): string {
  return valores.map(formatPrecoBRL).join('  /  ')
}

export const cardapioSecoes: readonly CardapioSecao[] = [
  {
    id: 'bacon-alho',
    subtitulo: 'bacon/alho',
    faixaPreco: [45, 53, 60, 75],
    itens: [
      {
        name: 'PORTUGUESA COMPLETA',
        ingredients:
          'Molho vermelho, muçarela, presunto, bacon, calabresa, palmito, cebola, alho e milho.',
      },
      {
        name: 'FRANGOLINO',
        ingredients:
          'Molho branco, muçarela, frango, bacon, palmito, milho e catupiry.',
      },
      {
        name: 'BRÓCOLIS COM BACON',
        ingredients:
          'Molho vermelho, muçarela, brócolis, bacon e milho.',
      },
      {
        name: 'BACON COM PALMITO',
        ingredients: 'Molho vermelho, muçarela, bacon e palmito.',
      },
      {
        name: 'CANADENSE',
        ingredients:
          'Molho branco, muçarela, bacon, lombinho, palmito e cheddar.',
      },
    ],
  },
  {
    id: 'queijos',
    subtitulo: 'queijos',
    itens: [
      {
        name: '2 QUEIJOS',
        ingredients: 'Molho vermelho, muçarela e provolone.',
        prices: [38, 43, 48, 58],
      },
      {
        name: '3 QUEIJOS',
        ingredients: 'Molho vermelho, muçarela, provolone e parmesão.',
        prices: [40, 45, 50, 63],
      },
      {
        name: '4 QUEIJOS',
        ingredients:
          'Molho vermelho, muçarela, provolone, parmesão e catupiry.',
        prices: [43, 50, 58, 73],
      },
      {
        name: '5 QUEIJOS',
        ingredients:
          'Molho vermelho, muçarela, provolone, parmesão, catupiry e cheddar.',
        prices: [45, 55, 63, 78],
      },
      {
        name: '6 QUEIJOS',
        ingredients:
          'Molho vermelho, muçarela, provolone, parmesão, catupiry, cheddar, queijo prato e creme de queijo.',
        prices: [50, 60, 70, 85],
      },
    ],
  },
  {
    id: 'carnes',
    subtitulo: 'carnes',
    faixaPreco: [50, 65, 70, 95],
    itens: [
      {
        name: 'COSTELA',
        ingredients:
          'Molho vermelho, muçarela, barbecue, champignon, cebola caramelizada e costela.',
      },
      {
        name: 'CAMARÃO',
        ingredients:
          'Molho vermelho, muçarela, parmesão, especiarias, creme de queijo e camarão.',
      },
    ],
  },
  {
    id: 'tradicionais',
    subtitulo: 'tradicionais',
    faixaPreco: [45, 50, 55, 70],
    itens: [
      {
        name: 'MUÇARELA',
        ingredients: 'Molho vermelho, muçarela e tomate confit.',
      },
      {
        name: 'FRANGO',
        ingredients:
          'Molho branco, muçarela, milho, frango e catupiry.',
      },
      {
        name: 'CALABRESA',
        ingredients: 'Molho vermelho, muçarela, cebola e calabresa.',
      },
      {
        name: 'LOMBINHO',
        ingredients: 'Molho vermelho, muçarela, cebola e lombinho.',
      },
      {
        name: 'PORTUGUESA TRADICIONAL',
        ingredients:
          'Molho vermelho, muçarela, presunto, cebola e ovo.',
      },
      {
        name: 'MODA DA CASA',
        ingredients:
          'Molho vermelho, muçarela, presunto, frango, milho e calabresa.',
      },
    ],
  },
  {
    id: 'vegetarianas',
    subtitulo: 'vegetarianas',
    faixaPreco: [40, 48, 58, 70],
    itens: [
      {
        name: 'VEGANA',
        ingredients: 'Molho vermelho, alho-poró e muçarela.',
      },
      {
        name: 'BRÓCOLIS',
        ingredients:
          'Molho vermelho, muçarela, brócolis, tomate e catupiry.',
      },
      {
        name: 'ITALIANA',
        ingredients:
          'Molho vermelho, muçarela, alho frito, bacon, ovo, tomate e milho.',
        note: 'Contém bacon.',
      },
      {
        name: 'NAPOLITANA',
        ingredients: 'Molho vermelho, tomate, muçarela e alho frito.',
      },
      {
        name: 'PALMITO',
        ingredients:
          'Molho vermelho, muçarela, palmito, tomate e catupiry.',
      },
      {
        name: 'TOMATE SECO',
        ingredients:
          'Molho vermelho, muçarela, tomate seco e manjericão.',
      },
    ],
  },
] as const
