import { useEffect, useState } from 'react'
import { isRestaurantOpen, restaurantHoursLabel } from '../utils/openHours'

type OpenStatusBadgeProps = {
  className?: string
  showHoursWhenClosed?: boolean
}

export function OpenStatusBadge({
  className = '',
  showHoursWhenClosed = true,
}: OpenStatusBadgeProps) {
  const [open, setOpen] = useState(() => isRestaurantOpen())

  useEffect(() => {
    const sync = () => setOpen(isRestaurantOpen())
    sync()
    const interval = window.setInterval(sync, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  if (open) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300 ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        Aberto agora
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-cream/20 bg-night/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cream-muted ${className}`}
    >
      <span className="h-2 w-2 rounded-full bg-cream-muted" aria-hidden />
      Fechado
      {showHoursWhenClosed ? (
        <span className="normal-case tracking-normal text-cream-muted/80">
          · hoje das {restaurantHoursLabel()}
        </span>
      ) : null}
    </span>
  )
}
