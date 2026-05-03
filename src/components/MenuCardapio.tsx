import {
  type CardapioItem,
  type CardapioSecao,
  formatFaixaPrecos,
  legendasTamanhos,
  cardapioSecoes,
} from '../content/cardapio'
import { siteContent, whatsappHrefPedidoPizza } from '../content/siteContent'
import { WhatsAppButton } from './WhatsAppButton'

function PrecoPorItem({ item }: { item: CardapioItem }) {
  if (!item.prices) return null
  return (
    <p className="mt-2 font-sans text-sm font-semibold tracking-tight text-[#9f1239]">
      {formatFaixaPrecos(item.prices)}
    </p>
  )
}

function FaixaDaSecao({ secao }: { secao: CardapioSecao }) {
  if (!secao.faixaPreco) return null
  return (
    <div className="mt-10 border-t border-neutral-200 pt-8">
      <p className="text-center font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#9f1239]">
        {legendasTamanhos}
      </p>
      <p className="mt-2 text-center font-menu-serif text-lg font-semibold text-[#9f1239]">
        {formatFaixaPrecos(secao.faixaPreco)}
      </p>
    </div>
  )
}

function PizzaRow({
  item,
  subtitulo,
  mostrarFaixaPorItem,
}: {
  item: CardapioItem
  subtitulo: string
  mostrarFaixaPorItem: boolean
}) {
  return (
    <li className="border-b border-neutral-100 py-8 last:border-b-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="font-sans text-base font-bold uppercase tracking-wide text-[#9f1239]">
            {item.name}
          </h4>
          <p className="mt-2 font-menu-serif text-[0.9375rem] leading-relaxed text-neutral-900">
            {item.ingredients}
          </p>
          {item.note ? (
            <p className="mt-2 font-menu-serif text-sm italic text-neutral-600">
              {item.note}
            </p>
          ) : null}
          {mostrarFaixaPorItem ? <PrecoPorItem item={item} /> : null}
        </div>
        <a
          href={whatsappHrefPedidoPizza(item.name, subtitulo)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[#9f1239]/35 bg-[#9f1239]/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#9f1239] transition hover:bg-[#9f1239]/10 hover:text-[#7f122d]"
        >
          Pedir
        </a>
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
      <div className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
        <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent-400">
              Cardápio
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Sabores e tamanhos
            </h2>
            <p className="text-lg text-zinc-400">{siteContent.cardapioNota}</p>
          </div>
          <WhatsAppButton variant="solidWhatsApp">Falar no WhatsApp</WhatsAppButton>
        </div>

        <div className="space-y-10">
          {cardapioSecoes.map((secao) => (
            <article
              key={secao.id}
              className="rounded-[2rem] bg-white px-6 py-10 shadow-2xl shadow-black/35 sm:px-10 sm:py-14"
            >
              <header className="border-b border-neutral-100 pb-8 text-center">
                <p className="font-display text-4xl font-semibold uppercase tracking-[0.04em] text-neutral-950 sm:text-5xl">
                  PIZZAS
                </p>
                <p className="mt-2 font-script text-4xl text-neutral-900 sm:text-5xl">
                  {secao.subtitulo}
                </p>
              </header>

              <ul className="mt-2">
                {secao.itens.map((item) => (
                  <PizzaRow
                    key={`${secao.id}-${item.name}`}
                    item={item}
                    subtitulo={secao.subtitulo}
                    mostrarFaixaPorItem={secao.id === 'queijos'}
                  />
                ))}
              </ul>

              {secao.faixaPreco ? <FaixaDaSecao secao={secao} /> : null}

              {secao.id === 'queijos' ? (
                <div className="mt-10 border-t border-neutral-200 pt-6">
                  <p className="text-center font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#9f1239]">
                    {legendasTamanhos}
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
