import { memo } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { VerseRef } from "@/lib/verse-ref-utils"
import { formatVerseRef, isPassageNote } from "@/lib/verse-ref-utils"

interface NoteBubbleProps {
  noteId: string
  content: string
  tags: string[]
  verseRef: VerseRef
  isExpanded: boolean
  onExpand: () => void
  onEdit: () => void
  onDelete: () => void
}

export const NoteBubble = memo(function NoteBubble({
  content,
  tags,
  verseRef,
  isExpanded,
  onExpand,
  onEdit,
  onDelete,
}: NoteBubbleProps) {
  const isPassage = isPassageNote(verseRef)
  const truncatedContent =
    !isExpanded && content.length > 150
      ? content.slice(0, 150) + "..."
      : content

  return (
    <div
      className={cn(
        "group relative border rounded-lg p-3 transition-all cursor-pointer",
        isPassage
          ? "bg-amber-50/80 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/50"
          : "bg-card border-border",
        isExpanded && "shadow-md"
      )}
      onClick={() => !isExpanded && onExpand()}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="text-xs font-normal">
            {formatVerseRef(verseRef)}
          </Badge>
          {isPassage && (
            <Badge variant="outline" className="text-xs font-normal text-amber-700 dark:text-amber-400/70 border-amber-300 dark:border-amber-600/50">
              passage
            </Badge>
          )}
        </div>
        {isExpanded && (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-1 rounded hover:bg-muted transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit note</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-1 rounded hover:bg-destructive/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete note</TooltipContent>
            </Tooltip>
          </div>
        )}
        {!isExpanded && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
              >
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Edit note</TooltipContent>
          </Tooltip>
        )}
      </div>

      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {truncatedContent}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
})
