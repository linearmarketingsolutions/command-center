import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import {
  seedActivities,
  seedCalendarEvents,
  seedContacts,
  seedContentDrafts,
  seedEcosystemProducts,
  seedProjects,
  seedTasks,
} from "./seedData";

/**
 * Seed the database with sample data
 * Run with: npx convex run seed:seedData
 */

async function getOrCreateTestUser(ctx: any): Promise<string> {
  // Try to find an existing user
  const existingUsers = await ctx.db.query("users").take(1);
  
  if (existingUsers.length > 0) {
    return existingUsers[0]._id;
  }
  
  // Create a test user
  const userId = await ctx.db.insert("users", {
    email: "test@example.com",
    name: "Test User",
    role: "admin",
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
  });
  
  return userId;
}

export const seedData = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    counts: v.object({
      activities: v.number(),
      calendarEvents: v.number(),
      contacts: v.number(),
      contentDrafts: v.number(),
      ecosystemProducts: v.number(),
      projects: v.number(),
      tasks: v.number(),
    }),
  }),
  handler: async (ctx: any, args: any) => {
    // Get or create a test user ID
    const userId = args.userId || (await getOrCreateTestUser(ctx));

    // Seed all data
    const results = {
      activities: await seedActivities(ctx, userId),
      calendarEvents: await seedCalendarEvents(ctx, userId),
      contacts: await seedContacts(ctx, userId),
      contentDrafts: await seedContentDrafts(ctx, userId),
      ecosystemProducts: await seedEcosystemProducts(ctx, userId),
      projects: await seedProjects(ctx, userId),
      tasks: await seedTasks(ctx, userId),
    };

    return {
      success: true,
      message: "Database seeded successfully",
      counts: {
        activities: results.activities.length,
        calendarEvents: results.calendarEvents.length,
        contacts: results.contacts.length,
        contentDrafts: results.contentDrafts.length,
        ecosystemProducts: results.ecosystemProducts.length,
        projects: results.projects.length,
        tasks: results.tasks.length,
      },
    };
  },
});
