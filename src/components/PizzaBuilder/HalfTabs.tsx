import type { usePizzaBuilder } from './usePizzaBuilder'

interface HalfTabsProps {
  builder: ReturnType<typeof usePizzaBuilder>
}

export function HalfTabs({ builder }: HalfTabsProps) {
  if (builder.state.mode !== 'meia') return null

  return (
    <div className="mb-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => builder.setActiveHalf(1)}
          className={`rounded-xl border px-3 py-2.5 text-center transition ${
            builder.state.activeHalf === 1
              ? 'border-gold bg-gradient-to-b from-gold/20 to-gold/5 shadow-[0_0_0_3px_rgba(217,164,65,0.12)]'
              : 'border-line bg-night-2 hover:border-cream/30'
          }`}
        >
          <div className="text-sm font-semibold text-cream">Metade 1</div>
          <div className="mt-1 text-xs text-cream-muted">
            {builder.state.activeHalf === 1 ? 'editando · ' : ''}
            <span className="font-semibold text-gold-soft">
              {builder.extrasCountHalf1}/6
            </span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => builder.setActiveHalf(2)}
          className={`rounded-xl border px-3 py-2.5 text-center transition ${
            builder.state.activeHalf === 2
              ? 'border-gold bg-gradient-to-b from-gold/20 to-gold/5 shadow-[0_0_0_3px_rgba(217,164,65,0.12)]'
              : 'border-line bg-night-2 hover:border-cream/30'
          }`}
        >
          <div className="text-sm font-semibold text-cream">Metade 2</div>
          <div className="mt-1 text-xs text-cream-muted">
            {builder.state.activeHalf === 2 ? 'editando · ' : ''}
            <span className="font-semibold text-gold-soft">
              {builder.extrasCountHalf2}/6
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
