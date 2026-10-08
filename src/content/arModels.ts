/** Modelos 3D do cardápio. Só itens com `src` ficam disponíveis. */

export type ArModel = {
  id: string
  label: string
  itemName: string
  /** Se undefined, o item fica pronto para receber o modelo depois. */
  src?: string
  scale: string
  sizeCm: number
  sizeLabel: string
  alt: string
}

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

/** Catálogo: itens sem `src` já estão previstos para GLB futuros. */
export const AR_MODELS: readonly ArModel[] = [PORTUGUESA_COMPLETA_AR_MODEL]

export function getArModel(itemName: string): ArModel | undefined {
  return AR_MODELS.find((model) => model.itemName === itemName)
}

export function has3dModel(itemName: string): boolean {
  const model = getArModel(itemName)
  return Boolean(model?.src)
}
