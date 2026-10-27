import { useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Check, Copy, RotateCcw, X } from 'lucide-react'
import { toast } from 'sonner'
import { colorForCategory, type Note } from '../lib/notes'
import { Button } from './ui/button'

interface NoteViewerProps {
  note: Note | null
  onClose: () => void
}

const placeholderPattern = /\[([^\]]+)\]/g

function getPlaceholders(note: Note): string[] {
  const keys = new Set<string>()
  for (const match of note.body.matchAll(placeholderPattern)) keys.add(match[1].trim())
  return [...keys]
}

function markdownWithFields(source: string, values: Record<string, string>): string {
  return source.replace(placeholderPattern, (_, rawKey: string) => {
    const key = rawKey.trim()
    const value = values[key]?.trim()
    return `[${value || key}](#webline-field-${encodeURIComponent(key)})`
  })
}

function filledText(source: string, values: Record<string, string>): string {
  return source
    .replace(placeholderPattern, (match, rawKey: string) => values[rawKey.trim()]?.trim() || match)
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/[*_~`]/g, '')
}

export function NoteViewer({ note, onClose }: NoteViewerProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const placeholders = useMemo(() => note ? getPlaceholders(note) : [], [note])
  const markdown = useMemo(() => note ? markdownWithFields(note.body, values) : '', [note, values])

  const copyMessage = async () => {
    if (!note) return
    try {
      await navigator.clipboard.writeText(filledText(note.body, values))
      toast.success('Copied!')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1700)
    } catch (error) {
      console.error('Could not copy note to clipboard.', error)
      toast.error('Clipboard access was blocked by your browser')
    }
  }

  return (
    <Dialog.Root open={Boolean(note)} onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="note-dialog-overlay" />
        <Dialog.Content className="note-viewer">
          {note && <>
            <div className="viewer-head">
              <span className={`viewer-category category-${colorForCategory(note.category)}`}>{note.categoryLabel}</span>
              <Dialog.Close asChild><button type="button" className="viewer-close" aria-label="Close note"><X size={18} /></button></Dialog.Close>
            </div>
            <Dialog.Title className="viewer-title">{note.title}</Dialog.Title>
            <div className="viewer-meta"><time dateTime={note.date}>{new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${note.date}T12:00:00`))}</time>{note.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
            {placeholders.length > 0 && <section className="viewer-fields">
              <div className="viewer-section-heading"><div><small>MAKE IT YOURS</small><h3>Fill in the details</h3></div><button type="button" onClick={() => { setValues({}); toast('Fields cleared') }}><RotateCcw size={13} /> Clear fields</button></div>
              <div className="viewer-fields-grid">{placeholders.map((key) => <label key={key}><span>{key}</span><input value={values[key] ?? ''} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} placeholder={`Enter ${key.toLowerCase()}...`} /></label>)}</div>
            </section>}
            <div className="viewer-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                a: ({ href, children }) => {
                  if (href?.startsWith('#webline-field-')) {
                    const key = decodeURIComponent(href.slice('#webline-field-'.length))
                    return <span className={values[key]?.trim() ? 'placeholder-filled' : 'placeholder-empty'}>{values[key]?.trim() || `[${key}]`}</span>
                  }
                  return <a href={href}>{children}</a>
                },
              }}>{markdown}</ReactMarkdown>
            </div>
            <div className="viewer-actions"><p>Fill in the fields, then copy your message.</p><Button type="button" onClick={() => void copyMessage()}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied!' : 'Copy message'}</Button></div>
          </>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
