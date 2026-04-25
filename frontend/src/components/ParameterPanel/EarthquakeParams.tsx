import type { EarthquakeParams } from '../../types/disaster'

interface Props {
  params: EarthquakeParams
  onChange: (params: EarthquakeParams) => void
}

export default function EarthquakeParamsPanel({ params, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">
        Earthquake Parameters
      </p>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Magnitude</span>
          <span className="text-gray-400">M{params.magnitude.toFixed(1)}</span>
        </div>
        <input
          type="range" min={4.0} max={9.0} step={0.1} value={params.magnitude}
          onChange={e => onChange({ ...params, magnitude: Number(e.target.value) })}
          className="w-full accent-amber-500 cursor-pointer"
        />
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Depth</span>
          <span className="text-gray-400">{params.depth} km</span>
        </div>
        <input
          type="range" min={5} max={50} value={params.depth}
          onChange={e => onChange({ ...params, depth: Number(e.target.value) })}
          className="w-full accent-amber-500 cursor-pointer"
        />
      </div>

      <p className="text-xs text-gray-500">
        Shallower depth = more surface damage and infrastructure disruption.
      </p>
    </div>
  )
}
