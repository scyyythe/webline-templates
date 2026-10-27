import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ChevronDown, FilePlus2, ListFilter, Search } from 'lucide-react'
import { Toaster } from 'sonner'
import { CalendarView } from '../components/CalendarView'
import { HolidayCard } from '../components/HolidayCard'
import { MonthsaryCard } from '../components/MonthsaryCard'
import { NoteCard } from '../components/NoteCard'
import { NoteViewer } from '../components/NoteViewer'
import { ScheduleWidget } from '../components/ScheduleWidget'
import { Sidebar, type DashboardTab, type NoteFilter } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { labelFromFolder, type Note } from '../lib/notes'

interface DashboardProps {
  notes: Note[]
  categories: string[]
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function Dashboard({ notes, categories, theme, onToggleTheme }: DashboardProps) {
  const [filter, setFilter] = useState<NoteFilter>('all')
  const [tab, setTab] = useState<DashboardTab>('Overview')
  const [search, setSearch] = useState('')
  const [tag, setTag] = useState('')
  const [sort, setSort] = useState<'newest' | 'az'>('newest')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const allTags = useMemo(() => [...new Set(notes.flatMap((note) => note.tags))].sort(), [notes])
  const counts = useMemo<Record<string, number>>(() => {
    const categoryCounts = Object.fromEntries(categories.map((category) => [category, notes.filter((note) => note.category === category).length]))
    return { ...categoryCounts, all: notes.length, pinned: notes.filter((note) => note.pinned).length }
  }, [categories, notes])
  const filteredNotes = useMemo(() => notes
    .filter((note) => filter === 'all' || (filter === 'pinned' ? note.pinned : note.category === filter))
    .filter((note) => !tag || note.tags.includes(tag))
    .filter((note) => {
      const term = search.trim().toLowerCase()
      return !term || [note.title, note.categoryLabel, note.body, ...note.tags].some((value) => value.toLowerCase().includes(term))
    })
    .sort((a, b) => sort === 'az' ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date) || a.title.localeCompare(b.title)), [notes, filter, tag, search, sort])

