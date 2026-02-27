import { TooltipButton } from "@/components/ui/tooltip-button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTabs } from "@/lib/use-tabs"
import { toPassageId } from "@/lib/verse-ref-utils"
import { getBookInfo, BIBLE_BOOKS } from "@/lib/bible-books"

interface ChapterHeaderProps {
  book: string
  chapter: number
}

export function ChapterHeader({ book, chapter }: ChapterHeaderProps) {
  const { navigateActiveTab } = useTabs()
  const bookInfo = getBookInfo(book)
  const bookIndex = BIBLE_BOOKS.findIndex((b) => b.name === book)

  const hasPrev = chapter > 1 || bookIndex > 0
  const hasNext = (bookInfo && chapter < bookInfo.chapters) || bookIndex < BIBLE_BOOKS.length - 1

  function goPrev() {
    if (chapter > 1) {
      const id = toPassageId(book, chapter - 1)
      navigateActiveTab(id, `${book} ${chapter - 1}`)
    } else if (bookIndex > 0) {
      const prevBook = BIBLE_BOOKS[bookIndex - 1]
      const id = toPassageId(prevBook.name, prevBook.chapters)
      navigateActiveTab(id, `${prevBook.name} ${prevBook.chapters}`)
    }
  }

  function goNext() {
    if (bookInfo && chapter < bookInfo.chapters) {
      const id = toPassageId(book, chapter + 1)
      navigateActiveTab(id, `${book} ${chapter + 1}`)
    } else if (bookIndex < BIBLE_BOOKS.length - 1) {
      const nextBook = BIBLE_BOOKS[bookIndex + 1]
      const id = toPassageId(nextBook.name, 1)
      navigateActiveTab(id, `${nextBook.name} 1`)
    }
  }

  return (
    <div className="flex items-center justify-between py-4 px-2">
      <TooltipButton
        variant="ghost"
        size="icon"
        onClick={goPrev}
        disabled={!hasPrev}
        className="h-8 w-8"
        tooltip="Previous chapter"
      >
        <ChevronLeft className="h-4 w-4" />
      </TooltipButton>
      <h1 className="text-2xl font-serif font-semibold tracking-tight">
        {book} {chapter}
      </h1>
      <TooltipButton
        variant="ghost"
        size="icon"
        onClick={goNext}
        disabled={!hasNext}
        className="h-8 w-8"
        tooltip="Next chapter"
      >
        <ChevronRight className="h-4 w-4" />
      </TooltipButton>
    </div>
  )
}
