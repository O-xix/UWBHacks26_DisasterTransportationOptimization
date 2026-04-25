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
}

export default function ParameterPanel({ config, status, onChange, onRun }: Props) {
  const { disaster, origin } = config

  const handleTypeChange = (type: DisasterType) => {
    onChange({ ...config, disaster: defaultParamsFor(type) })
  }

  const handleDisasterChange = (params: DisasterParams) => {
    onChange({ ...config, disaster: params })
  }

  return (
    <div className="w-80 h-full bg-gray-900 text-gray-100 flex flex-col overflow-y-auto border-r border-gray-700 shrink-0">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold text-white">Disaster Transit Sim</h1>
        <p className="text-xs text-gray-400 mt-1">Click the map to place the disaster origin</p>
      </div>

      <div className="p-4 space-y-5 flex-1">
        <DisasterSelector selected={disaster.type} onChange={handleTypeChange} />

        {disaster.type === 'wildfire'   && <WildfireParamsPanel   params={disaster} onChange={handleDisasterChange} />}
        {disaster.type === 'tornado'    && <TornadoParamsPanel    params={disaster} onChange={handleDisasterChange} />}
        {disaster.type === 'hurricane'  && <HurricaneParamsPanel  params={disaster} onChange={handleDisasterChange} />}
        {disaster.type === 'earthquake' && <EarthquakeParamsPanel params={disaster} onChange={handleDisasterChange} />}

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
              type="range" min={30} max={240} step={30} value={config.simulationDuration}
              onChange={e => onChange({ ...config, simulationDuration: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        {!origin && (
          <p className="text-xs text-yellow-400 mb-3">Click the map to place disaster origin first</p>
        )}
        <button
          onClick={onRun}
          disabled={!origin || status === 'running'}
          className="w-full py-3 rounded font-semibold text-sm bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {status === 'running' ? 'Simulating...' : 'Run Simulation'}
        </button>
      </div>
    </div>
  )
}
