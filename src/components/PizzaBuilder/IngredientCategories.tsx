import type { usePizzaBuilder } from './usePizzaBuilder'
import { INGREDIENTS, MAX_EXTRAS } from '../../data/pizzaBuilderIngredients'
import { getIngredientPrice } from '../../data/pizzaBuilderPricing'
import { formatPrecoBRL } from '../../content/cardapio'

interface IngredientCategoriesProps {
  builder: ReturnType<typeof usePizzaBuilder>
}

export function IngredientCategories({ builder }: IngredientCategoriesProps) {
  const categories = Array.from(new Set(INGREDIENTS.map((i) => i.cat)))

  return (
    <div className="mb-4 space-y-4">
      {categories.map((category) => {
        const ingredientsInCat = INGREDIENTS.filter((i) => i.cat === category)

        return (
          <div key={category}>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {ingredientsInCat.map((ingredient) => {
                const isSelected = builder.activeSet.has(ingredient.id)
                const isLocked =
                  !isSelected &&
                  builder.atLimit &&
                  !ingredient.base

                const price = getIngredientPrice(ingredient.id)
                let priceLabel: string
                if (ingredient.base || price === 0) {
                  priceLabel = ingredient.base ? 'base · não conta no 6' : 'incluso'
                } else {
                  priceLabel = `+ ${formatPrecoBRL(price)}`
                }

                const swatchUrl = ingredient.swatch || `/pizza-builder/assets/swatches/${ingredient.id}.png`

                return (
                  <button
                    key={ingredient.id}
                    type="button"
                    onClick={() => builder.toggleIngredient(ingredient.id)}
                    disabled={isLocked}
                    className={`inline-flex items-center gap-2 rounded-full border px-2 py-1.5 transition ${
                      isSelected
                        ? 'border-gold bg-gold/15'
                        : isLocked
                          ? 'cursor-not-allowed border-line bg-night-2 opacity-40 grayscale'
                          : 'border-line bg-night-2 hover:border-cream/30'
                    }`}
                    title={isLocked ? `Limite de ${MAX_EXTRAS} ingredientes atingido` : ingredient.name}
                  >
                    <span
                      className="h-7 w-7 flex-shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.25)]"
                      style={{
                        backgroundImage: `url('${swatchUrl}')`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#2a221c',
                      }}
                    />
                    <span className="flex flex-col items-start leading-tight">
                      <span className="text-sm font-semibold text-cream">{ingredient.name}</span>
                      <span className="text-xs font-medium text-cream-muted">{priceLabel}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
