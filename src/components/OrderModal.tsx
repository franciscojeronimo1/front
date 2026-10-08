import { useEffect, useMemo, useState } from 'react'
import { formatPrecoBRL } from '../content/cardapio'
import { PIZZA_SIZES } from '../content/pizzaSizes'
import {
  defaultSizeForKind,
  isHalfAllowedSize,
  useOrder,
  type PizzaSizeId,
} from '../context/OrderContext'
import type { PizzaRef } from '../types/order'
import {
  calculateLinePrice,
  getAllPizzas,
  type PizzaCatalogEntry,
} from '../utils/pizzaPricing'

type OrderKind = 'whole' | 'half'

function flavorKey(flavor: Pick<PizzaRef, 'sectionId' | 'itemName'>): string {
  return `${flavor.sectionId}::${flavor.itemName}`
}

export function OrderModal() {
  const { modalOpen, selectedPizza, closeOrderModal, addPizza } = useOrder()
  const [kind, setKind] = useState<OrderKind>('whole')
  const [size, setSize] = useState<PizzaSizeId>('media')
  const [secondFlavorKey, setSecondFlavorKey] = useState('')
  const [note, setNote] = useState('')

  const catalog = useMemo(() => getAllPizzas(), [])

  useEffect(() => {
    if (!modalOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [modalOpen])

  useEffect(() => {
    if (!modalOpen || !selectedPizza) return
    setKind('whole')
    setSize(defaultSizeForKind('whole'))
    setSecondFlavorKey('')
    setNote('')
  }, [modalOpen, selectedPizza])

  useEffect(() => {
    if (kind === 'half' && !isHalfAllowedSize(size)) setSize('media')
  }, [kind, size])

  const secondFlavor = useMemo(() => {
    if (!secondFlavorKey) return null
    return catalog.find((entry) => flavorKey(entry) === secondFlavorKey) ?? null
  }, [catalog, secondFlavorKey])

  const availableSecondFlavors = useMemo(() => {
    if (!selectedPizza) return catalog
    const firstKey = flavorKey(selectedPizza)
    return catalog.filter((entry) => flavorKey(entry) !== firstKey)
  }, [catalog, selectedPizza])

  useEffect(() => {
    if (!selectedPizza || availableSecondFlavors.length === 0) return
    const stillValid = availableSecondFlavors.some(
      (entry) => flavorKey(entry) === secondFlavorKey
    )
    if (!stillValid) setSecondFlavorKey(flavorKey(availableSecondFlavors[0]))
  }, [availableSecondFlavors, secondFlavorKey, selectedPizza])

  const price = useMemo(() => {
    if (!selectedPizza) return 0
    const flavor2 = secondFlavor
      ? {
          sectionId: secondFlavor.sectionId,
          sectionLabel: secondFlavor.sectionLabel,
          itemName: secondFlavor.itemName,
        }
      : undefined
    return calculateLinePrice(kind, selectedPizza, flavor2, size)
  }, [kind, selectedPizza, secondFlavor, size])

  if (!modalOpen || !selectedPizza) return null

  const canAdd = kind === 'whole' || Boolean(secondFlavor)

  function handleAdd() {
    if (!selectedPizza || !canAdd) return
    addPizza({
      kind,
      flavor1: selectedPizza,
      flavor2:
        kind === 'half' && secondFlavor
          ? {
              sectionId: secondFlavor.sectionId,
              sectionLabel: secondFlavor.sectionLabel,
              itemName: secondFlavor.itemName,
            }
          : undefined,
      size,
      note: note.trim() || undefined,
    })
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-5"
      role="presentation"
      onClick={closeOrderModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] border border-cream/10 bg-night pb-[env(safe-area-inset-bottom)] shadow-2xl sm:rounded-[1.75rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-cream/10 bg-night/95 px-4 py-4 backdrop-blur-xl sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Montar pizza</p>
            <h2 id="order-modal-title" className="mt-1 break-words font-display text-xl text-cream sm:text-2xl">
              {selectedPizza.itemName}
            </h2>
            <p className="mt-1 text-sm capitalize text-cream-muted">{selectedPizza.sectionLabel}</p>
          </div>
          <button
            type="button"
            onClick={closeOrderModal}
            className="inline-flex min-h-10 shrink-0 items-center rounded-xl border border-cream/15 px-3 py-2 text-sm text-cream-muted transition hover:bg-cream/5 hover:text-cream"
          >
            Fechar
          </button>
        </div>

        <div className="space-y-6 px-5 py-5">
          <fieldset>
            <legend className="text-sm font-semibold text-cream">Tipo</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <KindButton active={kind === 'whole'} onClick={() => setKind('whole')}>
                Inteira
              </KindButton>
              <KindButton active={kind === 'half'} onClick={() => setKind('half')}>
                Meia a meia
              </KindButton>
            </div>
            {kind === 'half' ? (
              <p className="mt-2 text-xs text-cream-muted">
                Meia a meia em Média, Grande e Família. Valor do sabor mais caro.
              </p>
            ) : null}
          </fieldset>

          {kind === 'half' ? (
            <label className="block">
              <span className="text-sm font-semibold text-cream">Segundo sabor</span>
              <select
                value={secondFlavorKey}
                onChange={(event) => setSecondFlavorKey(event.target.value)}
                className="mt-2 w-full rounded-xl border border-cream/15 bg-night-elevated px-4 py-3 text-sm text-cream outline-none focus:border-gold/50"
              >
                {groupPizzasBySection(availableSecondFlavors).map((group) => (
                  <optgroup key={group.sectionId} label={group.sectionLabel}>
                    {group.items.map((entry) => (
                      <option key={flavorKey(entry)} value={flavorKey(entry)} className="bg-night text-cream">
                        {entry.itemName}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          ) : null}

          <fieldset>
            <legend className="text-sm font-semibold text-cream">Tamanho</legend>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PIZZA_SIZES.map((entry) => {
                const disabled = kind === 'half' && !entry.halfAllowed
                return (
                  <button
                    key={entry.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSize(entry.id)}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                      size === entry.id
                        ? 'border-gold/60 bg-gold/15 text-gold'
                        : 'border-cream/15 bg-night-elevated text-cream-muted hover:border-cream/30'
                    } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
                  >
                    {entry.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-sm font-semibold text-cream">Observação</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={2}
              maxLength={200}
              placeholder="Opcional — ex.: sem cebola"
              className="mt-2 w-full resize-none rounded-xl border border-cream/15 bg-night-elevated px-4 py-3 text-sm text-cream placeholder:text-cream-muted/50 outline-none focus:border-gold/50"
            />
          </label>

          <div className="rounded-2xl border border-cream/10 bg-cream px-4 py-4 text-night">
            <p className="text-xs uppercase tracking-[0.16em] text-night/55">Valor</p>
            <p className="mt-1 font-display text-3xl text-tomato">{formatPrecoBRL(price)}</p>
          </div>

          <button
            type="button"
            disabled={!canAdd}
            onClick={handleAdd}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-tomato px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-tomato-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Adicionar ao pedido
          </button>
        </div>
      </div>
    </div>
  )
}

function KindButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? 'border-gold/60 bg-gold/15 text-gold'
          : 'border-cream/15 bg-night-elevated text-cream-muted hover:border-cream/30'
      }`}
    >
      {children}
    </button>
  )
}

function groupPizzasBySection(catalog: PizzaCatalogEntry[]) {
  const groups = new Map<
    string,
    { sectionId: string; sectionLabel: string; items: PizzaCatalogEntry[] }
  >()

  for (const entry of catalog) {
    const existing = groups.get(entry.sectionId)
    if (existing) {
      existing.items.push(entry)
      continue
    }
    groups.set(entry.sectionId, {
      sectionId: entry.sectionId,
      sectionLabel: entry.sectionLabel,
      items: [entry],
    })
  }

  return [...groups.values()]
}
