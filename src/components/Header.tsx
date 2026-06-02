import { siteContent } from '../content/siteContent'
import { WhatsAppButton } from './WhatsAppButton'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <a href="#" className="group flex flex-col gap-0.5">
          <span className="bg-gradient-to-r from-accent-400 to-amber-200 bg-clip-text text-lg font-semibold tracking-tight text-transparent sm:text-xl">
            {siteContent.brandName}
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            Pizzaria em Santana do Jacaré
          </span>
        </a>
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="#cardapio"
            className="text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            Cardápio
          </a>
          <a
            href="#faq-local"
            className="hidden text-sm font-medium text-zinc-300 transition hover:text-white md:inline-flex"
          >
            FAQ
          </a>
          <WhatsAppButton variant="solidWhatsApp" className="hidden sm:inline-flex">
            Falar no WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </header>
  )
}