  useEffect(() => {
    const handleSlash = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (event.key === '/' && target?.tagName !== 'INPUT' && target?.tagName !== 'TEXTAREA' && !target?.isContentEditable) {
        event.preventDefault()
        document.querySelector<HTMLInputElement>('.global-search input')?.focus()
        setTab('Notes')
      }
    }
    window.addEventListener('keydown', handleSlash)
    return () => window.removeEventListener('keydown', handleSlash)
  }, [])

  const [now] = useState(() => new Date())
  const hour = Number(new Intl.DateTimeFormat('en', { timeZone: 'Asia/Manila', hour: 'numeric', hourCycle: 'h23' }).format(now))
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const todayLabel = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Manila', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(now)
  const latestNotes = [...notes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
  const activeCategory = categories.includes(filter) ? filter : null

  return (
    <div className={`dashboard-layout ${collapsed ? 'dashboard-sidebar-collapsed' : ''}`}>
      <Sidebar categories={categories} counts={counts} filter={filter} onFilter={setFilter} tab={tab} onTab={setTab} collapsed={collapsed} onCollapsed={setCollapsed} />
      <main className="dashboard-main">
        <TopBar theme={theme} onToggleTheme={onToggleTheme} search={search} onSearchChange={setSearch} />
        <div className="dashboard-content">
          <div className="dashboard-greeting"><div><p className="section-eyebrow">{greeting.toUpperCase()}, JERA</p><h1>Hello, Jera! <span>✦</span></h1><p>{todayLabel} <i>·</i> Your notes are right where you need them.</p></div><div className="greeting-decoration" aria-hidden="true">✳</div></div>
          <div className="dashboard-tabs" role="tablist" aria-label="Dashboard sections">
            {(['Overview', 'Notes', 'Calendar'] as const).map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'dashboard-tab tab-selected' : 'dashboard-tab'} onClick={() => setTab(item)}>{item === 'Calendar' && <CalendarDays size={15} />}{item}{item === 'Notes' && <span>{notes.length}</span>}</button>)}
          </div>

          {tab === 'Overview' && <section className="overview-view">
            <div className="overview-widgets"><ScheduleWidget /><div className="overview-side-widgets"><MonthsaryCard /><HolidayCard /></div></div>
            <div className="overview-notes-heading"><div><p className="section-eyebrow">YOUR GO-TO WORDS</p><h2>Recently updated <span>({latestNotes.length})</span></h2></div><button type="button" className="text-link" onClick={() => { setTab('Notes'); setFilter('all') }}>All notes <span>→</span></button></div>
            <div className="notes-grid overview-notes">{latestNotes.map((note, index) => <NoteCard key={note.id} note={note} index={index} onOpen={setSelectedNote} />)}</div>
          </section>}

          {tab === 'Notes' && <section className="notes-view">
            <div className="notes-heading"><div><p className="section-eyebrow">YOUR MESSAGE LIBRARY</p><h2>{filter === 'all' ? 'All notes' : filter === 'pinned' ? 'Pinned notes' : labelFromFolder(filter)} <span>{filteredNotes.length}</span></h2><p>Keep your favorite words close, and make every reply feel like you.</p></div><div className="notes-heading-art">⌁</div></div>
            <div className="notes-filterbar">
              <label className="notes-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, message or tag..." aria-label="Search notes" /></label>
              <label className="filter-select"><ListFilter size={14} /><select aria-label="Filter by tag" value={tag} onChange={(event) => setTag(event.target.value)}><option value="">All tags</option>{allTags.map((item) => <option value={item} key={item}>{item}</option>)}</select><ChevronDown size={13} /></label>
              <label className="filter-select sort-select"><select aria-label="Sort notes" value={sort} onChange={(event) => setSort(event.target.value as 'newest' | 'az')}><option value="newest">Newest</option><option value="az">A–Z</option></select><ChevronDown size={13} /></label>
            </div>
            <div className="category-chips" aria-label="Filter by category">
              <button type="button" onClick={() => setFilter('all')} className={filter === 'all' ? 'chip-active' : ''}>All notes</button>
              {categories.map((category) => <button type="button" key={category} onClick={() => setFilter(category)} className={`${filter === category ? 'chip-active' : ''} chip-${category}`}>{labelFromFolder(category)} <span>{counts[category] ?? 0}</span></button>)}
              <button type="button" onClick={() => setFilter('pinned')} className={filter === 'pinned' ? 'chip-active' : ''}>Pinned <span>{counts.pinned ?? 0}</span></button>
            </div>
            {filteredNotes.length ? <div className="notes-grid">{filteredNotes.map((note, index) => <NoteCard key={note.id} note={note} index={index} onOpen={setSelectedNote} />)}</div> : <div className="notes-empty"><span><FilePlus2 size={22} /></span><h3>No notes here just yet</h3><p>{activeCategory ? <>Drop a <code>.md</code> or <code>.txt</code> file into <code>notes/{activeCategory}/</code> to add your first note here. See <code>notes/README.md</code> for the quick guide.</> : 'Try a different search or category filter to find your note.'}</p></div>}
          </section>}

          {tab === 'Calendar' && <section className="calendar-view"><div className="calendar-intro"><p className="section-eyebrow">DATES TO KEEP CLOSE</p><h2>Your calendar</h2><p>Workdays, holidays, and one little date to look forward to.</p></div><CalendarView /></section>}
          <footer className="dashboard-footer"><span>MADE WITH A LITTLE LOVE AND A LOT OF HEART <b>✦</b></span><span>WEBLINE · JERA’S PERSONAL HUB</span></footer>
        </div>
      </main>
      <NoteViewer key={selectedNote?.id ?? 'closed'} note={selectedNote} onClose={() => setSelectedNote(null)} />
      <Toaster theme={theme} position="bottom-right" />
    </div>
  )
}
