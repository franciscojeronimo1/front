import { useEffect, useMemo, useState } from 'react'
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
import { loadModelViewer } from '../utils/loadModelViewer'
import { MENU_FILTER_EVENT, type MenuFilterTarget } from '../utils/menuNavigation'
import { smoothScrollTo } from '../utils/smoothScrollTo'
import { ArViewerModal } from './ArViewerModal'
import { Reveal } from './Reveal'
import { PizzaBuilderModal } from './PizzaBuilder/PizzaBuilderModal'

type FilterId =
  | 'todas'
  | 'mais-pedidas'
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
  { id: 'mais-pedidas', label: 'Mais pedidas' },
  { id: 'novidades', label: 'Novidades' },
  { id: 'bacon-alho', label: 'Bacon & alho' },
  { id: 'queijos', label: 'Queijos' },
  { id: 'carnes', label: 'Carnes' },
  { id: 'tradicionais', label: 'Tradicionais' },
  { id: 'vegetarianas', label: 'Vegetarianas' },
  { id: 'esfihas', label: 'Esfihas' },
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
  const [builderOpen, setBuilderOpen] = useState(false)
  const rows = useMemo(() => buildRows(), [])

  useEffect(() => {
    const scrollToFilters = (target: MenuFilterTarget) => {
      const row = document.getElementById('cardapio-filtros')
      if (!row) return
      smoothScrollTo(row, { offset: -88 })
      const chip = row.querySelector<HTMLElement>(`[data-filter="${target}"]`)
      if (chip) row.scrollLeft = chip.offsetLeft - row.offsetLeft - 16
    }

    const onSelect = (event: Event) => {
      const target = (event as CustomEvent<MenuFilterTarget>).detail
      setFilter(target)
      setQuery('')
      requestAnimationFrame(() => scrollToFilters(target))
    }

    window.addEventListener(MENU_FILTER_EVENT, onSelect)
    if (window.location.hash === '#esfihas') {
      setFilter('esfihas')
      requestAnimationFrame(() => scrollToFilters('esfihas'))
    }
    return () => window.removeEventListener(MENU_FILTER_EVENT, onSelect)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (filter === 'mais-pedidas') {
        if (row.kind !== 'pizza' || !row.item.maisPedido) return false
      } else if (filter === 'novidades') {
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
    <section id="cardapio" className="relative border-b border-cream/10 bg-night">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-night-elevated/50 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-tomato">
            {siteContent.cardapio.label}
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-cream sm:text-5xl">
            {siteContent.cardapio.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream-muted sm:text-base">
            {siteContent.cardapio.note}
          </p>
          {isLocal ? (
            <p className="mt-3 rounded-2xl border border-gold/25 bg-gold/10 px-4 py-3 text-sm text-gold">
              {siteContent.cardapio.localHint}
            </p>
          ) : (
            <p className="mt-2 text-sm text-cream-muted">{esfihasContent.note}</p>
          )}

          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-cream/15 bg-night-elevated/80 px-3.5 py-1.5 text-xs text-cream-muted backdrop-blur-sm">
            <InfoIcon />
            {siteContent.cardapio.photoDisclaimer}
          </p>
        </Reveal>

        <div className="sticky top-[3.6rem] z-30 -mx-4 mt-8 border-y border-cream/10 bg-night/90 px-4 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5">
          <label className="relative block">
            <span className="sr-only">Buscar</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream-muted">
              <SearchIcon />
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={siteContent.cardapio.searchPlaceholder}
              className="w-full rounded-2xl border border-cream/15 bg-night-elevated py-3.5 pl-11 pr-4 text-base text-cream outline-none transition placeholder:text-cream-muted/70 focus:border-gold/50 focus:shadow-[0_0_0_3px_rgb(217_164_65_/_0.12)] sm:text-sm"
            />
          </label>

          <div className="relative mt-3">
            <div
              id="cardapio-filtros"
              className="chips-scroll flex scroll-mt-28 gap-2 overflow-x-auto overscroll-x-contain pb-0.5 pe-10"
              data-lenis-prevent
            >
              {FILTERS.map((chip) => {
                const active = filter === chip.id
                return (
                  <button
                    key={chip.id}
                    type="button"
                    data-filter={chip.id}
                    onClick={() => {
                      setFilter(chip.id)
                      if (chip.id === 'esfihas') {
                        const row = document.getElementById('cardapio-filtros')
                        if (row) smoothScrollTo(row, { offset: -88 })
                      }
                    }}
                    className={
                      active
                        ? 'shrink-0 rounded-full bg-cream px-3.5 py-2 text-sm font-semibold text-night shadow-[0_8px_24px_-12px_rgb(244_232_216_/_0.55)]'
                        : 'shrink-0 rounded-full border border-cream/20 px-3.5 py-2 text-sm font-medium text-cream/90 transition hover:border-cream/45 hover:bg-cream/5'
                    }
                  >
                    {chip.label}
                  </button>
                )
              })}
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-night via-night/80 to-transparent"
              aria-hidden
            />
          </div>
        </div>

        {!isLocal && (
          <Reveal delay={0}>
            <div className="mt-8 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-gold/5 to-transparent p-6 shadow-[0_8px_32px_rgba(217,164,65,0.15)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="mb-1 font-serif text-2xl text-cream">
                    Monte <em className="text-gold-soft">sua pizza</em>
                  </h3>
                  <p className="text-sm leading-relaxed text-cream-muted">
                    Escolha ingredientes, veja caindo na pizza e monte do seu jeito. Inteira ou meio a meia!
                  </p>
                </div>
                <button
                  onClick={() => setBuilderOpen(true)}
                  className="shrink-0 rounded-2xl bg-gold px-6 py-3.5 font-bold text-night transition hover:bg-gold-soft hover:shadow-[0_8px_24px_rgba(217,164,65,0.4)]"
                >
                  Começar
                </button>
              </div>
            </div>
          </Reveal>
        )}

        <div id="esfihas" className="mt-6 grid gap-0 sm:grid-cols-2">
          {filtered.map((row, index) => {
            const show3d = row.kind === 'pizza' && has3dModel(row.name)
            const priceLabel = formatPrecoBRL(row.kind === 'pizza' ? row.startingPrice : row.price)

            return (
              <Reveal
                key={row.key}
                as="article"
                delay={Math.min(index, 8) * 45}
                className="menu-row flex gap-4 border-b border-cream/10 py-5 pr-2 sm:rounded-2xl sm:px-3"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-cream/10 sm:h-24 sm:w-24">
                  <img
                    src={row.image}
                    alt={row.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      const img = event.currentTarget
                      const fallback = row.kind === 'bebida' ? row.fallbackImage : fallbackImage
                      if (img.src !== fallback) img.src = fallback
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg leading-tight text-cream sm:text-xl">
                    {row.name}
                    {row.kind === 'pizza' && row.item.maisPedido ? (
                      <span className="ml-2 inline-block rounded-full bg-gold px-2 py-0.5 align-middle font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-night">
                        Mais pedida
                      </span>
                    ) : null}
                    {row.kind === 'pizza' && row.item.novo ? (
                      <span className="ml-2 inline-block rounded-full bg-tomato px-2 py-0.5 align-middle font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-cream">
                        Novo
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-cream-muted">{row.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <p className="mr-auto text-sm font-semibold leading-tight text-gold">
                      {row.kind === 'pizza' ? (
                        <span className="block text-[11px] font-medium text-cream-muted">a partir de</span>
                      ) : null}
                      {priceLabel}
                    </p>
                    {show3d ? (
                      <button
                        type="button"
                        onPointerEnter={() => void loadModelViewer().catch(() => {})}
                        onTouchStart={() => void loadModelViewer().catch(() => {})}
                        onClick={() => setArOpen(true)}
                        className="inline-flex min-h-10 items-center rounded-full border border-gold/40 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-gold transition hover:border-gold hover:text-gold-soft sm:px-4"
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
                        className="inline-flex min-h-10 items-center rounded-full bg-tomato px-3.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-tomato-dark active:scale-95 sm:px-4 sm:tracking-[0.12em]"
                      >
                        Adicionar +
                      </button>
                    ) : null}
                  </div>
                </div>
              </Reveal>
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

      <PizzaBuilderModal isOpen={builderOpen} onClose={() => setBuilderOpen(false)} />
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
