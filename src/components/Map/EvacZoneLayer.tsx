import { GeoJSON, Tooltip } from 'react-leaflet'
import type { EvacZone } from '../../types/simulation'

interface Props {
  zones: EvacZone[]
}

const ZONE_COLORS: Record<string, { fill: string; stroke: string }> = {
  // Hurricane zones
  A:   { fill: '#ef4444', stroke: '#dc2626' },
  B:   { fill: '#f97316', stroke: '#ea580c' },
  C:   { fill: '#eab308', stroke: '#ca8a04' },
  D:   { fill: '#a3e635', stroke: '#84cc16' },
  E:   { fill: '#94a3b8', stroke: '#64748b' },
  // Wildfire levels
  order:   { fill: '#ef4444', stroke: '#dc2626' },
  warning: { fill: '#eab308', stroke: '#ca8a04' },
}

function getZoneStyle(zone: EvacZone) {
  const key = zone.level || zone.zone
  const colors = ZONE_COLORS[key] || ZONE_COLORS[zone.zone?.charAt(0)] || {
    fill: '#94a3b8',
    stroke: '#64748b',
  }

  return {
    fillColor: colors.fill,
    color: colors.stroke,
    fillOpacity: 0.15,
    weight: 2,
    opacity: 0.6,
    dashArray: zone.level === 'warning' ? '6 4' : undefined,
  }
}

export default function EvacZoneLayer({ zones }: Props) {
  return (
    <>
      {zones.map((zone, i) => (
        <GeoJSON
          key={`evac-${zone.zone}-${i}`}
          data={{
            type: 'Feature',
            properties: { zone: zone.zone, level: zone.level },
            geometry: zone.geometry,
          } as GeoJSON.GeoJsonObject}
          style={getZoneStyle(zone)}
        >
          <Tooltip sticky>
            {zone.zone}
          </Tooltip>
        </GeoJSON>
      ))}
    </>
  )
}
