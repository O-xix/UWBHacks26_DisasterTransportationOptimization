import { CircleMarker, Tooltip } from 'react-leaflet'
import type { HubState } from '../../types/simulation'

const STATUS_COLOR = {
  open:    '#22c55e',
  filling: '#eab308',
  full:    '#ef4444',
  closed:  '#6b7280',
}

interface Props {
  hubs: HubState[]
}

export default function HubLayer({ hubs }: Props) {
  return (
    <>
      {hubs.map(hub => {
        const fillPct = hub.capacity > 0 ? hub.current / hub.capacity : 0
        return (
          <CircleMarker
            key={hub.id}
            center={[hub.lat, hub.lng]}
            radius={10 + fillPct * 6}
            pathOptions={{
              color: STATUS_COLOR[hub.status],
              weight: 2,
              fillColor: STATUS_COLOR[hub.status],
              fillOpacity: 0.2 + fillPct * 0.5,
            }}
          >
            <Tooltip direction="top" offset={[0, -12]} permanent={false}>
              <div className="text-xs leading-tight">
                <div className="font-semibold">{hub.name}</div>
                <div>{hub.current} / {hub.capacity} capacity</div>
              </div>
            </Tooltip>
          </CircleMarker>
        )
      })}
    </>
  )
}
