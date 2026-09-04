import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type ModelViewerProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  src?: string
  alt?: string
  ar?: boolean | string
  'ar-modes'?: string
  'ar-scale'?: string
  'camera-controls'?: boolean | string
  'touch-action'?: string
  'auto-rotate'?: boolean | string
  'shadow-intensity'?: string | number
  'environment-image'?: string
  exposure?: string | number
  scale?: string
  poster?: string
  loading?: 'auto' | 'lazy' | 'eager'
  reveal?: 'auto' | 'manual'
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerProps
    }
  }
}

export {}
