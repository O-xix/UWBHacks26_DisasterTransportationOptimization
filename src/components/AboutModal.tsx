interface Props {
  onClose: () => void
}

export default function AboutModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">How It Works</h2>
            <p className="text-xs text-gray-400 mt-1">Disaster Transit Optimizer — educational simulation</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-xl leading-none cursor-pointer ml-4"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm text-gray-300">
          <Section title="What this is">
            Place a natural disaster on the map, set parameters, and watch an AI-driven bus
            evacuation unfold in real time. All routes and hub locations come from real
            OpenStreetMap data — this isn't random geometry.
          </Section>

          <Section title="Disaster spread models">
            <ul className="space-y-1.5 mt-1">
              <li><span className="text-orange-400 font-medium">Wildfire</span> — 72-point asymmetric polygon. Each boundary point grows at a rate weighted by wind alignment and randomised noise, so the fire fans out downwind.</li>
              <li><span className="text-purple-400 font-medium">Tornado</span> — swept rectangle that elongates along the path direction with an EF-scale width multiplier.</li>
              <li><span className="text-blue-400 font-medium">Hurricane</span> — expanding ellipse whose radii match observed Category 1–5 wind fields, drifting in the movement direction.</li>
              <li><span className="text-yellow-400 font-medium">Earthquake</span> — irregular rings with random radial variation simulating uneven ground shaking intensity.</li>
            </ul>
          </Section>

          <Section title="Hub & depot locations">
            Real locations are pulled live from the <span className="text-white font-medium">Overpass API</span> (OpenStreetMap) —
            bus stations and transit depots for vehicles, schools and community centres as evacuation hubs.
            If fewer than four results come back, procedural fallback positions are used.
          </Section>

          <Section title="Road routing">
            Every route is planned through <span className="text-white font-medium">OSRM</span>, an
            open-source road router. Buses follow actual driveable roads — no shortcuts across water.
            A local OSRM instance is tried first; if unavailable, the public OSRM demo server is used.
          </Section>

          <Section title="Allocation algorithm">
            Buses are assigned to hubs using a <span className="text-white font-medium">greedy capacitated VRP</span>.
            Each unserved hub gets a priority score:
            <code className="block mt-1.5 bg-gray-800 px-3 py-2 rounded text-xs text-gray-200 font-mono">
              priority = demand × urgency_factor / distance_to_disaster
            </code>
            Hubs closest to the spreading disaster get urgency boosts. The nearest available bus is
            then matched to the highest-priority hub, repeated until all buses are dispatched.
          </Section>

          <Section title="Route safety & rerouting">
            At each simulation step, every bus route is checked against the current disaster polygon.
            Routes within a 5 km buffer are flagged <span className="text-yellow-400 font-medium">yellow</span>;
            routes that intersect the polygon turn <span className="text-red-400 font-medium">red</span>.
            Red-route buses are automatically rerouted around the disaster using a perpendicular
            waypoint offset ~14 km to the side.
          </Section>

          <Section title="AI narration">
            The <span className="text-white font-medium">Explain</span> button sends the current
            simulation state to Claude (Haiku) which writes 2–3 sentences in plain English explaining
            what the optimizer is prioritising right now and why.
          </Section>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium text-gray-200 transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-white font-semibold mb-1">{title}</p>
      <div className="text-gray-400 leading-relaxed">{children}</div>
    </div>
  )
}
