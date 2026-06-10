import type { PizzaRef } from '../types/order'
import { useOrder } from '../context/OrderContext'

type OrderPizzaButtonProps = {
  pizza: PizzaRef
  className?: string
  children?: React.ReactNode
}

const defaultClassName =
  'inline-flex shrink-0 items-center justify-center rounded-xl border border-[#9f1239]/35 bg-[#9f1239]/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#9f1239] transition hover:bg-[#9f1239]/10 hover:text-[#7f122d]'

export function OrderPizzaButton({
  pizza,
  className = defaultClassName,
  children = 'Pedir',
}: OrderPizzaButtonProps) {
  const { openOrderModal } = useOrder()

  return (
    <button type="button" onClick={() => openOrderModal(pizza)} className={className}>
      {children}
    </button>
  )
}
