import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Command Center - Convex Schema
 * Production-ready schema for the AI Command Center application
 */

export default defineSchema({
  /**
   * Users - Authentication and user profiles
   */
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    role: v.union(
      v.literal("admin"),
      v.literal("user"),
      v.literal("viewer")
    ),
    preferences: v.optional(v.record(v.string(), v.any())),
    lastLoginAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  /**
   * Projects - Project organization for tasks
   */
  projects: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("archived"),
      v.literal("completed")
    ),
    color: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_status", ["userId", "status"]),

  /**
   * Activities - User activity logs and history
   */
  activities: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("task_created"),
      v.literal("task_completed"),
      v.literal("meeting_scheduled"),
      v.literal("content_created"),
      v.literal("contact_added"),
      v.literal("product_added"),
      v.literal("login"),
      v.literal("other")
    ),
    title: v.string(),
    description: v.optional(v.string()),
    metadata: v.optional(v.record(v.string(), v.any())),
    timestamp: v.number(), // Unix timestamp
  })
    .index("by_userId", ["userId"])
    .index("by_userId_timestamp", ["userId", "timestamp"])
    .index("by_type", ["type"])
    .index("by_timestamp", ["timestamp"]),

  /**
   * Calendar Events - Scheduled meetings and events
   */
  calendarEvents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(), // Unix timestamp
    endTime: v.number(), // Unix timestamp
    timezone: v.string(),
    location: v.optional(v.string()),
    attendees: v.optional(v.array(v.string())), // Array of email addresses
    isAllDay: v.optional(v.boolean()),
    recurrence: v.optional(v.string()), // RRULE format
    source: v.optional(v.union(
      v.literal("google"),
      v.literal("outlook"),
      v.literal("apple"),
      v.literal("manual")
    )),
    externalId: v.optional(v.string()), // ID from external calendar
    status: v.union(
      v.literal("confirmed"),
      v.literal("tentative"),
      v.literal("cancelled")
    ),
    color: v.optional(v.string()),
    reminders: v.optional(v.array(v.number())), // Minutes before event
  })
    .index("by_userId", ["userId"])
    .index("by_userId_startTime", ["userId", "startTime"])
    .index("by_startTime", ["startTime"])
    .index("by_externalId", ["externalId"])
    .index("by_userId_status", ["userId", "status"]),

  /**
   * Tasks - Todo items and task management
   */
  tasks: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("archived")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    dueDate: v.optional(v.number()), // Unix timestamp
    completedAt: v.optional(v.number()), // Unix timestamp
    tags: v.optional(v.array(v.string())),
    projectId: v.optional(v.id("projects")),
    assignedTo: v.optional(v.id("users")),
    createdBy: v.id("users"),
    parentTaskId: v.optional(v.id("tasks")), // For subtasks
    estimatedMinutes: v.optional(v.number()),
    actualMinutes: v.optional(v.number()),
    recurrence: v.optional(v.string()),
    source: v.optional(v.union(
      v.literal("manual"),
      v.literal("slack"),
      v.literal("email"),
      v.literal("meeting"),
      v.literal("ai_generated")
    )),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_priority", ["userId", "priority"])
    .index("by_userId_dueDate", ["userId", "dueDate"])
    .index("by_userId_status_dueDate", ["userId", "status", "dueDate"])
    .index("by_projectId", ["projectId"])
    .index("by_assignedTo", ["assignedTo"])
    .index("by_parentTaskId", ["parentTaskId"]),

  /**
   * Contacts - CRM contact management
   */
  contacts: defineTable({
    userId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.union(
      v.literal("lead"),
      v.literal("prospect"),
      v.literal("customer"),
      v.literal("partner"),
      v.literal("vendor"),
      v.literal("other")
    ),
    source: v.optional(v.string()),
    notes: v.optional(v.string()),
    lastContactedAt: v.optional(v.number()),
    nextFollowUpAt: v.optional(v.number()),
    socialLinks: v.optional(v.object({
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      github: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    customFields: v.optional(v.record(v.string(), v.any())),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_status", ["userId", "status"])
    .index("by_email", ["email"])
    .index("by_userId_company", ["userId", "company"])
    .index("by_userId_lastContacted", ["userId", "lastContactedAt"])
    .index("by_nextFollowUp", ["nextFollowUpAt"])
    .searchIndex("search_name", {
      searchField: "firstName",
      filterFields: ["userId", "status"],
    }),

  /**
   * Content Drafts - Content creation and management
   */
  contentDrafts: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("blog_post"),
      v.literal("social_post"),
      v.literal("email"),
      v.literal("newsletter"),
      v.literal("video_script"),
      v.literal("podcast_script"),
      v.literal("landing_page"),
      v.literal("ad_copy"),
      v.literal("other")
    ),
    platform: v.optional(v.union(
      v.literal("twitter"),
      v.literal("linkedin"),
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("tiktok"),
      v.literal("youtube"),
      v.literal("blog"),
      v.literal("email"),
      v.literal("other")
    )),
    status: v.union(
      v.literal("draft"),
      v.literal("review"),
      v.literal("approved"),
      v.literal("scheduled"),
      v.literal("published"),
      v.literal("archived")
    ),
    scheduledFor: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    publishedUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    aiGenerated: v.optional(v.boolean()),
    aiPrompt: v.optional(v.string()),
    tone: v.optional(v.string()),
    targetAudience: v.optional(v.string()),
    wordCount: v.optional(v.number()),
    metadata: v.optional(v.record(v.string(), v.any())),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_type", ["userId", "type"])
    .index("by_status_scheduledFor", ["status", "scheduledFor"])
    .index("by_scheduledFor", ["scheduledFor"])
    .index("by_publishedAt", ["publishedAt"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["userId", "type", "status"],
    }),

  /**
   * Ecosystem Products - Product and resource catalog
   */
  ecosystemProducts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("software"),
      v.literal("service"),
      v.literal("hardware"),
      v.literal("course"),
      v.literal("book"),
      v.literal("tool"),
      v.literal("resource"),
      v.literal("template"),
      v.literal("other")
    ),
    type: v.optional(v.union(
      v.literal("own_product"),
      v.literal("affiliate"),
      v.literal("partnership"),
      v.literal("recommended")
    )),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("coming_soon"),
      v.literal("discontinued")
    ),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    url: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    features: v.optional(v.array(v.string())),
    integrations: v.optional(v.array(v.string())),
    targetAudience: v.optional(v.array(v.string())),
    metrics: v.optional(v.object({
      users: v.optional(v.number()),
      rating: v.optional(v.number()),
      reviews: v.optional(v.number()),
    })),
    launchDate: v.optional(v.number()),
    sunsetDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_category", ["userId", "category"])
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_type", ["userId", "type"])
    .index("by_category_status", ["category", "status"])
    .index("by_launchDate", ["launchDate"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["userId", "category", "status"],
    }),
});
