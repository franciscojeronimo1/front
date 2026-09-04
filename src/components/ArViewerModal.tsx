import { useEffect, useState } from 'react'
import type { ArModel } from '../content/arModels'
import { CameraLiveView } from './CameraLiveView'

type ArViewerModalProps = {
  model: ArModel | null
  onClose: () => void
}

export function ArViewerModal({ model, onClose }: ArViewerModalProps) {
  const [viewerEl, setViewerEl] = useState<HTMLElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)

  useEffect(() => {
    if (!model) {
      setCameraOpen(false)
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (cameraOpen) setCameraOpen(false)
        else onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [model, onClose, cameraOpen])

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

    if ((viewerEl as HTMLElement & { loaded?: boolean }).loaded) {
      handleLoad()
    }

    viewerEl.addEventListener('load', handleLoad)
    viewerEl.addEventListener('error', handleError)

    return () => {
      viewerEl.removeEventListener('load', handleLoad)
      viewerEl.removeEventListener('error', handleError)
    }
  }, [model, viewerEl])

  if (!model) return null

  if (cameraOpen) {
    return <CameraLiveView model={model} onClose={() => setCameraOpen(false)} />
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-5"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ar-modal-title"
        className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] border border-white/10 bg-brand-950 shadow-2xl sm:rounded-[1.75rem]"
        onClick={(event) => event.stopPropagation()}
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
              Gire a pizza para ver mais detalhes. Depois abra a câmera para comparar o tamanho
              real.
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

        <div className="relative min-h-[320px] flex-1 bg-gradient-to-b from-brand-900 to-brand-950 sm:min-h-[420px]">
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
            camera-controls
            touch-action="pan-y"
            auto-rotate
            shadow-intensity="1"
            exposure="1"
            scale={model.scale}
            loading="eager"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '320px',
              opacity: isLoading || hasError ? 0 : 1,
              transition: 'opacity 0.25s ease',
            }}
          />
        </div>

        <div className="space-y-3 border-t border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            disabled={isLoading || hasError}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-400 px-4 py-3 text-sm font-semibold text-brand-950 transition hover:bg-accent-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CameraIcon />
            Abrir câmera
          </button>
          <p className="text-center text-xs text-zinc-500">
            Usa a câmera do seu celular.
          </p>
        </div>
      </div>
    </div>
  )
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
