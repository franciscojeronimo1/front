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
    <div className="fixed inset-x-0 bottom-0 z-[55] flex flex-col">
      {cartOpen ? (
        <div className="max-h-[45vh] overflow-y-auto border-t border-white/10 bg-brand-900/98 backdrop-blur-xl sm:max-h-[50vh]">
          <ul className="mx-auto max-w-6xl divide-y divide-white/10 px-4 py-2 sm:px-5">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 py-3 sm:gap-4 sm:py-4">
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
                  className="inline-flex min-h-10 shrink-0 items-center rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>

          <div className="mx-auto max-w-6xl border-t border-white/10 px-4 py-4 sm:px-5">
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

      <div className="border-t border-white/10 bg-brand-950/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setCartOpen(!cartOpen)}
              className="min-h-11 min-w-0 flex-1 text-left"
            >
              <p className="text-sm font-semibold text-white">
                {itemCount} {itemCount === 1 ? 'pizza' : 'pizzas'} no pedido
              </p>
              <p className="text-xs text-zinc-400">
                Total estimado: {formatPrecoBRL(total)} · {cartOpen ? 'Ocultar' : 'Ver detalhes'}
              </p>
            </button>

            <div className="grid grid-cols-[auto_1fr] gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 text-xs font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Limpar
              </button>
              <a
                href={whatsappCheckoutHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
              >
                Enviar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
