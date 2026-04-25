import { CircleMarker, Tooltip } from 'react-leaflet'
import type { DepotInfo } from '../../types/simulation'

interface Props {
  depots: DepotInfo[]
}

export default function DepotLayer({ depots }: Props) {
  return (
    <>
      {depots.map(depot => (
        <CircleMarker
          key={depot.id}
          center={[depot.lat, depot.lng]}
          radius={9}
          pathOptions={{
            color: '#f8fafc',
            weight: 2,
            fillColor: '#1e3a8a',
            fillOpacity: 0.9,
          }}
        >
          <Tooltip direction="top" offset={[0, -10]}>
            <div className="text-xs leading-tight">
              <div className="font-semibold">{depot.name}</div>
              <div className="text-gray-500">{depot.busCount} buses dispatched</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  )
}
