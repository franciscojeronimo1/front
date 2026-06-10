import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { FeaturedPizzas } from './components/FeaturedPizzas'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowToOrder } from './components/HowToOrder'
import { LocalSeoContent } from './components/LocalSeoContent'
import { MenuCardapio } from './components/MenuCardapio'
import { SeoJsonLd } from './components/SeoJsonLd'
import { TrustBar } from './components/TrustBar'

export default function App() {
  return (
    <>
      <SeoJsonLd />
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <HowToOrder />
        <FeaturedPizzas />
        <MenuCardapio />
        <LocalSeoContent />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
