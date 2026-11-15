import { useState } from 'react'
import type { usePizzaBuilder } from './usePizzaBuilder'
import { INGREDIENTS_BY_ID } from '../../data/pizzaBuilderIngredients'
import { CRUST_OPTIONS } from '../../data/pizzaBuilderPricing'

interface ShareButtonProps {
  builder: ReturnType<typeof usePizzaBuilder>
}

const SIZE_LABELS: Record<string, string> = {
  pequena: 'Pequena',
  media: 'Média',
  grande: 'Grande',
  familia: 'Família',
}

export function ShareButton({ builder }: ShareButtonProps) {
  const [generating, setGenerating] = useState(false)
  const { state } = builder

  const generateImage = async (): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1920
    const ctx = canvas.getContext('2d')!

    // Background
    ctx.fillStyle = '#120f0d'
    ctx.fillRect(0, 0, 1080, 1920)

    // Gradient glow
    const glow = ctx.createRadialGradient(540, 640, 20, 540, 640, 720)
    glow.addColorStop(0, 'rgba(217,164,65,0.22)')
    glow.addColorStop(1, 'rgba(217,164,65,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, 1080, 1920)

    // Brand
    ctx.textAlign = 'center'
    ctx.fillStyle = '#d9a441'
    ctx.font = '600 22px "Work Sans", system-ui, sans-serif'
    ctx.fillText('CLAUDIA  DELIVERY', 540, 96)

    // Pizza name
    ctx.fillStyle = '#f4e8d8'
    ctx.font = 'italic 70px "Instrument Serif", Georgia, serif'
    const pizzaName = state.pizzaName.trim() || 'Pizza montada'
    wrapText(ctx, pizzaName, 540, 175, 940, 78, 2)

    // Size and mode
    const sizeLabel = SIZE_LABELS[state.size] || 'Grande'
    const bits = [sizeLabel]
    if (state.mode === 'meia') bits.push('meio a meia')
    const crustOption = CRUST_OPTIONS.find((c) => c.id === state.crust)
    if (crustOption && crustOption.id !== 'none') bits.push(crustOption.label.toLowerCase())
    if (state.baked) bits.push('assada')

    ctx.fillStyle = '#cbbba6'
    ctx.font = '500 26px "Work Sans", system-ui, sans-serif'
    ctx.fillText(bits.join('  ·  '), 540, 280)

    // Pizza sprite (simplified - just crust for demo)
    try {
      const crustImg = await loadImage('/pizza-builder/assets/base/crust.png')
      const spriteSize = 820
      ctx.drawImage(crustImg, (1080 - spriteSize) / 2, 330, spriteSize, spriteSize)
    } catch {
      // Fallback: just draw a circle
      ctx.fillStyle = '#d9a441'
      ctx.beginPath()
      ctx.arc(540, 740, 410, 0, Math.PI * 2)
      ctx.fill()
    }

    // Ingredients
    ctx.textAlign = 'left'
    ctx.fillStyle = '#d9a441'
    ctx.font = '600 16px "Work Sans", system-ui, sans-serif'
    let y = 1220

    if (state.mode === 'meia') {
      // Metade 1
      ctx.fillText('METADE 1', 88, y)
      ctx.fillStyle = '#f4e8d8'
      ctx.font = '400 24px "Work Sans", system-ui, sans-serif'
      const items1 = Array.from(state.selectedHalf1)
        .map((id) => INGREDIENTS_BY_ID[id]?.name)
        .filter(Boolean)
      items1.forEach((name, i) => {
        ctx.fillText(`•  ${name}`, 88, y + 34 + i * 32)
      })

      // Metade 2
      y = 1220
      ctx.fillStyle = '#d9a441'
      ctx.font = '600 16px "Work Sans", system-ui, sans-serif'
      ctx.fillText('METADE 2', 580, y)
      ctx.fillStyle = '#f4e8d8'
      ctx.font = '400 24px "Work Sans", system-ui, sans-serif'
      const items2 = Array.from(state.selectedHalf2)
        .map((id) => INGREDIENTS_BY_ID[id]?.name)
        .filter(Boolean)
      items2.forEach((name, i) => {
        ctx.fillText(`•  ${name}`, 580, y + 34 + i * 32)
      })
    } else {
      ctx.fillText('INGREDIENTES', 88, y)
      ctx.fillStyle = '#f4e8d8'
      ctx.font = '400 24px "Work Sans", system-ui, sans-serif'
      const items = Array.from(state.selectedWhole)
        .map((id) => INGREDIENTS_BY_ID[id]?.name)
        .filter(Boolean)
      items.forEach((name, i) => {
        ctx.fillText(`•  ${name}`, 88, y + 34 + i * 32)
      })
    }

    // Crust
    if (state.crust !== 'none' && crustOption) {
      ctx.textAlign = 'center'
      ctx.fillStyle = '#cbbba6'
      ctx.font = '500 22px "Work Sans", system-ui, sans-serif'
      ctx.fillText(crustOption.label, 540, 1920 - 130)
    }

    // Footer
    ctx.textAlign = 'center'
    ctx.fillStyle = '#d9a441'
    ctx.font = '600 28px "Work Sans", system-ui, sans-serif'
    ctx.fillText('pizzariadeliverysj.com', 540, 1920 - 70)
    ctx.fillStyle = '#cbbba6'
    ctx.font = '400 20px "Work Sans", system-ui, sans-serif'
    ctx.fillText('Santana do Jacaré', 540, 1920 - 40)

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png')
    })
  }

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number
  ) => {
    const words = text.split(/\s+/)
    const lines: string[] = []
    let line = ''

    for (const word of words) {
      const trial = line ? `${line} ${word}` : word
      if (ctx.measureText(trial).width <= maxWidth) {
        line = trial
      } else {
        if (line) lines.push(line)
        line = word
      }
    }
    if (line) lines.push(line)

    const use = lines.slice(0, maxLines)
    use.forEach((ln, i) => ctx.fillText(ln, x, y + i * lineHeight))
  }

  const handleShare = async () => {
    setGenerating(true)

    try {
      const blob = await generateImage()
      const pizzaName = state.pizzaName.trim() || 'Pizza montada'
      const fileName = pizzaName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      const file = new File([blob], `${fileName}-claudia.png`, { type: 'image/png' })

      // Try Web Share API
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: pizzaName,
          text: `${pizzaName} — Claudia Delivery · pizzariadeliverysj.com`,
        })
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(url), 2000)
      }
    } catch (err) {
      console.error('Share error:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={generating}
      className="rounded-xl border border-gold/35 bg-gold/14 px-4 py-2.5 text-sm text-gold-soft transition hover:bg-gold/25 disabled:cursor-wait disabled:opacity-60"
    >
      {generating ? 'Gerando foto...' : 'Compartilhar'}
    </button>
  )
}
