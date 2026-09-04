import { SEO_CITY, SEO_STATE, siteContent, whatsappHref } from '../content/siteContent'

const faqs = [
  {
    q: `A Claudia Delivery atende toda a cidade de ${SEO_CITY}?`,
    a: `Atendemos ${SEO_CITY} e regiões próximas. Confirme seu bairro no WhatsApp para validar taxa e tempo de entrega.`,
  },
  {
    q: 'Posso pedir pizza meia a meia?',
    a: 'Sim. Meia a meia está disponível nos tamanhos Média, Grande e Família. O valor segue o sabor mais caro, e você pode combinar sabores de seções diferentes.',
  },
  {
    q: 'Vocês também vendem esfiha?',
    a: 'Sim. Temos combos prontos e a opção de 10 esfihas com sabores à sua escolha por R$ 40,00. Entrega de esfihas de segunda a quinta — peça pelo WhatsApp.',
  },
  {
    q: 'Qual é o horário da pizzaria?',
    a: siteContent.footer.hours,
  },
] as const

export function LocalSeoContent() {
  return (
    <section id="faq-local" className="border-b border-white/10 bg-brand-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16 lg:py-20">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            Pizzaria em {SEO_CITY} - {SEO_STATE}
          </h2>
          <p className="mt-4 text-base text-zinc-400 sm:text-lg">
            A {siteContent.brandName} faz delivery de pizza e esfiha em {SEO_CITY}.
            Nosso cardápio online facilita seu pedido com contato direto pelo WhatsApp.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {faqs.map((item) => (
            <article
              key={item.q}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
            >
              <h3 className="text-base font-semibold text-white sm:text-lg">{item.q}</h3>
              <p className="mt-3 text-sm text-zinc-400 sm:text-base">{item.a}</p>
            </article>
          ))}
        </div>

        <a
          href={whatsappHref('pedido')}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10 sm:w-auto"
        >
          Falar no WhatsApp agora
        </a>
      </div>
    </section>
  )
}
