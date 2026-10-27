import { Heart } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { scheduleSettings } from '../data/schedule'
import { daysBetween, getManilaTime, nextMonthsaryDate } from '../lib/date'

export function MonthsaryCard() {
  const today = getManilaTime().dateKey
  const days = daysBetween(today, nextMonthsaryDate(today))
  const isToday = Number(today.slice(-2)) === scheduleSettings.monthsaryDay
  const reduceMotion = useReducedMotion()
  return (
    <section className={`monthsary-card ${isToday ? 'monthsary-today' : ''}`}>
      <div className="monthsary-web" aria-hidden="true">⌁</div>
      <div className="monthsary-heart"><motion.span animate={isToday && !reduceMotion ? { scale: [1, 1.17, 1], rotate: [0, -6, 6, 0] } : {}} transition={{ duration: 1.8, repeat: Infinity }}><Heart size={20} fill="currentColor" /></motion.span></div>
      <div className="monthsary-content"><p>OUR LITTLE MILESTONE</p><h2>{isToday ? 'Happy Monthsary!' : `${days} ${days === 1 ? 'day' : 'days'} until our monthsary`}</h2><span>{isToday ? scheduleSettings.monthsaryMessage : `The 27th of every month · Next up on the ${nextMonthsaryDate(today).slice(8)}th`}</span></div>
      {isToday && <div className="heart-sparkles" aria-hidden="true">✦　♥　✧</div>}
    </section>
  )
}
