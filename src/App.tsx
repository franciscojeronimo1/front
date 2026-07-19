import { OrderProvider, useOrder } from './context/OrderContext'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { FeaturedPizzas } from './components/FeaturedPizzas'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowToOrder } from './components/HowToOrder'
import { LocalSeoContent } from './components/LocalSeoContent'
import { MenuCardapio } from './components/MenuCardapio'
import { MenuEsfihas } from './components/MenuEsfihas'
import { OrderCartBar } from './components/OrderCartBar'
import { OrderModal } from './components/OrderModal'
import { SeoJsonLd } from './components/SeoJsonLd'
import { TrustBar } from './components/TrustBar'

function AppContent() {
  const { itemCount } = useOrder()

  return (
    <>
      <SeoJsonLd />
      <Header />
      <main className={itemCount > 0 ? 'pb-32' : undefined}>
        <Hero />
        <TrustBar />
        <HowToOrder />
        <FeaturedPizzas />
        <MenuEsfihas />
        <MenuCardapio />
        <LocalSeoContent />
      </main>
      <Footer />
      <OrderModal />
      <OrderCartBar />
      <FloatingWhatsApp />
    </>
  )
}

export default function App() {
  return (
    <OrderProvider>
      <AppContent />
    </OrderProvider>
  )
}
