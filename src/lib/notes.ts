export interface NoteFrontmatter {
  title?: string
  date?: string
  tags: string[]
  pinned: boolean
}

export interface Note {
  id: string
  path: string
  category: string
  categoryLabel: string
  title: string
  date: string
  tags: string[]
  pinned: boolean
  body: string
  preview: string
}

const noteFiles = import.meta.glob('/notes/**/*.{md,txt}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const categoryColors: Record<string, string> = {
  announcements: 'red',
  reminders: 'teal',
  'email-replies': 'blue',
  'ticket-replies': 'amber',
}

export function labelFromFolder(folder: string): string {
  return folder
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function colorForCategory(category: string): string {
  if (categoryColors[category.toLowerCase()]) return categoryColors[category.toLowerCase()]
  const palette = ['violet', 'blue', 'teal', 'amber', 'red']
  const hash = [...category].reduce((value, character) => value + character.charCodeAt(0), 0)
  return palette[hash % palette.length]
}

function parseScalar(value: string): string {
  const trimmed = value.trim()
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

export function parseFrontmatter(source: string): { metadata: NoteFrontmatter; body: string } {
  const normalized = source.replace(/\r\n?/g, '\n')
  if (!normalized.startsWith('---\n')) {
    return { metadata: { tags: [], pinned: false }, body: normalized.trim() }
  }

  const end = normalized.indexOf('\n---', 4)
  if (end < 0) return { metadata: { tags: [], pinned: false }, body: normalized.trim() }

  const rawMetadata = normalized.slice(4, end)
  const metadata: NoteFrontmatter = { tags: [], pinned: false }
  let listField = ''

  for (const line of rawMetadata.split('\n')) {
    const listItem = line.match(/^\s*-\s+(.+)$/)
    if (listItem && listField === 'tags') {
      metadata.tags.push(parseScalar(listItem[1]))
      continue
    }

    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    listField = ''

    if (key === 'title' && rawValue) metadata.title = parseScalar(rawValue)
    if (key === 'date' && rawValue) metadata.date = parseScalar(rawValue)
    if (key === 'pinned') metadata.pinned = rawValue.trim().toLowerCase() === 'true'
    if (key === 'tags') {
      listField = 'tags'
      const value = rawValue.trim()
      if (value.startsWith('[') && value.endsWith(']')) {
        metadata.tags = value.slice(1, -1).split(',').map(parseScalar).filter(Boolean)
      } else if (value) {
        metadata.tags = [parseScalar(value)]
      }
    }
  }

  return { metadata, body: normalized.slice(end + 4).trim() }
}

function wordsFromFileName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function noteDate(date?: string): string {
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00`))) {
    return date
  }
  return new Date().toISOString().slice(0, 10)
}

function toPreview(body: string): string {
  return body
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180)
}

function createNote(path: string, source: string): Note | null {
  const match = path.match(/^\/notes\/([^/]+)\/(.+)$/)
  if (!match) return null
  const [, category, relativePath] = match
  const fileName = relativePath.split('/').pop() ?? relativePath
  const { metadata, body } = parseFrontmatter(source)
  const firstHeading = body.match(/^#{1,6}\s+(.+)$/m)?.[1]?.trim()
  const title = metadata.title?.trim() || firstHeading || wordsFromFileName(fileName)
  return {
    id: path,
    path,
    category,
    categoryLabel: labelFromFolder(category),
    title,
    date: noteDate(metadata.date),
    tags: metadata.tags,
    pinned: metadata.pinned,
    body,
    preview: toPreview(body),
  }
}

export function loadNotes(): Note[] {
  return Object.entries(noteFiles)
    .map(([path, source]) => createNote(path, source))
    .filter((note): note is Note => note !== null)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
}

if (import.meta.hot) {
  import.meta.hot.accept(() => window.location.reload())
}

export function getNoteCategories(notes: Note[]): string[] {
  return [...new Set(notes.map((note) => note.category))].sort((a, b) => {
    const standardOrder = ['announcements', 'reminders', 'email-replies', 'ticket-replies']
    const aIndex = standardOrder.indexOf(a)
    const bIndex = standardOrder.indexOf(b)
    if (aIndex >= 0 || bIndex >= 0) return (aIndex < 0 ? 99 : aIndex) - (bIndex < 0 ? 99 : bIndex)
    return a.localeCompare(b)
  })
}
