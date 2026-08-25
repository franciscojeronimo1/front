import esfihasFlyer from '../assets/esfihas-cardapio.jpeg'
import { formatPrecoBRL } from '../content/cardapio'
import {
  esfihaCombos,
  esfihaComboWhatsAppHref,
  esfihaCustomPack,
  esfihaCustomPackWhatsAppHref,
  esfihasContent,
} from '../content/esfihas'

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.032-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

const orderBtnClass =
  'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#20bd5a]'

export function MenuEsfihas() {
  return (
    <section id="esfihas" className="border-b border-white/10 bg-brand-950">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
        <div className="mb-10 flex flex-col gap-8 lg:mb-14 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent-400">
              {esfihasContent.subtitle}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {esfihasContent.title}
            </h2>
            <p className="text-lg text-zinc-400">{esfihasContent.note}</p>
            <p className="text-sm font-medium text-zinc-500">
              Entrega: {esfihasContent.deliveryDays}
            </p>
          </div>

          <div className="relative w-full max-w-sm shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl shadow-black/40 lg:max-w-xs">
            <img
              src={esfihasFlyer}
              alt="Cardápio de combos de esfiha da Esfiharia da Cláudia Delivery"
              className="h-auto w-full object-contain"
              loading="lazy"
            />
          </div>
        </div>

        <article className="mb-8 overflow-hidden rounded-[1.5rem] border border-accent-400/30 bg-gradient-to-br from-accent-500/15 via-white/[0.04] to-transparent p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">
                Opção flexível
              </p>
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                {esfihaCustomPack.name}
              </h3>
              <p className="max-w-xl text-zinc-400">{esfihaCustomPack.description}</p>
              <p className="text-xl font-semibold text-accent-400">
                {formatPrecoBRL(esfihaCustomPack.price)}
              </p>
            </div>
            <a
              href={esfihaCustomPackWhatsAppHref()}
              target="_blank"
              rel="noreferrer"
              className={`${orderBtnClass} sm:w-auto sm:min-w-[10rem]`}
            >
              <WhatsAppGlyph className="h-4 w-4" />
              Pedir
            </a>
          </div>
        </article>

        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {esfihaCombos.map((combo) => (
            <li
              key={combo.id}
              className="flex flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03]"
            >
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                    {combo.name}
                  </h3>
                  <ul className="mt-3 space-y-1.5">
                    {combo.items.map((item) => (
                      <li key={item} className="text-sm text-zinc-400">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-auto text-lg font-semibold text-accent-400">
                  {formatPrecoBRL(combo.price)}
                </p>
                <a
                  href={esfihaComboWhatsAppHref(combo)}
                  target="_blank"
                  rel="noreferrer"
                  className={orderBtnClass}
                >
                  <WhatsAppGlyph className="h-4 w-4" />
                  Pedir combo
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
