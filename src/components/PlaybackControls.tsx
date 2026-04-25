import type { SimulationHandle } from '../hooks/useSimulation'

const SPEEDS = [1, 2, 4]

interface Props {
  sim: SimulationHandle
}

export default function PlaybackControls({ sim }: Props) {
  const { status, currentFrame, currentFrameIdx, frames, speed, setSpeed, pause, resume, reset } = sim

  const progressPct = frames.length > 1
    ? (currentFrameIdx / (frames.length - 1)) * 100
    : 0

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900/95 border border-gray-700 rounded-xl px-5 py-3 flex items-center gap-5 shadow-xl backdrop-blur-sm min-w-[420px]">

      {/* Time */}
      <div className="text-sm text-gray-300 w-20 shrink-0">
        T+{currentFrame?.t ?? 0} min
      </div>

      {/* Progress bar */}
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Play / Pause */}
      <button
        onClick={status === 'running' ? pause : resume}
        disabled={status === 'complete'}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
        aria-label={status === 'running' ? 'Pause' : 'Play'}
      >
        {status === 'running'
          ? <PauseIcon />
          : <PlayIcon />}
      </button>

      {/* Speed */}
      <div className="flex gap-1 shrink-0">
        {SPEEDS.map(s => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer
              ${speed === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Evacuated */}
      <div className="text-sm text-green-400 font-semibold w-24 text-right shrink-0">
        {(currentFrame?.evacuated ?? 0).toLocaleString()} out
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        className="text-gray-500 hover:text-gray-300 text-xs transition-colors cursor-pointer shrink-0"
      >
        Reset
      </button>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
      <path d="M5 3.5l8 4.5-8 4.5V3.5z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
      <rect x="3" y="2" width="3.5" height="12" rx="1" />
      <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
    </svg>
  )
}
