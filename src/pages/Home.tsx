import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, CalendarDays, Heart } from 'lucide-react'
import { Hero } from '../components/Hero'
import { ShiftPreview } from '../components/ShiftPreview'
import { TopBar } from '../components/TopBar'
import { philippineHolidays } from '../data/holidays'
import { daysBetween, getManilaTime, nextMonthsaryDate } from '../lib/date'
import type { Note } from '../lib/notes'

interface HomeProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  notes: Note[]
}

export function Home({ theme, onToggleTheme, notes }: HomeProps) {
  const reduceMotion = useReducedMotion()
  const today = getManilaTime().dateKey
  const latestNote = [...notes].sort((a, b) => b.date.localeCompare(a.date))[0]
  return (
    <main className="home-page">
      <TopBar theme={theme} onToggleTheme={onToggleTheme} isHome />
      <Hero />
      <section className="home-preview-section">
        <div className="home-section-heading"><p className="section-eyebrow">YOUR DAY, AT A GLANCE</p><h2>A little web of <span>good things.</span></h2><p>All the little things you need, ready when you are.</p></div>
        <div className="home-preview-grid">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .38 }}>
            <ShiftPreview />
          </motion.div>
          <motion.div className="home-preview-card preview-holiday" initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .38, delay: .08 }}>
            <div className="preview-icon"><CalendarDays size={17} /></div><div><small>NEXT HOLIDAY</small><strong><HolidayPreview /></strong><span>Keep the important dates close</span></div>
          </motion.div>
          <motion.div className="home-preview-card preview-monthsary" initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .38, delay: .16 }}>
            <div className="preview-icon"><Heart size={17} /></div><div><small>OUR LITTLE MILESTONE</small><strong><MonthsaryPreview today={today} /></strong><span>Every 27th, a reason to celebrate</span></div>
          </motion.div>
        </div>
        <div className="home-latest-note"><span className="latest-web-icon">✳</span><p><small>FRESH FROM YOUR NOTES</small><strong>{latestNote?.title ?? 'Your notes will show up here'}</strong></p><span>{latestNote?.categoryLabel ?? 'ADD YOUR FIRST NOTE'}</span></div>
        <Link className="comic-button home-bottom-cta" to="/dashboard"><span>Enter Dashboard</span><ArrowRight size={18} /></Link>
        <p className="home-footnote">MADE WITH A LITTLE LOVE AND A LOT OF HEART <span>✦</span></p>
      </section>
    </main>
  )
}

function HolidayPreview() {
  const today = getManilaTime().dateKey
  const upcoming = [...philippineHolidays].sort((a, b) => a.date.localeCompare(b.date)).find((holiday) => holiday.date >= today)
  return upcoming ? `${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${upcoming.date}T12:00:00`))} · ${upcoming.name}` : 'No upcoming holiday'
}

function MonthsaryPreview({ today }: { today: string }) {
  const day = Number(today.slice(-2))
  const remaining = daysBetween(today, nextMonthsaryDate(today))
  return day === 27 ? 'Happy Monthsary! 💕' : `${remaining} days to go 💕`
}
