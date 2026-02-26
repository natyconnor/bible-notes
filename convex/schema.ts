import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  notes: defineTable({
    content: v.string(),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_updatedAt", ["updatedAt"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["tags"],
    }),

  verseRefs: defineTable({
    book: v.string(),
    chapter: v.number(),
    startVerse: v.number(),
    endVerse: v.number(),
  })
    .index("by_book_chapter", ["book", "chapter"])
    .index("by_book_chapter_verses", [
      "book",
      "chapter",
      "startVerse",
      "endVerse",
    ]),

  noteVerseLinks: defineTable({
    noteId: v.id("notes"),
    verseRefId: v.id("verseRefs"),
  })
    .index("by_noteId", ["noteId"])
    .index("by_verseRefId", ["verseRefId"])
    .index("by_noteId_verseRefId", ["noteId", "verseRefId"]),

  verseLinks: defineTable({
    verseRefId1: v.id("verseRefs"),
    verseRefId2: v.id("verseRefs"),
  })
    .index("by_verseRefId1", ["verseRefId1"])
    .index("by_verseRefId2", ["verseRefId2"]),

  gospelParallels: defineTable({
    label: v.string(),
    passages: v.array(
      v.object({
        book: v.string(),
        chapter: v.number(),
        startVerse: v.number(),
        endVerse: v.number(),
      })
    ),
  }).index("by_label", ["label"]),
})
