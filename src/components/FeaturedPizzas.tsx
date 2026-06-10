import {
  type CardapioItem,
  type CardapioSecao,
  type SizePrices,
  cardapioSecoes,
  formatPrecoBRL,
} from '../content/cardapio'
import { siteContent } from '../content/siteContent'
import { OrderPizzaButton } from './OrderPizzaButton'

function minPrice(prices: SizePrices): number {
  return Math.min(...prices)
}

function startingPrice(item: CardapioItem, secao: CardapioSecao): string | null {
  const prices = item.prices ?? secao.faixaPreco
  if (!prices) return null
  return `A partir de ${formatPrecoBRL(minPrice(prices))}`
}

const cardGradients = [
  'from-[#9f1239]/30 via-brand-900 to-brand-950',
  'from-amber-700/25 via-brand-900 to-brand-950',
  'from-orange-800/20 via-brand-900 to-brand-950',
  'from-rose-900/25 via-brand-900 to-brand-950',
] as const

export function FeaturedPizzas() {
  const featured = siteContent.featuredPizzas
    .map((entry, index) => {
      const secao = cardapioSecoes.find((section) => section.id === entry.sectionId)
      const item = secao?.itens.find((pizza) => pizza.name === entry.itemName)
      if (!secao || !item) return null

      return { entry, secao, item, index }
    })
    .filter((value): value is NonNullable<typeof value> => value !== null)

  if (featured.length === 0) return null

  return (
    <section className="border-b border-white/10 bg-brand-950">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent-400">
              Destaques
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Sabores que mais saem
            </h2>
            <p className="text-lg text-zinc-400">
              Os preferidos da casa — monte inteira ou meia a meia e adicione ao pedido.
            </p>
          </div>
          <a
            href="#cardapio"
            className="text-sm font-semibold text-accent-400 transition hover:text-accent-500"
          >
            Ver todos os sabores →
          </a>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map(({ entry, secao, item, index }) => {
            const price = startingPrice(item, secao)

            return (
              <li
                key={`${entry.sectionId}-${entry.itemName}`}
                className="animate-rise group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03]"
              >
                <div
                  className={`relative flex h-36 items-end bg-gradient-to-br ${cardGradients[index % cardGradients.length]} p-5`}
                >
                  <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-zinc-200 backdrop-blur-sm">
                    {entry.tag}
                  </span>
                </div>

                <div className="space-y-3 p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      {secao.subtitulo}
                    </p>
                    <h3 className="mt-1 text-base font-bold uppercase tracking-wide text-white">
                      {item.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                      {item.ingredients}
                    </p>
                  </div>

                  {price ? (
                    <p className="text-sm font-semibold text-accent-400">{price}</p>
                  ) : null}

                  <OrderPizzaButton
                    pizza={{
                      sectionId: secao.id,
                      sectionLabel: secao.subtitulo,
                      itemName: item.name,
                    }}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition group-hover:brightness-110 hover:bg-[#20bd5a]"
                  >
                    Pedir
                  </OrderPizzaButton>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
