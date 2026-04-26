import { useState } from 'react'
import MapView from './components/Map/MapView'
import ParameterPanel from './components/ParameterPanel/ParameterPanel'
import PlaybackControls from './components/PlaybackControls'
import AboutModal from './components/AboutModal'
import LocationSearch from './components/LocationSearch'
import PresetSelector from './components/PresetSelector'
import { useSimulation } from './hooks/useSimulation'
import { useNarration } from './hooks/useNarration'
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
  presetId: null,
  warningMinutes: 0,
}

export default function App() {
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig)
  const [showPresetSelector, setShowPresetSelector] = useState(true)
  const [showDepots, setShowDepots] = useState(true)
  const [showRoutes, setShowRoutes] = useState(true)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null)
  const sim = useSimulation(config)
  const narration = useNarration()

  const isActive = sim.status === 'loading' || sim.status === 'running' || sim.status === 'paused'

  function handleConfigChange(next: SimulationConfig) {
    setConfig(next)
    sim.reset()
    narration.dismiss()
  }

  function handlePresetSelect(next: SimulationConfig) {
    setConfig(next)
    sim.reset()
    narration.dismiss()
    setShowPresetSelector(false)
    if (next.origin) setFlyTo(next.origin)
  }

  function handleStop() {
    sim.reset()
    narration.dismiss()
  }

  const hasSimData = sim.frames.length > 0 || sim.depots.length > 0

  return (
    <div className="flex h-full w-full bg-gray-950">
      <ParameterPanel
        config={config}
        status={sim.status}
        onChange={handleConfigChange}
        onRun={sim.run}
        onStop={handleStop}
        onChangePreset={() => setShowPresetSelector(true)}
        onAbout={() => setAboutOpen(true)}
      />

      <div className="flex-1 relative">
        <MapView
          config={config}
          currentFrame={sim.currentFrame}
          depots={sim.depots}
          evacZones={sim.evacZones}
          showDepots={showDepots}
          showRoutes={showRoutes}
          flyTo={flyTo}
          onOriginSet={(origin) => {
            if (!isActive) handleConfigChange({ ...config, origin })
          }}
        />

        {/* Search bar — top center */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000]">
          <LocationSearch onFlyTo={pos => setFlyTo(pos)} />
        </div>

        {/* Layer toggles — top right, only after sim data */}
        {hasSimData && (
          <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5">
            <ToggleButton
              label="Depots"
              active={showDepots}
              color="bg-blue-900 border-blue-700"
              activeColor="bg-blue-600 border-blue-500"
              onClick={() => setShowDepots(v => !v)}
            />
            <ToggleButton
              label="Routes"
              active={showRoutes}
              color="bg-gray-800 border-gray-600"
              activeColor="bg-gray-600 border-gray-400"
              onClick={() => setShowRoutes(v => !v)}
            />
          </div>
        )}

        {sim.error && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[1000] bg-red-900/90 border border-red-700 text-red-200 text-sm px-4 py-2 rounded-lg">
            {sim.error}
          </div>
        )}

        {sim.status === 'loading' && (
          <div className="absolute inset-0 z-[999] flex items-center justify-center bg-gray-950/60">
            <div className="bg-gray-900 border border-gray-700 rounded-xl px-8 py-6 text-center space-y-2">
              <p className="text-gray-200 text-sm font-medium">Running simulation</p>
              <p className="text-gray-500 text-xs">Fetching real locations and road routes…</p>
            </div>
          </div>
        )}

        {sim.frames.length > 0 && (
          <PlaybackControls
            sim={sim}
            narration={narration}
            disasterType={config.disaster.type}
          />
        )}
      </div>

      {showPresetSelector && (
        <PresetSelector
          onSelect={handlePresetSelect}
          onCustom={() => setShowPresetSelector(false)}
        />
      )}

      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </div>
  )
}

interface ToggleButtonProps {
  label: string
  active: boolean
  color: string
  activeColor: string
  onClick: () => void
}

function ToggleButton({ label, active, color, activeColor, onClick }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer
        text-white shadow-md backdrop-blur-sm
        ${active ? activeColor : color} opacity-${active ? '100' : '60'}`}
    >
      {active ? '● ' : '○ '}{label}
    </button>
  )
}
