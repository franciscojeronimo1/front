import {
  type CardapioItem,
  type CardapioSecao,
  type SizePrices,
  cardapioSecoes,
} from './cardapio'
import { esfihaCombos, esfihaCustomPack } from './esfihas'
import { SEO_SITE_URL } from './siteContent'

function minPrice(prices: SizePrices): number {
  return Math.min(...prices)
}

function itemStartingPrice(
  item: CardapioItem,
  secao: CardapioSecao
): number | undefined {
  if (item.prices) return minPrice(item.prices)
  if (secao.faixaPreco) return minPrice(secao.faixaPreco)
  return undefined
}

function menuItemSchema(item: CardapioItem, secao: CardapioSecao) {
  const price = itemStartingPrice(item, secao)

  return {
    '@type': 'MenuItem',
    name: item.name,
    description: item.ingredients,
    ...(price !== undefined
      ? {
          offers: {
            '@type': 'Offer',
            price: price.toFixed(2),
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  }
}

export function buildMenuSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${SEO_SITE_URL}/#cardapio`,
    name: 'Cardápio Claudia Delivery',
    inLanguage: 'pt-BR',
    hasMenuSection: [
      ...cardapioSecoes.map((secao) => ({
        '@type': 'MenuSection',
        name: secao.subtitulo,
        hasMenuItem: secao.itens.map((item) => menuItemSchema(item, secao)),
      })),
      {
        '@type': 'MenuSection',
        name: 'Esfihas',
        hasMenuItem: [
          {
            '@type': 'MenuItem',
            name: esfihaCustomPack.name,
            description: esfihaCustomPack.description,
            offers: {
              '@type': 'Offer',
              price: esfihaCustomPack.price.toFixed(2),
              priceCurrency: 'BRL',
              availability: 'https://schema.org/InStock',
            },
          },
          ...esfihaCombos.map((combo) => ({
            '@type': 'MenuItem',
            name: combo.name,
            description: combo.items.join(', '),
            offers: {
              '@type': 'Offer',
              price: combo.price.toFixed(2),
              priceCurrency: 'BRL',
              availability: 'https://schema.org/InStock',
            },
          })),
        ],
      },
    ],
  }
}
