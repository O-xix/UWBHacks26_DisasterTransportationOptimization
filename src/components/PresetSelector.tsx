import type { SimulationConfig } from '../types/simulation'
import type { DisasterType } from '../types/disaster'

interface PresetDef {
  id: string
  displayName: string
  subtitle: string
  disasterType: DisasterType
  origin: [number, number]
  busCount: number
  simulationDuration: number
  warningMinutes: number
  timeOfDay: number
  icon: string
  tagline: string
  stats: { label: string; value: string }[]
  color: string        // tailwind bg class for card accent
  textColor: string
}

const PRESETS: PresetDef[] = [
  {
    id: 'lahaina_2023',
    displayName: 'Lahaina Fire',
    subtitle: 'Maui, HI — August 2023',
    disasterType: 'wildfire',
    origin: [20.872, -156.681],
    busCount: 12,
    simulationDuration: 240,
    warningMinutes: 20,
    timeOfDay: 7,
    icon: '🔥',
    tagline: '90% of Lahaina destroyed in 4 hours. 20-minute evacuation window.',
    stats: [
      { label: 'Warning', value: '20 min' },
      { label: 'Fleet', value: '12 buses' },
      { label: 'Affected', value: '~12,000' },
    ],
    color: 'bg-orange-950 border-orange-700',
    textColor: 'text-orange-400',
  },
  {
    id: 'palisades_2025',
    displayName: 'Palisades Fire',
    subtitle: 'Pacific Palisades, CA — January 2025',
    disasterType: 'wildfire',
    origin: [34.052, -118.522],
    busCount: 25,
    simulationDuration: 720,
    warningMinutes: 45,
    timeOfDay: 10,
    icon: '🔥',
    tagline: '17,000 acres in 24 hours. Red Flag Warning was active.',
    stats: [
      { label: 'Warning', value: '45 min' },
      { label: 'Fleet', value: '25 buses' },
      { label: 'Affected', value: '~30,000' },
    ],
    color: 'bg-red-950 border-red-700',
    textColor: 'text-red-400',
  },
  {
    id: 'hurricane_ian_2022',
    displayName: 'Hurricane Ian',
    subtitle: 'Fort Myers, FL — September 2022',
    disasterType: 'hurricane',
    origin: [26.513, -81.955],
    busCount: 40,
    simulationDuration: 2880,
    warningMinutes: 1440,
    timeOfDay: 8,
    icon: '🌀',
    tagline: 'Category 4 landfall. 18-ft storm surge. No bus evacuation ran.',
    stats: [
      { label: 'Warning', value: '24 hours' },
      { label: 'Fleet', value: '40 buses' },
      { label: 'Affected', value: '~800,000' },
    ],
    color: 'bg-blue-950 border-blue-700',
    textColor: 'text-blue-400',
  },
  {
    id: 'hurricane_helene_2024',
    displayName: 'Hurricane Helene',
    subtitle: 'Asheville, NC — September 2024',
    disasterType: 'hurricane',
    origin: [35.575, -82.551],
    busCount: 20,
    simulationDuration: 1440,
    warningMinutes: 480,
    timeOfDay: 6,
    icon: '🌀',
    tagline: 'Record 27-ft river crest. Transit suspended with no pre-staging.',
    stats: [
      { label: 'Warning', value: '8 hours' },
      { label: 'Fleet', value: '20 buses' },
      { label: 'Affected', value: '~93,000' },
    ],
    color: 'bg-cyan-950 border-cyan-700',
    textColor: 'text-cyan-400',
  },
  {
    id: 'rolling_fork_2023',
    displayName: 'Rolling Fork Tornado',
    subtitle: 'Rolling Fork, MS — March 2023',
    disasterType: 'tornado',
    origin: [32.906, -90.877],
    busCount: 8,
    simulationDuration: 120,
    warningMinutes: 13,
    timeOfDay: 21,
    icon: '🌪️',
    tagline: 'EF4, 90 km path. 13 minutes of warning. No public transit.',
    stats: [
      { label: 'Warning', value: '13 min' },
      { label: 'Fleet', value: '8 buses' },
      { label: 'Affected', value: '~3,300' },
    ],
    color: 'bg-slate-800 border-slate-600',
    textColor: 'text-slate-300',
  },
]

function defaultDisasterFor(type: DisasterType) {
  switch (type) {
    case 'wildfire':  return { type: 'wildfire' as const, windSpeed: 25, windDirection: 270, spreadRate: 1.0 }
    case 'hurricane': return { type: 'hurricane' as const, category: 4 as const, movementDirection: 315, movementSpeed: 12 }
    case 'tornado':   return { type: 'tornado' as const, efScale: 4 as const, pathDirection: 45, speed: 55, width: 1600 }
    case 'earthquake': return { type: 'earthquake' as const, magnitude: 6.5, depth: 10 }
  }
}

interface Props {
  onSelect: (config: SimulationConfig) => void
  onCustom: () => void
}

export default function PresetSelector({ onSelect, onCustom }: Props) {
  function handleSelect(preset: PresetDef) {
    onSelect({
      disaster: defaultDisasterFor(preset.disasterType),
      origin: preset.origin,
      timeOfDay: preset.timeOfDay,
      dayOfWeek: 4,
      busCount: preset.busCount,
      simulationDuration: preset.simulationDuration,
      presetId: preset.id,
      warningMinutes: preset.warningMinutes,
    })
  }

  return (
    <div className="fixed inset-0 z-[2000] bg-gray-950/95 flex flex-col overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Disaster Transit Optimizer
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Five real disasters. Five counterfactuals. See how optimized bus deployment
            could have changed the outcome.
          </p>
        </div>

        {/* Preset grid — 2 cols, last card centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSelect(preset)}
              className={`
                text-left rounded-xl border p-5 space-y-3 cursor-pointer
                transition-all duration-150 hover:scale-[1.02] hover:brightness-110
                ${preset.color}
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{preset.icon}</span>
                    <span className="text-white font-semibold text-base">{preset.displayName}</span>
                  </div>
                  <p className={`text-xs mt-0.5 ${preset.textColor}`}>{preset.subtitle}</p>
                </div>
              </div>

              <p className="text-gray-300 text-xs leading-relaxed">{preset.tagline}</p>

              <div className="flex gap-4">
                {preset.stats.map(s => (
                  <div key={s.label} className="flex flex-col">
                    <span className="text-gray-500 text-[10px] uppercase tracking-wider">{s.label}</span>
                    <span className={`text-sm font-medium ${preset.textColor}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Custom mode entry */}
        <div className="text-center">
          <button
            onClick={onCustom}
            className="text-sm text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Skip — use custom disaster placement
          </button>
        </div>
      </div>
    </div>
  )
}

export { PRESETS }
export type { PresetDef }
