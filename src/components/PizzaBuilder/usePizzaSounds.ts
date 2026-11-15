import { useRef, useCallback } from 'react'

export function usePizzaSounds(muted: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const sizzleSourceRef = useRef<AudioBufferSourceNode | null>(null)

  const getAudioContext = useCallback(() => {
    if (muted) return null
    
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    
    if (!audioContextRef.current) {
      audioContextRef.current = new AC()
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }
    
    return audioContextRef.current
  }, [muted])

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (muted) return
      try {
        if (navigator.vibrate) {
          navigator.vibrate(pattern)
        }
      } catch {
        // ignore
      }
    },
    [muted]
  )

  const playPloc = useCallback(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    const t = ctx.currentTime
    const freq = 760 + Math.random() * 420

    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, t)
    osc.frequency.exponentialRampToValueAtTime(Math.max(180, freq * 0.55), t + 0.1)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.11, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)

    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.16)

    vibrate(16)
  }, [getAudioContext, vibrate])

  const stopSizzle = useCallback(() => {
    try {
      if (sizzleSourceRef.current) {
        sizzleSourceRef.current.stop()
      }
    } catch {
      // ignore
    }
    sizzleSourceRef.current = null
  }, [])

  const playSizzle = useCallback(
    (duration: number = 2.45) => {
      const ctx = getAudioContext()
      if (!ctx) return

      stopSizzle()

      const sampleCount = Math.floor(ctx.sampleRate * duration)
      const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      // Generate noise
      let last = 0
      for (let i = 0; i < sampleCount; i++) {
        last = last * 0.93 + (Math.random() * 2 - 1) * 0.07
        data[i] = last
      }

      const source = ctx.createBufferSource()
      source.buffer = buffer

      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.frequency.value = 2300
      bandpass.Q.value = 0.8

      const gain = ctx.createGain()
      const t = ctx.currentTime
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.07, t + 0.18)
      gain.gain.setValueAtTime(0.07, t + duration - 0.28)
      gain.gain.linearRampToValueAtTime(0.0001, t + duration)

      source.connect(bandpass).connect(gain).connect(ctx.destination)
      source.start(t)
      source.stop(t + duration + 0.05)

      sizzleSourceRef.current = source
    },
    [getAudioContext, stopSizzle]
  )

  const playDing = useCallback(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    const t = ctx.currentTime
    const frequencies = [880, 1174.7]

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq

      const gain = ctx.createGain()
      const t0 = t + i * 0.11
      gain.gain.setValueAtTime(0, t0)
      gain.gain.linearRampToValueAtTime(0.15, t0 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55)

      osc.connect(gain).connect(ctx.destination)
      osc.start(t0)
      osc.stop(t0 + 0.6)
    })

    vibrate([30, 50, 40])
  }, [getAudioContext, vibrate])

  const unlockAudio = useCallback(() => {
    getAudioContext()
  }, [getAudioContext])

  return {
    playPloc,
    playSizzle,
    stopSizzle,
    playDing,
    unlockAudio,
  }
}
