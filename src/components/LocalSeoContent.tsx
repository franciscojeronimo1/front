import { SEO_CITY, SEO_STATE, siteContent, whatsappHref } from '../content/siteContent'

const faqs = [
  {
    q: `A Claudia Delivery atende toda a cidade de ${SEO_CITY}?`,
    a: `Atendemos ${SEO_CITY} e regiões próximas. Confirme seu bairro no WhatsApp para validar taxa e tempo de entrega.`,
  },
  {
    q: 'Como fazer pedido online?',
    a: 'Escolha os sabores no cardápio, selecione o tamanho e toque em pedir no WhatsApp para finalizar.',
  },
  {
    q: 'Qual é o horário da pizzaria?',
    a: siteContent.footer.hours,
  },
] as const

export function LocalSeoContent() {
  return (
    <section id="faq-local" className="border-b border-white/10 bg-brand-950">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Pizzaria em {SEO_CITY} - {SEO_STATE}
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            A {siteContent.brandName} e especializada em delivery de pizza em {SEO_CITY}.
            Nosso cardapio online facilita seu pedido com contato direto pelo WhatsApp.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {faqs.map((item) => (
            <article
              key={item.q}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h3 className="text-lg font-semibold text-white">{item.q}</h3>
              <p className="mt-3 text-zinc-400">{item.a}</p>
            </article>
          ))}
        </div>

        <a
          href={whatsappHref('pedido')}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
        >
          Falar no WhatsApp agora
        </a>
      </div>
    </section>
  )
}
