import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle({ isDarkMode, toggleTheme }) {
  return (
    <div className="flex items-center">
      <div
        className={`w-16 h-8 p-2 rounded-full relative transition-colors duration-300 
        ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}
        onClick={toggleTheme}
      >
        <div
          className={`absolute top-1 w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center
          ${isDarkMode ? 'translate-x-[100%] bg-slate-800' : 'translate-x-[0%] bg-white'}
          transform`}
        >
          {isDarkMode ? (
            <Moon size={16} className="text-slate-100" />
          ) : (
            <Sun size={16} className="text-slate-800" />
          )}
        </div>
      </div>
    </div>
  )
}
