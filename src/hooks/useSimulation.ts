import { useState, useEffect, useRef, useCallback } from 'react'
import type { SimulationConfig, SimulationStatus, SimulationFrame, SimulationResponse } from '../types/simulation'

const API_BASE = 'http://localhost:8000'
const MS_PER_FRAME_AT_1X = 800   // ~0.8s per frame at 1x speed

export interface SimulationHandle {
  status: SimulationStatus
  frames: SimulationFrame[]
  currentFrame: SimulationFrame | null
  currentFrameIdx: number
  speed: number
  error: string | null
  run: () => Promise<void>
  pause: () => void
  resume: () => void
  reset: () => void
  setSpeed: (s: number) => void
}

export function useSimulation(config: SimulationConfig): SimulationHandle {
  const [status, setStatus] = useState<SimulationStatus>('idle')
  const [frames, setFrames] = useState<SimulationFrame[]>([])
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTicker = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Advance frames while running
  useEffect(() => {
    if (status !== 'running' || frames.length === 0) {
      clearTicker()
      return
    }
    intervalRef.current = setInterval(() => {
      setCurrentFrameIdx(prev => {
        if (prev >= frames.length - 1) {
          setStatus('complete')
          return prev
        }
        return prev + 1
      })
    }, MS_PER_FRAME_AT_1X / speed)

    return clearTicker
  }, [status, frames.length, speed])

  const run = useCallback(async () => {
    if (!config.origin) return
    clearTicker()
    setError(null)
    setFrames([])
    setCurrentFrameIdx(0)
    setStatus('loading')

    try {
      const res = await fetch(`${API_BASE}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data: SimulationResponse = await res.json()
      setFrames(data.frames)
      setStatus('running')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setStatus('idle')
    }
  }, [config])

  const pause = useCallback(() => {
    clearTicker()
    setStatus('paused')
  }, [])

  const resume = useCallback(() => setStatus('running'), [])

  const reset = useCallback(() => {
    clearTicker()
    setFrames([])
    setCurrentFrameIdx(0)
    setStatus('idle')
    setError(null)
  }, [])

  return {
    status,
    frames,
    currentFrame: frames[currentFrameIdx] ?? null,
    currentFrameIdx,
    speed,
    error,
    run,
    pause,
    resume,
    reset,
    setSpeed,
  }
}
