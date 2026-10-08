import { useMemo, useState } from 'react'
import { has3dModel, PORTUGUESA_COMPLETA_AR_MODEL } from '../content/arModels'
import { bebidas } from '../content/bebidas'
import {
  cardapioSecoes,
  formatPrecoBRL,
  type CardapioItem,
  type CardapioSecao,
  type SizePrices,
} from '../content/cardapio'
import { esfihaCombos, esfihaCustomPack, esfihasContent } from '../content/esfihas'
import { esfihaImageUrl, fallbackImage, pizzaImage } from '../content/menuImages'
import { siteContent } from '../content/siteContent'
import { useVisitMode } from '../context/VisitModeContext'
import { useOrder } from '../context/OrderContext'
import { ArViewerModal } from './ArViewerModal'

type FilterId =
  | 'todas'
  | 'novidades'
  | 'bacon-alho'
  | 'queijos'
  | 'carnes'
  | 'tradicionais'
  | 'vegetarianas'
  | 'esfihas'
  | 'bebidas'

type MenuRow =
  | {
      kind: 'pizza'
      key: string
      filterId: FilterId
      name: string
      description: string
      image: string
      startingPrice: number
      section: CardapioSecao
      item: CardapioItem
    }
  | {
      kind: 'esfiha'
      key: string
      filterId: 'esfihas'
      name: string
      description: string
      image: string
      price: number
      productId: string
    }
  | {
      kind: 'bebida'
      key: string
      filterId: 'bebidas'
      name: string
      description: string
      image: string
      fallbackImage: string
      price: number
      productId: string
    }

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'novidades', label: 'Novidades' },
  { id: 'bacon-alho', label: 'Bacon & alho' },
  { id: 'queijos', label: 'Queijos' },
  { id: 'carnes', label: 'Carnes' },
  { id: 'tradicionais', label: 'Tradicionais' },
  { id: 'vegetarianas', label: 'Vegetarianas' },
  { id: 'esfihas', label: 'Esfihas & combos' },
  { id: 'bebidas', label: 'Bebidas' },
]

function minPrice(prices: SizePrices): number {
  return Math.min(...prices)
}

function buildRows(): MenuRow[] {
  const pizzas: MenuRow[] = cardapioSecoes.flatMap((secao) =>
    secao.itens.map((item) => {
      const prices = item.prices ?? secao.faixaPreco
      return {
        kind: 'pizza' as const,
        key: `pizza-${secao.id}-${item.name}`,
        filterId: secao.id as FilterId,
        name: item.name,
        description: item.ingredients,
        image: pizzaImage(secao.id, item.name),
        startingPrice: prices ? minPrice(prices) : 0,
        section: secao,
        item,
      }
    })
  )

  const esfihas: MenuRow[] = [
    {
      kind: 'esfiha',
      key: `esfiha-${esfihaCustomPack.id}`,
      filterId: 'esfihas',
      name: esfihaCustomPack.name,
      description: esfihaCustomPack.description,
      image: esfihaImageUrl(esfihaCustomPack.id),
      price: esfihaCustomPack.price,
      productId: esfihaCustomPack.id,
    },
    ...esfihaCombos.map((combo) => ({
      kind: 'esfiha' as const,
      key: `esfiha-${combo.id}`,
      filterId: 'esfihas' as const,
      name: combo.name,
      description: combo.items.join(' + '),
      image: esfihaImageUrl(combo.id),
      price: combo.price,
      productId: combo.id,
    })),
  ]

  const drinks: MenuRow[] = bebidas.map((bebida) => ({
    kind: 'bebida',
    key: `bebida-${bebida.id}`,
    filterId: 'bebidas',
    name: bebida.name,
    description: bebida.description,
    image: bebida.image,
    fallbackImage: bebida.fallbackImage,
    price: bebida.price,
    productId: bebida.id,
  }))

  return [...pizzas, ...esfihas, ...drinks]
}

