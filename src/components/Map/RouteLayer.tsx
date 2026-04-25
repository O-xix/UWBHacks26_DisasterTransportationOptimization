import { Polyline, Tooltip } from 'react-leaflet'
import type { BusState } from '../../types/simulation'

const ROUTE_COLOR: Record<BusState['routeSafety'], string> = {
  green:  '#22c55e',
  yellow: '#eab308',
  red:    '#ef4444',
}

const STATUS_LABEL: Record<BusState['status'], string> = {
  idle:      'Idle',
  moving:    'En route',
  loading:   'Loading',
  returning: 'Returning',
  rerouting: 'Rerouting',
}

interface Props {
  buses: BusState[]
}

export default function RouteLayer({ buses }: Props) {
  return (
    <>
      {buses
        .filter(bus => bus.routePolyline.length >= 2 && bus.status !== 'loading')
        .map(bus => (
          <Polyline
            key={bus.id}
            positions={bus.routePolyline}
            pathOptions={{
              color: ROUTE_COLOR[bus.routeSafety],
              weight: bus.routeSafety === 'red' ? 4 : 3,
              opacity: 0.75,
              // Dashed while returning; animated dash while rerouting
              dashArray: bus.status === 'returning'
                ? '8 5'
                : bus.status === 'rerouting'
                  ? '4 4'
                  : undefined,
            }}
          >
            <Tooltip sticky>
              Bus {bus.id} — {STATUS_LABEL[bus.status]}
            </Tooltip>
          </Polyline>
        ))}
    </>
  )
}
