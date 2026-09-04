/** Modelos 3D para preview e câmera no cardápio. Escala em metros. */

export type ArModel = {
  id: string
  /** Nome amigável para o cliente */
  label: string
  /** Nome do item no cardápio (para bater com o sabor) */
  itemName: string
  /** Caminho público do arquivo .glb */
  src: string
  /**
   * Escala no model-viewer. Em câmera, 1 unidade ≈ 1 metro.
   * Pizza Grande 35 cm → ~0.35 se o modelo vier “tamanho 1”.
   */
  scale: string
  /** Diâmetro em centímetros (texto para o cliente) */
  sizeCm: number
  /** Rótulo do tamanho no cardápio */
  sizeLabel: string
  alt: string
}

/** Portuguesa Completa — único modelo liberado por enquanto (GLB otimizado com Draco). */
export const PORTUGUESA_COMPLETA_AR_MODEL: ArModel = {
  id: 'pizza-portuguesa-completa',
  label: 'Pizza Portuguesa Completa',
  itemName: 'PORTUGUESA COMPLETA',
  src: '/models/pizza-modelo-3d.glb',
  scale: '0.35 0.35 0.35',
  sizeCm: 35,
  sizeLabel: 'Grande',
  alt: 'Pizza Portuguesa Completa em tamanho Grande de 35 centímetros',
}

export function hasArModel(itemName: string): boolean {
  return itemName === PORTUGUESA_COMPLETA_AR_MODEL.itemName
}
