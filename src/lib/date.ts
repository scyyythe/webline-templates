import { scheduleSettings } from '../data/schedule'

export interface ManilaTime {
  dateKey: string
  hour: number
  minute: number
  weekday: number
}

export function getManilaTime(now = new Date()): ManilaTime {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: scheduleSettings.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  }).formatToParts(now)
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '0'
  const weekdayIndex: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return {
    dateKey: `${value('year')}-${value('month')}-${value('day')}`,
    hour: Number(value('hour')),
    minute: Number(value('minute')),
    weekday: weekdayIndex[value('weekday')] ?? 0,
  }
}

export function dateKeyFromDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function dateFromKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function daysBetween(from: string, to: string): number {
  const start = Date.UTC(...from.split('-').map(Number).map((part, index) => index === 1 ? part - 1 : part) as [number, number, number])
  const end = Date.UTC(...to.split('-').map(Number).map((part, index) => index === 1 ? part - 1 : part) as [number, number, number])
  return Math.round((end - start) / 86_400_000)
}

export function nextMonthsaryDate(today: string, day = scheduleSettings.monthsaryDay): string {
  const [year, month] = today.split('-').map(Number)
  const currentDate = dateFromKey(today)
  if (currentDate.getDate() <= day) return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const nextMonthDate = new Date(year, month, 1)
  const nextYear = nextMonthDate.getFullYear()
  const nextMonth = nextMonthDate.getMonth() + 1
  const lastDay = new Date(nextYear, nextMonth, 0).getDate()
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(Math.min(day, lastDay)).padStart(2, '0')}`
}
