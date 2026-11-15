import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PizzaSizeId } from '../../data/pizzaBuilderPricing'
import type { CrustId } from '../../data/pizzaBuilderPricing'
import {
  DEFAULT_INGREDIENT_IDS,
  HALF_ALLOWED_SIZES,
  MAX_EXTRAS,
  INGREDIENTS_BY_ID,
} from '../../data/pizzaBuilderIngredients'
import { calculateBuilderPrice } from '../../data/pizzaBuilderPricing'

export type BuilderMode = 'inteira' | 'meia'

export interface PizzaBuilderState {
  size: PizzaSizeId
  mode: BuilderMode
  activeHalf: 1 | 2
  selectedWhole: Set<string>
  selectedHalf1: Set<string>
  selectedHalf2: Set<string>
  crust: CrustId
  baked: boolean
  baking: boolean
  pizzaName: string
}

const MUTE_STORAGE_KEY = 'pizza-builder:muted'

export function usePizzaBuilder() {
  const [state, setState] = useState<PizzaBuilderState>({
    size: 'grande',
    mode: 'inteira',
    activeHalf: 1,
    selectedWhole: new Set(DEFAULT_INGREDIENT_IDS),
    selectedHalf1: new Set(DEFAULT_INGREDIENT_IDS),
    selectedHalf2: new Set(DEFAULT_INGREDIENT_IDS),
    crust: 'none',
    baked: false,
    baking: false,
    pizzaName: '',
  })

  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(MUTE_STORAGE_KEY, muted ? '1' : '0')
    } catch {
      // ignore
    }
  }, [muted])

  const activeSet = useMemo(() => {
    return state.mode === 'meia'
      ? state.activeHalf === 1
        ? state.selectedHalf1
        : state.selectedHalf2
      : state.selectedWhole
  }, [state.mode, state.activeHalf, state.selectedWhole, state.selectedHalf1, state.selectedHalf2])

  const extrasCount = useMemo(() => {
    let count = 0
    for (const id of activeSet) {
      const ingredient = INGREDIENTS_BY_ID[id]
      if (ingredient && !ingredient.base) {
        count++
      }
    }
    return count
  }, [activeSet])

  const extrasCountHalf1 = useMemo(() => {
    let count = 0
    for (const id of state.selectedHalf1) {
      const ingredient = INGREDIENTS_BY_ID[id]
      if (ingredient && !ingredient.base) {
        count++
      }
    }
    return count
  }, [state.selectedHalf1])

  const extrasCountHalf2 = useMemo(() => {
    let count = 0
    for (const id of state.selectedHalf2) {
      const ingredient = INGREDIENTS_BY_ID[id]
      if (ingredient && !ingredient.base) {
        count++
      }
    }
    return count
  }, [state.selectedHalf2])

  const atLimit = useMemo(() => extrasCount >= MAX_EXTRAS, [extrasCount])

  const totalPrice = useMemo(() => {
    return calculateBuilderPrice(
      state.size,
      state.mode,
      state.selectedWhole,
      state.selectedHalf1,
      state.selectedHalf2,
      state.crust
    )
  }, [state.size, state.mode, state.selectedWhole, state.selectedHalf1, state.selectedHalf2, state.crust])

  const setSize = useCallback((size: PizzaSizeId) => {
    setState((prev) => {
      // Se mudou para pequena e estava em meia, volta para inteira
      if (size === 'pequena' && prev.mode === 'meia') {
        return {
          ...prev,
          size,
          mode: 'inteira',
          selectedWhole: new Set(prev.selectedHalf1),
          baked: false,
          baking: false,
        }
      }
      return { ...prev, size, baked: false, baking: false }
    })
  }, [])

  const setMode = useCallback((mode: BuilderMode) => {
    setState((prev) => {
      if (mode === 'meia' && !HALF_ALLOWED_SIZES.has(prev.size)) {
        return prev
      }
      if (mode === prev.mode) return prev

      if (mode === 'meia') {
        return {
          ...prev,
          mode,
          selectedHalf1: new Set(prev.selectedWhole),
          selectedHalf2: new Set(DEFAULT_INGREDIENT_IDS),
          activeHalf: 1,
          baked: false,
          baking: false,
        }
      } else {
        return {
          ...prev,
          mode,
          selectedWhole: new Set(prev.activeHalf === 1 ? prev.selectedHalf1 : prev.selectedHalf2),
          baked: false,
          baking: false,
        }
      }
    })
  }, [])

  const setActiveHalf = useCallback((half: 1 | 2) => {
    setState((prev) => {
      if (prev.mode !== 'meia' || prev.activeHalf === half) return prev
      return { ...prev, activeHalf: half }
    })
  }, [])

  const setCrust = useCallback((crust: CrustId) => {
    setState((prev) => ({ ...prev, crust, baked: false, baking: false }))
  }, [])

  const toggleIngredient = useCallback(
    (ingredientId: string) => {
      setState((prev) => {
        const ingredient = INGREDIENTS_BY_ID[ingredientId]
        if (!ingredient) return prev

        const workingSet =
          prev.mode === 'meia'
            ? prev.activeHalf === 1
              ? prev.selectedHalf1
              : prev.selectedHalf2
            : prev.selectedWhole

        const newSet = new Set(workingSet)

        // Se já está selecionado, remove
        if (newSet.has(ingredientId)) {
          newSet.delete(ingredientId)
        } else {
          // Se é extra e já está no limite, não adiciona
          if (!ingredient.base) {
            let currentExtras = 0
            for (const id of newSet) {
              const ing = INGREDIENTS_BY_ID[id]
              if (ing && !ing.base) currentExtras++
            }
            if (currentExtras >= MAX_EXTRAS) {
              return prev
            }
          }

          // Se tem grupo (ex.: molhos), remove outros do mesmo grupo
          if (ingredient.group) {
            for (const id of newSet) {
              const other = INGREDIENTS_BY_ID[id]
              if (other && other.group === ingredient.group) {
                newSet.delete(id)
              }
            }
          }

          newSet.add(ingredientId)
        }

        if (prev.mode === 'meia') {
          if (prev.activeHalf === 1) {
            return { ...prev, selectedHalf1: newSet, baked: false, baking: false }
          } else {
            return { ...prev, selectedHalf2: newSet, baked: false, baking: false }
          }
        } else {
          return { ...prev, selectedWhole: newSet, baked: false, baking: false }
        }
      })
    },
    []
  )

  const clearCurrentSide = useCallback(() => {
    setState((prev) => {
      const newSet = new Set(DEFAULT_INGREDIENT_IDS)
      if (prev.mode === 'meia') {
        if (prev.activeHalf === 1) {
          return { ...prev, selectedHalf1: newSet, baked: false, baking: false }
        } else {
          return { ...prev, selectedHalf2: newSet, baked: false, baking: false }
        }
      } else {
        return { ...prev, selectedWhole: newSet, baked: false, baking: false }
      }
    })
  }, [])

  const surpriseMe = useCallback(() => {
    setState((prev) => {
      const allExtras = Object.values(INGREDIENTS_BY_ID).filter((i) => !i.base)
      const shuffled = allExtras.sort(() => Math.random() - 0.5)
      const picked = shuffled.slice(0, MAX_EXTRAS)
      const newSet = new Set([...DEFAULT_INGREDIENT_IDS, ...picked.map((i) => i.id)])

      if (prev.mode === 'meia') {
        if (prev.activeHalf === 1) {
          return { ...prev, selectedHalf1: newSet, baked: false, baking: false }
        } else {
          return { ...prev, selectedHalf2: newSet, baked: false, baking: false }
        }
      } else {
        return { ...prev, selectedWhole: newSet, baked: false, baking: false }
      }
    })
  }, [])

  const startBake = useCallback(() => {
    setState((prev) => {
      if (prev.baking || prev.baked) return prev
      return { ...prev, baking: true }
    })
  }, [])

  const finishBake = useCallback(() => {
    setState((prev) => ({ ...prev, baking: false, baked: true }))
  }, [])

  const markRaw = useCallback(() => {
    setState((prev) => ({ ...prev, baked: false, baking: false }))
  }, [])

  const setPizzaName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, pizzaName: name }))
  }, [])

  return {
    state,
    activeSet,
    extrasCount,
    extrasCountHalf1,
    extrasCountHalf2,
    atLimit,
    totalPrice,
    muted,
    setMuted,
    setSize,
    setMode,
    setActiveHalf,
    setCrust,
    toggleIngredient,
    clearCurrentSide,
    surpriseMe,
    startBake,
    finishBake,
    markRaw,
    setPizzaName,
  }
}
