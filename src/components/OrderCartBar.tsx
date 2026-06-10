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
    removeItem,
    clearCart,
    whatsappCheckoutHref,
  } = useOrder()

  if (itemCount === 0) return null

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[55] border-t border-white/10 bg-brand-950/95 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCartOpen(!cartOpen)}
              className="min-w-0 flex-1 text-left"
            >
              <p className="text-sm font-semibold text-white">
                {itemCount} {itemCount === 1 ? 'pizza' : 'pizzas'} no pedido
              </p>
              <p className="text-xs text-zinc-400">
                Total estimado: {formatPrecoBRL(total)} · {cartOpen ? 'Ocultar' : 'Ver detalhes'}
              </p>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Limpar
              </button>
              <a
                href={whatsappCheckoutHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
              >
                Enviar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {cartOpen ? (
        <div className="fixed inset-x-0 bottom-[4.75rem] z-[54] max-h-[50vh] overflow-y-auto border-t border-white/10 bg-brand-900/98 backdrop-blur-xl sm:bottom-[4.5rem]">
          <ul className="mx-auto max-w-6xl divide-y divide-white/10 px-5 py-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{formatLineDescription(item)}</p>
                  {item.note ? (
                    <p className="mt-1 text-xs text-zinc-400">Obs: {item.note}</p>
                  ) : null}
                  <p className="mt-1 text-sm text-accent-400">{formatPrecoBRL(item.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="shrink-0 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>

          <div className="mx-auto max-w-6xl border-t border-white/10 px-5 py-4">
            <label className="block">
              <span className="text-sm font-semibold text-white">Observações do pedido</span>
              <span className="mt-1 block text-xs text-zinc-500">
                Opcional — endereço, pagamento, ponto de referência etc.
              </span>
              <textarea
                value={orderNote}
                onChange={(event) => setOrderNote(event.target.value)}
                rows={3}
                maxLength={300}
                placeholder="Ex.: Rua..., pagamento no Pix, portão azul..."
                className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-accent-400/50"
              />
            </label>
          </div>
        </div>
      ) : null}
    </>
  )
}
