export type DisasterType = 'wildfire'

export interface WildfireParams {
  type: 'wildfire'
  windSpeed: number       // mph, 0–80
  windDirection: number   // degrees 0–359
  spreadRate: number      // multiplier 0.5–3.0
}

export type DisasterParams = WildfireParams
