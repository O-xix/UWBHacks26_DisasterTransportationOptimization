import { GeoJSON } from 'react-leaflet'
import type { DisasterType } from '../../types/disaster'

const COLORS: Record<DisasterType, string> = {
  wildfire:   '#f97316',
  tornado:    '#a855f7',
  hurricane:  '#3b82f6',
  earthquake: '#f59e0b',
}

interface Props {
  geojson: object
  disasterType: DisasterType
  frameKey: number   // forces re-mount when frame changes
}

export default function SpreadLayer({ geojson, disasterType, frameKey }: Props) {
  const color = COLORS[disasterType]
  return (
    <GeoJSON
      key={frameKey}
      data={geojson as GeoJSON.GeoJsonObject}
      style={{
        color,
        fillColor: color,
        fillOpacity: 0.25,
        weight: 2,
        opacity: 0.8,
      }}
    />
  )
}
