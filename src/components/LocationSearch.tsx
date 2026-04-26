import { useState, useRef, useEffect } from 'react'

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

interface Props {
  onFlyTo: (pos: [number, number]) => void
}

export default function LocationSearch({ onFlyTo }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NominatimResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const search = (q: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!q.trim()) { setResults([]); setOpen(false); return }

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`
        const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
        const data: NominatimResult[] = await res.json()
        setResults(data)
        setOpen(data.length > 0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 500)
  }

  const handleSelect = (r: NominatimResult) => {
    onFlyTo([parseFloat(r.lat), parseFloat(r.lon)])
    setQuery(r.display_name.split(',')[0])
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-64">
      <div className="flex items-center bg-gray-900/95 border border-gray-700 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
        <svg className="w-4 h-4 text-gray-500 ml-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.41-1.41l4.38 4.38-1.41 1.41-4.38-4.38zM8 14A6 6 0 108 2a6 6 0 000 12z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          value={query}
          placeholder="Search location…"
          onChange={e => { setQuery(e.target.value); search(e.target.value) }}
          onKeyDown={e => e.key === 'Escape' && setOpen(false)}
          className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 text-xs px-2 py-2.5 outline-none"
        />
        {loading && (
          <div className="w-3 h-3 border border-gray-500 border-t-transparent rounded-full animate-spin mr-3 shrink-0" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-10">
          {results.map(r => (
            <button
              key={r.place_id}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer border-b border-gray-800 last:border-0"
            >
              <span className="block font-medium text-gray-100 truncate">{r.display_name.split(',')[0]}</span>
              <span className="block text-gray-500 truncate text-[10px]">{r.display_name.split(',').slice(1, 3).join(',')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
