import { formatPrecoBRL } from '../content/cardapio'
import { formatLineDescription, useOrder } from '../context/OrderContext'

export function OrderCartBar() {
  const {
    items,
    itemCount,
    total,
    cartOpen,
    orderNote,
    setCartOpen,
    setOrderNote,
    updateQuantity,
    removeItem,
    clearCart,
    whatsappCheckoutHref,
  } = useOrder()

  if (!cartOpen && itemCount === 0) return null

  return (
    <>
      {cartOpen ? (
        <div
          className="fixed inset-0 z-[54] bg-black/55"
          role="presentation"
          onClick={() => setCartOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-x-0 bottom-0 z-[55] flex max-h-[85vh] flex-col transition sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-md sm:max-h-none sm:border-l ${
          cartOpen
            ? 'translate-y-0 sm:translate-x-0'
            : itemCount > 0
              ? 'translate-y-[calc(100%-4.75rem)] sm:translate-x-full'
              : 'translate-y-full sm:translate-x-full'
        } border-t border-cream/20 bg-cream text-night shadow-2xl sm:border-t-0`}
        aria-label="Comanda do pedido"
      >
        <div className="flex items-center justify-between border-b border-night/10 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-night/50">Comanda</p>
            <p className="font-display text-xl text-night">
              {itemCount} {itemCount === 1 ? 'item' : 'itens'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(!cartOpen)}
            className="rounded-full border border-night/15 px-3 py-1.5 text-sm text-night/70"
          >
            {cartOpen ? 'Fechar' : 'Abrir'}
          </button>
        </div>

        {cartOpen ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            {items.length === 0 ? (
              <p className="py-8 text-center text-sm text-night/55">Sua comanda está vazia.</p>
            ) : (
              <ul className="divide-y divide-night/10">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-night">
                        {formatLineDescription(item).replace(/\*/g, '')}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-tomato">
                        {formatPrecoBRL(item.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-night/15 text-sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Diminuir quantidade"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-night/15 text-sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-xs font-semibold uppercase tracking-wide text-night/45 hover:text-tomato"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {items.length > 0 ? (
              <label className="mt-4 block">
                <span className="text-sm font-semibold text-night">Observações do pedido</span>
                <textarea
                  value={orderNote}
                  onChange={(event) => setOrderNote(event.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder="Endereço, pagamento, ponto de referência..."
                  className="mt-2 w-full resize-none rounded-xl border border-night/15 bg-white px-3 py-2 text-sm text-night outline-none focus:border-tomato/50"
                />
              </label>
            ) : null}
          </div>
        ) : null}

        <div className="border-t border-night/10 px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-3">
          <div className="mb-3 flex items-end justify-between">
            <span className="text-sm text-night/60">Total estimado</span>
            <span className="font-display text-2xl text-tomato">{formatPrecoBRL(total)}</span>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <button
              type="button"
              onClick={clearCart}
              disabled={itemCount === 0}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-night/15 px-4 text-xs font-semibold uppercase tracking-wide text-night/60 disabled:opacity-40"
            >
              Limpar
            </button>
            <a
              href={whatsappCheckoutHref}
              target="_blank"
              rel="noreferrer"
              aria-disabled={itemCount === 0}
              className={`inline-flex min-h-11 items-center justify-center rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white ${
                itemCount === 0 ? 'pointer-events-none opacity-40' : 'hover:bg-[#20bd5a]'
              }`}
            >
              Enviar no WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
