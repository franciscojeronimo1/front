import { WHATSAPP_DISPLAY, siteContent, whatsappHref } from '../content/siteContent'
import { WhatsAppButton } from './WhatsAppButton'

type FooterProps = {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`border-t border-white/10 bg-black/55 ${className}`}>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:gap-12 sm:px-5 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-6">
          <span className="bg-gradient-to-r from-accent-400 to-amber-200 bg-clip-text text-xl font-semibold tracking-tight text-transparent">
            {siteContent.brandName}
          </span>
          <p className="max-w-xl text-base text-zinc-400 sm:text-lg">{siteContent.footer.area}</p>
          <dl className="space-y-2 text-sm text-zinc-400">
            <div>
              <dt className="font-semibold text-zinc-300">Localização</dt>
              <dd>{siteContent.footer.locationLabel}</dd>
            </div>
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
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-lg font-medium text-white">
            Pizza e esfiha em Santana do Jacaré
          </p>
          <p className="text-sm text-zinc-400">
            Escolha pizza, combos de esfiha ou 10 sabores à escolha e envie pelo WhatsApp.
          </p>
          <WhatsAppButton className="w-full justify-center md:w-fit">
            Falar agora com a Claudia Delivery
          </WhatsAppButton>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-500">
            <a
              href={siteContent.footer.instagramHref}
              className="inline-flex min-h-10 items-center text-zinc-300 transition hover:text-white"
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

      <div className="border-t border-white/5">
        <p className="mx-auto max-w-6xl px-5 py-4 text-center text-xs text-zinc-600">
          Feito por{' '}
          <a
            href="https://www.instagram.com/franciscojeronimo0/"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 transition hover:text-zinc-300"
          >
            Francisco Jerônimo
          </a>
        </p>
      </div>
    </footer>
  )
}
