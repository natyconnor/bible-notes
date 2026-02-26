import { memo } from "react"
import { Pencil, Trash2, Plus, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { VerseRef } from "@/lib/verse-ref-utils"
import { isPassageNote } from "@/lib/verse-ref-utils"
import type { Id } from "../../../convex/_generated/dataModel"

export interface VerseNote {
  noteId: Id<"notes">
  content: string
  tags: string[]
  verseRef: VerseRef
  createdAt: number
}

interface VerseNotesProps {
  notes: VerseNote[]
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onEdit: (noteId: Id<"notes">) => void
  onDelete: (noteId: Id<"notes">) => void
  onAddNote: () => void
}

export const VerseNotes = memo(function VerseNotes({
  notes,
  isOpen,
  onOpen,
  onClose,
  onEdit,
  onDelete,
  onAddNote,
}: VerseNotesProps) {
  if (notes.length === 0) return null

  // Collapsed: show a small bubble or stack
  if (!isOpen) {
    if (notes.length === 1) {
      return (
        <CollapsedBubble
          note={notes[0]}
          onClick={onOpen}
          onEdit={() => onEdit(notes[0].noteId)}
        />
      )
    }
    return (
      <StackedBubble
        count={notes.length}
        preview={notes[0].content}
        isPassage={isPassageNote(notes[0].verseRef)}
        onClick={onOpen}
      />
    )
  }

  // Expanded: show all notes with actions
  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          onClick={onAddNote}
        >
          <Plus className="h-3 w-3" />
          New note
        </button>
        <button
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={onClose}
          title="Collapse"
        >
          <ChevronUp className="h-3 w-3" />
          Collapse
        </button>
      </div>
      {notes.map((note) => (
        <ExpandedBubble
          key={note.noteId}
          note={note}
          onEdit={() => onEdit(note.noteId)}
          onDelete={() => onDelete(note.noteId)}
        />
      ))}
    </div>
  )
})

function CollapsedBubble({
  note,
  onClick,
  onEdit,
}: {
  note: VerseNote
  onClick: () => void
  onEdit: () => void
}) {
  const isPassage = isPassageNote(note.verseRef)
  const preview =
    note.content.length > 100
      ? note.content.slice(0, 100) + "..."
      : note.content

  return (
    <div
      className={cn(
        "group relative border rounded-lg px-3 py-2 cursor-pointer transition-all hover:shadow-sm text-sm",
        isPassage
          ? "bg-amber-50/80 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
          : "bg-card border-border"
      )}
      onClick={onClick}
    >
      <p className="text-muted-foreground line-clamp-2 leading-relaxed">
        {preview}
      </p>
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      <button
        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all"
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
        }}
        title="Edit note"
      >
        <Pencil className="h-3 w-3 text-muted-foreground" />
      </button>
    </div>
  )
}

function StackedBubble({
  count,
  preview,
  isPassage,
  onClick,
}: {
  count: number
  preview: string
  isPassage: boolean
  onClick: () => void
}) {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      {count > 2 && (
        <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-lg border bg-muted/40" />
      )}
      <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-lg border bg-muted/60" />
      <div
        className={cn(
          "relative border rounded-lg px-3 py-2 transition-all hover:shadow-sm text-sm",
          isPassage
            ? "bg-amber-50/80 border-amber-200"
            : "bg-card border-border"
        )}
      >
        <div className="flex items-center justify-between mb-0.5">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {count} notes
          </Badge>
        </div>
        <p className="text-muted-foreground line-clamp-1 text-xs">
          {preview}
        </p>
      </div>
    </div>
  )
}

function ExpandedBubble({
  note,
  onEdit,
  onDelete,
}: {
  note: VerseNote
  onEdit: () => void
  onDelete: () => void
}) {
  const isPassage = isPassageNote(note.verseRef)

  return (
    <div
      className={cn(
        "border rounded-lg px-3 py-2 shadow-sm text-sm",
        isPassage
          ? "bg-amber-50/80 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
          : "bg-card border-border"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="leading-relaxed whitespace-pre-wrap flex-1">
          {note.content}
        </p>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            className="p-1 rounded hover:bg-muted transition-colors"
            onClick={onEdit}
            title="Edit note"
          >
            <Pencil className="h-3 w-3 text-muted-foreground" />
          </button>
          <button
            className="p-1 rounded hover:bg-destructive/10 transition-colors"
            onClick={onDelete}
            title="Delete note"
          >
            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
