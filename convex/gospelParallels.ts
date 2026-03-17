import { query } from "./_generated/server";
import { v } from "convex/values";

import { gospelParallelValue } from "./lib/publicValues";

export const findParallels = query({
  args: {
    book: v.string(),
    chapter: v.number(),
  },
  returns: v.array(gospelParallelValue),
  handler: async (ctx, args) => {
    // Small static dataset, collecting all is fine
    const all = await ctx.db.query("gospelParallels").collect();
    return all
      .filter((parallel) =>
        parallel.passages.some(
          (passage) =>
            passage.book === args.book && passage.chapter === args.chapter,
        ),
      )
      .map((parallel) => ({
        _id: parallel._id,
        label: parallel.label,
        passages: parallel.passages,
      }));
  },
});
