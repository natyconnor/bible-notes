import { memo } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NoteEditor } from "@/components/notes/note-editor";
import { useNoteUiVariant } from "@/components/notes/use-note-ui-variant";
import type { Id } from "../../../convex/_generated/dataModel";
import type { NoteWithRef } from "@/components/notes/model/note-model";
import type { NoteBody } from "@/lib/note-inline-content";
import {
  NoteCardActions,
  NoteTagList,
  StackedCardBackground,
  HoverEditButton,
  NoteContent,
} from "@/components/notes/view/note-card-primitives";
import { cn } from "@/lib/utils";
import { NoteBubbleShell, type BubbleState } from "./view/note-bubble-shell";
import { LAYOUT_CORRECTION_TRANSITION } from "./note-animation-config";

export type VerseNote = NoteWithRef;

interface CurrentChapter {
  book: string;
  chapter: number;
}

interface VerseNotesProps {
  notes: VerseNote[];
  isOpen: boolean;
  viewMode?: "compose" | "read";
  isPill?: boolean;
  currentChapter?: CurrentChapter;
  editingNoteIds?: Set<Id<"notes">>;
  onSaveEdit?: (noteId: Id<"notes">, body: NoteBody, tags: string[]) => void | Promise<void>;
  onCancelEdit?: (noteId: Id<"notes">) => void;
  onEditorDirtyChange?: (noteId: Id<"notes">, isDirty: boolean) => void;
  onOpen: () => void;
  onClose: () => void;
  onEdit: (noteId: Id<"notes">) => void;
  onDelete: (noteId: Id<"notes">) => void;
  onAddNote: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const VerseNotes = memo(function VerseNotes({
  notes,
  isOpen,
  viewMode = "compose",
  isPill = false,
  currentChapter,
  editingNoteIds,
  onSaveEdit,
  onCancelEdit,
  onEditorDirtyChange,
  onOpen,
  onClose,
  onEdit,
  onDelete,
  onAddNote,
  onMouseEnter,
  onMouseLeave,
}: VerseNotesProps) {
  const { variant: noteUiVariant } = useNoteUiVariant();
  const isMargin = noteUiVariant === "margin";
  const isManuscript = noteUiVariant === "manuscript";
  if (notes.length === 0) return null;
  const isReadMode = viewMode === "read";
  const supportsInlineEditing = !!onSaveEdit && !!onCancelEdit;
  const hasEditsInGroup =
    supportsInlineEditing && editingNoteIds
      ? notes.some((note) => editingNoteIds.has(note.noteId))
      : false;
  const isEditingWithinGroup = hasEditsInGroup;
  const shouldShowExpanded = isOpen || isReadMode || isEditingWithinGroup;

  const bubbleState: BubbleState =
    isPill && !isEditingWithinGroup
      ? "pill"
      : shouldShowExpanded || isReadMode
        ? "expanded"
        : "collapsed";

  return (
    <NoteBubbleShell
      state={bubbleState}
      pill={<VerseNotesPill count={notes.length} onClick={onOpen} />}
      collapsed={
        notes.length === 1 ? (
          <CollapsedBubble
            note={notes[0]}
            currentChapter={currentChapter}
            onClick={onOpen}
            onEdit={() => onEdit(notes[0].noteId)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        ) : (
          <StackedBubble
            count={notes.length}
            preview={notes[0].content}
            onClick={onOpen}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        )
      }
      expanded={
        <div
          data-note-surface
          className={isReadMode ? "space-y-3" : "min-h-[96px] space-y-1.5"}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {!isReadMode && (
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium transition-colors",
                      isMargin || isManuscript
                        ? "text-muted-foreground hover:text-foreground"
                        : "text-primary hover:text-primary/80",
                    )}
                    onClick={onAddNote}
                  >
                    <Plus className="h-3 w-3" />
                    New note
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add new note for this verse</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onClick={onClose}
                  >
                    <ChevronUp className="h-3 w-3" />
                    Collapse
                  </button>
                </TooltipTrigger>
                <TooltipContent>Collapse notes</TooltipContent>
              </Tooltip>
            </div>
          )}
          {notes.map((note, index) => (
            <motion.div
              key={note.noteId}
              layout
              transition={{
                layout: LAYOUT_CORRECTION_TRANSITION,
                delay: index * 0.03,
              }}
            >
              {supportsInlineEditing &&
              editingNoteIds?.has(note.noteId) ? (
                <div data-note-surface>
                  <NoteEditor
                    verseRef={note.verseRef}
                    initialContent={note.content}
                    initialBody={note.body}
                    initialTags={note.tags}
                    currentChapter={currentChapter}
                    onSave={(body, tags) => onSaveEdit(note.noteId, body, tags)}
                    onCancel={() => onCancelEdit(note.noteId)}
                    onDirtyChange={
                      onEditorDirtyChange
                        ? (isDirty) => onEditorDirtyChange(note.noteId, isDirty)
                        : undefined
                    }
                  />
                </div>
              ) : (
                <ExpandedBubble
                  note={note}
                  currentChapter={currentChapter}
                  density={isReadMode ? "reading" : "default"}
                  onEdit={() => onEdit(note.noteId)}
                  onDelete={() => onDelete(note.noteId)}
                />
              )}
            </motion.div>
          ))}
        </div>
      }
    />
  );
});

