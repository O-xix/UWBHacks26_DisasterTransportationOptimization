import { useState } from 'react'
import MapView from './components/Map/MapView'
import ParameterPanel from './components/ParameterPanel/ParameterPanel'
import PlaybackControls from './components/PlaybackControls'
import { useSimulation } from './hooks/useSimulation'
import type { SimulationConfig } from './types/simulation'

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
  const sim = useSimulation(config)

  function handleConfigChange(next: SimulationConfig) {
    setConfig(next)
    sim.reset()
  }

  return (
    <div className="flex h-full w-full bg-gray-950">
      <ParameterPanel
        config={config}
        status={sim.status}
        onChange={handleConfigChange}
        onRun={sim.run}
      />

      <div className="flex-1 relative">
        <MapView
          config={config}
          currentFrame={sim.currentFrame}
          onOriginSet={(origin) => handleConfigChange({ ...config, origin })}
        />

        {sim.error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-red-900/90 border border-red-700 text-red-200 text-sm px-4 py-2 rounded-lg">
            {sim.error}
          </div>
        )}

        {sim.status === 'loading' && (
          <div className="absolute inset-0 z-[999] flex items-center justify-center bg-gray-950/60">
            <div className="bg-gray-900 border border-gray-700 rounded-xl px-8 py-6 text-gray-200 text-sm">
              Running simulation...
            </div>
          </div>
        )}

        {sim.frames.length > 0 && (
          <PlaybackControls sim={sim} />
        )}
      </div>
    </div>
  )
}
