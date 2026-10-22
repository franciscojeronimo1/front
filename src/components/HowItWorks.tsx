import { siteContent } from '../content/siteContent'
import { useVisitMode } from '../context/VisitModeContext'
import { Reveal } from './Reveal'

const stepsDelivery = [
  {
    n: '01',
    title: 'Escolha os sabores',
    text: 'Pizzas, esfihas e bebidas no cardápio digital — com busca e filtros.',
  },
  {
    n: '02',
    title: 'Monte o pedido',
    text: 'Tamanho, meia a meia, quantidade e observações na comanda.',
  },
  {
    n: '03',
    title: 'Finalize no WhatsApp',
    text: 'Endereço e pagamento já vão na mensagem. Entrega em ~40–60 min.',
  },
] as const

const stepsLocal = [
  {
    n: '01',
    title: 'Explore o cardápio',
    text: 'Veja sabores, preços e detalhes sem pressa, direto na mesa.',
  },
  {
    n: '02',
    title: 'Escolha com calma',
    text: 'Use busca e filtros pra achar o que combina com o momento.',
  },
  {
    n: '03',
    title: 'Peça ao garçom',
    text: 'Quando decidir, chame o atendimento — o pedido é na mesa.',
  },
] as const

export function HowItWorks() {
  const { isLocal } = useVisitMode()
  const steps = isLocal ? stepsLocal : stepsDelivery

  return (
    <section className="relative border-b border-cream/10 bg-night-elevated/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            {isLocal ? 'Na mesa' : 'Como pedir'}
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl text-cream sm:text-4xl">
            {isLocal ? 'Simples de consultar.' : 'Do cardápio ao WhatsApp em três passos.'}
          </h2>
        </Reveal>

        <ol className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {steps.map((step, index) => (
            <Reveal key={step.n} as="li" delay={index * 90} className="relative">
              <p className="font-display text-4xl italic text-gold/35">{step.n}</p>
              <h3 className="mt-3 font-display text-xl text-cream">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-muted">{step.text}</p>
            </Reveal>
          ))}
        </ol>

        {!isLocal ? (
          <Reveal delay={280} className="mt-10">
            <a
              href="#cardapio"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-gold transition hover:text-gold-soft"
            >
              {siteContent.hero.cta}
              <span className="ml-2" aria-hidden>
                →
              </span>
            </a>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
