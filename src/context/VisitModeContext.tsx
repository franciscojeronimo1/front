import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'claudia-visit-mode'

export type VisitMode = 'delivery' | 'local'

type VisitModeContextValue = {
  mode: VisitMode
  isLocal: boolean
}

const VisitModeContext = createContext<VisitModeContextValue | null>(null)

/**
 * Detecta abertura pelo QR da pizzaria.
 * URL do QR (um pra todas as mesas): https://pizzariadeliverysj.com/?local=1
 * Também aceita ?qr=1
 * Mantém o modo na sessão do navegador enquanto a pessoa navega.
 */
function resolveVisitMode(): VisitMode {
  if (typeof window === 'undefined') return 'delivery'

  const params = new URLSearchParams(window.location.search)
  const fromUrl =
    params.get('local') === '1' ||
    params.get('qr') === '1' ||
    params.get('mesa') === 'local'

  if (fromUrl) {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'local')
    } catch {
      /* ignore */
    }
    return 'local'
  }

  try {
    if (sessionStorage.getItem(STORAGE_KEY) === 'local') return 'local'
  } catch {
    /* ignore */
  }

  return 'delivery'
}

export function VisitModeProvider({ children }: { children: ReactNode }) {
  const mode = useMemo(() => resolveVisitMode(), [])
  const value = useMemo(
    () => ({
      mode,
      isLocal: mode === 'local',
    }),
    [mode]
  )

  return (
    <VisitModeContext.Provider value={value}>{children}</VisitModeContext.Provider>
  )
}

export function useVisitMode() {
  const context = useContext(VisitModeContext)
  if (!context) {
    throw new Error('useVisitMode deve ser usado dentro de VisitModeProvider')
  }
  return context
}
