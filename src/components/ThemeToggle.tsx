import { Moon, Sun } from 'lucide-react'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  return (
    <button className="theme-toggle" type="button" onClick={onToggle} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`} title={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}
