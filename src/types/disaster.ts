export type DisasterType = 'wildfire' | 'tornado' | 'hurricane' | 'earthquake'

export interface WildfireParams {
  type: 'wildfire'
  windSpeed: number       // mph, 0–80
  windDirection: number   // degrees 0–359
  spreadRate: number      // multiplier 0.5–3.0
}

export interface TornadoParams {
  type: 'tornado'
  efScale: 0 | 1 | 2 | 3 | 4 | 5
  pathDirection: number   // degrees 0–359
  speed: number           // mph, 5–70
  width: number           // meters, 100–1500
}

export interface HurricaneParams {
  type: 'hurricane'
  category: 1 | 2 | 3 | 4 | 5
  movementDirection: number  // degrees 0–359
  movementSpeed: number      // mph, 3–30
}

export interface EarthquakeParams {
  type: 'earthquake'
  magnitude: number   // 4.0–9.0
  depth: number       // km, 5–50
}

export type DisasterParams =
  | WildfireParams
  | TornadoParams
  | HurricaneParams
  | EarthquakeParams