export function MenuDigital() {
  const { isLocal } = useVisitMode()
  const { openOrderModal, addSimple } = useOrder()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterId>('todas')
  const [arOpen, setArOpen] = useState(false)
  const rows = useMemo(() => buildRows(), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (filter === 'novidades') {
        if (row.kind !== 'pizza' || !row.item.novo) return false
      } else if (filter !== 'todas' && row.filterId !== filter) return false
      if (!q) return true
      return (
        row.name.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q)
      )
    })
  }, [rows, filter, query])

  return (
    <section id="cardapio" className="border-b border-cream/10 bg-night">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-tomato">
          {siteContent.cardapio.label}
        </p>
        <h2 className="mt-3 font-display text-3xl text-gold sm:text-5xl">
          {siteContent.cardapio.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-cream-muted sm:text-base">
          {siteContent.cardapio.note}
        </p>
        {isLocal ? (
          <p className="mt-3 rounded-2xl border border-gold/25 bg-gold/10 px-4 py-3 text-sm text-gold">
            {siteContent.cardapio.localHint}
          </p>
        ) : (
          <p className="mt-2 text-sm text-cream-muted">{esfihasContent.note}</p>
        )}

        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-cream/15 bg-night-elevated px-3.5 py-1.5 text-xs text-cream-muted">
          <InfoIcon />
          {siteContent.cardapio.photoDisclaimer}
        </p>

        <div className="mt-6">
          <label className="relative block">
            <span className="sr-only">Buscar</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream-muted">
              <SearchIcon />
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={siteContent.cardapio.searchPlaceholder}
              className="w-full rounded-2xl border border-cream/15 bg-night-elevated py-3.5 pl-11 pr-4 text-sm text-cream outline-none placeholder:text-cream-muted/70 focus:border-gold/50"
            />
          </label>
        </div>

        <div className="chips-scroll mt-5 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((chip) => {
            const active = filter === chip.id
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setFilter(chip.id)
                  if (chip.id === 'esfihas') {
                    document.getElementById('esfihas')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className={
                  active
                    ? 'shrink-0 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-night'
                    : 'shrink-0 rounded-full border border-cream/25 px-4 py-2 text-sm font-medium text-cream transition hover:border-cream/50'
                }
              >
                {chip.label}
              </button>
            )
          })}
        </div>

        <div id="esfihas" className="mt-10 grid gap-0 sm:grid-cols-2">
          {filtered.map((row) => {
            const show3d = row.kind === 'pizza' && has3dModel(row.name)
            const priceLabel =
              row.kind === 'pizza'
                ? `a partir de ${formatPrecoBRL(row.startingPrice)}`
                : formatPrecoBRL(row.price)

            return (
              <article
                key={row.key}
                className="animate-rise flex gap-4 border-b border-cream/10 py-5 pr-2 sm:px-2"
              >
                <img
                  src={row.image}
                  alt={row.name}
                  className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-24"
                  loading="lazy"
                  onError={(event) => {
                    const img = event.currentTarget
                    const fallback = row.kind === 'bebida' ? row.fallbackImage : fallbackImage
                    if (img.src !== fallback) img.src = fallback
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg leading-tight text-cream sm:text-xl">
                      {row.name}
                      {row.kind === 'pizza' && row.item.novo ? (
                        <span className="ml-2 inline-block rounded-full bg-tomato px-2 py-0.5 align-middle font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-cream">
                          Novo
                        </span>
                      ) : null}
                    </h3>
                    <p className="shrink-0 text-sm font-semibold text-gold">{priceLabel}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-cream-muted">{row.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {show3d ? (
                      <button
                        type="button"
                        onClick={() => setArOpen(true)}
                        className="text-xs font-semibold uppercase tracking-[0.12em] text-gold transition hover:text-gold-soft"
                      >
                        Ver
                      </button>
                    ) : null}
                    {!isLocal ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (row.kind === 'pizza') {
                            openOrderModal({
                              sectionId: row.section.id,
                              sectionLabel: row.section.subtitulo,
                              itemName: row.item.name,
                            })
                            return
                          }
                          addSimple({
                            productId: row.productId,
                            name: row.name,
                            description: row.description,
                            unitPrice: row.price,
                          })
                        }}
                        className="text-xs font-bold uppercase tracking-[0.14em] text-tomato transition hover:text-tomato-dark"
                      >
                        Adicionar +
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 text-center text-sm text-cream-muted">
            Nenhum item encontrado. Tente outro sabor ou filtro.
          </p>
        ) : null}
      </div>

      <ArViewerModal
        model={arOpen ? PORTUGUESA_COMPLETA_AR_MODEL : null}
        onClose={() => setArOpen(false)}
      />
    </section>
  )
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="shrink-0 text-gold">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  )
}
