import type { DisasterType } from '../../types/disaster'

const DISASTERS: { type: DisasterType; label: string; activeClass: string }[] = [
  { type: 'wildfire',   label: 'Wildfire',   activeClass: 'border-orange-500 text-orange-400 bg-orange-950/40' },
  { type: 'tornado',    label: 'Tornado',    activeClass: 'border-purple-500 text-purple-400 bg-purple-950/40' },
  { type: 'hurricane',  label: 'Hurricane',  activeClass: 'border-blue-500  text-blue-400  bg-blue-950/40'  },
  { type: 'earthquake', label: 'Earthquake', activeClass: 'border-amber-500 text-amber-400 bg-amber-950/40' },
]

interface Props {
  selected: DisasterType
  onChange: (type: DisasterType) => void
}

export default function DisasterSelector({ selected, onChange }: Props) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
        Disaster Type
      </p>
      <div className="grid grid-cols-2 gap-2">
        {DISASTERS.map(({ type, label, activeClass }) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`py-2 px-3 rounded text-sm border transition-colors cursor-pointer
              ${selected === type
                ? activeClass
                : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
