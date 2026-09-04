import { useEffect } from 'react'
import type { ArModel } from '../content/arModels'

type ArViewerModalProps = {
  model: ArModel | null
  onClose: () => void
}

export function ArViewerModal({ model, onClose }: ArViewerModalProps) {
  useEffect(() => {
    if (!model) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [model, onClose])

  if (!model) return null

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
              Gire a pizza para ver mais detalhes. No celular, abra a câmera para ver o tamanho real.
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
          <model-viewer
            key={model.src}
            src={model.src}
            alt={model.alt}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="fixed"
            camera-controls
            touch-action="pan-y"
            auto-rotate
            shadow-intensity="1"
            exposure="1"
            scale={model.scale}
            loading="eager"
            style={{ width: '100%', height: '100%', minHeight: '320px' }}
          />
        </div>

        <div className="space-y-2 border-t border-white/10 px-5 py-4 text-sm text-zinc-400">
          <p>
            No celular, toque no botão da câmera no visualizador para ver a pizza no tamanho
            real, como se estivesse na sua mesa.
          </p>
          <p className="text-xs text-zinc-500">
            Dica: aponte para o chão ou para a mesa e espere a pizza aparecer.
          </p>
        </div>
      </div>
    </div>
  )
}
