import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function setLenisInstance(instance: Lenis | null) {
  lenis = instance
}

/** Rola até o elemento com Lenis quando disponível. */
export function smoothScrollTo(
  target: HTMLElement | string,
  options: { offset?: number } = {}
) {
  const el =
    typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return

  const offset = options.offset ?? -96

  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.15 })
    return
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
