import { Bookmark, FolderOpen, StickyNote, Tags } from 'lucide-react'
import { getNoteCategories, labelFromFolder, type Note } from '../lib/notes'

interface NoteAnalyticsProps {
  notes: Note[]
}

export function NoteAnalytics({ notes }: NoteAnalyticsProps) {
  const categories = getNoteCategories(notes).map((category) => ({
    name: labelFromFolder(category),
    count: notes.filter((note) => note.category === category).length,
  }))
  const tags = new Set(notes.flatMap((note) => note.tags)).size
  const maxCount = Math.max(1, ...categories.map(({ count }) => count))
  const stats = [
    { label: 'NOTES', value: notes.length, icon: StickyNote, color: 'blue' },
    { label: 'PINNED', value: notes.filter((note) => note.pinned).length, icon: Bookmark, color: 'amber' },
    { label: 'CATEGORIES', value: categories.length, icon: FolderOpen, color: 'teal' },
    { label: 'TAGS', value: tags, icon: Tags, color: 'red' },
  ]

  return (
    <div className="note-analytics">
      <div className="analytics-stat-grid" aria-label="Note statistics">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div className={`analytics-stat analytics-${color}`} key={label}>
            <span className="analytics-stat-icon"><Icon size={15} /></span>
            <span className="analytics-stat-copy"><small>{label}</small><strong>{value}</strong></span>
          </div>
        ))}
      </div>
      <section className="analytics-breakdown" aria-label="Notes by category">
        <div className="analytics-breakdown-heading">
          <div><p className="section-eyebrow">LIBRARY SNAPSHOT</p><h2>Notes by category</h2></div>
          <span>{notes.length} total</span>
        </div>
        {categories.length ? (
          <div className="analytics-category-list">
            {categories.map(({ name, count }) => (
              <div className="analytics-category" key={name}>
                <div><span>{name}</span><strong>{count}</strong></div>
                <div className="analytics-bar" role="img" aria-label={`${name}: ${count} notes`}>
                  <span style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : <p className="analytics-empty">Your note stats will show here.</p>}
      </section>
    </div>
  )
}
