import type { SimulationHandle } from '../hooks/useSimulation'
import type { NarrationHandle } from '../hooks/useNarration'

const SPEEDS = [1, 2, 4]

interface Props {
  sim: SimulationHandle
  narration: NarrationHandle
  disasterType: string
}

export default function PlaybackControls({ sim, narration, disasterType }: Props) {
  const { status, currentFrame, currentFrameIdx, frames, speed, setSpeed, pause, resume, seek, replay } = sim

  const maxIdx = Math.max(0, frames.length - 1)
  const isComplete = status === 'complete'

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-2">

      {/* Narration panel */}
      {(narration.text || narration.loading) && (
        <div className="bg-gray-900/95 border border-gray-700 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm max-w-[540px] relative">
          {narration.loading
            ? <p className="text-gray-400 text-xs italic">Claude is analysing the situation…</p>
            : (
              <>
                <p className="text-gray-200 text-xs leading-relaxed pr-5">{narration.text}</p>
                <button
                  onClick={narration.dismiss}
                  className="absolute top-2 right-3 text-gray-500 hover:text-gray-300 text-sm leading-none cursor-pointer"
                  aria-label="Dismiss"
                >×</button>
              </>
            )
          }
        </div>
      )}

      {/* Controls bar */}
      <div className="bg-gray-900/95 border border-gray-700 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden min-w-[540px]">

        {/* Scrub slider — full width */}
        <div className="px-4 pt-3 pb-1">
          <input
            type="range"
            min={0}
            max={maxIdx}
            value={currentFrameIdx}
            onChange={e => seek(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-1"
          />
        </div>

        {/* Bottom row */}
        <div className="px-4 pb-3 flex items-center gap-4">

          {/* Time */}
          <div className="text-xs text-gray-400 w-16 shrink-0 tabular-nums">
            T+{currentFrame?.t ?? 0} min
          </div>

          {/* Play / Pause / Replay */}
          <button
            onClick={isComplete ? replay : (status === 'running' ? pause : resume)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer shrink-0"
            aria-label={isComplete ? 'Replay' : status === 'running' ? 'Pause' : 'Play'}
          >
            {isComplete ? <ReplayIcon /> : status === 'running' ? <PauseIcon /> : <PlayIcon />}
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
          <div className="flex-1 text-xs text-green-400 font-semibold text-center">
            {(currentFrame?.evacuated ?? 0).toLocaleString()} evacuated
          </div>

          {/* Explain */}
          <button
            onClick={() => { if (currentFrame) narration.explain(currentFrame, disasterType) }}
            disabled={narration.loading || !currentFrame}
            className="text-purple-400 hover:text-purple-300 disabled:text-gray-600 disabled:cursor-not-allowed text-xs font-medium transition-colors cursor-pointer shrink-0"
          >
            Explain
          </button>

          {/* Completion badge */}
          {isComplete && (
            <span className="text-xs text-gray-500 shrink-0">Complete</span>
          )}
        </div>
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M5 3.5l8 4.5-8 4.5V3.5z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <rect x="3" y="2" width="3.5" height="12" rx="1" />
      <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
    </svg>
  )
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
      <path d="M8 1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H5a.5.5 0 0 1 0-1h2.5V2a.5.5 0 0 1 .5-.5z" />
    </svg>
  )
}
