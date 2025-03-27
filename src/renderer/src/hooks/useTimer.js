import { useState, useEffect } from 'react'

export const useTimer = (initialSettings) => {
  const [settings, setSettings] = useState({
    focusTime: initialSettings.focusTime,
    shortBreak: initialSettings.shortBreak,
    longBreak: initialSettings.longBreak,
    sessionsBeforeLongBreak: initialSettings.sessionsBeforeLongBreak,
    soundEnabled: true
  })

  const [timeLeft, setTimeLeft] = useState(settings.focusTime)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('focus')
  const [completedSessions, setCompletedSessions] = useState(0)

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

        // reset completed sessions after long break
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

  const startTimer = () => setIsRunning(true)
  const pauseTimer = () => setIsRunning(false)

  const resetTimer = () => {
    setIsRunning(false)
    switch (mode) {
      case 'focus':
        setTimeLeft(settings.focusTime)
        break
      case 'shortBreak':
        setTimeLeft(settings.shortBreak)
        break
      case 'longBreak':
        setTimeLeft(settings.longBreak)
        break
    }
  }

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

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings
    }))

    // update time left based on current mode
    switch (mode) {
      case 'focus':
        setTimeLeft(newSettings.focusTime)
        break
      case 'shortBreak':
        setTimeLeft(newSettings.shortBreak)
        break
      case 'longBreak':
        setTimeLeft(newSettings.longBreak)
        break
    }
  }

  return {
    timeLeft,
    isRunning,
    mode,
    completedSessions,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    calculateProgress,
    updateSettings
  }
}
