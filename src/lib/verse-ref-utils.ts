export interface VerseRef {
  book: string
  chapter: number
  startVerse: number
  endVerse: number
}

export function formatVerseRef(ref: VerseRef): string {
  if (ref.startVerse === ref.endVerse) {
    return `${ref.book} ${ref.chapter}:${ref.startVerse}`
  }
  return `${ref.book} ${ref.chapter}:${ref.startVerse}-${ref.endVerse}`
}

export function parseVerseRef(str: string): VerseRef | null {
  const match = str.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/)
  if (!match) return null
  return {
    book: match[1],
    chapter: parseInt(match[2]),
    startVerse: parseInt(match[3]),
    endVerse: match[4] ? parseInt(match[4]) : parseInt(match[3]),
  }
}

export function verseInRange(verseNum: number, ref: VerseRef): boolean {
  return verseNum >= ref.startVerse && verseNum <= ref.endVerse
}

export function parsePassageId(passageId: string): {
  book: string
  chapter: number
} {
  const lastDash = passageId.lastIndexOf("-")
  const bookUrl = passageId.substring(0, lastDash)
  const chapter = parseInt(passageId.substring(lastDash + 1))
  // "1Corinthians" -> "1 Corinthians", "SongOfSolomon" -> "Song of Solomon"
  const book = bookUrl
    .replace(/(\d)([A-Z])/g, "$1 $2")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/ Of /g, " of ")
  return { book, chapter }
}

export function toPassageId(book: string, chapter: number): string {
  // "1 Corinthians" -> "1Corinthians", "Song of Solomon" -> "SongOfSolomon"
  const urlBook = book
    .replace(/ of /g, " Of ")
    .replace(/\s/g, "")
  return `${urlBook}-${chapter}`
}

export function toEsvQuery(book: string, chapter: number): string {
  return `${book} ${chapter}`
}

export function isPassageNote(ref: VerseRef): boolean {
  return ref.startVerse !== ref.endVerse
}
