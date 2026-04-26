import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SimulationConfig, SimulationFrame, DepotInfo } from '../../types/simulation'
import SpreadLayer from './SpreadLayer'
import BusLayer from './BusLayer'
import HubLayer from './HubLayer'
import RouteLayer from './RouteLayer'
import DepotLayer from './DepotLayer'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function ClickHandler({ onOriginSet }: { onOriginSet: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) { onOriginSet([e.latlng.lat, e.latlng.lng]) },
  })
  return null
}

function FlyToController({ pos }: { pos: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (pos) map.flyTo(pos, 13, { duration: 1.5 })
  }, [pos, map])
  return null
}

interface Props {
  config: SimulationConfig
  currentFrame: SimulationFrame | null
  depots: DepotInfo[]
  showDepots: boolean
  showRoutes: boolean
  flyTo: [number, number] | null
  onOriginSet: (origin: [number, number]) => void
}

export default function MapView({ config, currentFrame, depots, showDepots, showRoutes, flyTo, onOriginSet }: Props) {
  return (
    <MapContainer
      center={[37.5, -119.5]}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler onOriginSet={onOriginSet} />
      <FlyToController pos={flyTo} />

      {config.origin && <Marker position={config.origin} />}

      {showDepots && depots.length > 0 && <DepotLayer depots={depots} />}

      {currentFrame && (
        <>
          {showRoutes && <RouteLayer buses={currentFrame.buses} />}
          <SpreadLayer
            geojson={currentFrame.spreadGeoJSON}
            disasterType={config.disaster.type}
            frameKey={currentFrame.t}
          />
          <HubLayer hubs={currentFrame.hubs} />
          <BusLayer buses={currentFrame.buses} />
        </>
      )}
    </MapContainer>
  )
}
