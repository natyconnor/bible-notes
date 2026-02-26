import { useQuery } from "convex-helpers/react/cache"
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Link2 } from "lucide-react"
import { useTabs } from "@/lib/use-tabs"
import { toPassageId } from "@/lib/verse-ref-utils"

interface LinkedVersesPopoverProps {
  verseRefId: Id<"verseRefs">
}

export function LinkedVersesPopover({
  verseRefId,
}: LinkedVersesPopoverProps) {
  const linkedRefs = useQuery(api.verseLinks.getLinksForVerseRef, {
    verseRefId,
  })
  const { openTab } = useTabs()

  if (!linkedRefs || linkedRefs.length === 0) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="p-0.5 rounded hover:bg-muted transition-colors"
          title="Linked verses"
        >
          <Link2 className="h-3 w-3 text-primary/60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          Linked Verses
        </p>
        <div className="flex flex-wrap gap-1">
          {linkedRefs.map((ref) => {
            if (!ref) return null
            const label =
              ref.startVerse === ref.endVerse
                ? `${ref.book} ${ref.chapter}:${ref.startVerse}`
                : `${ref.book} ${ref.chapter}:${ref.startVerse}-${ref.endVerse}`
            return (
              <Badge
                key={ref._id}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => {
                  const id = toPassageId(ref.book, ref.chapter)
                  openTab(id, `${ref.book} ${ref.chapter}`)
                }}
              >
                {label}
              </Badge>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
