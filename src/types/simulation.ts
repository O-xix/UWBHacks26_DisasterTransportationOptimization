import type { DisasterParams } from './disaster'

export interface SimulationConfig {
  disaster: DisasterParams
  origin: [number, number] | null
  dayOfWeek: number
  simulationDuration: number
}

export type SimulationStatus = 'idle' | 'loading' | 'running' | 'paused' | 'complete'
