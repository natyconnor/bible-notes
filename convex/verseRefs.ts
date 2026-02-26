import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const findOrCreate = mutation({
  args: {
    book: v.string(),
    chapter: v.number(),
    startVerse: v.number(),
    endVerse: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("verseRefs")
      .withIndex("by_book_chapter_verses", (q) =>
        q
          .eq("book", args.book)
          .eq("chapter", args.chapter)
          .eq("startVerse", args.startVerse)
          .eq("endVerse", args.endVerse)
      )
      .first()
    if (existing) return existing._id
    return await ctx.db.insert("verseRefs", args)
  },
})

export const getByBookChapter = query({
  args: { book: v.string(), chapter: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("verseRefs")
      .withIndex("by_book_chapter", (q) =>
        q.eq("book", args.book).eq("chapter", args.chapter)
      )
      .collect()
  },
})
