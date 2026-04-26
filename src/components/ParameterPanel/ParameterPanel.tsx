import type { SimulationConfig, SimulationStatus } from '../../types/simulation'
import type { DisasterParams } from '../../types/disaster'
import WildfireParamsPanel from './WildfireParams'

interface Props {
  config: SimulationConfig
  status: SimulationStatus
  onChange: (config: SimulationConfig) => void
  onRun: () => void
}

export default function ParameterPanel({ config, status, onChange, onRun }: Props) {
  const { disaster, origin } = config

  const handleDisasterChange = (params: DisasterParams) => {
    onChange({ ...config, disaster: params })
  }

  return (
    <div className="w-80 h-full bg-gray-900 text-gray-100 flex flex-col overflow-y-auto border-r border-gray-700 shrink-0">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold text-white">Palisades Fire Sim</h1>
        <p className="text-xs text-gray-400 mt-1">January 2025 Evacuation</p>
      </div>

      <div className="p-4 space-y-5 flex-1">
        <div className="bg-red-900/40 border border-red-800 rounded p-3 mb-4">
          <h2 className="text-sm font-semibold text-red-200">Incident Details</h2>
          <div className="text-xs text-red-300 mt-2 space-y-1">
            <p><strong>Location:</strong> Pacific Palisades, CA</p>
            <p><strong>Evacuated Pop:</strong> ~37,000</p>
            <p><strong>Date:</strong> January 2025</p>
          </div>
        </div>
        
        <WildfireParamsPanel params={disaster} onChange={handleDisasterChange} />

        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">General</p>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Duration</span>
              <span className="text-gray-400">{config.simulationDuration} min</span>
            </div>
            <input
              type="range" min={30} max={720} step={30} value={config.simulationDuration}
              onChange={e => onChange({ ...config, simulationDuration: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">

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
