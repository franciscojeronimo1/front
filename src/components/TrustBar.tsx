import { siteContent } from '../content/siteContent'

const icons = {
  delivery: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 7h11v8H3zM14 10h3l3 3v2h-6v-5z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  click: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 3v12M8 11l4 4 4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  flavors: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 3c2 3 4 5 4 8a4 4 0 01-8 0c0-3 2-5 4-8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 21h8" strokeLinecap="round" />
    </svg>
  ),
  hours: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
} as const

export function TrustBar() {
  return (
    <section className="border-b border-white/10 bg-brand-900/40">
      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {siteContent.trustHighlights.map((item) => (
          <article
            key={item.title}
            className="animate-rise flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5"
          >
            <span className="inline-flex rounded-xl bg-accent-500/15 p-2.5 text-accent-400">
              {icons[item.icon]}
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
