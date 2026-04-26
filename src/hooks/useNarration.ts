import { useState, useCallback } from 'react'
import type { SimulationFrame } from '../types/simulation'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export interface NarrationHandle {
  text: string | null
  loading: boolean
  explain: (frame: SimulationFrame, disasterType: string) => Promise<void>
  dismiss: () => void
}

export function useNarration(): NarrationHandle {
  const [text, setText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const explain = useCallback(async (
    frame: SimulationFrame,
    disasterType: string,
  ) => {
    setLoading(true)
    setText(null)

    const busesActive = frame.buses.filter(b => b.status !== 'loading').length
    const busesRerouting = frame.buses.filter(b => b.status === 'rerouting').length
    const hubsAtCapacity = frame.hubs.filter(h => h.current / h.capacity >= 0.9).length
    const routesAtRisk = frame.buses.filter(b => b.routeSafety === 'yellow' || b.routeSafety === 'red').length
    const totalDemand = frame.hubs.reduce((sum, h) => sum + h.capacity, 0)

    const sortedHubs = [...frame.hubs].sort(
      (a, b) => b.current / b.capacity - a.current / a.capacity,
    )
    const topHubs = sortedHubs.slice(0, 3).map(h => h.name)

    try {
      const res = await fetch(`${API_BASE}/api/narrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disasterType,
          t: frame.t,
          evacuated: frame.evacuated,
          totalDemand,
          busesActive,
          busesRerouting,
          hubsAtCapacity,
          routesAtRisk,
          topHubs,
        }),
      })
      if (!res.ok) throw new Error('narrate failed')
      const data = await res.json()
      setText(data.text)
    } catch {
      setText(
        'The optimizer is dispatching buses to the highest-demand hubs ' +
        'while monitoring route safety against the spreading disaster zone.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const dismiss = useCallback(() => setText(null), [])

  return { text, loading, explain, dismiss }
}
