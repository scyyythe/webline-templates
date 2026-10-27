import { useState } from 'react'
import { CalendarDays, ChevronLeft, Layers3, Menu, X } from 'lucide-react'
import { colorForCategory, labelFromFolder } from '../lib/notes'

export type DashboardTab = 'Overview' | 'Notes' | 'Calendar'
export type NoteFilter = 'all' | 'pinned' | string

interface SidebarProps {
  categories: string[]
  counts: Record<string, number>
  filter: NoteFilter
  onFilter: (filter: NoteFilter) => void
  tab: DashboardTab
  onTab: (tab: DashboardTab) => void
  collapsed: boolean
  onCollapsed: (collapsed: boolean) => void
}

export function Sidebar({ categories, counts, filter, onFilter, tab, onTab, collapsed, onCollapsed }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const chooseFilter = (value: NoteFilter) => {
    onFilter(value)
    onTab('Notes')
    setMobileOpen(false)
  }
  const sidebarContent = (
    <>
      <div className="sidebar-heading"><div className="sidebar-logo">W</div><div><strong>Jera’s library</strong><small>PERSONAL WORKSPACE</small></div><button className="sidebar-close" type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}><X size={17} /></button></div>
      <p className="side-label">YOUR LIBRARY</p>
      <nav className="side-nav" aria-label="Notes filters">
        <button type="button" className={`side-nav-link ${filter === 'all' && tab === 'Notes' ? 'side-active' : ''}`} onClick={() => chooseFilter('all')} title="All notes"><Layers3 size={17} /><span>All notes</span><b>{counts.all ?? 0}</b></button>
        <button type="button" className={`side-nav-link ${filter === 'pinned' && tab === 'Notes' ? 'side-active' : ''}`} onClick={() => chooseFilter('pinned')} title="Pinned"><span className="side-star">✦</span><span>Pinned</span><b>{counts.pinned ?? 0}</b></button>
      </nav>
      <div className="side-category-header"><p className="side-label">CATEGORIES</p><span>{String(categories.length).padStart(2, '0')}</span></div>
      <nav className="side-nav side-categories" aria-label="Note categories">
        {categories.map((category) => (
          <button type="button" key={category} className={`side-nav-link ${filter === category && tab === 'Notes' ? 'side-active' : ''}`} onClick={() => chooseFilter(category)} title={labelFromFolder(category)}>
            <span className={`category-dot category-${colorForCategory(category)}`} />
            <span>{labelFromFolder(category)}</span><b>{counts[category] ?? 0}</b>
          </button>
        ))}
      </nav>
      <div className="sidebar-fill" />
      <div className="sidebar-bottom">
        <button type="button" className={`side-nav-link calendar-side-link ${tab === 'Calendar' ? 'side-active' : ''}`} onClick={() => { onTab('Calendar'); setMobileOpen(false) }}><CalendarDays size={17} /><span>Calendar</span><span className="new-indicator" /></button>
        <div className="sidebar-tip"><span>✦</span><p><strong>A little shortcut</strong><small>Press <kbd>/</kbd> to find a note.</small></p></div>
        <button type="button" className="collapse-side" onClick={() => onCollapsed(!collapsed)}><ChevronLeft size={15} /> Collapse sidebar</button>
      </div>
    </>
  )

  return (
    <>
      <button className="mobile-sidebar-button" type="button" onClick={() => setMobileOpen(true)} aria-label="Open categories"><Menu size={19} /></button>
      {mobileOpen && <button className="sidebar-shade" type="button" onClick={() => setMobileOpen(false)} aria-label="Close categories" />}
      <aside className={`sidebar-v2 ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        {collapsed && !mobileOpen
          ? <button className="expand-side" aria-label="Expand sidebar" type="button" onClick={() => onCollapsed(false)}><Menu size={18} /></button>
          : sidebarContent}
      </aside>
    </>
  )
}
