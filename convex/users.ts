import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserIdOrNull, getCurrentUserId } from "./lib/auth";
import { deleteAllDataForUser } from "./lib/deleteAccount";

const currentUserValue = v.object({
  id: v.id("users"),
  email: v.union(v.string(), v.null()),
  name: v.union(v.string(), v.null()),
  image: v.union(v.string(), v.null()),
});

function readOptionalString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export const getMe = query({
  args: {},
  returns: v.union(currentUserValue, v.null()),
  handler: async (ctx) => {
    const userId = await getCurrentUserIdOrNull(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    return {
      id: user._id,
      email: "email" in user ? readOptionalString(user.email) : null,
      name: "name" in user ? readOptionalString(user.name) : null,
      image: "image" in user ? readOptionalString(user.image) : null,
    };
  },
});

export const deleteMyAccount = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    await deleteAllDataForUser(ctx, userId);
    return null;
  },
});
