# Adding notes

1. Make a folder inside `notes/` for the category, such as `notes/meetings/`.
2. Add a `.md` or `.txt` file in that folder, for example `notes/meetings/team-check-in.md`.
3. Write your note. Use `[Name]`, `[Date]`, or other square-bracket words wherever you want a fill-in field.
4. Optional: start a Markdown note with `title`, `date`, `tags`, or `pinned` frontmatter. For example:

   ```yaml
   ---
   title: Team check-in
   date: 2026-10-28
   tags: [team, weekly]
   pinned: true
   ---
   ```

The category is taken from the folder name. The title uses the frontmatter title, the first Markdown heading, or the file name, in that order. Save the file while the development server is running and the notes list updates automatically. This README is for instructions and is not shown as a note.
