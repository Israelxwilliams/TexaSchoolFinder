import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Fetch all schools
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("schools").collect();
  },
});

// Fetch a single school by its original schoolId
export const getById = query({
  args: { schoolId: v.string() },
  handler: async (ctx, { schoolId }) => {
    return await ctx.db
      .query("schools")
      .withIndex("by_schoolId", (q) => q.eq("schoolId", schoolId))
      .first();
  },
});

// Upsert a school
export const upsert = mutation({
  args: { school: v.any() },
  handler: async (ctx, { school }) => {
    const existing = await ctx.db
      .query("schools")
      .withIndex("by_schoolId", (q) => q.eq("schoolId", school.id))
      .first();

    const doc = { ...school, schoolId: school.id };
    delete doc.id;

    if (existing) {
      await ctx.db.patch(existing._id, doc);
    } else {
      await ctx.db.insert("schools", doc);
    }
  },
});

// Clear all schools from the database
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("schools").collect();
    await Promise.all(all.map((s) => ctx.db.delete(s._id)));
    return { deleted: all.length };
  },
});
