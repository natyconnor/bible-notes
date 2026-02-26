import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTabs } from "@/lib/use-tabs"
import { toPassageId } from "@/lib/verse-ref-utils"
import { getBookInfo, BIBLE_BOOKS } from "@/lib/bible-books"

interface ChapterHeaderProps {
  book: string
  chapter: number
}

export function ChapterHeader({ book, chapter }: ChapterHeaderProps) {
  const { openTab } = useTabs()
  const bookInfo = getBookInfo(book)
  const bookIndex = BIBLE_BOOKS.findIndex((b) => b.name === book)

  const hasPrev = chapter > 1 || bookIndex > 0
  const hasNext = (bookInfo && chapter < bookInfo.chapters) || bookIndex < BIBLE_BOOKS.length - 1

  function goPrev() {
    if (chapter > 1) {
      const id = toPassageId(book, chapter - 1)
      openTab(id, `${book} ${chapter - 1}`)
    } else if (bookIndex > 0) {
      const prevBook = BIBLE_BOOKS[bookIndex - 1]
      const id = toPassageId(prevBook.name, prevBook.chapters)
      openTab(id, `${prevBook.name} ${prevBook.chapters}`)
    }
  }

  function goNext() {
    if (bookInfo && chapter < bookInfo.chapters) {
      const id = toPassageId(book, chapter + 1)
      openTab(id, `${book} ${chapter + 1}`)
    } else if (bookIndex < BIBLE_BOOKS.length - 1) {
      const nextBook = BIBLE_BOOKS[bookIndex + 1]
      const id = toPassageId(nextBook.name, 1)
      openTab(id, `${nextBook.name} 1`)
    }
  }

  return (
    <div className="flex items-center justify-between py-4 px-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={goPrev}
        disabled={!hasPrev}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-serif font-semibold tracking-tight">
        {book} {chapter}
      </h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={goNext}
        disabled={!hasNext}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
