import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getById = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const search = query({
  args: { query: v.string(), tag: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("notes")
      .withSearchIndex("search_content", (search) =>
        search.search("content", args.query)
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
    const notes = await ctx.db.query("notes").collect()
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
    const now = Date.now()
    return await ctx.db.insert("notes", {
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
    const { id, ...fields } = args
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() })
  },
})

export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
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
