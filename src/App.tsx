import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useNotes } from './hooks/useNotes'
import { useTheme } from './hooks/useTheme'
import './App.css'

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })))
const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })))

function App() {
  const { notes, categories } = useNotes()
  const { theme, toggleTheme } = useTheme()

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="app-loading">Following the web…</div>}>
        <Routes>
          <Route path="/" element={<Home theme={theme} onToggleTheme={toggleTheme} notes={notes} />} />
          <Route path="/dashboard" element={<Dashboard notes={notes} categories={categories} theme={theme} onToggleTheme={toggleTheme} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
