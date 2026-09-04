type ViewInArButtonProps = {
  onClick: () => void
  className?: string
  children?: React.ReactNode
}

const defaultClassName =
  'inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-accent-400/40 bg-accent-400/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent-400 transition hover:bg-accent-400/20 hover:text-accent-500'

export function ViewInArButton({
  onClick,
  className = defaultClassName,
  children = 'Ver tamanho real',
}: ViewInArButtonProps) {
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  )
}
