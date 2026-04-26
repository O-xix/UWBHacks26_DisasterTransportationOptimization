import type { SimulationConfig, SimulationStatus } from '../../types/simulation'
import type { DisasterParams, DisasterType } from '../../types/disaster'
import DisasterSelector from './DisasterSelector'
import WildfireParamsPanel from './WildfireParams'
import TornadoParamsPanel from './TornadoParams'
import HurricaneParamsPanel from './HurricaneParams'
import EarthquakeParamsPanel from './EarthquakeParams'

const defaultParamsFor = (type: DisasterType): DisasterParams => {
  switch (type) {
    case 'wildfire':   return { type: 'wildfire',   windSpeed: 20, windDirection: 270, spreadRate: 1.0 }
    case 'tornado':    return { type: 'tornado',    efScale: 2, pathDirection: 45, speed: 30, width: 400 }
    case 'hurricane':  return { type: 'hurricane',  category: 3, movementDirection: 315, movementSpeed: 12 }
    case 'earthquake': return { type: 'earthquake', magnitude: 6.5, depth: 15 }
  }
}

interface Props {
  config: SimulationConfig
  status: SimulationStatus
  onChange: (config: SimulationConfig) => void
  onRun: () => void
  onStop: () => void
  onChangePreset: () => void
  onAbout: () => void
}

export default function ParameterPanel({ config, status, onChange, onRun, onStop, onChangePreset, onAbout }: Props) {
  const { disaster, origin } = config
  const locked = status === 'loading' || status === 'running' || status === 'paused'
  const isPreset = config.presetId !== null

  const handleTypeChange = (type: DisasterType) => {
    onChange({ ...config, disaster: defaultParamsFor(type) })
  }

  const handleDisasterChange = (params: DisasterParams) => {
    onChange({ ...config, disaster: params })
  }

  return (
    <div className="w-80 h-full bg-gray-900 text-gray-100 flex flex-col border-r border-gray-700 shrink-0 relative">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Disaster Transit Sim</h1>
          <button
            onClick={onAbout}
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
          >
            About
          </button>
        </div>
        {isPreset ? (
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-orange-400 font-medium truncate">
              Historical preset
            </p>
            <button
              onClick={onChangePreset}
              disabled={locked}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-400">Click map to place disaster origin</p>
            <button
              onClick={onChangePreset}
              disabled={locked}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Presets
            </button>
          </div>
        )}
      </div>

      {/* Parameter content — scrollable, dimmed when locked */}
      <div className={`p-4 space-y-5 flex-1 overflow-y-auto transition-opacity ${locked ? 'opacity-40 pointer-events-none select-none' : ''}`}>
        {/* Disaster type + params hidden in preset mode (backend uses real data) */}
        {!isPreset && (
          <>
            <DisasterSelector selected={disaster.type} onChange={handleTypeChange} />
            {disaster.type === 'wildfire'   && <WildfireParamsPanel   params={disaster} onChange={handleDisasterChange} />}
            {disaster.type === 'tornado'    && <TornadoParamsPanel    params={disaster} onChange={handleDisasterChange} />}
            {disaster.type === 'hurricane'  && <HurricaneParamsPanel  params={disaster} onChange={handleDisasterChange} />}
            {disaster.type === 'earthquake' && <EarthquakeParamsPanel params={disaster} onChange={handleDisasterChange} />}
          </>
        )}

        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">General</p>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Time of day</span>
              <span className="text-gray-400">{config.timeOfDay}:00</span>
            </div>
            <input
              type="range" min={0} max={23} value={config.timeOfDay}
              onChange={e => onChange({ ...config, timeOfDay: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Buses available</span>
              <span className="text-gray-400">{config.busCount}</span>
            </div>
            <input
              type="range" min={5} max={100} step={5} value={config.busCount}
              onChange={e => onChange({ ...config, busCount: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Duration</span>
              <span className="text-gray-400">{config.simulationDuration} min</span>
            </div>
            <input
              type="range" min={30} max={isPreset ? Math.max(config.simulationDuration, 240) : 240} step={30}
              value={config.simulationDuration}
              onChange={e => onChange({ ...config, simulationDuration: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Footer button */}
      <div className="p-4 border-t border-gray-700 shrink-0">
        {locked ? (
          <button
            onClick={onStop}
            className="w-full py-3 rounded font-semibold text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors cursor-pointer"
          >
            Stop Simulation
          </button>
        ) : (
          <>
            {!isPreset && !origin && (
              <p className="text-xs text-yellow-400 mb-3">Click the map to place disaster origin first</p>
            )}
            <button
              onClick={onRun}
              disabled={!isPreset && !origin}
              className="w-full py-3 rounded font-semibold text-sm bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Run Simulation
            </button>
          </>
        )}
      </div>
    </div>
  )
}
