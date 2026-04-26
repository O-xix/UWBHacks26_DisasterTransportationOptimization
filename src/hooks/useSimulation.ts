import { useState, useEffect, useRef, useCallback } from 'react'
import type {
  SimulationConfig, SimulationStatus,
  SimulationFrame, SimulationResponse, DepotInfo,
} from '../types/simulation'

const API_BASE = 'http://localhost:8000'
const MS_PER_FRAME_AT_1X = 800

export interface SimulationHandle {
  status: SimulationStatus
  frames: SimulationFrame[]
  currentFrame: SimulationFrame | null
  currentFrameIdx: number
  speed: number
  error: string | null
  depots: DepotInfo[]
  run: () => Promise<void>
  pause: () => void
  resume: () => void
  reset: () => void
  seek: (idx: number) => void
  replay: () => void
  setSpeed: (s: number) => void
}

export function useSimulation(config: SimulationConfig): SimulationHandle {
  const [status, setStatus] = useState<SimulationStatus>('idle')
  const [frames, setFrames] = useState<SimulationFrame[]>([])
  const [depots, setDepots] = useState<DepotInfo[]>([])
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const framesRef = useRef(frames)
  framesRef.current = frames

  const clearTicker = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    if (status !== 'running' || frames.length === 0) {
      clearTicker()
      return
    }
    intervalRef.current = setInterval(() => {
      setCurrentFrameIdx(prev => {
        if (prev >= framesRef.current.length - 1) {
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
    setDepots([])
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
      setDepots(data.depots ?? [])
      setStatus('running')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setStatus('idle')
    }
  }, [config])

  const pause  = useCallback(() => { clearTicker(); setStatus('paused') }, [])
  const resume = useCallback(() => setStatus('running'), [])
  const reset  = useCallback(() => {
    clearTicker()
    setFrames([])
    setDepots([])
    setCurrentFrameIdx(0)
    setStatus('idle')
    setError(null)
  }, [])

  const seek = useCallback((idx: number) => {
    clearTicker()
    setStatus('paused')
    setCurrentFrameIdx(Math.max(0, Math.min(idx, framesRef.current.length - 1)))
  }, [])

  const replay = useCallback(() => {
    clearTicker()
    setCurrentFrameIdx(0)
    setStatus('running')
  }, [])

  return {
    status,
    frames,
    currentFrame: frames[currentFrameIdx] ?? null,
    currentFrameIdx,
    speed,
    error,
    depots,
    run,
    pause,
    resume,
    reset,
    seek,
    replay,
    setSpeed,
  }
}
