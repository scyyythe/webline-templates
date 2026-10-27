import { useEffect, useState } from 'react'
import { AlarmClock, CheckCircle2 } from 'lucide-react'
import { philippineHolidays } from '../data/holidays'
import { scheduleSettings } from '../data/schedule'
import { getManilaTime } from '../lib/date'

function formatTime(hour: number, minute: number): string {
  const date = new Date(Date.UTC(2020, 0, 1, hour, minute))
  return new Intl.DateTimeFormat('en', { timeZone: 'UTC', hour: 'numeric', minute: '2-digit', hour12: true }).format(date)
}

function countdown(minutes: number): string {
  const hours = Math.floor(Math.max(0, minutes) / 60)
  const mins = Math.max(0, minutes) % 60
  return `${hours}h ${String(mins).padStart(2, '0')}m`
}

export function ScheduleWidget() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const local = getManilaTime(now)
  const currentMinute = local.hour * 60 + local.minute
  const start = scheduleSettings.startHour * 60 + scheduleSettings.startMinute
  const end = scheduleSettings.endHour * 60 + scheduleSettings.endMinute
  const holiday = philippineHolidays.find((item) => item.date === local.dateKey)
  const isWorkday = scheduleSettings.workdays.includes(local.weekday) && !holiday
  const onShift = isWorkday && currentMinute >= start && currentMinute < end
  const progress = onShift ? Math.min(100, Math.max(0, (currentMinute - start) / (end - start) * 100)) : currentMinute >= end && isWorkday ? 100 : 0
  const status = !isWorkday
    ? 'Day off – rest up!'
    : currentMinute < start
      ? `Shift starts in ${countdown(start - currentMinute)}`
      : currentMinute < end
        ? `On shift · ${countdown(end - currentMinute)} left`
        : 'Shift done for today'
  const today = new Date(`${local.dateKey}T12:00:00`)
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

  return (
    <section className="schedule-card">
      <div className="widget-heading"><div className="widget-icon schedule-icon"><AlarmClock size={17} /></div><div><p>THE DAILY SWING</p><h2>Work schedule</h2></div><span className="timezone-badge">MANILA · PHT</span></div>
      <div className="schedule-hours"><strong>{formatTime(scheduleSettings.startHour, scheduleSettings.startMinute)} <i>—</i> {formatTime(scheduleSettings.endHour, scheduleSettings.endMinute)}</strong><span>MONDAY TO FRIDAY</span></div>
      <div className={`schedule-status ${onShift ? 'status-on' : ''}`}><span className="live-dot" />{status}</div>
      <div className="shift-progress"><div style={{ width: `${progress}%` }} /></div>
      <div className="shift-progress-labels"><span>{formatTime(scheduleSettings.startHour, scheduleSettings.startMinute)}</span><span>{formatTime(scheduleSettings.endHour, scheduleSettings.endMinute)}</span></div>
      <div className="week-pills">{dayLabels.map((label, index) => {
        const date = new Date(monday)
        date.setDate(monday.getDate() + index)
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        const isToday = dateKey === local.dateKey
        const isHoliday = philippineHolidays.some((item) => item.date === dateKey)
        return <span key={label} className={`${isToday ? 'today-pill' : ''} ${isHoliday ? 'holiday-pill' : ''}`} title={isHoliday ? 'Public holiday' : undefined}><small>{label}</small><b>{date.getDate()}</b>{isHoliday && <CheckCircle2 size={9} />}</span>
      })}</div>
      {holiday && <p className="schedule-holiday-note">{holiday.name} · public holiday</p>}
    </section>
  )
}
