import { siteContent } from '../content/siteContent'
import { useVisitMode } from '../context/VisitModeContext'
import { useOrder } from '../context/OrderContext'
import { useScrolled } from '../hooks/useScrolled'
import { selectMenuFilter } from '../utils/menuNavigation'

export function Header() {
  const { isLocal } = useVisitMode()
  const { itemCount, toggleCart, setCartOpen } = useOrder()
  const scrolled = useScrolled(16)

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? 'border-b border-cream/10 bg-night/85 shadow-[0_12px_40px_-20px_rgb(0_0_0_/_0.7)] backdrop-blur-2xl'
          : 'border-b border-transparent bg-night/40 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <a
          href={isLocal ? '/?local=1' : '/'}
          className="group min-w-0"
          aria-label={`${siteContent.brandName} — início`}
        >
          <span className="block font-display text-xl italic text-gold transition group-hover:text-gold-soft sm:text-2xl">
            {siteContent.brandName}
          </span>
          <span className="mt-0.5 block text-[0.65rem] font-medium uppercase tracking-[0.2em] text-cream-muted">
            {isLocal ? 'Cardápio na mesa' : siteContent.locationShort}
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink
            href="#cardapio"
            onClick={() => selectMenuFilter('todas')}
          >
            Pizzas
          </NavLink>
          <NavLink
            href="#esfihas"
            onClick={() => selectMenuFilter('esfihas')}
          >
            Esfihas
          </NavLink>
          {!isLocal ? (
            <NavLink href="#contato">Contato</NavLink>
          ) : null}
        </nav>

        {isLocal ? (
          <a
            href="#cardapio"
            className="inline-flex min-h-11 items-center rounded-full border border-cream/25 px-4 py-2 text-sm font-semibold text-cream transition hover:border-cream/50 hover:bg-cream/5"
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
            className="cta-glow inline-flex min-h-11 items-center gap-2 rounded-full bg-tomato px-4 py-2 text-sm font-semibold text-white hover:bg-tomato-dark"
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

function NavLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick?: () => void
  children: string
}) {
  return (
    <a
      href={href}
      onClick={(event) => {
        if (!onClick) return
        event.preventDefault()
        onClick()
      }}
      className="rounded-full px-3.5 py-2 text-sm font-medium text-cream/80 transition hover:bg-cream/5 hover:text-cream"
    >
      {children}
    </a>
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
