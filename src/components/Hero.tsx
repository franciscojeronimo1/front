import { motion, useReducedMotion } from 'motion/react'
import { heroImage } from '../content/menuImages'
import { siteContent } from '../content/siteContent'
import { useVisitMode } from '../context/VisitModeContext'
import { OpenStatusBadge } from './OpenStatusBadge'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const { isLocal } = useVisitMode()
  const hero = isLocal ? siteContent.heroLocal : siteContent.hero
  const reduceMotion = useReducedMotion()

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        }

  return (
    <section
      className={
        isLocal
          ? 'relative min-h-[56vh] overflow-hidden border-b border-cream/10 sm:min-h-[62vh]'
          : 'relative min-h-[78vh] overflow-hidden border-b border-cream/10 sm:min-h-[88vh]'
      }
    >
      <motion.img
        src={heroImage}
        alt="Pizza da Claudia Delivery"
        className="absolute inset-0 h-full w-full object-cover"
        width={2000}
        height={1200}
        loading="eager"
        fetchPriority="high"
        initial={reduceMotion ? false : { scale: 1.1 }}
        animate={reduceMotion ? undefined : { scale: 1 }}
        transition={{ duration: 14, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-night via-night/88 to-night/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-night/50" />
      <div className="ambient-ring -left-24 top-1/3 h-72 w-72 bg-tomato/20" aria-hidden />
      <div
        className="ambient-ring -right-16 bottom-0 h-64 w-64 bg-gold/15"
        style={{ animationDelay: '2.5s' }}
        aria-hidden
      />

      <div
        className={
          isLocal
            ? 'relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-12 pt-24 sm:px-5 sm:pb-16 sm:pt-28'
            : 'relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-5 sm:pb-24 sm:pt-36'
        }
      >
        {!isLocal ? (
          <motion.div className="mb-5 flex flex-wrap items-center gap-3" {...fadeUp(0.05)}>
            <OpenStatusBadge showHoursWhenClosed={false} />
          </motion.div>
        ) : (
          <motion.p
            className="mb-4 inline-flex w-fit rounded-full border border-gold/40 bg-night/55 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur-md"
            {...fadeUp(0.05)}
          >
            Peça ao garçom
          </motion.p>
        )}

        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.26em] text-gold"
          {...fadeUp(0.12)}
        >
          {hero.eyebrow}
        </motion.p>

        <motion.h1
          className="mt-4 max-w-3xl font-display text-[2.6rem] leading-[1.05] tracking-tight text-cream sm:text-6xl lg:text-7xl"
          {...fadeUp(0.22)}
        >
          {hero.titleLead}
          <span className="gold-shimmer italic">{hero.titleAccent}</span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-md text-base leading-relaxed text-cream-muted sm:text-lg"
          {...fadeUp(0.34)}
        >
          {hero.subtitle}
        </motion.p>

        <motion.div className="mt-9 flex flex-wrap items-center gap-3" {...fadeUp(0.46)}>
          <a
            href="#cardapio"
            className="cta-glow inline-flex min-h-12 items-center justify-center rounded-full bg-tomato px-8 py-3 text-sm font-semibold text-white hover:bg-tomato-dark"
          >
            {hero.cta}
          </a>
          {!isLocal ? (
            <a
              href="#contato"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream/90 transition hover:border-cream/55 hover:bg-cream/5"
            >
              Contato
            </a>
          ) : null}
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-night to-transparent"
        aria-hidden
      />
    </section>
  )
}
