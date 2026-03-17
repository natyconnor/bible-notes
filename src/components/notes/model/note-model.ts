import type { Id } from "../../../../convex/_generated/dataModel";
import type {
  ChapterNoteEntry,
  NoteSummary,
} from "../../../../convex/lib/publicValues";
import type { NoteBody } from "@/lib/note-inline-content";
import type { VerseRef } from "@/lib/verse-ref-utils";

export interface NoteWithRef {
  noteId: Id<"notes">;
  content: string;
  body?: NoteBody;
  tags: string[];
  verseRef: VerseRef;
  createdAt: number;
}

function toNoteWithRef(
  note: NoteSummary,
  ref: ChapterNoteEntry["verseRef"],
): NoteWithRef {
  return {
    noteId: note._id,
    content: note.content,
    ...(note.body ? { body: note.body } : {}),
    tags: note.tags,
    verseRef: {
      book: ref.book,
      chapter: ref.chapter,
      startVerse: ref.startVerse,
      endVerse: ref.endVerse,
    },
    createdAt: note.createdAt,
  };
}

export function buildNotesByVerseRange(
  chapterNotes: ChapterNoteEntry[] | undefined,
): Map<string, NoteWithRef[]> {
  const map = new Map<string, NoteWithRef[]>();
  if (!chapterNotes) return map;

  for (const entry of chapterNotes) {
    const ref = entry.verseRef;
    const key = `${ref.startVerse}-${ref.endVerse}`;
    const existing = map.get(key) ?? [];
    for (const note of entry.notes) {
      if (!existing.some((n) => n.noteId === note._id)) {
        existing.push(toNoteWithRef(note, ref));
      }
    }
    map.set(key, existing);
  }
  return map;
}

export function buildSingleVerseNotes(
  chapterNotes: ChapterNoteEntry[] | undefined,
): Map<number, NoteWithRef[]> {
  const map = new Map<number, NoteWithRef[]>();
  if (!chapterNotes) return map;

  for (const entry of chapterNotes) {
    const ref = entry.verseRef;
    if (ref.startVerse !== ref.endVerse) continue;
    const existing = map.get(ref.startVerse) ?? [];
    for (const note of entry.notes) {
      if (!existing.some((n) => n.noteId === note._id)) {
        existing.push(toNoteWithRef(note, ref));
      }
    }
    map.set(ref.startVerse, existing);
  }
  return map;
}

export function buildPassageNotesByAnchor(
  chapterNotes: ChapterNoteEntry[] | undefined,
): Map<number, NoteWithRef[]> {
  const map = new Map<number, NoteWithRef[]>();
  if (!chapterNotes) return map;

  for (const entry of chapterNotes) {
    const ref = entry.verseRef;
    if (ref.startVerse === ref.endVerse) continue;
    const existing = map.get(ref.startVerse) ?? [];
    for (const note of entry.notes) {
      if (!existing.some((n) => n.noteId === note._id)) {
        existing.push(toNoteWithRef(note, ref));
      }
    }
    map.set(ref.startVerse, existing);
  }
  return map;
}

export function buildVerseToPassageAnchor(
  chapterNotes: ChapterNoteEntry[] | undefined,
): Map<number, number> {
  const map = new Map<number, number>();
  if (!chapterNotes) return map;

  for (const entry of chapterNotes) {
    const ref = entry.verseRef;
    if (ref.startVerse === ref.endVerse) continue;
    for (let v = ref.startVerse; v <= ref.endVerse; v++) {
      map.set(v, ref.startVerse);
    }
  }
  return map;
}
