import { query, mutation } from "./_generated/server"
import type { Doc } from "./_generated/dataModel"
import { v } from "convex/values"
import { getCurrentUserId, getCurrentUserIdOrNull } from "./lib/auth"

function isNote(doc: unknown): doc is Doc<"notes"> {
  return (
    doc !== null &&
    typeof doc === "object" &&
    "content" in doc &&
    "tags" in doc &&
    "createdAt" in doc
  )
}

export const link = mutation({
  args: { noteId: v.id("notes"), verseRefId: v.id("verseRefs") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    const existing = await ctx.db
      .query("noteVerseLinks")
      .withIndex("by_noteId_verseRefId", (q) =>
        q.eq("noteId", args.noteId).eq("verseRefId", args.verseRefId)
      )
      .first()
    if (existing) return existing._id
    return await ctx.db.insert("noteVerseLinks", { ...args, userId })
  },
})

export const unlink = mutation({
  args: { noteId: v.id("notes"), verseRefId: v.id("verseRefs") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    const existing = await ctx.db
      .query("noteVerseLinks")
      .withIndex("by_noteId_verseRefId", (q) =>
        q.eq("noteId", args.noteId).eq("verseRefId", args.verseRefId)
      )
      .first()
    if (existing && existing.userId === userId) {
      await ctx.db.delete(existing._id)
    }
  },
})

export const getNotesForVerseRef = query({
  args: { verseRefId: v.id("verseRefs") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserIdOrNull(ctx)
    if (!userId) return []
    const links = await ctx.db
      .query("noteVerseLinks")
      .withIndex("by_verseRefId", (q) => q.eq("verseRefId", args.verseRefId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect()
    const rawNotes = await Promise.all(links.map((l) => ctx.db.get(l.noteId)))
    return rawNotes.filter(isNote)
  },
})

export const getVerseRefsForNote = query({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserIdOrNull(ctx)
    if (!userId) return []
    const links = await ctx.db
      .query("noteVerseLinks")
      .withIndex("by_noteId", (q) => q.eq("noteId", args.noteId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect()
    const refs = await Promise.all(links.map((l) => ctx.db.get(l.verseRefId)))
    return refs.filter(Boolean)
  },
})

export const getNotesForChapter = query({
  args: { book: v.string(), chapter: v.number() },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserIdOrNull(ctx)
    if (!userId) return []
    const verseRefs = await ctx.db
      .query("verseRefs")
      .withIndex("by_userId_book_chapter", (q) =>
        q.eq("userId", userId).eq("book", args.book).eq("chapter", args.chapter)
      )
      .collect()

    const result: Array<{
      verseRef: (typeof verseRefs)[0]
      notes: Doc<"notes">[]
    }> = []

    for (const ref of verseRefs) {
      const links = await ctx.db
        .query("noteVerseLinks")
        .withIndex("by_verseRefId", (q) => q.eq("verseRefId", ref._id))
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect()
      const rawNotes = await Promise.all(links.map((l) => ctx.db.get(l.noteId)))
      const notes = rawNotes.filter(isNote)
      if (notes.length > 0) {
        result.push({ verseRef: ref, notes })
      }
    }

    return result
  },
})
