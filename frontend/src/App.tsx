import { useState } from 'react'
import MapView from './components/Map/MapView'
import ParameterPanel from './components/ParameterPanel/ParameterPanel'
import type { SimulationConfig, SimulationStatus } from './types/simulation'

const defaultConfig: SimulationConfig = {
  disaster: {
    type: 'wildfire',
    windSpeed: 20,
    windDirection: 270,
    spreadRate: 1.0,
  },
  origin: null,
  timeOfDay: 14,
  dayOfWeek: 2,
  busCount: 20,
  simulationDuration: 120,
}

export default function App() {
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig)
  const [status, setStatus] = useState<SimulationStatus>('idle')

  return (
    <div className="flex h-full w-full bg-gray-950">
      <ParameterPanel
        config={config}
        status={status}
        onChange={setConfig}
        onRun={() => setStatus('running')}
      />
      <div className="flex-1 relative">
        <MapView
          config={config}
          onOriginSet={(origin) => setConfig({ ...config, origin })}
        />
      </div>
    </div>
  )
}
