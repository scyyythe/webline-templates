import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Pin } from 'lucide-react'
import { colorForCategory, type Note } from '../lib/notes'

interface NoteCardProps {
  note: Note
  index?: number
  onOpen: (note: Note) => void
}

export function NoteCard({ note, index = 0, onOpen }: NoteCardProps) {
  const color = colorForCategory(note.category)
  const reduceMotion = useReducedMotion()
  return (
    <motion.button
      type="button"
      className={`note-card note-${color}`}
      onClick={() => onOpen(note)}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : .32, delay: reduceMotion ? 0 : Math.min(index * .055, .38), ease: 'easeOut' }}
      whileHover={reduceMotion ? {} : { y: -4, rotate: index % 2 ? .4 : -.4 }}
      whileTap={reduceMotion ? {} : { scale: .985 }}
      aria-label={`Open note: ${note.title}`}
    >
      <span className="card-web-corner" aria-hidden="true"><svg viewBox="0 0 94 94"><path d="M94 0 0 94M94 0 24 94M94 0 57 94M94 0v94M94 0l32 94M94 0l68 94M94 0c-6 28-23 45-53 53M94 0C57 7 31 25 14 60M94 0C83 43 57 73 17 94"/></svg></span>
      <span className="note-card-top"><span className="category-badge">{note.categoryLabel}</span>{note.pinned && <Pin size={14} className="note-pin" fill="currentColor" aria-label="Pinned" />}</span>
      <span className="note-card-title">{note.title}</span>
      <span className="note-card-preview">{note.preview || 'Open this note to see its message.'}</span>
      <span className="note-card-tags">{note.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}</span>
      <span className="note-card-footer"><span>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${note.date}T12:00:00`))}</span><ArrowUpRight size={16} /></span>
    </motion.button>
  )
}
