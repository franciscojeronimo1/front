import { OrderProvider, useOrder } from './context/OrderContext'
import { VisitModeProvider, useVisitMode } from './context/VisitModeContext'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MenuDigital } from './components/MenuDigital'
import { OrderCartBar } from './components/OrderCartBar'
import { OrderModal } from './components/OrderModal'
import { SeoJsonLd } from './components/SeoJsonLd'

function AppContent() {
  const { isLocal } = useVisitMode()
  const { itemCount } = useOrder()
  const bottomPad =
    !isLocal && itemCount > 0
      ? 'pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-8'
      : isLocal
        ? 'pb-[calc(5rem+env(safe-area-inset-bottom))]'
        : 'pb-8'

  return (
    <>
      <SeoJsonLd />
      <Header />
      <main>
        <Hero />
        <MenuDigital />
      </main>
      <Footer className={bottomPad} />
      {!isLocal ? (
        <>
          <OrderModal />
          <OrderCartBar />
        </>
      ) : (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-cream/15 bg-night/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center backdrop-blur-xl">
          <p className="text-sm font-medium text-cream">
            Escolheu? <span className="text-gold">Peça ao garçom</span> na sua mesa.
          </p>
        </div>
      )}
    </>
  )
}

export default function App() {
  return (
    <VisitModeProvider>
      <OrderProvider>
        <AppContent />
      </OrderProvider>
    </VisitModeProvider>
  )
}
