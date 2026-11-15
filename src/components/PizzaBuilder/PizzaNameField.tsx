import type { usePizzaBuilder } from './usePizzaBuilder'

interface PizzaNameFieldProps {
  builder: ReturnType<typeof usePizzaBuilder>
}

export function PizzaNameField({ builder }: PizzaNameFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor="pizzaName" className="mb-2 block text-xs text-cream-muted">
        Nome da pizza (opcional, aparece no pedido)
      </label>
      <input
        id="pizzaName"
        type="text"
        maxLength={48}
        placeholder="Ex.: A Braba do João"
        value={builder.state.pizzaName}
        onChange={(e) => builder.setPizzaName(e.target.value)}
        className="w-full rounded-xl border border-line bg-night-2 px-3 py-2.5 text-sm text-cream placeholder:text-cream-muted/50 focus:border-gold focus:outline-none"
      />
    </div>
  )
}
