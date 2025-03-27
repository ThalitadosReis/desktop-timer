import { Play, Pause, RefreshCw, Settings } from 'lucide-react'

export default function ControlButtons({
  isDarkMode,
  isRunning,
  resetTimer,
  startTimer,
  pauseTimer,
  openSettings
}) {
  return (
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={resetTimer}
        className={`p-2 rounded-full 
        ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-800'}`}
      >
        <RefreshCw />
      </button>
      {!isRunning ? (
        <button
          onClick={startTimer}
          className={`p-4 rounded-full 
          ${isDarkMode ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-white'}`}
        >
          <Play />
        </button>
      ) : (
        <button
          onClick={pauseTimer}
          className={`p-4 rounded-full 
          ${isDarkMode ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-white'}`}
        >
          <Pause />
        </button>
      )}

      <button
        onClick={openSettings}
        className={`p-2 rounded-full 
        ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-800'}`}
      >
        <Settings />
      </button>
    </div>
  )
}