function CollapsedBubble({
  note,
  currentChapter,
  onClick,
  onEdit,
  onMouseEnter,
  onMouseLeave,
}: {
  note: VerseNote;
  currentChapter?: { book: string; chapter: number };
  onClick: () => void;
  onEdit: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const { variant: noteUiVariant } = useNoteUiVariant();
  const isMargin = noteUiVariant === "margin";
  const isManuscript = noteUiVariant === "manuscript";
  return (
    <div
      className="group relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        type="button"
        data-note-trigger
        className={cn(
          "w-full cursor-pointer px-2.5 py-1.5 text-left transition-colors",
          isManuscript
            ? cn(
                "rounded-md border-0 relative overflow-visible text-sm",
                "ms-note-hit",
              )
            : cn(
                "rounded-lg text-[13px] transition-all hover:shadow-sm",
                isMargin
                  ? "note-grain border bg-stone-50/60 dark:bg-stone-950/40 border-stone-200/70 dark:border-stone-800/60 hover:bg-stone-50/80"
                  : "border border-border bg-card",
              ),
        )}
        onClick={onClick}
      >
        <NoteContent
          content={note.content}
          body={note.body}
          truncateAt={100}
          currentChapter={currentChapter}
          uiVariant={noteUiVariant}
          className={cn(
            "text-muted-foreground line-clamp-2",
            isManuscript && "text-[15px] leading-snug",
          )}
        />
        <NoteTagList tags={note.tags} className="mt-1" />
      </button>
      <HoverEditButton onEdit={onEdit} />
    </div>
  );
}

function StackedBubble({
  count,
  preview,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  count: number;
  preview: string;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const { variant: noteUiVariant } = useNoteUiVariant();
  const isMargin = noteUiVariant === "margin";
  const isManuscript = noteUiVariant === "manuscript";
  return (
    <button
      type="button"
      data-note-trigger
      className="relative block w-full cursor-pointer text-left"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {!isMargin && !isManuscript && (
        <StackedCardBackground count={count} variant="muted" />
      )}
      <div
        className={cn(
          "relative px-2.5 py-1.5 text-xs transition-colors",
          isManuscript
            ? cn("rounded-md border-0 overflow-visible", "ms-note-hit")
            : cn(
                "border rounded-lg transition-all hover:shadow-sm",
                isMargin
                  ? "bg-stone-50/60 dark:bg-stone-950/40 border-stone-200/70 dark:border-stone-800/60"
                  : "bg-card border-border",
              ),
        )}
      >
        <div className="flex items-center justify-between mb-0.5">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {count} notes
          </Badge>
        </div>
        <p
          className={cn(
            "text-muted-foreground line-clamp-1",
            isManuscript ? "text-sm" : "text-xs",
            (isMargin || isManuscript) &&
              "font-serif tracking-[0.01em] dark:font-normal",
          )}
        >
          {preview}
        </p>
      </div>
    </button>
  );
}

export function VerseNotesPill({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          data-note-trigger
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-card hover:bg-muted/50 transition-colors cursor-pointer text-xs text-muted-foreground"
          onClick={onClick}
        >
          <Pencil className="h-3 w-3" />
          <span>{count}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {count} verse {count === 1 ? "note" : "notes"}
      </TooltipContent>
    </Tooltip>
  );
}

function ExpandedBubble({
  note,
  currentChapter,
  density = "default",
  onEdit,
  onDelete,
}: {
  note: VerseNote;
  currentChapter?: { book: string; chapter: number };
  density?: "default" | "reading";
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { variant: noteUiVariant } = useNoteUiVariant();
  const isReading = density === "reading";
  const marginSurface =
    noteUiVariant === "margin"
      ? isReading
        ? "border rounded-xl px-4 py-3 shadow-sm bg-stone-50/70 dark:bg-stone-950/35 border-stone-200/80 dark:border-stone-800/80"
        : "border rounded-lg px-3 py-2.5 shadow-sm text-sm bg-stone-50/70 dark:bg-stone-950/35 border-stone-200/80 dark:border-stone-800/80"
      : null;
  const manuscriptSurface =
    noteUiVariant === "manuscript"
      ? isReading
        ? "rounded-md px-4 py-3 ink-rule-bottom ms-note-hit ms-ink-group relative overflow-visible"
        : "rounded-md px-3 py-2.5 text-sm ink-rule-bottom ms-note-hit ms-ink-group relative overflow-visible"
      : null;

  return (
    <div
      className={cn(
        manuscriptSurface ??
          marginSurface ??
          (isReading
            ? "border rounded-xl px-4 py-3 shadow-sm bg-card border-border"
            : "border rounded-lg px-3 py-2.5 shadow-sm text-sm bg-card/95 border-border/90"),
        noteUiVariant === "margin" && "note-grain",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <NoteContent
          content={note.content}
          body={note.body}
          density={density}
          currentChapter={currentChapter}
          uiVariant={noteUiVariant}
          className={isReading ? "flex-1 text-foreground" : "flex-1"}
        />
        <NoteCardActions onEdit={onEdit} onDelete={onDelete} />
      </div>
      <NoteTagList
        tags={note.tags}
        size={isReading ? "sm" : "xs"}
        className="mt-2"
      />
    </div>
  );
}
