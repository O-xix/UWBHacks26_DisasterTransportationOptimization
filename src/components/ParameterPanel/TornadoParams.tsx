import type { TornadoParams } from '../../types/disaster'

const EF_LABELS = ['EF0', 'EF1', 'EF2', 'EF3', 'EF4', 'EF5']

interface Props {
  params: TornadoParams
  onChange: (params: TornadoParams) => void
}

export default function TornadoParamsPanel({ params, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-purple-400 uppercase tracking-wider">
        Tornado Parameters
      </p>

      <div>
        <p className="text-sm text-gray-300 mb-2">EF Scale</p>
        <div className="flex gap-1">
          {EF_LABELS.map((label, scale) => (
            <button
              key={scale}
              onClick={() => onChange({ ...params, efScale: scale as TornadoParams['efScale'] })}
              className={`flex-1 py-1 rounded text-xs font-bold transition-colors cursor-pointer
                ${params.efScale === scale
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Path direction</span>
          <span className="text-gray-400">{params.pathDirection}°</span>
        </div>
        <input
          type="range" min={0} max={359} value={params.pathDirection}
          onChange={e => onChange({ ...params, pathDirection: Number(e.target.value) })}
          className="w-full accent-purple-500 cursor-pointer"
        />
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Movement speed</span>
          <span className="text-gray-400">{params.speed} mph</span>
        </div>
        <input
          type="range" min={5} max={70} value={params.speed}
          onChange={e => onChange({ ...params, speed: Number(e.target.value) })}
          className="w-full accent-purple-500 cursor-pointer"
        />
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Width</span>
          <span className="text-gray-400">{params.width} m</span>
        </div>
        <input
          type="range" min={100} max={1500} step={50} value={params.width}
          onChange={e => onChange({ ...params, width: Number(e.target.value) })}
          className="w-full accent-purple-500 cursor-pointer"
        />
      </div>
    </div>
  )
}
