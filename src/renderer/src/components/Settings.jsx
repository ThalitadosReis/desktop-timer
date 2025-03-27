import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Settings({
  isDarkMode,
  isOpen,
  settings,
  refs,
  closeSettings,
  saveSettings
}) {
  const settingsInputs = [
    {
      ref: refs.focusRef,
      label: 'Focus Time (min)',
      defaultValue: settings.focusTime / 60
    },
    {
      ref: refs.shortBreakRef,
      label: 'Short Break (min)',
      defaultValue: settings.shortBreak / 60
    },
    {
      ref: refs.longBreakRef,
      label: 'Long Break (min)',
      defaultValue: settings.longBreak / 60
    },
    {
      ref: refs.sessionsRef,
      label: 'Long break after',
      defaultValue: settings.sessionsBeforeLongBreak
    }
  ]

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 
      ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-900'}`}
    >
      <div className="p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="m-auto text-xl font-semibold">Settings</h2>
          <button
            onClick={closeSettings}
            className={`${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          {settingsInputs.map(({ ref, label, defaultValue }) => (
            <div key={label} className="flex justify-between items-center text-sm">
              <label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {label}
              </label>
              <div className="flex items-center w-4/12">
                <button
                  type="button"
                  className={`p-2 rounded-l ${
                    isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-800'
                  }`}
                  onClick={() => ref.current.stepDown()}
                >
                  <ChevronLeft size={16} />
                </button>
                <input
                  ref={ref}
                  type="number"
                  defaultValue={defaultValue}
                  className={`w-full p-2 text-center ${
                    isDarkMode ? 'text-slate-200' : 'border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  className={`p-2 rounded-r ${
                    isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-800'
                  }`}
                  onClick={() => ref.current.stepUp()}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            onClick={saveSettings}
            className={`w-full py-2 rounded ${
              isDarkMode ? 'bg-slate-300 text-slate-800' : 'bg-slate-800 text-white'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
