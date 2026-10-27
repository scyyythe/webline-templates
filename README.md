# Webline · Jera's Personal Hub

A Vite + React + TypeScript notes and message hub. Notes are loaded directly from the `notes/` folders as Markdown or text; schedules and holiday dates are editable in `src/data/`.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Build and lint with `npm run build` and `npm run lint`.

## Add a note or category

Create a category folder such as `notes/meetings/`, then add a `.md` or `.txt` file in it. The folder becomes a category automatically. Add a Markdown heading for a title, or optional YAML frontmatter for `title`, `date`, `tags`, and `pinned`. Square-bracket text such as `[Name]` becomes a fill-in field in the note viewer. See [notes/README.md](./notes/README.md).

## Edit dates and work schedule

- Work hours, timezone, workdays, and monthsary day/message: `src/data/schedule.ts`
- Philippine public holidays: `src/data/holidays.ts`. Check dates, especially lunar holidays, against the official proclamation.
