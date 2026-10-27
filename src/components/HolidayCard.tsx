import { CalendarHeart, PartyPopper } from 'lucide-react'
import { philippineHolidays } from '../data/holidays'
import { getManilaTime } from '../lib/date'

export function HolidayCard() {
  const today = getManilaTime().dateKey
  const holiday = [...philippineHolidays].sort((a, b) => a.date.localeCompare(b.date)).find((item) => item.date >= today)
  return (
    <section className="holiday-card">
      <div className="widget-heading"><div className="widget-icon holiday-icon"><CalendarHeart size={17} /></div><div><p>UP NEXT</p><h2>Public holiday</h2></div><PartyPopper className="holiday-spark" size={17} /></div>
      {holiday ? <div className="holiday-content"><strong>{new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }).format(new Date(`${holiday.date}T12:00:00`))}</strong><span>{holiday.name}</span><small>{holiday.type === 'regular' ? 'REGULAR HOLIDAY' : 'SPECIAL NON-WORKING'}</small></div> : <div className="holiday-content"><strong>No upcoming holidays</strong><span>Add dates in src/data/holidays.ts</span></div>}
    </section>
  )
}
