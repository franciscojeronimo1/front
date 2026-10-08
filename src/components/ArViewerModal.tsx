import { useEffect, useState } from 'react'
import type { ArModel } from '../content/arModels'
import { loadModelViewer } from '../utils/loadModelViewer'

type ArViewerModalProps = {
  model: ArModel | null
  onClose: () => void
}

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

/** Preview 3D apenas (sem câmera/AR nesta etapa). */
export function ArViewerModal({ model, onClose }: ArViewerModalProps) {
  const [viewerEl, setViewerEl] = useState<HTMLElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [viewerReady, setViewerReady] = useState(false)

  useEffect(() => {
    if (!model) return
    let cancelled = false
    loadModelViewer()
      .then(() => {
        if (!cancelled) setViewerReady(true)
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false)
          setHasError(true)
        }
      })
    return () => {
      cancelled = true
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

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('touchmove', preventBackgroundTouch, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      unlock()
      document.removeEventListener('touchmove', preventBackgroundTouch)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [model, onClose])

  useEffect(() => {
    if (!model || !viewerEl) return

    setIsLoading(true)
    setHasError(false)

    function handleLoad() {
      setIsLoading(false)
      setHasError(false)
    }

    function handleError() {
      setIsLoading(false)
      setHasError(true)
    }

    if ((viewerEl as HTMLElement & { loaded?: boolean }).loaded) handleLoad()

    viewerEl.addEventListener('load', handleLoad)
    viewerEl.addEventListener('error', handleError)
    return () => {
      viewerEl.removeEventListener('load', handleLoad)
      viewerEl.removeEventListener('error', handleError)
    }
  }, [model, viewerEl])

  if (!model?.src) return null

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
        className="flex max-h-[94vh] w-full max-w-lg touch-auto flex-col overflow-hidden overscroll-contain rounded-t-[1.75rem] border border-cream/10 bg-night shadow-2xl sm:rounded-[1.75rem]"
        onClick={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-cream/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">De pertinho</p>
            <h2 id="ar-modal-title" className="mt-1 font-display text-2xl text-cream">
              {model.label}
            </h2>
            <p className="mt-1 text-sm font-medium text-gold">
              Tamanho {model.sizeLabel} — {model.sizeCm} cm
            </p>
            <p className="mt-2 text-sm text-cream-muted">
              Gire para ver a pizza ou aproxime para ver mais detalhes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-cream/15 px-3 py-1.5 text-sm text-cream-muted transition hover:bg-cream/5 hover:text-cream"
          >
            Fechar
          </button>
        </div>

        <div className="relative min-h-[320px] flex-1 touch-none bg-night-elevated sm:min-h-[420px]">
          {isLoading ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-night/90">
              <div className="ar-spinner" aria-hidden />
              <p className="text-sm text-cream">Preparando a pizza…</p>
            </div>
          ) : null}
          {hasError ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
              <p className="text-sm text-cream">Não foi possível carregar a pizza. Tente de novo.</p>
            </div>
          ) : null}
          {viewerReady ? (
            <model-viewer
              ref={(el) => setViewerEl(el)}
              key={model.src}
              src={model.src}
              alt={model.alt}
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
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
