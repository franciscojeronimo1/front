import { siteContent } from '../content/siteContent'
import { useVisitMode } from '../context/VisitModeContext'
import { useOrder } from '../context/OrderContext'

export function Header() {
  const { isLocal } = useVisitMode()
  const { itemCount, toggleCart, setCartOpen } = useOrder()

  return (
    <header className="sticky top-0 z-40 border-b border-cream/10 bg-night/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <a href={isLocal ? '/?local=1' : '/'} className="min-w-0" aria-label={`${siteContent.brandName} — início`}>
          <span className="block font-display text-xl italic text-gold sm:text-2xl">
            {siteContent.brandName}
          </span>
          <span className="mt-0.5 block text-[0.65rem] font-medium uppercase tracking-[0.18em] text-cream-muted">
            {isLocal ? 'Cardápio na mesa' : siteContent.locationShort}
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#cardapio" className="text-sm font-medium text-cream/90 transition hover:text-cream">
            Pizzas
          </a>
          <a href="#esfihas" className="text-sm font-medium text-cream/90 transition hover:text-cream">
            Esfihas
          </a>
          {!isLocal ? (
            <a href="#contato" className="text-sm font-medium text-cream/90 transition hover:text-cream">
              Contato
            </a>
          ) : null}
        </nav>

        {isLocal ? (
          <a
            href="#cardapio"
            className="inline-flex min-h-11 items-center rounded-full border border-cream/25 px-4 py-2 text-sm font-semibold text-cream transition hover:border-cream/50"
          >
            Cardápio
          </a>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (itemCount === 0) setCartOpen(true)
              else toggleCart()
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-tomato px-4 py-2 text-sm font-semibold text-white transition hover:bg-tomato-dark"
            aria-label={`Pedido com ${itemCount} itens`}
          >
            <BagIcon />
            <span className="hidden sm:inline">Pedido</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-tomato">
              {itemCount}
            </span>
          </button>
        )}
      </div>
    </header>
  )
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 7h12l-1 13H7L6 7z" strokeLinejoin="round" />
      <path d="M9 7a3 3 0 0 1 6 0" strokeLinecap="round" />
    </svg>
  )
}
