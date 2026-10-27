import { useEffect, useState } from 'react'
import { Clock3 } from 'lucide-react'
import { philippineHolidays } from '../data/holidays'
import { scheduleSettings } from '../data/schedule'
import { getManilaTime } from '../lib/date'

function remainingTime(minutes: number): string {
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`
}

export function ShiftPreview() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])
  const local = getManilaTime(now)
  const currentMinute = local.hour * 60 + local.minute
  const start = scheduleSettings.startHour * 60 + scheduleSettings.startMinute
  const end = scheduleSettings.endHour * 60 + scheduleSettings.endMinute
  const isOff = !scheduleSettings.workdays.includes(local.weekday) || philippineHolidays.some((holiday) => holiday.date === local.dateKey)
  const status = isOff
    ? 'Day off – rest up!'
    : currentMinute < start
      ? `Shift starts in ${remainingTime(start - currentMinute)}`
      : currentMinute < end
        ? `On shift · ${remainingTime(end - currentMinute)} left`
        : 'Shift done for today'
  return <div className="home-preview-card preview-shift"><div className="preview-icon"><Clock3 size={17} /></div><div><small>TODAY’S SHIFT · {local.hour > 11 ? 'PHT' : 'MANILA'}</small><strong>{status}</strong><span>Monday – Friday · 8:00 AM – 5:30 PM</span></div></div>
}
