import { lazy, Suspense, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const PizzaBuilderContent = lazy(() => import('./PizzaBuilderContent'))

interface PizzaBuilderModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PizzaBuilderModal({ isOpen, onClose }: PizzaBuilderModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-night/95 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative h-full w-full max-w-[1400px] overflow-hidden rounded-3xl bg-gradient-to-b from-night-2 to-night-3 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-night-2 text-cream-muted transition hover:border-cream/30 hover:text-cream"
          aria-label="Fechar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gold/20 border-t-gold"></div>
                <p className="text-cream-muted">Carregando Monte sua pizza...</p>
              </div>
            </div>
          }
        >
          <PizzaBuilderContent onClose={onClose} />
        </Suspense>
      </div>
    </div>,
    document.body
  )
}
