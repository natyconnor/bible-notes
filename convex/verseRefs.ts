import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserId, getCurrentUserIdOrNull } from "./lib/auth"

export const findOrCreate = mutation({
  args: {
    book: v.string(),
    chapter: v.number(),
    startVerse: v.number(),
    endVerse: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    const existing = await ctx.db
      .query("verseRefs")
      .withIndex("by_userId_book_chapter_verses", (q) =>
        q
          .eq("userId", userId)
          .eq("book", args.book)
          .eq("chapter", args.chapter)
          .eq("startVerse", args.startVerse)
          .eq("endVerse", args.endVerse)
      )
      .first()
    if (existing) return existing._id
    return await ctx.db.insert("verseRefs", { ...args, userId })
  },
})

export const getByBookChapter = query({
  args: { book: v.string(), chapter: v.number() },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserIdOrNull(ctx)
    if (!userId) return []
    return await ctx.db
      .query("verseRefs")
      .withIndex("by_userId_book_chapter", (q) =>
        q.eq("userId", userId).eq("book", args.book).eq("chapter", args.chapter)
      )
      .collect()
  },
})
