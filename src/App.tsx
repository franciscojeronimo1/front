import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { LocalSeoContent } from './components/LocalSeoContent'
import { MenuCardapio } from './components/MenuCardapio'

export default function App() {
  return (
    <>
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
