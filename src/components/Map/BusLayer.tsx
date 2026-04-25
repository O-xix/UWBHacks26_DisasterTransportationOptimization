import { CircleMarker, Tooltip } from 'react-leaflet'
import type { BusState } from '../../types/simulation'

const SAFETY_COLOR = {
  green:  '#22c55e',
  yellow: '#eab308',
  red:    '#ef4444',
}

const STATUS_LABEL = {
  idle:      'Idle',
  moving:    'En route',
  loading:   'Loading',
  returning: 'Returning',
}

interface Props {
  buses: BusState[]
}

export default function BusLayer({ buses }: Props) {
  return (
    <>
      {buses.map(bus => (
        <CircleMarker
          key={bus.id}
          center={[bus.lat, bus.lng]}
          radius={6}
          pathOptions={{
            color: '#1e293b',
            weight: 1.5,
            fillColor: SAFETY_COLOR[bus.routeSafety],
            fillOpacity: 0.9,
          }}
        >
          <Tooltip direction="top" offset={[0, -8]}>
            <span className="text-xs">
              Bus {bus.id} — {STATUS_LABEL[bus.status]}
            </span>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  )
}
