import { useCallback, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEsvPassage } from "@/hooks/use-esv-passage"
import { useVerseSelection } from "@/hooks/use-verse-selection"
import { ChapterHeader } from "./chapter-header"
import { VerseBlock } from "./verse-block"
import { CopyrightNotice } from "./copyright-notice"
import { PassageNavigator } from "./passage-navigator"
import { GospelParallelBanner } from "@/components/links/gospel-parallel-banner"
import { Loader2 } from "lucide-react"

interface BiblePanelProps {
  book: string
  chapter: number
  selectedVerses?: Set<number>
  verseNoteCounts?: Map<number, number>
  onAddNote?: (startVerse: number, endVerse: number) => void
  onVerseClick?: (verseNumber: number) => void
  scrollRef?: React.RefObject<HTMLDivElement | null>
}

export function BiblePanel({
  book,
  chapter,
  selectedVerses,
  verseNoteCounts,
  onAddNote,
  onVerseClick,
  scrollRef,
}: BiblePanelProps) {
  const { data, loading, error } = useEsvPassage(book, chapter)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSelectionComplete = useCallback(
    (selection: { startVerse: number; endVerse: number }) => {
      if (selection.startVerse === selection.endVerse) {
        onVerseClick?.(selection.startVerse)
      } else {
        onAddNote?.(selection.startVerse, selection.endVerse)
      }
    },
    [onAddNote, onVerseClick]
  )

  const {
    isInSelection,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
  } = useVerseSelection(handleSelectionComplete)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-destructive">
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <ScrollArea className="h-full" ref={scrollRef}>
      <div
        ref={containerRef}
        className="max-w-2xl mx-auto px-6 pb-12"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex items-center justify-between">
          <ChapterHeader book={book} chapter={chapter} />
          <PassageNavigator />
        </div>

        <GospelParallelBanner book={book} chapter={chapter} />

        <div className="space-y-0.5">
          {data.verses.map((verse) => (
            <VerseBlock
              key={verse.number}
              verseNumber={verse.number}
              text={verse.text}
              isSelected={selectedVerses?.has(verse.number) ?? false}
              isInSelectionRange={isInSelection(verse.number)}
              hasNotes={(verseNoteCounts?.get(verse.number) ?? 0) > 0}
              onAddNote={() =>
                onAddNote?.(verse.number, verse.number)
              }
              onMouseDown={() => handleMouseDown(verse.number)}
              onMouseEnter={() => handleMouseEnter(verse.number)}
            />
          ))}
        </div>

        <CopyrightNotice text={data.copyright} />
      </div>
    </ScrollArea>
  )
}
