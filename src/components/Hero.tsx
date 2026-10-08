import { heroImage } from '../content/menuImages'
import { siteContent } from '../content/siteContent'
import { useVisitMode } from '../context/VisitModeContext'
import { OpenStatusBadge } from './OpenStatusBadge'

export function Hero() {
  const { isLocal } = useVisitMode()
  const hero = isLocal ? siteContent.heroLocal : siteContent.hero

  return (
    <section
      className={
        isLocal
          ? 'relative min-h-[52vh] overflow-hidden border-b border-cream/10 sm:min-h-[58vh]'
          : 'relative min-h-[72vh] overflow-hidden border-b border-cream/10 sm:min-h-[78vh]'
      }
    >
      <img
        src={heroImage}
        alt="Pizza da Claudia Delivery"
        className="absolute inset-0 h-full w-full object-cover"
        width={2000}
        height={1200}
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/40" />

      <div
        className={
          isLocal
            ? 'relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-10 pt-24 sm:px-5 sm:pb-14 sm:pt-28'
            : 'relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-14 pt-28 sm:px-5 sm:pb-20 sm:pt-36'
        }
      >
        {!isLocal ? (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <OpenStatusBadge showHoursWhenClosed={false} />
          </div>
        ) : (
          <p className="mb-3 inline-flex w-fit rounded-full border border-gold/35 bg-night/50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold">
            Peça ao garçom
          </p>
        )}
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{hero.eyebrow}</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.1] text-cream sm:text-5xl lg:text-6xl">
          {hero.titleLead}
          <span className="text-gold">{hero.titleAccent}</span>
        </h1>
        <p className="mt-5 max-w-lg text-base text-cream-muted sm:text-lg">{hero.subtitle}</p>
        <div className="mt-8">
          <a
            href="#cardapio"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-cream/35 px-7 py-3 text-sm font-semibold text-cream transition hover:border-cream/60 hover:bg-cream/5"
          >
            {hero.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
