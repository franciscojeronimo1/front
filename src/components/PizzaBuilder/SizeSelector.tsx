import type { usePizzaBuilder } from './usePizzaBuilder'
import { formatPrecoBRL } from '../../content/cardapio'
import { SIZE_PRICING } from '../../data/pizzaBuilderPricing'

interface SizeSelectorProps {
  builder: ReturnType<typeof usePizzaBuilder>
}

const SIZES = [
  { id: 'pequena' as const, label: 'Pequena' },
  { id: 'media' as const, label: 'Média' },
  { id: 'grande' as const, label: 'Grande' },
  { id: 'familia' as const, label: 'Família' },
]

export function SizeSelector({ builder }: SizeSelectorProps) {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SIZES.map((size) => {
          const isSelected = builder.state.size === size.id
          return (
            <button
              key={size.id}
              type="button"
              onClick={() => builder.setSize(size.id)}
              className={`rounded-xl border px-3 py-2.5 text-center transition ${
                isSelected
                  ? 'border-gold bg-gradient-to-b from-gold/20 to-gold/5 shadow-[0_0_0_3px_rgba(217,164,65,0.12)]'
                  : 'border-line bg-night-2 hover:border-cream/30'
              }`}
            >
              <div className="text-sm font-semibold text-cream">{size.label}</div>
              <div className="mt-1 text-xs text-cream-muted">
                {formatPrecoBRL(SIZE_PRICING[size.id].base)}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
