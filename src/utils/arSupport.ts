/** Detecção aproximada de suporte a AR no aparelho (nunca 100% garantida). */

export type DeviceKind = 'ios' | 'android' | 'desktop'

export function getDeviceKind(): DeviceKind {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'desktop'
}

export function isMobileDevice(): boolean {
  return getDeviceKind() !== 'desktop'
}

export type ModelViewerArApi = HTMLElement & {
  canActivateAR?: boolean
  activateAR?: () => Promise<void>
  loaded?: boolean
}

export function readCanActivateAr(viewer: ModelViewerArApi | null): boolean {
  return Boolean(viewer?.canActivateAR)
}
