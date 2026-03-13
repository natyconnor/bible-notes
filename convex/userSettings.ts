import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import type { MutationCtx } from "./_generated/server"
import { getCurrentUserId, getCurrentUserIdOrNull } from "./lib/auth"
import { resolveOnboardingStatus } from "./lib/onboarding"

const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

async function getOrCreateUserSettings(
  ctx: Pick<MutationCtx, "db">,
  userId: Id<"users">,
  now: number
) {
  const existing = await ctx.db
    .query("userSettings")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first()
  if (existing) return existing

  const settingsId = await ctx.db.insert("userSettings", {
    userId,
    createdAt: now,
    updatedAt: now,
  })
  return await ctx.db.get(settingsId)
}

const onboardingStatusValue = v.object({
  needsStarterTagsSetup: v.boolean(),
  starterTagsSetupCompletedAt: v.optional(v.number()),
  mainOnboardingCompletedAt: v.optional(v.number()),
  advancedSearchOnboardingCompletedAt: v.optional(v.number()),
  categoryColors: v.record(v.string(), v.string()),
})

export const getOnboardingStatus = query({
  args: {},
  returns: onboardingStatusValue,
  handler: async (ctx) => {
    const userId = await getCurrentUserIdOrNull(ctx)
    if (!userId) {
      return resolveOnboardingStatus(null)
    }

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()

    return resolveOnboardingStatus(settings)
  },
})

export const completeStarterTagsSetup = mutation({
  args: {},
  returns: v.object({
    completedAt: v.number(),
  }),
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx)
    const now = Date.now()
    const settings = await getOrCreateUserSettings(ctx, userId, now)

    if (!settings) {
      throw new Error("Unable to initialize user settings")
    }

    await ctx.db.patch(settings._id, {
      starterTagsSetupCompletedAt: now,
      updatedAt: now,
    })

    return {
      completedAt: now,
    }
  },
})

export const completeMainOnboarding = mutation({
  args: {},
  returns: v.object({
    completedAt: v.number(),
  }),
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx)
    const now = Date.now()
    const settings = await getOrCreateUserSettings(ctx, userId, now)

    if (!settings) {
      throw new Error("Unable to initialize user settings")
    }

    await ctx.db.patch(settings._id, {
      mainOnboardingCompletedAt: now,
      updatedAt: now,
    })

    return {
      completedAt: now,
    }
  },
})

export const completeAdvancedSearchOnboarding = mutation({
  args: {},
  returns: v.object({
    completedAt: v.number(),
  }),
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx)
    const now = Date.now()
    const settings = await getOrCreateUserSettings(ctx, userId, now)

    if (!settings) {
      throw new Error("Unable to initialize user settings")
    }

    await ctx.db.patch(settings._id, {
      advancedSearchOnboardingCompletedAt: now,
      updatedAt: now,
    })

    return {
      completedAt: now,
    }
  },
})

export const setStarterTagCategoryColor = mutation({
  args: {
    categoryId: v.string(),
    color: v.string(),
  },
  returns: v.object({
    categoryColors: v.record(v.string(), v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    const now = Date.now()
    const settings = await getOrCreateUserSettings(ctx, userId, now)

    if (!settings) {
      throw new Error("Unable to initialize user settings")
    }
    if (!HEX_COLOR_PATTERN.test(args.color)) {
      throw new Error("Invalid color format")
    }

    const nextColors = {
      ...(settings.starterTagCategoryColors ?? {}),
      [args.categoryId]: args.color,
    }

    await ctx.db.patch(settings._id, {
      starterTagCategoryColors: nextColors,
      updatedAt: now,
    })

    return {
      categoryColors: nextColors,
    }
  },
})
