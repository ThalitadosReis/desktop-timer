import { useState, useEffect, useRef } from 'react'
import { Play, Settings, RefreshCw, Pause, X, ChevronLeft, ChevronRight } from 'lucide-react'

function App() {
  // default settings
  const [settings, setSettings] = useState({
    focusTime: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    sessionsBeforeLongBreak: 4
  })

  // the timer state
  const [timeLeft, setTimeLeft] = useState(settings.focusTime)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('focus')
  const [completedSessions, setCompletedSessions] = useState(0)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // refs for input validation
  const focusRef = useRef(null)
  const shortBreakRef = useRef(null)
  const longBreakRef = useRef(null)
  const sessionsRef = useRef(null)

  // the timer logic
  useEffect(() => {
    let interval
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)

    if (mode === 'focus') {
      const newCompletedSessions = completedSessions + 1
      setCompletedSessions(newCompletedSessions)

      // determining the next break type
      if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
        setMode('longBreak')
        setTimeLeft(settings.longBreak)

        // Reset completed sessions after long break
        if (newCompletedSessions === settings.sessionsBeforeLongBreak) {
          setCompletedSessions(0)
        }
      } else {
        setMode('shortBreak')
        setTimeLeft(settings.shortBreak)
      }
    } else {
      // returning to focus mode after any break
      setMode('focus')
      setTimeLeft(settings.focusTime)
    }
  }

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (mode === 'focus') {
      setTimeLeft(settings.focusTime)
    } else if (mode === 'shortBreak') {
      setTimeLeft(settings.shortBreak)
    } else {
      setTimeLeft(settings.longBreak)
    }
  }

  const handleSaveSettings = () => {
    const newFocusTime = parseInt(focusRef.current.value) * 60
    const newShortBreak = parseInt(shortBreakRef.current.value) * 60
    const newLongBreak = parseInt(longBreakRef.current.value) * 60
    const newSessionsBeforeLongBreak = parseInt(sessionsRef.current.value)

    setSettings({
      focusTime: newFocusTime,
      shortBreak: newShortBreak,
      longBreak: newLongBreak,
      sessionsBeforeLongBreak: newSessionsBeforeLongBreak
    })

    // reset timer based on current mode
    switch (mode) {
      case 'focus':
        setTimeLeft(newFocusTime)
        break
      case 'shortBreak':
        setTimeLeft(newShortBreak)
        break
      case 'longBreak':
        setTimeLeft(newLongBreak)
        break
    }

    // top the timer when settings are saved
    setIsRunning(false)
    setIsSettingsOpen(false)
  }

  // calculate progress percentage
  const calculateProgress = () => {
    let totalTime
    switch (mode) {
      case 'focus':
        totalTime = settings.focusTime
        break
      case 'shortBreak':
        totalTime = settings.shortBreak
        break
      case 'longBreak':
        totalTime = settings.longBreak
        break
      default:
        totalTime = settings.focusTime
    }
    return ((totalTime - timeLeft) / totalTime) * 360
  }

  // format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // capitalize first letter of mode
  const formatMode = (mode) => {
    return mode.charAt(0).toUpperCase() + mode.slice(1).replace(/([A-Z])/g, ' $1')
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-50 text-slate-900">
      <div className="w-full max-w-md px-4">
        {/* timer display */}
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
              className="text-slate-200"
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
              className="text-slate-800"
              transform="rotate(-90 50 50)"
            />
          </svg>
          {/* timer */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* session display */}
            <div className="text-center">
              <span className="text-xs uppercase text-slate-600">{formatMode(mode)}</span>
            </div>
            <div className=" text-5xl font-bold text-slate-900">{formatTime(timeLeft)}</div>
            <div className="text-center text-xs font-light mt-1 text-slate-600">
              {completedSessions} / {settings.sessionsBeforeLongBreak} Sessions
            </div>
          </div>
        </div>

        {/* control buttons */}
        <div className="flex justify-center space-x-4 mb-4">
          {!isRunning ? (
            <button onClick={startTimer} className="p-2 rounded-full bg-slate-800 text-white">
              <Play />
            </button>
          ) : (
            <button onClick={pauseTimer} className="p-2 rounded-full bg-slate-200 text-slate-800">
              <Pause />
            </button>
          )}
          <button onClick={resetTimer} className="p-2 rounded-full bg-slate-200 text-slate-800">
            <RefreshCw />
          </button>
        </div>

        {/* settings modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-white bg-opacity-20 flex items-center justify-center z-50">
            <div className="p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="m-auto text-slate-900">Settings</h2>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    ref: focusRef,
                    label: 'Focus Time (min)',
                    defaultValue: settings.focusTime / 60
                  },
                  {
                    ref: shortBreakRef,
                    label: 'Short Break (min)',
                    defaultValue: settings.shortBreak / 60
                  },
                  {
                    ref: longBreakRef,
                    label: 'Long Break (min)',
                    defaultValue: settings.longBreak / 60
                  },
                  {
                    ref: sessionsRef,
                    label: 'Long break after',
                    defaultValue: settings.sessionsBeforeLongBreak
                  }
                ].map(({ ref, label, defaultValue }) => (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <label className="text-slate-700 text-left">{label}</label>
                    <div className="flex items-center w-4/12">
                      <button
                        type="button"
                        className="p-2 rounded-l bg-slate-200 hover:bg-slate-300 transition-colors"
                        onClick={() => ref.current.stepDown()}
                      >
                        <ChevronLeft size={16} className="text-slate-800" />
                      </button>
                      <input
                        ref={ref}
                        type="number"
                        defaultValue={defaultValue}
                        className="w-full p-2 text-center border-slate-300 text-slate-900"
                      />
                      <button
                        type="button"
                        className="p-2 rounded-r bg-slate-200 hover:bg-slate-300 transition-colors"
                        onClick={() => ref.current.stepUp()}
                      >
                        <ChevronRight size={16} className="text-slate-800" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={handleSaveSettings}
                  className="w-full py-2 rounded bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* settings icon */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 rounded-full shadow-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            <Settings />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
