import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface NoteBubbleStackProps {
  count: number
  firstNotePreview: string
  verseLabel: string
  onClick: () => void
}

export function NoteBubbleStack({
  count,
  firstNotePreview,
  verseLabel,
  onClick,
}: NoteBubbleStackProps) {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      {/* Stacked card shadows behind */}
      {count > 2 && (
        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-lg border bg-muted/50" />
      )}
      {count > 1 && (
        <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-lg border bg-muted/70" />
      )}

      {/* Top card */}
      <div
        className={cn(
          "relative border rounded-lg p-3 bg-card transition-all hover:shadow-sm"
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <Badge variant="secondary" className="text-xs font-normal">
            {verseLabel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {count} notes
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {firstNotePreview}
        </p>
      </div>
    </div>
  )
}
