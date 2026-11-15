import type { usePizzaBuilder } from './usePizzaBuilder'
import { MAX_EXTRAS } from '../../data/pizzaBuilderIngredients'

interface LimitRowProps {
  builder: ReturnType<typeof usePizzaBuilder>
}

export function LimitRow({ builder }: LimitRowProps) {
  const isAtLimit = builder.extrasCount >= MAX_EXTRAS

  return (
    <>
      <div
        className={`mb-3 flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition ${
          isAtLimit
            ? 'border-gold/45 bg-gold/10'
            : 'border-line bg-night-2'
        }`}
      >
        <span className="text-sm text-cream">
          {builder.state.mode === 'meia'
            ? `Adicionais da metade ${builder.state.activeHalf}`
            : 'Adicionais escolhidos'}
        </span>
        <strong className="text-sm font-semibold tabular-nums text-gold-soft">
          {builder.state.mode === 'meia'
            ? `M${builder.state.activeHalf} ${builder.extrasCount}/${MAX_EXTRAS}`
            : `${builder.extrasCount}/${MAX_EXTRAS}`}
        </strong>
      </div>

      {isAtLimit && (
        <div className="mb-3 rounded-xl border border-gold/25 bg-gold/10 px-3 py-2 text-xs leading-relaxed text-gold-soft">
          {builder.state.mode === 'meia'
            ? `A metade ${builder.state.activeHalf} já tem 6 adicionais. Tire um para colocar outro. Molho e muçarela continuam livres — eles são a base e não entram na conta.`
            : 'Você já escolheu 6 ingredientes. Tire um para colocar outro. Molho e muçarela continuam livres — eles são a base da pizza.'}
        </div>
      )}
    </>
  )
}
