import { buildMenuSchema } from '../content/seoSchema'

export function SeoJsonLd() {
  const menuSchema = buildMenuSchema()

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }}
    />
  )
}
