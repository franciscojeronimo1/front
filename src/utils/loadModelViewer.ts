let modelViewerPromise: Promise<unknown> | null = null

/** Baixa o visualizador 3D só quando alguém for usar (é a parte mais pesada do site). */
export function loadModelViewer(): Promise<unknown> {
  modelViewerPromise ??= import('@google/model-viewer').catch((error) => {
    modelViewerPromise = null
    throw error
  })
  return modelViewerPromise
}
