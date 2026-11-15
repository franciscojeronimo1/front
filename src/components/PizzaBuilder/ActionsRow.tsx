import type { usePizzaBuilder } from './usePizzaBuilder'

interface ActionsRowProps {
  builder: ReturnType<typeof usePizzaBuilder>
}

export function ActionsRow({ builder }: ActionsRowProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={builder.surpriseMe}
        className="rounded-xl border border-line bg-night-2 px-4 py-2.5 text-sm text-cream-muted transition hover:border-cream/30 hover:text-cream"
      >
        Surpresa da casa
      </button>
      <button
        type="button"
        onClick={builder.clearCurrentSide}
        className="rounded-xl border border-line bg-night-2 px-4 py-2.5 text-sm text-cream-muted transition hover:border-cream/30 hover:text-cream"
      >
        {builder.state.mode === 'meia' ? 'Limpar esta metade' : 'Limpar adicionais'}
      </button>
    </div>
  )
}
