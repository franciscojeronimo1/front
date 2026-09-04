import { useEffect, useState } from 'react'
import type { ArModel } from '../content/arModels'
import {
  getDeviceKind,
  readCanActivateAr,
  type ModelViewerArApi,
} from '../utils/arSupport'
import { CameraLiveView } from './CameraLiveView'

type ArViewerModalProps = {
  model: ArModel | null
  onClose: () => void
}

type ArAvailability = 'checking' | 'yes' | 'no'

function lockPageScroll() {
  const scrollY = window.scrollY
  const { style: bodyStyle } = document.body
  const { style: htmlStyle } = document.documentElement

  const previous = {
    bodyOverflow: bodyStyle.overflow,
    bodyPosition: bodyStyle.position,
    bodyTop: bodyStyle.top,
    bodyWidth: bodyStyle.width,
    htmlOverflow: htmlStyle.overflow,
    scrollY,
  }

  htmlStyle.overflow = 'hidden'
  bodyStyle.overflow = 'hidden'
  bodyStyle.position = 'fixed'
  bodyStyle.top = `-${scrollY}px`
  bodyStyle.width = '100%'

  return () => {
    htmlStyle.overflow = previous.htmlOverflow
    bodyStyle.overflow = previous.bodyOverflow
    bodyStyle.position = previous.bodyPosition
    bodyStyle.top = previous.bodyTop
    bodyStyle.width = previous.bodyWidth
    window.scrollTo(0, previous.scrollY)
  }
}

