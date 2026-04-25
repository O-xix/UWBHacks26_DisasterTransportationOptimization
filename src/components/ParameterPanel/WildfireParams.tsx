import type { WildfireParams } from '../../types/disaster'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit: string
  accentClass?: string
  onChange: (v: number) => void
}

function Slider({ label, value, min, max, step = 1, unit, onChange }: SliderProps) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-400">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-orange-500 cursor-pointer"
      />
    </div>
  )
}

interface Props {
  params: WildfireParams
  onChange: (params: WildfireParams) => void
}

export default function WildfireParamsPanel({ params, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-orange-400 uppercase tracking-wider">
        Wildfire Parameters
      </p>
      <Slider
        label="Wind speed" value={params.windSpeed} min={0} max={80} unit=" mph"
        onChange={v => onChange({ ...params, windSpeed: v })}
      />
      <Slider
        label="Wind direction" value={params.windDirection} min={0} max={359} unit="°"
        onChange={v => onChange({ ...params, windDirection: v })}
      />
      <Slider
        label="Spread rate" value={params.spreadRate} min={0.5} max={3} step={0.1} unit="x"
        onChange={v => onChange({ ...params, spreadRate: v })}
      />
    </div>
  )
}
