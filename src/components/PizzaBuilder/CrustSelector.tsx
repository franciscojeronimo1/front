import type { usePizzaBuilder } from './usePizzaBuilder'
import { formatPrecoBRL } from '../../content/cardapio'
import { CRUST_OPTIONS, getCrustPrice } from '../../data/pizzaBuilderPricing'

interface CrustSelectorProps {
  builder: ReturnType<typeof usePizzaBuilder>
}

export function CrustSelector({ builder }: CrustSelectorProps) {
  return (
    <div className="mb-4">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold">
        Borda recheada
      </h4>
      <div className="grid gap-2 sm:grid-cols-3">
        {CRUST_OPTIONS.map((crust) => {
          const isSelected = builder.state.crust === crust.id
          const price = getCrustPrice(crust.id, builder.state.size)
          const subtitle =
            crust.id === 'none'
              ? 'padrão · não conta no 6'
              : `+ ${formatPrecoBRL(price)} · não conta no 6`

          return (
            <button
              key={crust.id}
              type="button"
              onClick={() => builder.setCrust(crust.id)}
              className={`rounded-xl border px-3 py-2.5 text-center transition ${
                isSelected
                  ? 'border-gold bg-gradient-to-b from-gold/20 to-gold/5 shadow-[0_0_0_3px_rgba(217,164,65,0.12)]'
                  : 'border-line bg-night-2 hover:border-cream/30'
              }`}
            >
              <div className="text-sm font-semibold text-cream">{crust.label}</div>
              <div className="mt-1 text-xs text-cream-muted">{subtitle}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
