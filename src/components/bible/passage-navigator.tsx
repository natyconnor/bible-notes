import { useState } from "react"
import { TooltipButton } from "@/components/ui/tooltip-button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { BookOpen } from "lucide-react"
import { BIBLE_BOOKS, type BookInfo } from "@/lib/bible-books"
import { useTabs } from "@/lib/use-tabs"
import { toPassageId } from "@/lib/verse-ref-utils"
import { cn } from "@/lib/utils"

export function PassageNavigator() {
  const [open, setOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookInfo | null>(null)
  const [search, setSearch] = useState("")
  const { openTab } = useTabs()

  const filteredBooks = search
    ? BIBLE_BOOKS.filter(
        (b) =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.abbreviation.toLowerCase().includes(search.toLowerCase())
      )
    : BIBLE_BOOKS

  function selectChapter(book: BookInfo, chapter: number) {
    const passageId = toPassageId(book.name, chapter)
    openTab(passageId, `${book.name} ${chapter}`)
    setOpen(false)
    setSelectedBook(null)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={(o) => {
      setOpen(o)
      if (!o) {
        setSelectedBook(null)
        setSearch("")
      }
    }}>
      <PopoverTrigger asChild>
        <TooltipButton variant="ghost" size="icon" className="h-8 w-8" tooltip="Go to passage">
          <BookOpen className="h-4 w-4" />
        </TooltipButton>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        {!selectedBook ? (
          <>
            <div className="p-2 border-b">
              <Input
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8"
                autoFocus
              />
            </div>
            <ScrollArea className="h-80">
              <div className="p-1">
                {(["OT", "NT"] as const).map((testament) => {
                  const books = filteredBooks.filter(
                    (b) => b.testament === testament
                  )
                  if (books.length === 0) return null
                  return (
                    <div key={testament}>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                        {testament === "OT"
                          ? "Old Testament"
                          : "New Testament"}
                      </div>
                      {books.map((book) => (
                        <Tooltip key={book.name}>
                          <TooltipTrigger asChild>
                            <button
                              className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-muted transition-colors cursor-pointer"
                              onClick={() => {
                                if (book.chapters === 1) {
                                  selectChapter(book, 1)
                                } else {
                                  setSelectedBook(book)
                                }
                              }}
                            >
                              {book.name}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {book.chapters === 1 ? `Open ${book.name}` : `Select chapter in ${book.name}`}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </>
        ) : (
          <>
            <div className="p-2 border-b">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={() => setSelectedBook(null)}
                  >
                    &larr; {selectedBook.name}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Back to book list</TooltipContent>
              </Tooltip>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-6 gap-1">
                {Array.from(
                  { length: selectedBook.chapters },
                  (_, i) => i + 1
                ).map((ch) => (
                  <Tooltip key={ch}>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "h-9 w-full rounded-sm text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer",
                          "bg-muted"
                        )}
                        onClick={() => selectChapter(selectedBook, ch)}
                      >
                        {ch}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Go to {selectedBook.name} {ch}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
