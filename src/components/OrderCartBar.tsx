import { useState, type MouseEvent, type ReactNode } from 'react'
import { formatPrecoBRL } from '../content/cardapio'
import { formatLineDescription, paymentLabels, useOrder } from '../context/OrderContext'
import type { CheckoutField, Fulfillment, PaymentMethod } from '../types/order'

const fieldIds: Record<CheckoutField, string> = {
  name: 'checkout-name',
  street: 'checkout-street',
  payment: 'checkout-payment',
}

const fulfillmentOptions: { id: Fulfillment; label: string }[] = [
  { id: 'entrega', label: 'Entrega' },
  { id: 'retirada', label: 'Retirada' },
]

const paymentOptions = Object.entries(paymentLabels) as [PaymentMethod, string][]

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
    checkout,
    updateCheckout,
    missingCheckoutFields,
    whatsappCheckoutHref,
  } = useOrder()
  const [showErrors, setShowErrors] = useState(false)

  if (!cartOpen && itemCount === 0) return null

  const isMissing = (field: CheckoutField) => showErrors && missingCheckoutFields.includes(field)

  function handleSend(event: MouseEvent<HTMLAnchorElement>) {
    if (missingCheckoutFields.length === 0) return
    event.preventDefault()
    setShowErrors(true)
    setCartOpen(true)
    requestAnimationFrame(() => {
      const first = document.getElementById(fieldIds[missingCheckoutFields[0]])
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (first instanceof HTMLInputElement) first.focus({ preventScroll: true })
    })
  }

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
              <div className="mt-4 space-y-4 border-t border-night/10 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-night/50">
                  Seus dados
                </p>

                <TextField
                  id={fieldIds.name}
                  label="Seu nome"
                  value={checkout.name}
                  onChange={(name) => updateCheckout({ name })}
                  autoComplete="name"
                  error={isMissing('name') ? 'Digite seu nome.' : undefined}
                />

                <div>
                  <span className="text-sm font-semibold text-night">Como quer receber?</span>
                  <ChoiceGroup>
                    {fulfillmentOptions.map((option) => (
                      <Choice
                        key={option.id}
                        active={checkout.fulfillment === option.id}
                        onClick={() => updateCheckout({ fulfillment: option.id })}
                      >
                        {option.label}
                      </Choice>
                    ))}
                  </ChoiceGroup>
                </div>

                {checkout.fulfillment === 'entrega' ? (
                  <>
                    <TextField
                      id={fieldIds.street}
                      label="Rua e número"
                      value={checkout.street}
                      onChange={(street) => updateCheckout({ street })}
                      autoComplete="street-address"
                      placeholder="Ex.: Rua das Flores, 120"
                      error={isMissing('street') ? 'Digite a rua e o número.' : undefined}
                    />
                    <TextField
                      id="checkout-neighborhood"
                      label="Bairro (opcional)"
                      value={checkout.neighborhood}
                      onChange={(neighborhood) => updateCheckout({ neighborhood })}
                      placeholder="Ex.: Centro"
                    />
                    <TextField
                      id="checkout-reference"
                      label="Ponto de referência (opcional)"
                      value={checkout.reference}
                      onChange={(reference) => updateCheckout({ reference })}
                      placeholder="Ex.: casa azul ao lado da padaria"
                    />
                  </>
                ) : (
                  <p className="rounded-xl bg-night/5 px-3 py-2 text-sm text-night/70">
                    Você busca o pedido no local. Avisamos pelo WhatsApp quando estiver pronto.
                  </p>
                )}

                <div id={fieldIds.payment}>
                  <span className="text-sm font-semibold text-night">Forma de pagamento</span>
                  <ChoiceGroup>
                    {paymentOptions.map(([id, label]) => (
                      <Choice
                        key={id}
                        active={checkout.payment === id}
                        onClick={() => updateCheckout({ payment: id })}
                      >
                        {label}
                      </Choice>
                    ))}
                  </ChoiceGroup>
                  {isMissing('payment') ? (
                    <p className="mt-1 text-xs font-medium text-tomato">Escolha como vai pagar.</p>
                  ) : null}
                </div>

                {checkout.payment === 'dinheiro' ? (
                  <TextField
                    id="checkout-change"
                    label="Troco para quanto? (opcional)"
                    value={checkout.changeFor}
                    onChange={(changeFor) => updateCheckout({ changeFor })}
                    inputMode="decimal"
                    placeholder="Ex.: 100"
                    prefix="R$"
                  />
                ) : null}

                <label className="block">
                  <span className="text-sm font-semibold text-night">Observações (opcional)</span>
                  <textarea
                    value={orderNote}
                    onChange={(event) => setOrderNote(event.target.value)}
                    rows={2}
                    maxLength={300}
                    placeholder="Ex.: sem cebola, campainha não funciona..."
                    className="mt-2 w-full resize-none rounded-xl border border-night/15 bg-white px-3 py-2 text-sm text-night outline-none focus:border-tomato/50"
                  />
                </label>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="border-t border-night/10 px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-3">
          <div className="mb-3 flex items-end justify-between">
            <span className="text-sm text-night/60">Total</span>
            <span className="font-display text-2xl text-tomato">{formatPrecoBRL(total)}</span>
          </div>
          {showErrors && missingCheckoutFields.length > 0 ? (
            <p className="mb-2 text-center text-xs font-medium text-tomato">
              Preencha os campos marcados para enviar o pedido.
            </p>
          ) : null}
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <button
              type="button"
              onClick={() => {
                clearCart()
                setShowErrors(false)
              }}
              disabled={itemCount === 0}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-night/15 px-4 text-xs font-semibold uppercase tracking-wide text-night/60 disabled:opacity-40"
            >
              Limpar
            </button>
            <a
              href={whatsappCheckoutHref}
              target="_blank"
              rel="noreferrer"
              onClick={handleSend}
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

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  prefix,
  error,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
  inputMode?: 'decimal' | 'text'
  prefix?: string
  error?: string
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-semibold text-night">{label}</span>
      <span
        className={`mt-2 flex items-center rounded-xl border bg-white px-3 focus-within:border-tomato/50 ${
          error ? 'border-tomato' : 'border-night/15'
        }`}
      >
        {prefix ? <span className="mr-2 text-sm text-night/50">{prefix}</span> : null}
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={120}
          aria-invalid={Boolean(error)}
          className="min-h-11 w-full bg-transparent py-2 text-base text-night outline-none placeholder:text-night/35 sm:text-sm"
        />
      </span>
      {error ? <span className="mt-1 block text-xs font-medium text-tomato">{error}</span> : null}
    </label>
  )
}

function ChoiceGroup({ children }: { children: ReactNode }) {
  return <div className="mt-2 flex flex-wrap gap-2">{children}</div>
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'min-h-10 rounded-full bg-night px-4 text-sm font-semibold text-cream'
          : 'min-h-10 rounded-full border border-night/20 px-4 text-sm font-medium text-night/75 transition hover:border-night/40'
      }
    >
      {children}
    </button>
  )
}
