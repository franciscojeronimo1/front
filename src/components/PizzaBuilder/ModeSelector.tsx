import type { usePizzaBuilder } from './usePizzaBuilder'
import { HALF_ALLOWED_SIZES } from '../../data/pizzaBuilderIngredients'

interface ModeSelectorProps {
  builder: ReturnType<typeof usePizzaBuilder>
}

export function ModeSelector({ builder }: ModeSelectorProps) {
  const halfDisabled = !HALF_ALLOWED_SIZES.has(builder.state.size)

  return (
    <div className="mb-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => builder.setMode('inteira')}
          className={`rounded-xl border px-3 py-2.5 text-center transition ${
            builder.state.mode === 'inteira'
              ? 'border-gold bg-gradient-to-b from-gold/20 to-gold/5 shadow-[0_0_0_3px_rgba(217,164,65,0.12)]'
              : 'border-line bg-night-2 hover:border-cream/30'
          }`}
        >
          <div className="text-sm font-semibold text-cream">Inteira</div>
          <div className="mt-1 text-xs text-cream-muted">Um sabor</div>
        </button>
        <button
          type="button"
          onClick={() => builder.setMode('meia')}
          disabled={halfDisabled}
          className={`rounded-xl border px-3 py-2.5 text-center transition ${
            builder.state.mode === 'meia'
              ? 'border-gold bg-gradient-to-b from-gold/20 to-gold/5 shadow-[0_0_0_3px_rgba(217,164,65,0.12)]'
              : halfDisabled
                ? 'cursor-not-allowed border-line bg-night-2 opacity-40'
                : 'border-line bg-night-2 hover:border-cream/30'
          }`}
          title={halfDisabled ? 'Meio a meia é só para Média, Grande e Família' : ''}
        >
          <div className="text-sm font-semibold text-cream">Meio a meia</div>
          <div className="mt-1 text-xs text-cream-muted">Dois sabores</div>
        </button>
      </div>

      {halfDisabled && builder.state.size === 'pequena' && (
        <div className="mt-3 rounded-xl border border-gold/25 bg-gold/10 px-3 py-2 text-xs leading-relaxed text-gold-soft">
          Meio a meia é só para Média, Grande e Família. A Pequena fica só inteira.
        </div>
      )}
    </div>
  )
}
