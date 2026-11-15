import { useEffect, useState } from 'react'
import type { usePizzaBuilder } from './usePizzaBuilder'
import { INGREDIENTS_BY_ID } from '../../data/pizzaBuilderIngredients'

interface PizzaStageProps {
  builder: ReturnType<typeof usePizzaBuilder>
}

interface LayoutData {
  [key: string]: {
    type: 'spread' | 'drop'
    src: string
    srcOverHam?: string
    items?: Array<{
      src: string
      x: number
      y: number
      rot: number
      w: number
    }>
    z?: number
    underCheese?: boolean
  }
}

export function PizzaStage({ builder }: PizzaStageProps) {
  const [layout, setLayout] = useState<LayoutData | null>(null)
  const { state } = builder

  useEffect(() => {
    fetch('/pizza-builder/assets/layout.json')
      .then((r) => r.json())
      .then((data) => setLayout(data))
      .catch(() => setLayout({}))
  }, [])

  const getSauceLayer = (set: Set<string>) => {
    for (const id of set) {
      const ingredient = INGREDIENTS_BY_ID[id]
      if (ingredient?.group === 'sauce') {
        return ingredient.sauce === 'white'
          ? '/pizza-builder/assets/base/sauce-white.png'
          : '/pizza-builder/assets/base/sauce-red.png'
      }
    }
    return '/pizza-builder/assets/base/sauce-red.png'
  }

  const hasPresunto = (set: Set<string>) => set.has('presunto')
  const hasMucarela = (set: Set<string>) => set.has('mucarela')

  const getCheeseLayer = (set: Set<string>) => {
    if (!hasMucarela(set)) return null
    if (hasPresunto(set)) {
      return layout?.mucarela?.srcOverHam || '/pizza-builder/assets/base/cheese-over-ham.png'
    }
    return '/pizza-builder/assets/base/cheese.png'
  }

  const getToppings = (set: Set<string>) => {
    const toppings: Array<{
      id: string
      src: string
      z: number
    }> = []

    for (const id of set) {
      const ingredient = INGREDIENTS_BY_ID[id]
      if (!ingredient || ingredient.base || id === 'presunto') continue

      const meta = layout?.[id]
      const src = meta?.src || `/pizza-builder/assets/layers/${id}.png`
      const z = meta?.z ?? 10

      toppings.push({ id, src, z })
    }

    return toppings.sort((a, b) => a.z - b.z)
  }

  const renderLegend = () => {
    if (state.mode === 'meia') {
      const items1 = Array.from(state.selectedHalf1)
        .map((id) => INGREDIENTS_BY_ID[id]?.name)
        .filter(Boolean)
      const items2 = Array.from(state.selectedHalf2)
        .map((id) => INGREDIENTS_BY_ID[id]?.name)
        .filter(Boolean)

      return (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          <span className="rounded-full bg-cream/10 px-2.5 py-1 text-xs text-cream-muted">
            Metade 1: {items1.join(', ')}
          </span>
          <span className="rounded-full bg-cream/10 px-2.5 py-1 text-xs text-cream-muted">
            Metade 2: {items2.join(', ')}
          </span>
        </div>
      )
    } else {
      const items = Array.from(state.selectedWhole)
        .map((id) => INGREDIENTS_BY_ID[id]?.name)
        .filter(Boolean)

      return (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {items.map((name) => (
            <span
              key={name}
              className="rounded-full bg-cream/10 px-2.5 py-1 text-xs text-cream-muted"
            >
              {name}
            </span>
          ))}
        </div>
      )
    }
  }

  if (!layout) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-line bg-gradient-to-b from-night-2 to-night-3 p-8">
        <div className="text-center text-cream-muted">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="sticky top-4 rounded-3xl border border-line bg-gradient-to-b from-night-2 to-night-3 p-4 shadow-2xl">
      <p className="mb-2 text-center text-xs text-cream-muted">Pizza sendo montada</p>

      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        {/* Prato */}
        <div className="absolute inset-[2%] rounded-full bg-gradient-radial from-[#2a241f] via-[#3a322b] to-[#2c2621] shadow-[inset_0_0_0_8px_#1f1a16,0_20px_40px_rgba(0,0,0,0.35)]" />

        {/* Pizza */}
        <div className="absolute inset-[6%] overflow-hidden rounded-full">
          {state.mode === 'meia' ? (
            <>
              {/* Metade 1 */}
              <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}>
                <img src="/pizza-builder/assets/base/crust.png" alt="" className="h-full w-full object-contain" />
                <img src={getSauceLayer(state.selectedHalf1)} alt="" className="absolute inset-0 h-full w-full object-contain" />
                {hasPresunto(state.selectedHalf1) && (
                  <img src="/pizza-builder/assets/layers/presunto.png" alt="" className="absolute inset-0 h-full w-full object-contain" />
                )}
                {getCheeseLayer(state.selectedHalf1) && (
                  <img src={getCheeseLayer(state.selectedHalf1)!} alt="" className="absolute inset-0 h-full w-full object-contain" />
                )}
                {getToppings(state.selectedHalf1).map((topping) => (
                  <img key={topping.id} src={topping.src} alt="" className="absolute inset-0 h-full w-full object-contain" />
                ))}
              </div>

              {/* Metade 2 */}
              <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}>
                <img src="/pizza-builder/assets/base/crust.png" alt="" className="h-full w-full object-contain" />
                <img src={getSauceLayer(state.selectedHalf2)} alt="" className="absolute inset-0 h-full w-full object-contain" />
                {hasPresunto(state.selectedHalf2) && (
                  <img src="/pizza-builder/assets/layers/presunto.png" alt="" className="absolute inset-0 h-full w-full object-contain" />
                )}
                {getCheeseLayer(state.selectedHalf2) && (
                  <img src={getCheeseLayer(state.selectedHalf2)!} alt="" className="absolute inset-0 h-full w-full object-contain" />
                )}
                {getToppings(state.selectedHalf2).map((topping) => (
                  <img key={topping.id} src={topping.src} alt="" className="absolute inset-0 h-full w-full object-contain" />
                ))}
              </div>

              {/* Linha divisória */}
              <div className="absolute left-1/2 top-[7%] bottom-[7%] w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-[rgba(255,236,210,0.4)] to-transparent shadow-[0_0_4px_rgba(0,0,0,0.35)]" />

              {/* Tags das metades */}
              <div className={`absolute left-[20%] top-[11%] flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${state.activeHalf === 1 ? 'border-gold bg-gold text-night' : 'border-gold bg-night/80 text-gold-soft'}`}>
                1
              </div>
              <div className={`absolute right-[20%] top-[11%] flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${state.activeHalf === 2 ? 'border-gold bg-gold text-night' : 'border-gold bg-night/80 text-gold-soft'}`}>
                2
              </div>
            </>
          ) : (
            <>
              <img src="/pizza-builder/assets/base/crust.png" alt="" className="h-full w-full object-contain" />
              <img src={getSauceLayer(state.selectedWhole)} alt="" className="absolute inset-0 h-full w-full object-contain" />
              {hasPresunto(state.selectedWhole) && (
                <img src="/pizza-builder/assets/layers/presunto.png" alt="" className="absolute inset-0 h-full w-full object-contain" />
              )}
              {getCheeseLayer(state.selectedWhole) && (
                <img src={getCheeseLayer(state.selectedWhole)!} alt="" className="absolute inset-0 h-full w-full object-contain" />
              )}
              {getToppings(state.selectedWhole).map((topping) => (
                <img key={topping.id} src={topping.src} alt="" className="absolute inset-0 h-full w-full object-contain" />
              ))}
            </>
          )}
        </div>
      </div>

      {renderLegend()}

      {/* Ferramentas do Stage */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-cream-muted">
        <p>Visualização simplificada</p>
      </div>
    </div>
  )
}
