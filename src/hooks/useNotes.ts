import { useMemo, useState } from 'react'
import { getNoteCategories, loadNotes } from '../lib/notes'

export function useNotes() {
  const [notes] = useState(loadNotes)
  const categories = useMemo(() => getNoteCategories(notes), [notes])
  const tags = useMemo(() => [...new Set(notes.flatMap((note) => note.tags))].sort(), [notes])
  return { notes, categories, tags }
}