export function ArViewerModal({ model, onClose }: ArViewerModalProps) {
  const [viewerEl, setViewerEl] = useState<HTMLElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [arAvailability, setArAvailability] = useState<ArAvailability>('checking')
  const deviceKind = getDeviceKind()

  useEffect(() => {
    if (!model) {
      setCameraOpen(false)
      setArAvailability('checking')
    }
  }, [model])

  useEffect(() => {
    if (!model) return

    const unlock = lockPageScroll()

    function preventBackgroundTouch(event: TouchEvent) {
      if (event.target instanceof Element && event.target.closest('model-viewer')) {
        event.preventDefault()
      }
    }

    document.addEventListener('touchmove', preventBackgroundTouch, { passive: false })

    return () => {
      unlock()
      document.removeEventListener('touchmove', preventBackgroundTouch)
    }
  }, [model])

  useEffect(() => {
    if (!model) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (cameraOpen) setCameraOpen(false)
      else onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [model, onClose, cameraOpen])

  useEffect(() => {
    if (!model || !viewerEl) return

    setIsLoading(true)
    setHasError(false)
    setArAvailability('checking')

    const viewer = viewerEl as ModelViewerArApi

    function syncArAvailability() {
      setArAvailability(readCanActivateAr(viewer) ? 'yes' : 'no')
    }

    function handleLoad() {
      setIsLoading(false)
      setHasError(false)
      // O model-viewer atualiza canActivateAR após carregar / escolher o modo.
      window.setTimeout(syncArAvailability, 150)
      window.setTimeout(syncArAvailability, 600)
    }

    function handleError() {
      setIsLoading(false)
      setHasError(true)
      setArAvailability('no')
    }

    if (viewer.loaded) handleLoad()

    viewerEl.addEventListener('load', handleLoad)
    viewerEl.addEventListener('error', handleError)

    return () => {
      viewerEl.removeEventListener('load', handleLoad)
      viewerEl.removeEventListener('error', handleError)
    }
  }, [model, viewerEl])

  function handleOpenRealAr() {
    const viewer = viewerEl as ModelViewerArApi | null
    if (!viewer?.activateAR || !readCanActivateAr(viewer)) return
    // Precisa partir do clique do usuário (Scene Viewer / Quick Look).
    void viewer.activateAR()
  }

  if (!model) return null

  if (cameraOpen) {
    return <CameraLiveView model={model} onClose={() => setCameraOpen(false)} />
  }

  const showRealAr = arAvailability === 'yes'
  const busy = isLoading || hasError
  const tipText = getTipText(deviceKind, arAvailability)

  return (
    <div
      className="fixed inset-0 z-[70] flex touch-none items-end justify-center overscroll-none bg-black/80 p-0 sm:items-center sm:p-5"
      role="presentation"
      onClick={onClose}
      onTouchMove={(event) => event.preventDefault()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ar-modal-title"
        className="flex max-h-[94vh] w-full max-w-lg touch-auto flex-col overflow-hidden overscroll-contain rounded-t-[1.75rem] border border-white/10 bg-brand-950 shadow-2xl sm:rounded-[1.75rem]"
        onClick={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">
              Ver na sua mesa
            </p>
            <h2 id="ar-modal-title" className="mt-1 text-xl font-semibold text-white">
              {model.label}
            </h2>
            <p className="mt-1 text-sm font-medium text-accent-400">
              Tamanho {model.sizeLabel} — {model.sizeCm} cm
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Gire a pizza para ver mais detalhes. Depois escolha como quer ver o tamanho.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Fechar visualização"
          >
            Fechar
          </button>
        </div>

        <div className="relative min-h-[320px] flex-1 touch-none overscroll-none bg-gradient-to-b from-brand-900 to-brand-950 sm:min-h-[420px]">
          {isLoading ? (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-brand-950/90"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <div className="ar-spinner" aria-hidden="true" />
              <div className="text-center">
                <p className="text-sm font-medium text-white">Preparando a pizza…</p>
                <p className="mt-1 text-xs text-zinc-400">Isso pode levar alguns segundos</p>
              </div>
            </div>
          ) : null}

          {hasError ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-brand-950 px-6 text-center">
              <p className="text-sm font-medium text-white">Não foi possível carregar a pizza</p>
              <p className="text-xs text-zinc-400">Feche e tente abrir de novo.</p>
            </div>
          ) : null}

          <model-viewer
            ref={(el) => setViewerEl(el)}
            key={model.src}
            src={model.src}
            alt={model.alt}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="fixed"
            camera-controls
            touch-action="none"
            auto-rotate
            shadow-intensity="1"
            exposure="1"
            scale={model.scale}
            loading="eager"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '320px',
              touchAction: 'none',
              opacity: isLoading || hasError ? 0 : 1,
              transition: 'opacity 0.25s ease',
            }}
          >
            {/* Esconde o botão padrão; usamos nossos botões com texto claro. */}
            <button slot="ar-button" type="button" style={{ display: 'none' }} tabIndex={-1} />
          </model-viewer>
        </div>

        <div className="space-y-2.5 border-t border-white/10 px-5 py-4">
          {arAvailability === 'checking' && !busy ? (
            <p className="text-center text-xs text-zinc-500">Verificando se o celular permite tamanho real…</p>
          ) : null}

          {showRealAr ? (
            <button
              type="button"
              onClick={handleOpenRealAr}
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-400 px-4 py-3 text-sm font-semibold text-brand-950 transition hover:bg-accent-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <TableIcon />
              Ver na mesa (tamanho real)
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            disabled={busy}
            className={
              showRealAr
                ? 'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'
                : 'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-400 px-4 py-3 text-sm font-semibold text-brand-950 transition hover:bg-accent-500 disabled:cursor-not-allowed disabled:opacity-50'
            }
          >
            <CameraIcon />
            Ver na câmera
          </button>

          <p className="text-center text-xs leading-relaxed text-zinc-500">{tipText}</p>
        </div>
      </div>
    </div>
  )
}

function getTipText(
  deviceKind: ReturnType<typeof getDeviceKind>,
  arAvailability: ArAvailability
): string {
  if (arAvailability === 'yes') {
    if (deviceKind === 'ios') {
      return 'Tamanho real: Câmera para ver como fica a pizza na mesa.'
    }
    if (deviceKind === 'android') {
      return 'Tamanho real: Câmera para ver como fica a pizza na mesa.'
    }
    return 'Tamanho real: Câmera para ver como fica a pizza na mesa.'
  }

  if (deviceKind === 'desktop') {
    return 'No computador dá para girar a pizza. Para tamanho real na mesa, abra pelo celular.'
  }

  return 'Neste aparelho o tamanho real na mesa pode não estar disponível. Use a câmera para comparar.'
}

function CameraIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function TableIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10h18" />
      <path d="M5 10v10" />
      <path d="M19 10v10" />
      <path d="M3 6h18v4H3z" />
    </svg>
  )
}
