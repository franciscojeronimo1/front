/** Bebidas do cardápio. */

export type Bebida = {
  id: string
  name: string
  description: string
  price: number
  /** Foto oficial em public/images/bebidas. */
  image: string
  /** Usada enquanto a foto oficial não existir. */
  fallbackImage: string
}

export const bebidas: readonly Bebida[] = [
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    description: 'Refrigerante 2L',
    price: 15,
    image: '/images/bebidas/coca-cola.png',
    fallbackImage:
      'https://images.unsplash.com/photo-1561758033-48d52648ae8b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'kuat',
    name: 'Kuat',
    description: 'Refrigerante 2L',
    price: 10,
    image: '/images/bebidas/kuat.png',
    fallbackImage:
      'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=600&q=80',
  },
] as const
