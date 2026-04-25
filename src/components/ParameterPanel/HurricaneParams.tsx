import type { HurricaneParams } from '../../types/disaster'

const CATEGORIES = [1, 2, 3, 4, 5] as const

interface Props {
  params: HurricaneParams
  onChange: (params: HurricaneParams) => void
}

export default function HurricaneParamsPanel({ params, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-blue-400 uppercase tracking-wider">
        Hurricane Parameters
      </p>

      <div>
        <p className="text-sm text-gray-300 mb-2">Category</p>
        <div className="flex gap-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onChange({ ...params, category: cat })}
              className={`flex-1 py-1 rounded text-xs font-bold transition-colors cursor-pointer
                ${params.category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Movement direction</span>
          <span className="text-gray-400">{params.movementDirection}°</span>
        </div>
        <input
          type="range" min={0} max={359} value={params.movementDirection}
          onChange={e => onChange({ ...params, movementDirection: Number(e.target.value) })}
          className="w-full accent-blue-500 cursor-pointer"
        />
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Movement speed</span>
          <span className="text-gray-400">{params.movementSpeed} mph</span>
        </div>
        <input
          type="range" min={3} max={30} value={params.movementSpeed}
          onChange={e => onChange({ ...params, movementSpeed: Number(e.target.value) })}
          className="w-full accent-blue-500 cursor-pointer"
        />
      </div>
    </div>
  )
}
