import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { philippineHolidays } from '../data/holidays'
import { scheduleSettings } from '../data/schedule'
import { dateFromKey, dateKeyFromDate, getManilaTime } from '../lib/date'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarView() {
  const todayKey = getManilaTime().dateKey
  const [month, setMonth] = useState(() => {
    const current = dateFromKey(todayKey)
    return new Date(current.getFullYear(), current.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(todayKey)
  const holidaysByDate = useMemo(() => new Map(philippineHolidays.map((holiday) => [holiday.date, holiday])), [])
  const firstWeekday = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const days = Array.from({ length: Math.ceil((firstWeekday + daysInMonth) / 7) * 7 }, (_, index) => {
    const day = index - firstWeekday + 1
    return day > 0 && day <= daysInMonth ? dateKeyFromDate(new Date(month.getFullYear(), month.getMonth(), day)) : null
  })
  const selectedHoliday = holidaysByDate.get(selectedDate)
  const selectedDateObject = dateFromKey(selectedDate)
  const selectedIsMonthsary = selectedDateObject.getDate() === scheduleSettings.monthsaryDay
  const selectedIsWorkingDay = scheduleSettings.workdays.includes(selectedDateObject.getDay()) && !selectedHoliday

  const navigate = (amount: number) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))

  return (
    <section className="calendar-panel">
      <div className="calendar-heading"><div><p className="section-eyebrow">PLAN YOUR MONTH</p><h2>{new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(month)}</h2></div><div className="calendar-controls"><button type="button" className="today-button" onClick={() => { const current = dateFromKey(todayKey); setMonth(new Date(current.getFullYear(), current.getMonth(), 1)); setSelectedDate(todayKey) }}>Today</button><button type="button" aria-label="Previous month" onClick={() => navigate(-1)}><ChevronLeft size={17} /></button><button type="button" aria-label="Next month" onClick={() => navigate(1)}><ChevronRight size={17} /></button></div></div>
      <div className="calendar-weekdays">{weekDays.map((day) => <span key={day}>{day}</span>)}</div>
      <div className="calendar-days">{days.map((date, index) => {
        if (!date) return <span key={`empty-${index}`} className="calendar-empty" />
        const dateObject = dateFromKey(date)
        const holiday = holidaysByDate.get(date)
        const isWeekend = !scheduleSettings.workdays.includes(dateObject.getDay())
        const isMonthsary = dateObject.getDate() === scheduleSettings.monthsaryDay
        return (
          <button type="button" key={date} className={`calendar-day ${isWeekend ? 'day-off' : 'working-day'} ${holiday ? 'holiday-day' : ''} ${isMonthsary ? 'monthsary-day' : ''} ${date === todayKey ? 'calendar-today' : ''} ${date === selectedDate ? 'calendar-selected' : ''}`} onClick={() => setSelectedDate(date)} aria-label={`${date}${holiday ? `, ${holiday.name}` : ''}${isMonthsary ? ', monthsary' : ''}`}>
            <span>{Number(date.slice(-2))}</span>{holiday && <i title={holiday.name} />}{isMonthsary && <Heart size={11} fill="currentColor" />}
          </button>
        )
      })}</div>
      <div className="calendar-legend"><span><i className="legend-work" />Working day</span><span><i className="legend-off" />Day off</span><span><i className="legend-holiday" />Holiday</span><span><Heart size={11} fill="currentColor" /> Monthsary</span></div>
      <div className="calendar-day-detail"><div><small>{new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(selectedDateObject)}</small><strong>{selectedHoliday ? selectedHoliday.name : selectedIsMonthsary ? 'Our monthsary 💕' : selectedIsWorkingDay ? 'Working day' : 'Day off – rest up!'}</strong></div>{selectedHoliday && <span>{selectedHoliday.type === 'regular' ? 'REGULAR HOLIDAY' : 'SPECIAL NON-WORKING'}</span>}</div>
    </section>
  )
}
