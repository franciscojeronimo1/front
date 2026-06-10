const OPEN_HOUR = 18
const CLOSE_HOUR = 22
const TIMEZONE = 'America/Sao_Paulo'

function getLocalMinutes(date: Date): number {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0)

  return hour * 60 + minute
}

export function isRestaurantOpen(now = new Date()): boolean {
  const minutes = getLocalMinutes(now)
  return minutes >= OPEN_HOUR * 60 && minutes < CLOSE_HOUR * 60
}

export function restaurantHoursLabel(): string {
  return `${String(OPEN_HOUR).padStart(2, '0')}:00 às ${String(CLOSE_HOUR).padStart(2, '0')}:00`
}
