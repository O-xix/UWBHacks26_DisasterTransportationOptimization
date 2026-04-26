import { useState } from 'react'
import MapView from './components/Map/MapView'
import ParameterPanel from './components/ParameterPanel/ParameterPanel'
import type { SimulationConfig } from './types/simulation'
import type { SimulationStatus } from './types/simulation'

const defaultConfig: SimulationConfig = {
  disaster: {
    type: 'wildfire',
    windSpeed: 50,
    windDirection: 45,
    spreadRate: 3.0,
  },
  origin: [34.052, -118.530],
  dayOfWeek: 2,
  simulationDuration: 720,
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
