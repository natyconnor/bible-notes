import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserId } from "./lib/auth";

const MAX_DESCRIPTION_LENGTH = 10_000;
const MAX_LOGS_LENGTH = 500_000;

const feedbackKind = v.union(v.literal("bug"), v.literal("feature"));

export const generateFeedbackUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    await getCurrentUserId(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const submitFeedback = mutation({
  args: {
    kind: feedbackKind,
    description: v.string(),
    path: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    logsText: v.optional(v.string()),
    screenshotId: v.optional(v.id("_storage")),
  },
  returns: v.id("feedbackReports"),
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);

    const description = args.description.trim();
    if (description.length === 0) {
      throw new Error("Description is required");
    }
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error("Description is too long");
    }

    let path: string | undefined = args.path?.trim();
    if (path !== undefined && path.length === 0) path = undefined;
    if (path !== undefined && path.length > 2048) {
      throw new Error("Path is too long");
    }

    let userAgent: string | undefined = args.userAgent?.trim();
    if (userAgent !== undefined && userAgent.length === 0)
      userAgent = undefined;
    if (userAgent !== undefined && userAgent.length > 2048) {
      throw new Error("User agent is too long");
    }

    let logsText = args.logsText;
    let screenshotId = args.screenshotId;

    if (args.kind === "feature") {
      logsText = undefined;
      screenshotId = undefined;
    } else {
      if (logsText !== undefined) {
        if (logsText.length > MAX_LOGS_LENGTH) {
          throw new Error("Logs text is too long");
        }
        if (logsText.trim().length === 0) {
          logsText = undefined;
        }
      }
    }

    return await ctx.db.insert("feedbackReports", {
      userId,
      kind: args.kind,
      description,
      createdAt: Date.now(),
      path,
      userAgent,
      logsText,
      screenshotId,
    });
  },
});
