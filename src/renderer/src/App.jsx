import React, { useState, useRef } from 'react'
import ThemeToggle from './components/ThemeToggle'
import TimerDisplay from './components/TimerDisplay'
import ControlButtons from './components/ControlButtons'
import Settings from './components/Settings'
import { useTimer } from './hooks/useTimer'

function App() {
  // default initial settings
  const initialSettings = {
    focusTime: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    sessionsBeforeLongBreak: 4
  }

  // theme state
  const [isDarkMode, setIsDarkMode] = useState(false)

  // timer hook
  const {
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
  } = useTimer(initialSettings)

  // settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // refs for settings inputs
  const refs = {
    focusRef: useRef(null),
    shortBreakRef: useRef(null),
    longBreakRef: useRef(null),
    sessionsRef: useRef(null)
  }

  // theme toggle effect
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  // save settings handler
  const handleSaveSettings = () => {
    const newSettings = {
      focusTime: parseInt(refs.focusRef.current.value) * 60,
      shortBreak: parseInt(refs.shortBreakRef.current.value) * 60,
      longBreak: parseInt(refs.longBreakRef.current.value) * 60,
      sessionsBeforeLongBreak: parseInt(refs.sessionsRef.current.value)
    }

    updateSettings(newSettings)
    setIsSettingsOpen(false)
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative 
      ${isDarkMode ? 'bg-slate-900 text-slate-50' : 'bg-slate-50 text-slate-900'}`}
    >
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
      </div>

      <div className="w-full max-w-md px-4">
        <TimerDisplay
          mode={mode}
          timeLeft={timeLeft}
          isDarkMode={isDarkMode}
          calculateProgress={calculateProgress}
          completedSessions={completedSessions}
          sessionsBeforeLongBreak={settings.sessionsBeforeLongBreak}
        />

        <ControlButtons
          isDarkMode={isDarkMode}
          isRunning={isRunning}
          resetTimer={resetTimer}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
          openSettings={() => setIsSettingsOpen(true)}
        />

        <Settings
          isDarkMode={isDarkMode}
          isOpen={isSettingsOpen}
          settings={settings}
          refs={refs}
          closeSettings={() => setIsSettingsOpen(false)}
          saveSettings={handleSaveSettings}
        />
      </div>
    </div>
  )
}

export default App
