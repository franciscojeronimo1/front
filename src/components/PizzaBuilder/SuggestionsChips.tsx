import { useMemo } from 'react'
import type { usePizzaBuilder } from './usePizzaBuilder'
import {
  INGREDIENTS_BY_ID,
  MENU_COMBOS,
  MAX_EXTRAS,
} from '../../data/pizzaBuilderIngredients'

interface SuggestionsChipsProps {
  builder: ReturnType<typeof usePizzaBuilder>
}

export function SuggestionsChips({ builder }: SuggestionsChipsProps) {
  const suggestions = useMemo(() => {
    const selected = builder.activeSet
    const extras: string[] = []
    for (const id of selected) {
      const ingredient = INGREDIENTS_BY_ID[id]
      if (ingredient && !ingredient.base) {
        extras.push(id)
      }
    }

    const scores: Record<string, number> = {}

    for (const combo of MENU_COMBOS) {
      const overlap = extras.length
        ? combo.filter((id) => extras.includes(id)).length
        : 1

      if (!overlap) continue

      for (const id of combo) {
        if (selected.has(id) || !INGREDIENTS_BY_ID[id]) continue
        scores[id] = (scores[id] || 0) + overlap
      }
    }

    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 2)
      .map(([id]) => INGREDIENTS_BY_ID[id])
      .filter(Boolean)

    return sorted
  }, [builder.activeSet])

  if (suggestions.length === 0) return null

  const isAtLimit = builder.extrasCount >= MAX_EXTRAS

  return (
    <div className="mb-4">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold">
        Combina com
      </h4>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((ingredient) => {
          const isLocked = isAtLimit

          return (
            <button
              key={ingredient.id}
              type="button"
              onClick={() => builder.toggleIngredient(ingredient.id)}
              disabled={isLocked}
              className={`rounded-full border border-dashed px-3 py-2 text-sm font-semibold transition ${
                isLocked
                  ? 'cursor-not-allowed border-gold/45 bg-gold/10 opacity-40'
                  : 'border-gold/45 bg-gold/10 text-gold-soft hover:bg-gold/20'
              }`}
              title={isLocked ? 'Limite de 6 atingido' : `Adicionar ${ingredient.name}`}
            >
              + {ingredient.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
