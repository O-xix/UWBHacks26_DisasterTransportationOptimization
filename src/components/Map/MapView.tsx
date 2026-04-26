import { MapContainer, TileLayer, Marker, useMapEvents, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SimulationConfig } from '../../types/simulation'

// Fix Vite + Leaflet default marker icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const disasterIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'disaster-marker',
})

function ClickHandler({ onOriginSet }: { onOriginSet: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onOriginSet([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

interface Props {
  config: SimulationConfig
  onOriginSet: (origin: [number, number]) => void
}

export default function MapView({ config, onOriginSet }: Props) {
  return (
    <MapContainer
      center={[37.5, -119.5]}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onOriginSet={onOriginSet} />
      {config.origin && (
        <Marker position={config.origin} icon={disasterIcon} />
      )}
    </MapContainer>
  )
}
