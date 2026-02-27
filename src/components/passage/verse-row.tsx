import { memo } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerseRowLeftProps {
  verseNumber: number
  text: string
  isSelected: boolean
  isInSelectionRange: boolean
  hasNotes: boolean
  onAddNote: (verseNumber: number) => void
  onMouseDown: (verseNumber: number) => void
  onMouseEnter: (verseNumber: number) => void
}

export const VerseRowLeft = memo(function VerseRowLeft({
  verseNumber,
  text,
  isSelected,
  isInSelectionRange,
  hasNotes,
  onAddNote,
  onMouseDown,
  onMouseEnter,
}: VerseRowLeftProps) {
  return (
    <div
      data-verse-number={verseNumber}
      className={cn(
        "group relative flex gap-2 py-2 px-3 min-h-[2.5rem] rounded-sm transition-colors select-none cursor-pointer",
        isSelected && "bg-primary/10 ring-1 ring-primary/20",
        isInSelectionRange && !isSelected && "bg-primary/5",
        !isSelected && !isInSelectionRange && "hover:bg-muted"
      )}
      onMouseDown={(e) => {
        e.preventDefault()
        onMouseDown(verseNumber)
      }}
      onMouseEnter={() => onMouseEnter(verseNumber)}
    >
      <span className="flex items-start gap-1 shrink-0 pt-0.5">
        <span className="text-xs font-semibold text-muted-foreground tabular-nums min-w-[1.5rem] text-right">
          {verseNumber}
        </span>
        {hasNotes && (
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1 shrink-0" />
        )}
      </span>
      <span className="font-serif text-base leading-relaxed flex-1 min-w-0 whitespace-pre-wrap">
        {text}
      </span>
      <div className="group/addbtn relative shrink-0 ml-3 self-stretch flex items-center justify-center min-w-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="w-full h-full flex items-center justify-center px-2 rounded hover:bg-primary/10"
          onClick={(e) => {
            e.stopPropagation()
            onAddNote(verseNumber)
          }}
        >
          <Plus className="h-4 w-4 text-primary" />
        </button>
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-3 py-1.5 text-xs rounded-md bg-foreground text-background whitespace-nowrap opacity-0 group-hover/addbtn:opacity-100 transition-opacity z-50">
          Add note
        </span>
      </div>
    </div>
  )
})
