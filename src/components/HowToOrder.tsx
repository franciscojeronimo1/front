import { siteContent } from '../content/siteContent'
import { WhatsAppButton } from './WhatsAppButton'

export function HowToOrder() {
  return (
    <section className="border-b border-white/10 bg-brand-950">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent-400">
            Simples e rápido
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Como pedir sua pizza
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Em poucos toques você monta o pedido e fala direto com a Claudia Delivery.
          </p>
        </div>

        <ol className="grid gap-6 md:grid-cols-3">
          {siteContent.orderSteps.map((step, index) => (
            <li
              key={step.title}
              className="animate-rise relative rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <span className="font-display text-5xl font-semibold text-white/10">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <WhatsAppButton>{siteContent.hero.ctaPrimary}</WhatsAppButton>
          <a
            href="#cardapio"
            className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/30 hover:bg-white/5"
          >
            Ver cardápio completo
          </a>
        </div>
      </div>
    </section>
  )
}
