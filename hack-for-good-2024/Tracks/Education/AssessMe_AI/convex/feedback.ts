import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const feedbackStore = mutation({
  args: {
    name: v.optional(v.string()),
    jobProfile: v.optional(v.string()),
    companyName: v.optional(v.string()),
    jobtype: v.optional(v.string()),
    jobRequirements: v.optional(v.string()),
    level: v.optional(v.string()),
    questions: v.array(
      v.object({
        question: v.string(),
        answer: v.string(),
        isAI: v.boolean(),
        strengths: v.array(
          v.object({
            feedbackHeading: v.string(),
            feedback: v.string(),
          })
        ),
        improvements: v.array(
          v.object({
            feedbackHeading: v.string(),
            feedback: v.string(),
          })
        ),
      })
    ),
    overview: v.optional(v.string()),
    analytics: v.array(
      v.object({
        parameter: v.string(),
        points: v.number(),
        maxPoints: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;

    const feedback = await ctx.db.insert("feedback", {
      name: args.name || "null",
      jobProfile: args.jobProfile || "null",
      companyName: args.companyName || "null",
      jobtype: args.jobtype || "null",
      jobRequirements: args.jobRequirements || "null",
      questions: args.questions || [],
      level: args.level || "null",
      overview: args.overview || "null",
      analytics: args.analytics || [],
      userId,
    });
    return feedback;
  },
});

export const getFeedbackById = query({
  args: { _id: v.id("feedback") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const FeedbackInfo = await ctx.db
      .query("feedback")
      .filter((q) => q.eq(q.field("_id"), args._id))
      .collect();
    return FeedbackInfo;
  },
});
