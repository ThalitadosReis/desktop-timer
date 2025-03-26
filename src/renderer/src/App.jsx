import { useState, useEffect, useRef } from 'react'
import { Play, Settings, RefreshCw, Pause } from 'lucide-react'

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
  const [isEditing, setIsEditing] = useState(false)

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

    // reseting timer to new focus time if in focus mode
    if (mode === 'focus') {
      setTimeLeft(newFocusTime)
    }

    setIsEditing(false)
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md">
        {/* session selector */}
        <div className="flex justify-center mb-4 space-x-2 text-white">
          <button
            className={`px-4 py-2 rounded ${mode === 'focus' ? 'bg-blue-500' : 'bg-gray-500'}`}
            onClick={() => {
              setMode('focus')
              setTimeLeft(settings.focusTime)
              setIsRunning(false)
            }}
          >
            Focus
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === 'shortBreak' ? 'bg-green-500' : 'bg-gray-500'}`}
            onClick={() => {
              setMode('shortBreak')
              setTimeLeft(settings.shortBreak)
              setIsRunning(false)
            }}
          >
            Short Break
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === 'longBreak' ? 'bg-purple-500' : 'bg-gray-500'}`}
            onClick={() => {
              setMode('longBreak')
              setTimeLeft(settings.longBreak)
              setIsRunning(false)
            }}
          >
            Long Break
          </button>
        </div>

        {/* timer display */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          {/* background ring */}
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="6" />
          </svg>

          {/* progress ring */}
          <svg
            className="absolute top-0 left-0 w-full h-full rotate-[-90deg]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={mode === 'focus' ? '#3b82f6' : mode === 'shortBreak' ? '#10b981' : '#8b5cf6'}
              strokeWidth="6"
              strokeDasharray="283"
              strokeDashoffset={283 - (calculateProgress() * 283) / 360}
            />
          </svg>

          {/* timer */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-bold">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* control buttons */}
        <div className="flex justify-center space-x-4 mb-4">
          {!isRunning ? (
            <button onClick={startTimer} className="bg-blue-500 text-white p-2 rounded-full">
              <Play />
            </button>
          ) : (
            <button onClick={pauseTimer} className="bg-yellow-500 text-white p-2 rounded-full">
              <Pause />
            </button>
          )}
          <button onClick={resetTimer} className="bg-gray-500 text-white p-2 rounded-full">
            <RefreshCw />
          </button>
        </div>

        {/* sessions counter */}
        <div className="text-center mb-4">Sessions Completed: {completedSessions}</div>

        {/* settings */}
        {isEditing ? (
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block">Focus Time (min)</label>
                <input
                  ref={focusRef}
                  type="number"
                  defaultValue={settings.focusTime / 60}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">Short Break (min)</label>
                <input
                  ref={shortBreakRef}
                  type="number"
                  defaultValue={settings.shortBreak / 60}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">Long Break (min)</label>
                <input
                  ref={longBreakRef}
                  type="number"
                  defaultValue={settings.longBreak / 60}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">Long break after</label>
                <input
                  ref={sessionsRef}
                  type="number"
                  defaultValue={settings.sessionsBeforeLongBreak}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSaveSettings}
                className="bg-gray-500 text-white py-2 px-4 rounded-full flex items-center"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              <Settings className="inline-block mr-2" />
              Settings
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
