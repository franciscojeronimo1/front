import { useEffect, useRef } from 'react'
import { usePizzaBuilder } from './usePizzaBuilder'
import { useOrder } from '../../context/OrderContext'
import { formatPrecoBRL } from '../../content/cardapio'
import { PizzaStage } from './PizzaStage'
import { SizeSelector } from './SizeSelector'
import { ModeSelector } from './ModeSelector'
import { HalfTabs } from './HalfTabs'
import { LimitRow } from './LimitRow'
import { CrustSelector } from './CrustSelector'
import { IngredientCategories } from './IngredientCategories'
import { SuggestionsChips } from './SuggestionsChips'
import { ActionsRow } from './ActionsRow'
import { PizzaNameField } from './PizzaNameField'

interface PizzaBuilderContentProps {
  onClose: () => void
}

export default function PizzaBuilderContent({ onClose }: PizzaBuilderContentProps) {
  const builder = usePizzaBuilder()
  const { addCustomPizza } = useOrder()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to top quando abre
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [])

  const handleAddToCart = () => {
    const { state, totalPrice } = builder

    const customPizza = {
      mode: state.mode,
      size: state.size,
      ingredientsWhole:
        state.mode === 'inteira' ? Array.from(state.selectedWhole) : undefined,
      ingredientsHalf1:
        state.mode === 'meia' ? Array.from(state.selectedHalf1) : undefined,
      ingredientsHalf2:
        state.mode === 'meia' ? Array.from(state.selectedHalf2) : undefined,
      crust: state.crust,
      pizzaName: state.pizzaName.trim() || undefined,
      price: totalPrice,
    }

    addCustomPizza(customPizza)
    onClose()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-line px-6 py-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gold">
          Claudia Delivery · Santana do Jacaré
        </div>
        <h2 className="font-serif text-3xl text-cream sm:text-4xl">
          Monte <em className="text-gold-soft">sua pizza</em>
        </h2>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[minmax(300px,1fr)_minmax(350px,1.05fr)] lg:gap-8">
          {/* Left Panel - Stage */}
          <div className="order-2 lg:order-1">
            <PizzaStage builder={builder} />
          </div>

          {/* Right Panel - Controls */}
          <div className="order-1 lg:order-2">
            <h3 className="mb-2 font-serif text-2xl text-cream">
              Escolha e veja montar
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-cream-muted">
              Toque nos ingredientes: eles caem na pizza, o preço atualiza na hora. Dá para montar
              inteira ou meio a meia (até 6 adicionais em cada metade). Molho e muçarela são a base
              e não entram nessa conta.
            </p>

            <ModeSelector builder={builder} />
            <HalfTabs builder={builder} />
            <LimitRow builder={builder} />
            <SizeSelector builder={builder} />
            <CrustSelector builder={builder} />
            <SuggestionsChips builder={builder} />
            <IngredientCategories builder={builder} />
            <ActionsRow builder={builder} />
            <PizzaNameField builder={builder} />
          </div>
        </div>
      </div>

      {/* Footer - Total e Botão */}
      <div className="border-t border-line bg-night/95 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <div>
            <div className="mb-1 text-xs uppercase tracking-wider text-cream-muted">
              Total ·{' '}
              <span>
                {builder.state.mode === 'meia'
                  ? `M1 ${builder.extrasCountHalf1}/6 · M2 ${builder.extrasCountHalf2}/6`
                  : `${builder.extrasCount}/6`}
              </span>
            </div>
            <div className="font-serif text-3xl text-cream">
              {formatPrecoBRL(builder.totalPrice)}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="rounded-2xl bg-gold px-6 py-3 font-bold text-night transition hover:bg-gold-soft"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  )
}
