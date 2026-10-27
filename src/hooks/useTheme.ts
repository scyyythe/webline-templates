import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const THEME_KEY = 'webline-theme'

function getPreferredTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getPreferredTheme)
  const [hasUserChoice, setHasUserChoice] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY)
    return saved === 'light' || saved === 'dark'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    if (hasUserChoice) localStorage.setItem(THEME_KEY, theme)
    document.documentElement.style.colorScheme = theme
  }, [theme, hasUserChoice])
  const toggleTheme = () => {
    setHasUserChoice(true)
    setTheme((current) => current === 'dark' ? 'light' : 'dark')
  }
  return { theme, toggleTheme }
}
