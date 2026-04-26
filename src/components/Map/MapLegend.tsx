import { useState } from 'react'

const LEGEND_ITEMS = [
  { type: 'line', color: '#22c55e', label: 'Route clear', dash: false },
  { type: 'line', color: '#eab308', label: 'Route threatened', dash: false },
  { type: 'line', color: '#ef4444', label: 'Route blocked / rerouting', dash: false },
  { type: 'line', color: '#94a3b8', label: 'Bus returning', dash: true },
  { type: 'divider' },
  { type: 'circle', color: '#22c55e', label: 'Hub — open' },
  { type: 'circle', color: '#eab308', label: 'Hub — filling (>60%)' },
  { type: 'circle', color: '#ef4444', label: 'Hub — full' },
  { type: 'divider' },
  { type: 'square', color: '#3b82f6', label: 'Bus depot' },
  { type: 'bus',    color: '#f97316', label: 'Bus' },
] as const

type LegendItem = (typeof LEGEND_ITEMS)[number]

function Swatch({ item }: { item: LegendItem }) {
  if (item.type === 'divider') {
    return <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.12)', margin: '4px 0' }} />
  }

  const swatchStyle: React.CSSProperties = {
    width: 22,
    height: item.type === 'line' ? 4 : 12,
    borderRadius: item.type === 'circle' ? '50%' : item.type === 'square' ? 2 : 0,
    flexShrink: 0,
  }

  if (item.type === 'line') {
    const dash = 'dash' in item && item.dash
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
        <svg width="22" height="6" style={{ flexShrink: 0 }}>
          <line
            x1="0" y1="3" x2="22" y2="3"
            stroke={'color' in item ? item.color : '#fff'}
            strokeWidth={3}
            strokeDasharray={dash ? '4 3' : undefined}
          />
        </svg>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
          {'label' in item ? item.label : ''}
        </span>
      </div>
    )
  }

  if (item.type === 'bus') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
        <svg width="22" height="14" viewBox="0 0 22 14" style={{ flexShrink: 0 }}>
          <rect x="2" y="2" width="18" height="10" rx="3" fill={'color' in item ? item.color : '#fff'} />
          <rect x="5" y="4" width="4" height="4" rx="1" fill="rgba(255,255,255,0.7)" />
          <rect x="11" y="4" width="4" height="4" rx="1" fill="rgba(255,255,255,0.7)" />
        </svg>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
          {'label' in item ? item.label : ''}
        </span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
      <div style={{ ...swatchStyle, background: 'color' in item ? item.color : '#fff' }} />
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
        {'label' in item ? item.label : ''}
      </span>
    </div>
  )
}

export default function MapLegend() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      id="map-legend"
      style={{
        position: 'absolute',
        bottom: 24,
        left: 12,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 10,
        padding: collapsed ? '6px 10px' : '10px 14px',
        minWidth: collapsed ? 'auto' : 170,
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        transition: 'all 0.2s ease',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: collapsed ? 0 : 6,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          Legend
        </span>
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            fontSize: 13,
            padding: '0 2px',
            lineHeight: 1,
          }}
          aria-label={collapsed ? 'Expand legend' : 'Collapse legend'}
        >
          {collapsed ? '▲' : '▼'}
        </button>
      </div>

      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {LEGEND_ITEMS.map((item, i) => (
            <Swatch key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
