import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserId, getCurrentUserIdOrNull } from "./lib/auth"

export const getById = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserIdOrNull(ctx)
    if (!userId) return null
    const note = await ctx.db.get(args.id)
    if (!note) return null
    if (note.userId !== userId) return null
    return note
  },
})

export const search = query({
  args: { query: v.string(), tag: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserIdOrNull(ctx)
    if (!userId) return []
    const results = await ctx.db
      .query("notes")
      .withSearchIndex("search_content", (search) =>
        search.search("content", args.query).eq("userId", userId)
      )
      .take(50)
    if (args.tag) {
      return results.filter((note) => note.tags.includes(args.tag!))
    }
    return results
  },
})

export const allTags = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserIdOrNull(ctx)
    if (!userId) return []
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect()
    const tagSet = new Set<string>()
    for (const note of notes) {
      for (const tag of note.tags) {
        tagSet.add(tag)
      }
    }
    return Array.from(tagSet).sort()
  },
})

export const create = mutation({
  args: { content: v.string(), tags: v.array(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    const now = Date.now()
    return await ctx.db.insert("notes", {
      userId,
      content: args.content,
      tags: args.tags,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("notes"),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    const note = await ctx.db.get(args.id)
    if (!note || note.userId !== userId) {
      throw new Error("Note not found or access denied")
    }
    const { id, ...fields } = args
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() })
  },
})

export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    const note = await ctx.db.get(args.id)
    if (!note || note.userId !== userId) {
      throw new Error("Note not found or access denied")
    }
    const links = await ctx.db
      .query("noteVerseLinks")
      .withIndex("by_noteId", (q) => q.eq("noteId", args.id))
      .collect()
    for (const link of links) {
      await ctx.db.delete(link._id)
    }
    await ctx.db.delete(args.id)
  },
})
