import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { LocalSeoContent } from './components/LocalSeoContent'
import { MenuCardapio } from './components/MenuCardapio'
import { SeoJsonLd } from './components/SeoJsonLd'

export default function App() {
  return (
    <>
      <SeoJsonLd />
      <Header />
      <main>
        <Hero />
        <MenuCardapio />
        <LocalSeoContent />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
