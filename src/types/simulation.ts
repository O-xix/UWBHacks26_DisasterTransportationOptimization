import type { DisasterParams } from './disaster'

export interface SimulationConfig {
  disaster: DisasterParams
  origin: [number, number] | null   // [lat, lng]
  timeOfDay: number                 // 0–23
  dayOfWeek: number                 // 0–6 (Sun–Sat)
  busCount: number                  // 5–100
  simulationDuration: number        // minutes, 30–240
}

export type SimulationStatus = 'idle' | 'loading' | 'running' | 'paused' | 'complete'

// --- API response types (mirror backend Pydantic models) ---

export interface BusState {
  id: number
  lat: number
  lng: number
  status: 'idle' | 'moving' | 'loading' | 'returning'
  routeSafety: 'green' | 'yellow' | 'red'
}

export interface HubState {
  id: string
  lat: number
  lng: number
  name: string
  capacity: number
  current: number
  status: 'open' | 'filling' | 'full' | 'closed'
}

export interface SimulationFrame {
  t: number
  spreadGeoJSON: object
  buses: BusState[]
  hubs: HubState[]
  evacuated: number
}

export interface SimulationResponse {
  frames: SimulationFrame[]
  frameIntervalMinutes: number
  totalDuration: number
}