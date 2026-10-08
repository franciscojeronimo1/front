/**
 * Imagens por item (Unsplash como placeholder até fotos oficiais).
 * Chave: `${sectionId}::${itemName}` ou id de esfiha/bebida.
 */

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`

const pizzaPool = [
  unsplash('photo-1513104890138-7c749659a591'),
  unsplash('photo-1565299624946-b28f40a0ae38'),
  unsplash('photo-1574071318508-1cdbab80d002'),
  unsplash('photo-1628840042765-356cda07504e'),
  unsplash('photo-1593560708920-61dd98c46a4e'),
  unsplash('photo-1594007654729-407eedc4be65'),
  unsplash('photo-1595854341625-f33ee10dbf94'),
  unsplash('photo-1588315029754-2dd089d39a1a'),
  unsplash('photo-1576458088443-04a19bb13da6'),
  unsplash('photo-1590947132387-155cc02f3212'),
  unsplash('photo-1620374645498-af6bd681a0bd'),
  unsplash('photo-1541745537411-b8046dc6d66c'),
] as const

const byKey: Record<string, string> = {
  'bacon-alho::PORTUGUESA COMPLETA': pizzaPool[3],
  'bacon-alho::FRANGOLINO': pizzaPool[5],
  'queijos::4 QUEIJOS': pizzaPool[10],
  'carnes::COSTELA': pizzaPool[4],
  'tradicionais::CALABRESA': pizzaPool[0],
  'tradicionais::MUÇARELA': pizzaPool[11],
  'vegetarianas::NAPOLITANA': pizzaPool[6],
}

export const fallbackImage = pizzaPool[0]

export function pizzaImage(sectionId: string, itemName: string): string {
  const key = `${sectionId}::${itemName}`
  if (byKey[key]) return byKey[key]
  if (/PALMITO/.test(itemName)) return pizzaPool[8]
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash + key.charCodeAt(i) * (i + 1)) % pizzaPool.length
  return pizzaPool[hash]
}

/** Recortes do folheto da Esfiharia da Cláudia (public/images/esfihas). */
export function esfihaImageUrl(id: string): string {
  return `/images/esfihas/${id}.jpg`
}

export const heroImage =
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2000&q=80'
