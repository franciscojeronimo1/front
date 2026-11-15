import { useEffect, useState, useRef } from 'react'
import type { usePizzaBuilder } from './usePizzaBuilder'
import { INGREDIENTS_BY_ID } from '../../data/pizzaBuilderIngredients'
import { usePizzaSounds } from './usePizzaSounds'

interface PizzaStageProps {
  builder: ReturnType<typeof usePizzaBuilder>
}

interface LayoutData {
  [key: string]: {
    type: 'spread' | 'drop'
    src: string
    srcOverHam?: string
    items?: Array<{
      src: string
      x: number
      y: number
      rot: number
      w: number
    }>
    z?: number
    underCheese?: boolean
  }
}

interface PieceData {
  src: string
  x: number
  y: number
  rot: number
  w: number
}

export function PizzaStage({ builder }: PizzaStageProps) {
  const [layout, setLayout] = useState<LayoutData | null>(null)
  const [spinning, setSpinning] = useState(true)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [velocity, setVelocity] = useState(0)
  
  const pizzaRef = useRef<HTMLDivElement>(null)
  const spinRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef({
    startAngle: 0,
    lastAngle: 0,
    lastTime: 0,
    moved: 0,
  })
  const animationFrameRef = useRef<number | undefined>(undefined)
  const bakeTimeoutRef = useRef<number | undefined>(undefined)

  const { state, muted, startBake, finishBake, markRaw } = builder
  const sounds = usePizzaSounds(muted)

  useEffect(() => {
    fetch('/pizza-builder/assets/layout.json')
      .then((r) => r.json())
      .then((data) => setLayout(data))
      .catch(() => setLayout({}))
  }, [])

  // Animação de rotação automática e inércia
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let lastTime = performance.now()

    const animate = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now

      if (!isDragging) {
        if (Math.abs(velocity) > 0.4) {
          setRotation((r) => r + velocity * dt)
          setVelocity((v) => v * Math.pow(0.92, dt * 60))
        } else if (spinning && !state.baking) {
          setRotation((r) => r + 8 * dt)
          setVelocity(0)
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isDragging, velocity, spinning, state.baking])

  // Detectar mudanças para marcar como crua
  useEffect(() => {
    if (state.baked || state.baking) {
      markRaw()
    }
  }, [
    state.selectedWhole,
    state.selectedHalf1,
    state.selectedHalf2,
    state.size,
    state.mode,
    state.crust,
    state.baked,
    state.baking,
    markRaw,
  ])

  const getPointerAngle = (e: PointerEvent | React.PointerEvent, el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    return Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
  }

  const normalizeAngle = (angle: number) => {
    while (angle > 180) angle -= 360
    while (angle < -180) angle += 360
    return angle
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    if (!spinRef.current) return

    setIsDragging(true)
    setVelocity(0)

    const angle = getPointerAngle(e, spinRef.current)
    dragStateRef.current = {
      startAngle: angle,
      lastAngle: angle,
      lastTime: performance.now(),
      moved: 0,
    }

    spinRef.current.setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !spinRef.current) return

    const angle = getPointerAngle(e, spinRef.current)
    const delta = normalizeAngle(angle - dragStateRef.current.lastAngle)
    const now = performance.now()
    const dt = Math.max(0.008, (now - dragStateRef.current.lastTime) / 1000)

    setRotation((r) => r + delta)
    setVelocity(delta / dt)

    dragStateRef.current.lastAngle = angle
    dragStateRef.current.lastTime = now
    dragStateRef.current.moved += Math.abs(delta)

    e.preventDefault()
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return

    setIsDragging(false)

    // Se clicou sem arrastar muito e está em modo meia, trocar metade ativa
    if (dragStateRef.current.moved < 8 && state.mode === 'meia' && spinRef.current) {
      const rect = spinRef.current.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      const rad = -rotation * (Math.PI / 180)
      const lx = dx * Math.cos(rad) - dy * Math.sin(rad)
      builder.setActiveHalf(lx < 0 ? 1 : 2)
    }

    // Limitar velocidade máxima
    if (Math.abs(velocity) > 720) {
      setVelocity((v) => Math.sign(v) * 720)
    }
  }

  const mapPieceToHalf = (piece: PieceData, half: 1 | 2): PieceData => {
    let { x, y, rot } = piece
    const wantLeft = half === 1
    const onLeft = x < 0.5

    if (wantLeft !== onLeft) {
      x = 1 - x
      rot = -rot
    }

    if (wantLeft && x > 0.47) x = 0.47
    if (!wantLeft && x < 0.53) x = 0.53

    return { ...piece, x, y, rot }
  }

  const renderIngredientLayer = (
    ingredientId: string,
    shouldAnimate: boolean,
    half: 1 | 2 | null
  ) => {
    if (!layout) return null

    const meta = layout[ingredientId]
    if (!meta) {
      // Fallback para ingredientes sem layout.json
      return (
        <img
          key={ingredientId}
          src={`/pizza-builder/assets/layers/${ingredientId}.png`}
          alt=""
          className={`layer-top ${shouldAnimate ? 'spread-in' : ''}`}
          style={{ zIndex: 10 }}
        />
      )
    }

    const zIndex = meta.z ?? 10

    // Tipo spread (imagem única)
    if (meta.type === 'spread' || !meta.items || meta.items.length === 0) {
      return (
        <img
          key={ingredientId}
          src={meta.src}
          alt=""
          className={`layer-top ${shouldAnimate ? 'spread-in' : ''}`}
          style={{ zIndex }}
        />
      )
    }

    // Tipo drop (peças individuais)
    const pieces = half ? meta.items.map((p) => mapPieceToHalf(p, half)) : meta.items

    return (
      <div
        key={ingredientId}
        className="toppings-group"
        style={{ position: 'absolute', inset: 0, zIndex, isolation: 'isolate' }}
      >
        {pieces.map((piece, i) => (
          <div
            key={i}
            className="piece"
            style={
              {
                '--x': `${piece.x * 100}%`,
                '--y': `${piece.y * 100}%`,
                '--s': `${piece.w * 100}%`,
                '--rot': `${piece.rot}deg`,
                '--delay': shouldAnimate ? `${i * 26}ms` : '0ms',
              } as React.CSSProperties
            }
          >
            <img src={piece.src} alt="" />
          </div>
        ))}
      </div>
    )
  }

  const renderPizzaSide = (
    set: Set<string>,
    half: 1 | 2 | null,
    clipPath?: string
  ) => {
    if (!layout) return null

    const sauceIngredient = Array.from(set).find((id) => {
      const ing = INGREDIENTS_BY_ID[id]
      return ing?.group === 'sauce'
    })
    const sauceType = sauceIngredient
      ? INGREDIENTS_BY_ID[sauceIngredient]?.sauce || 'red'
      : 'red'
    const sauceSrc = `/pizza-builder/assets/base/sauce-${sauceType}.png`

    const hasPresunto = set.has('presunto')
    const hasMucarela = set.has('mucarela')

    const shouldAnimateSauce = state.lastAnimatedId === sauceIngredient
    const shouldAnimateHam = state.lastAnimatedId === 'presunto' || state.lastAnimatedId === 'surprise'
    const shouldAnimateCheese = state.lastAnimatedId === 'mucarela'

    const cheeseSrc =
      hasMucarela && hasPresunto
        ? layout.mucarela?.srcOverHam || '/pizza-builder/assets/base/cheese-over-ham.png'
        : '/pizza-builder/assets/base/cheese.png'

    // Ordenar extras por z-index
    const extras = Array.from(set)
      .map((id) => INGREDIENTS_BY_ID[id])
      .filter((ing) => ing && !ing.base && ing.id !== 'presunto')
      .sort((a, b) => {
        const zA = layout[a.id]?.z ?? 10
        const zB = layout[b.id]?.z ?? 10
        return zA - zB
      })

    return (
      <div className="pizza-side" style={{ clipPath }}>
        {/* Molho */}
        <img
          src={sauceSrc}
          alt=""
          className={`layer sauce ${shouldAnimateSauce ? 'spread-in' : ''}`}
        />

        {/* Presunto */}
        {hasPresunto && (
          <img
            src="/pizza-builder/assets/layers/presunto.png"
            alt=""
            className={`layer ham ${shouldAnimateHam ? 'spread-in' : ''}`}
          />
        )}

        {/* Muçarela */}
        {hasMucarela && (
          <img
            src={cheeseSrc}
            alt=""
            className={`layer cheese ${shouldAnimateCheese ? 'spread-in' : ''}`}
          />
        )}

        {/* Coberturas */}
        <div className="toppings-container">
          {extras.map((ing) => {
            const shouldAnimate =
              state.lastAnimatedId === ing.id || state.lastAnimatedId === 'surprise'
            return renderIngredientLayer(ing.id, shouldAnimate, half)
          })}
        </div>
      </div>
    )
  }

  // Tocar som quando ingrediente é adicionado
  useEffect(() => {
    if (state.lastAnimatedId && state.lastAnimatedId !== 'surprise') {
      const ingredient = INGREDIENTS_BY_ID[state.lastAnimatedId]
      if (ingredient && !ingredient.base) {
        sounds.playPloc()
      }
    } else if (state.lastAnimatedId === 'surprise') {
      sounds.playPloc()
    }
  }, [state.lastAnimatedId, sounds])

  // Cleanup
  useEffect(() => {
    return () => {
      sounds.stopSizzle()
      if (bakeTimeoutRef.current) {
        clearTimeout(bakeTimeoutRef.current)
      }
    }
  }, [sounds])

  if (!layout) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-line bg-gradient-to-b from-night-2 to-night-3 p-8">
        <div className="text-center text-cream-muted">Carregando...</div>
      </div>
    )
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="sticky top-4 rounded-3xl border border-line bg-gradient-to-b from-night-2 to-night-3 p-4 shadow-2xl">
      <p className="mb-2 text-center text-xs text-cream-muted">
        {state.baked ? 'Pizza assada' : 'Pizza sendo montada'}
      </p>

      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        {/* Prato */}
        <div className="absolute inset-[2%] rounded-full bg-gradient-radial from-[#2a241f] via-[#3a322b] to-[#2c2621] shadow-[inset_0_0_0_8px_#1f1a16,0_20px_40px_rgba(0,0,0,0.35)]" />

        {/* Brilho do forno (quando assando) */}
        {state.baking && !reducedMotion && (
          <div className="oven-glow pointer-events-none absolute inset-0 rounded-full" />
        )}

        {/* Área giratória */}
        <div
          ref={spinRef}
          className={`pizza-spin ${isDragging ? 'is-dragging' : ''}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            touchAction: 'none',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            ref={pizzaRef}
            className={`pizza ${state.baked ? 'is-baked' : ''} ${
              state.baking ? 'is-baking' : ''
            }`}
          >
            {/* Massa */}
            <img
              src="/pizza-builder/assets/base/crust.png"
              alt=""
              className="layer crust"
            />

            {state.mode === 'meia' ? (
              <>
                {/* Metade 1 */}
                {renderPizzaSide(
                  state.selectedHalf1,
                  1,
                  'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
                )}

                {/* Metade 2 */}
                {renderPizzaSide(
                  state.selectedHalf2,
                  2,
                  'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)'
                )}

                {/* Linha divisória */}
                <div className="divider" />

                {/* Destaque da metade ativa */}
                <div
                  className={`half-highlight ${
                    state.activeHalf === 1 ? 'on-1' : 'on-2'
                  }`}
                />

                {/* Tags 1 e 2 */}
                <div className="half-tags">
                  <span
                    className={`half-tag tag-1 ${
                      state.activeHalf === 1 ? 'is-active' : ''
                    }`}
                  >
                    1
                  </span>
                  <span
                    className={`half-tag tag-2 ${
                      state.activeHalf === 2 ? 'is-active' : ''
                    }`}
                  >
                    2
                  </span>
                </div>
              </>
            ) : (
              renderPizzaSide(state.selectedWhole, null)
            )}

            {/* Efeitos do forno */}
            {state.baking && !reducedMotion && (
              <div className="fx" aria-hidden="true">
                {/* Bolhas */}
                {Array.from({ length: 16 }).map((_, i) => {
                  const angle = Math.random() * Math.PI * 2
                  const radius = Math.sqrt(Math.random()) * 28
                  return (
                    <span
                      key={`bubble-${i}`}
                      className="bubble"
                      style={
                        {
                          '--x': `${50 + Math.cos(angle) * radius}%`,
                          '--y': `${50 + Math.sin(angle) * radius}%`,
                          '--s': `${10 + Math.random() * 16}px`,
                          '--d': `${Math.random() * 1.4}s`,
                        } as React.CSSProperties
                      }
                    />
                  )
                })}
                {/* Vapor */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <span
                    key={`steam-${i}`}
                    className="steam"
                    style={
                      {
                        '--x': `${22 + Math.random() * 56}%`,
                        '--d': `${Math.random() * 0.7}s`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ferramentas do Stage */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <p className="text-xs text-cream-muted">
          {isDragging ? 'Girando...' : 'Arraste para girar'}
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-cream-muted">
          <input
            type="checkbox"
            checked={spinning}
            onChange={(e) => setSpinning(e.target.checked)}
            className="accent-gold"
          />
          Girar sozinha
        </label>
        <button
          type="button"
          onClick={() => {
            if (state.baking || state.baked) return
            
            startBake()
            sounds.playSizzle(2.5)
            
            if (reducedMotion) {
              finishBake()
              sounds.playDing()
            } else {
              bakeTimeoutRef.current = window.setTimeout(() => {
                finishBake()
                sounds.playDing()
              }, 2500)
            }
          }}
          disabled={state.baking}
          className={`rounded-xl border px-3 py-1.5 text-xs transition ${
            state.baked
              ? 'border-gold/45 bg-gold/20 text-gold-soft opacity-70'
              : state.baking
                ? 'cursor-wait border-gold/45 bg-gold/20 text-gold-soft'
                : 'border-gold/35 bg-gold/14 text-gold-soft hover:bg-gold/25'
          }`}
        >
          {state.baked ? 'Assada' : state.baking ? 'Assando...' : 'Assar'}
        </button>
      </div>
    </div>
  )
}
