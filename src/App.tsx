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
  const bottomPad =
    itemCount > 0
      ? 'pb-[calc(8.5rem+env(safe-area-inset-bottom))]'
      : 'pb-[calc(5.5rem+env(safe-area-inset-bottom))]'

  return (
    <>
      <SeoJsonLd />
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <HowToOrder />
        <FeaturedPizzas />
        <MenuEsfihas />
        <MenuCardapio />
        <LocalSeoContent />
      </main>
      <Footer className={bottomPad} />
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
