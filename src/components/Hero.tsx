import { imagery, siteContent } from '../content/siteContent'
import { OpenStatusBadge } from './OpenStatusBadge'
import { WhatsAppButton } from './WhatsAppButton'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-[center_top] opacity-[0.22]"
        style={{ backgroundImage: `url(${imagery.hero})` }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-950 via-brand-950/94 to-brand-950" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:gap-14 sm:px-5 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:py-28">
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <p className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-zinc-300 sm:text-xs sm:tracking-[0.18em]">
              Claudia Delivery
            </p>
            <OpenStatusBadge showHoursWhenClosed={false} />
          </div>
          <div className="space-y-4 sm:space-y-5">
            <h1 className="text-[1.85rem] font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl sm:leading-tight lg:text-6xl">
              {siteContent.hero.title}
            </h1>
            <p className="max-w-xl text-base text-zinc-400 sm:text-xl">
              {siteContent.hero.subtitle}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <WhatsAppButton className="w-full sm:w-auto">
              {siteContent.hero.ctaPrimary}
            </WhatsAppButton>
            <a
              href="#cardapio"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/15 px-6 py-3 text-base font-medium text-white/90 transition hover:border-white/30 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 sm:w-auto"
            >
              {siteContent.hero.ctaSecondary}
            </a>
          </div>
          <dl className="grid max-w-lg grid-cols-3 gap-2 text-sm text-zinc-400 sm:gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
              <dt className="text-[0.65rem] uppercase tracking-wider text-zinc-500 sm:text-xs">
                Sabores
              </dt>
              <dd className="mt-1 text-sm font-semibold text-white sm:text-base">+20 opções</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
              <dt className="text-[0.65rem] uppercase tracking-wider text-zinc-500 sm:text-xs">
                Tamanhos
              </dt>
              <dd className="mt-1 text-sm font-semibold text-white sm:text-base">4 opções</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
              <dt className="text-[0.65rem] uppercase tracking-wider text-zinc-500 sm:text-xs">
                Pedido
              </dt>
              <dd className="mt-1 text-sm font-semibold text-white sm:text-base">1 clique</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-accent-500/25 via-transparent to-amber-200/10 blur-3xl sm:-inset-6" />
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 shadow-2xl shadow-black/50 ring-1 ring-white/10 sm:rounded-[2rem]">
            <img
              src={imagery.hero}
              alt="Pizza artesanal da Claudia Delivery em Santana do Jacaré."
              className="aspect-[5/4] w-full object-cover sm:aspect-[5/6]"
              width={900}
              height={1080}
              loading="eager"
              fetchPriority="high"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/10 bg-black/50 p-3 backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5 sm:p-4">
              <p className="text-xs font-medium text-white sm:text-sm">
                Pizza e esfiha em Santana do Jacaré — cardápio completo no site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
