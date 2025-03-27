import { formatTime } from '../utils/formatTime'

export default function TimerDisplay({
  mode,
  timeLeft,
  isDarkMode,
  calculateProgress,
  completedSessions,
  sessionsBeforeLongBreak
}) {
  return (
    <div className="relative w-64 h-64 mx-auto mb-6">
      {/* background ring */}
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className={`${isDarkMode ? 'text-slate-600' : 'text-slate-200'}`}
        />
      </svg>

      {/* progress ring */}
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="283"
          strokeDashoffset={283 - (calculateProgress() * 283) / 360}
          className={`${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      {/* timer */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* session display */}
        <div className="text-center">
          <span className={`text-xs uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {mode}
          </span>
        </div>
        <div className={`text-5xl font-bold ${isDarkMode ? 'text-slate-50' : 'text-slate-900'}`}>
          {formatTime(timeLeft)}
        </div>
        <div
          className={`text-center text-xs font-light mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
        >
          {completedSessions} / {sessionsBeforeLongBreak} Sessions
        </div>
      </div>
    </div>
  )
}
