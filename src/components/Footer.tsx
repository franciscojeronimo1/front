import { WHATSAPP_DISPLAY, siteContent, whatsappHref } from '../content/siteContent'
import { useVisitMode } from '../context/VisitModeContext'

type FooterProps = {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  const { isLocal } = useVisitMode()

  return (
    <footer id="contato" className={`border-t border-cream/10 bg-night ${className}`}>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-5 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl italic text-gold">{siteContent.brandName}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream-muted">
            {isLocal
              ? 'Cardápio digital para consultar na mesa. Seu pedido é com o garçom.'
              : siteContent.footer.area}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream-muted">
            Atendimento
          </p>
          <p className="mt-3 text-cream">{siteContent.footer.hours}</p>
          <p className="mt-1 text-sm text-cream-muted">{siteContent.footer.esfihasNote}</p>
          <p className="mt-3 text-sm text-cream-muted">{siteContent.footer.locationLabel}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream-muted">
            {isLocal ? 'Dúvidas' : 'Pedidos'}
          </p>
          {isLocal ? (
            <p className="mt-3 text-sm leading-relaxed text-cream-muted">
              Chame o garçom na mesa.
            </p>
          ) : (
            <a
              href={whatsappHref('pedido')}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block font-display text-2xl text-gold transition hover:text-gold-soft"
            >
              {WHATSAPP_DISPLAY}
            </a>
          )}
          <a
            href={siteContent.footer.instagramHref}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-h-10 items-center text-sm text-cream-muted transition hover:text-cream"
          >
            {siteContent.footer.instagramLabel}
          </a>
        </div>
      </div>

      <div className="border-t border-cream/5">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-cream-muted/60 sm:px-5">
          © {new Date().getFullYear()} {siteContent.brandName}
        </p>
      </div>
    </footer>
  )
}
