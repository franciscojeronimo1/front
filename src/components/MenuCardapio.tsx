import {
  type CardapioItem,
  type CardapioSecao,
  type SizePrices,
  formatPrecoBRL,
  cardapioSecoes,
} from '../content/cardapio'
import { siteContent } from '../content/siteContent'
import { OrderPizzaButton } from './OrderPizzaButton'
import { WhatsAppButton } from './WhatsAppButton'

const SIZE_LABELS = ['Pequena', 'Média', 'Grande', 'Família'] as const

function SizePriceGrid({ prices }: { prices: SizePrices }) {
  return (
    <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {SIZE_LABELS.map((label, index) => (
        <li
          key={label}
          className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-center"
        >
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-neutral-500">
            {label}
          </p>
          <p className="mt-0.5 font-sans text-sm font-semibold text-[#9f1239]">
            {formatPrecoBRL(prices[index])}
          </p>
        </li>
      ))}
    </ul>
  )
}

function PrecoPorItem({ item }: { item: CardapioItem }) {
  if (!item.prices) return null
  return <SizePriceGrid prices={item.prices} />
}

function FaixaDaSecao({ secao }: { secao: CardapioSecao }) {
  if (!secao.faixaPreco) return null
  return (
    <div className="mt-8 border-t border-neutral-200 pt-6 sm:mt-10 sm:pt-8">
      <p className="text-center font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#9f1239] sm:tracking-[0.2em]">
        Preços por tamanho
      </p>
      <SizePriceGrid prices={secao.faixaPreco} />
    </div>
  )
}

function PizzaRow({
  item,
  sectionId,
  subtitulo,
  mostrarFaixaPorItem,
}: {
  item: CardapioItem
  sectionId: string
  subtitulo: string
  mostrarFaixaPorItem: boolean
}) {
  return (
    <li className="border-b border-neutral-100 py-6 last:border-b-0 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="font-sans text-sm font-bold uppercase tracking-wide text-[#9f1239] sm:text-base">
            {item.name}
          </h4>
          <p className="mt-2 font-menu-serif text-[0.9375rem] leading-relaxed text-neutral-900">
            {item.ingredients}
          </p>
          {item.note ? (
            <p className="mt-2 font-menu-serif text-sm italic text-neutral-600">{item.note}</p>
          ) : null}
          {mostrarFaixaPorItem ? <PrecoPorItem item={item} /> : null}
        </div>
        <OrderPizzaButton
          pizza={{
            sectionId,
            sectionLabel: subtitulo,
            itemName: item.name,
          }}
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-xl border border-[#9f1239]/35 bg-[#9f1239]/[0.06] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#9f1239] transition hover:bg-[#9f1239]/10 hover:text-[#7f122d] sm:w-auto"
        />
      </div>
    </li>
  )
}

export function MenuCardapio() {
  return (
    <section
      id="cardapio"
      className="border-b border-white/10 bg-gradient-to-b from-brand-950 to-brand-950"
    >
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-5 sm:py-20 lg:py-28">
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-xl space-y-3 text-white sm:space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent-400">
              Cardápio
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
              Sabores e tamanhos
            </h2>
            <p className="text-base text-zinc-400 sm:text-lg">{siteContent.cardapioNota}</p>
          </div>
          <WhatsAppButton variant="solidWhatsApp" className="w-full justify-center sm:w-auto">
            Falar no WhatsApp
          </WhatsAppButton>
        </div>

        <div className="space-y-8 sm:space-y-10">
          {cardapioSecoes.map((secao) => (
            <article
              key={secao.id}
              className="rounded-[1.5rem] bg-white px-4 py-8 shadow-2xl shadow-black/35 sm:rounded-[2rem] sm:px-10 sm:py-14"
            >
              <header className="border-b border-neutral-100 pb-6 text-center sm:pb-8">
                <p className="font-display text-3xl font-semibold uppercase tracking-[0.04em] text-neutral-950 sm:text-5xl">
                  PIZZAS
                </p>
                <h3 className="mt-2 break-words font-script text-3xl text-neutral-900 sm:text-5xl">
                  {secao.subtitulo}
                </h3>
              </header>

              <ul className="mt-2">
                {secao.itens.map((item) => (
                  <PizzaRow
                    key={`${secao.id}-${item.name}`}
                    item={item}
                    sectionId={secao.id}
                    subtitulo={secao.subtitulo}
                    mostrarFaixaPorItem={secao.id === 'queijos'}
                  />
                ))}
              </ul>

              {secao.faixaPreco ? <FaixaDaSecao secao={secao} /> : null}

              {secao.id === 'queijos' ? (
                <div className="mt-8 border-t border-neutral-200 pt-6 sm:mt-10">
                  <p className="text-center font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#9f1239]">
                    Preços por tamanho
                  </p>
                  <p className="mt-2 font-menu-serif text-center text-sm text-neutral-600">
                    Valores ao lado de cada combinação de queijos.
                  </p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
