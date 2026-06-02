import { WHATSAPP_DISPLAY, siteContent, whatsappHref } from '../content/siteContent'
import { WhatsAppButton } from './WhatsAppButton'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/55">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-6">
          <span className="bg-gradient-to-r from-accent-400 to-amber-200 bg-clip-text text-xl font-semibold tracking-tight text-transparent">
            {siteContent.brandName}
          </span>
          <p className="max-w-xl text-lg text-zinc-400">{siteContent.footer.area}</p>
          <dl className="space-y-2 text-sm text-zinc-400">
            <div>
              <dt className="font-semibold text-zinc-300">Horário</dt>
              <dd>{siteContent.footer.hours}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-300">Contato rápido</dt>
              <dd>
                <a
                  className="text-accent-400 transition hover:text-accent-500"
                  href={whatsappHref('pedido')}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp {WHATSAPP_DISPLAY}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-lg font-medium text-white">
            Sua pizzaria em Santana do Jacaré está aqui
          </p>
          <p className="text-sm text-zinc-400">
            Escolha sabor e tamanho no cardápio e envie seu pedido pelo WhatsApp.
          </p>
          <WhatsAppButton className="w-full justify-center md:w-fit">
            Falar agora com a Claudia Delivery
          </WhatsAppButton>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-500">
            <a
              href={siteContent.footer.instagramHref}
              className="text-zinc-300 transition hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              {siteContent.footer.instagramLabel}
            </a>
            <span>
              © {new Date().getFullYear()} {siteContent.brandName}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
