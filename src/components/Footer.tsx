import { WHATSAPP_DISPLAY, siteContent, whatsappHref } from '../content/siteContent'
import { useVisitMode } from '../context/VisitModeContext'
import { Reveal } from './Reveal'

type FooterProps = {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  const { isLocal } = useVisitMode()

  return (
    <footer id="contato" className={`relative overflow-hidden border-t border-cream/10 bg-night ${className}`}>
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-tomato/10 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-5 md:grid-cols-3">
        <Reveal>
          <p className="font-display text-3xl italic text-gold sm:text-4xl">{siteContent.brandName}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-muted">
            {isLocal
              ? 'Cardápio digital para consultar na mesa. Seu pedido é com o garçom.'
              : siteContent.footer.area}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/80">
            Atendimento
          </p>
          <p className="mt-4 text-cream">{siteContent.footer.hours}</p>
          <p className="mt-1 text-sm text-cream-muted">{siteContent.footer.esfihasNote}</p>
          <p className="mt-4 text-sm text-cream-muted">{siteContent.footer.locationLabel}</p>
        </Reveal>

        <Reveal delay={140}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/80">
            {isLocal ? 'Dúvidas' : 'Pedidos'}
          </p>
          {isLocal ? (
            <p className="mt-4 text-sm leading-relaxed text-cream-muted">
              Chame o garçom na mesa.
            </p>
          ) : (
            <a
              href={whatsappHref('pedido')}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block font-display text-2xl text-gold transition hover:text-gold-soft sm:text-3xl"
            >
              {WHATSAPP_DISPLAY}
            </a>
          )}
          <a
            href={siteContent.footer.instagramHref}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-10 items-center text-sm text-cream-muted transition hover:text-cream"
          >
            {siteContent.footer.instagramLabel}
          </a>
        </Reveal>
      </div>

      <div className="relative border-t border-cream/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-cream-muted/55 sm:px-5">
          © {new Date().getFullYear()} {siteContent.brandName}
        </p>
      </div>
    </footer>
  )
}
