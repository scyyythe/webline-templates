import { Hero } from '../components/Hero'
import { TopBar } from '../components/TopBar'
import type { Note } from '../lib/notes'

interface HomeProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  notes: Note[]
}

export function Home({ theme, onToggleTheme, notes }: HomeProps) {
  return (
    <main className="home-page">
      <TopBar theme={theme} onToggleTheme={onToggleTheme} isHome />
      <Hero notes={notes} />
    </main>
  )
}
