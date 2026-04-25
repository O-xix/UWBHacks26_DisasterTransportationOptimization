import type { DisasterParams } from './disaster'

export interface SimulationConfig {
  disaster: DisasterParams
  origin: [number, number] | null   // [lat, lng]
  timeOfDay: number                 // 0–23
  dayOfWeek: number                 // 0–6 (Sun–Sat)
  busCount: number                  // 5–100
  simulationDuration: number        // minutes, 30–240
}

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'complete'
