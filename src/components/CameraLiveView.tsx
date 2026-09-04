import { useEffect, useState } from 'react'
import type { ArModel } from '../content/arModels'

type CameraLiveViewProps = {
  model: ArModel
  onClose: () => void
}

type CameraStatus = 'starting' | 'ready' | 'denied' | 'unavailable'

/**
 * Câmera do celular + pizza por cima, sem app da Play Store / ARCore.
 * Não detecta mesa de verdade; mostra o tamanho aproximado na tela ao vivo.
 */
export function CameraLiveView({ model, onClose }: CameraLiveViewProps) {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
  const [viewerEl, setViewerEl] = useState<HTMLElement | null>(null)
  const [status, setStatus] = useState<CameraStatus>('starting')
  const [modelReady, setModelReady] = useState(false)

  useEffect(() => {
    if (!videoEl) return

    let cancelled = false
    let stream: MediaStream | null = null

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unavailable')
        return
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        videoEl!.srcObject = stream
        await videoEl!.play().catch(() => undefined)
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('denied')
      }
    }

    void startCamera()

    return () => {
      cancelled = true
      stream?.getTracks().forEach((track) => track.stop())
      if (videoEl) videoEl.srcObject = null
    }
  }, [videoEl])

  useEffect(() => {
    if (!viewerEl) return

    function handleLoad() {
      setModelReady(true)
    }

    if ((viewerEl as HTMLElement & { loaded?: boolean }).loaded) {
      handleLoad()
    }

    viewerEl.addEventListener('load', handleLoad)
    return () => viewerEl.removeEventListener('load', handleLoad)
  }, [viewerEl])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
      aria-labelledby="camera-live-title"
    >
      <video
        ref={setVideoEl}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        autoPlay
        aria-hidden={status !== 'ready'}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65" />

      <header className="relative z-10 flex items-start justify-between gap-3 px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent-400">
            Câmera ao vivo
          </p>
          <h2 id="camera-live-title" className="mt-1 truncate text-lg font-semibold text-white">
            {model.label}
          </h2>
          <p className="mt-0.5 text-sm text-accent-400">
            Tamanho {model.sizeLabel} — {model.sizeCm} cm
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/55"
        >
          Fechar
        </button>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-2">
        {status === 'starting' ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-black/50 px-6 py-5 text-center backdrop-blur-sm">
            <div className="ar-spinner" aria-hidden="true" />
            <p className="text-sm text-white">Abrindo a câmera…</p>
          </div>
        ) : null}

        {status === 'denied' ? (
          <div className="mx-4 max-w-sm rounded-2xl bg-black/70 px-5 py-5 text-center backdrop-blur-sm">
            <p className="text-base font-medium text-white">Precisamos da câmera</p>
            <p className="mt-2 text-sm text-zinc-300">
              Permita o acesso à câmera nas configurações do navegador e tente de novo.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-xl bg-accent-400 px-4 py-2.5 text-sm font-semibold text-brand-950"
            >
              Voltar
            </button>
          </div>
        ) : null}

        {status === 'unavailable' ? (
          <div className="mx-4 max-w-sm rounded-2xl bg-black/70 px-5 py-5 text-center backdrop-blur-sm">
            <p className="text-base font-medium text-white">Câmera indisponível</p>
            <p className="mt-2 text-sm text-zinc-300">
              Este aparelho ou navegador não permite abrir a câmera por aqui.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-xl bg-accent-400 px-4 py-2.5 text-sm font-semibold text-brand-950"
            >
              Voltar
            </button>
          </div>
        ) : null}

        {status === 'ready' ? (
          <div className="relative flex h-[min(72vw,420px)] w-[min(72vw,420px)] items-center justify-center">
            {!modelReady ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
                <div className="ar-spinner" aria-hidden="true" />
                <p className="text-xs text-white/80">Colocando a pizza…</p>
              </div>
            ) : null}
            <model-viewer
              ref={(el) => setViewerEl(el)}
              src={model.src}
              alt={model.alt}
              camera-controls
              touch-action="none"
              auto-rotate
              interaction-prompt="none"
              shadow-intensity="0"
              exposure="1.05"
              scale={model.scale}
              loading="eager"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                opacity: modelReady ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
          </div>
        ) : null}
      </div>

      {status === 'ready' ? (
        <footer className="relative z-10 space-y-1 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 text-center">
          <p className="text-sm font-medium text-white">
            Aponte para a mesa e veja como fica a pizza
          </p>
          <p className="text-xs text-zinc-300">
            Gire com o dedo se quiser ver outro ângulo.
          </p>
        </footer>
      ) : null}
    </div>
  )
}
