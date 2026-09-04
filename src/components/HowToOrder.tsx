import { siteContent } from '../content/siteContent'
import { WhatsAppButton } from './WhatsAppButton'

export function HowToOrder() {
  return (
    <section className="border-b border-white/10 bg-brand-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16 lg:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent-400">
            Simples e rápido
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            Como pedir sua pizza
          </h2>
          <p className="mt-4 text-base text-zinc-400 sm:text-lg">
            Em poucos toques você monta o pedido e fala direto com a Claudia Delivery.
          </p>
        </div>

        <ol className="grid gap-6 md:grid-cols-3">
          {siteContent.orderSteps.map((step, index) => (
            <li
              key={step.title}
              className="animate-rise relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
            >
              <span className="font-display text-5xl font-semibold text-white/10">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <WhatsAppButton className="w-full sm:w-auto">
            {siteContent.hero.ctaPrimary}
          </WhatsAppButton>
          <a
            href="#cardapio"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/30 hover:bg-white/5 sm:w-auto"
          >
            Ver cardápio completo
          </a>
        </div>
      </div>
    </section>
  )
}
