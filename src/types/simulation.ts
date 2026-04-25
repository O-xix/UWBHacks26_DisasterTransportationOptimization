import type { DisasterParams } from './disaster'

export interface SimulationConfig {
  disaster: DisasterParams
  origin: [number, number] | null
  timeOfDay: number
  dayOfWeek: number
  busCount: number
  simulationDuration: number
}

export type SimulationStatus = 'idle' | 'loading' | 'running' | 'paused' | 'complete'

export interface BusState {
  id: number
  lat: number
  lng: number
  status: 'idle' | 'moving' | 'loading' | 'returning' | 'rerouting'
  routeSafety: 'green' | 'yellow' | 'red'
  routePolyline: [number, number][]
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

export interface DepotInfo {
  id: string
  lat: number
  lng: number
  name: string
  busCount: number
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
  depots: DepotInfo[]
}
