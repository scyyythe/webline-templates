import { Link } from 'react-router-dom'
import { Home as HomeIcon, Search } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface TopBarProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  search?: string
  onSearchChange?: (value: string) => void
  isHome?: boolean
}

export function TopBar({ theme, onToggleTheme, search, onSearchChange, isHome = false }: TopBarProps) {
  return (
    <header className={`topbar-v2 ${isHome ? 'topbar-home' : ''}`}>
      <Link to="/" className="wordmark" aria-label="Webline home">WEBLINE<span>✳</span></Link>
      {!isHome && onSearchChange && (
        <label className="global-search">
          <Search size={16} />
          <input value={search ?? ''} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search notes, tags..." aria-label="Search notes" />
          <kbd>/</kbd>
        </label>
      )}
      <div className="topbar-links">
        {!isHome && <Link className="home-link" to="/"><HomeIcon size={15} /> <span>Home</span></Link>}
        {isHome && <Link className="home-link" to="/dashboard">Dashboard <span aria-hidden="true">↗</span></Link>}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}
