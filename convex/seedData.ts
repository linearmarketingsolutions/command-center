import { v } from "convex/values";

/**
 * Command Center - Seed Data
 * Sample data for testing the Convex backend
 */

export async function seedActivities(ctx: any, userId: string) {
  const activities = [
    {
      userId,
      type: "task_created" as const,
      title: "Created onboarding checklist",
      description: "Set up new client onboarding workflow",
      metadata: { projectId: "proj_001", priority: "high" },
      timestamp: Date.now() - 86400000 * 2,
    },
    {
      userId,
      type: "meeting_scheduled" as const,
      title: "Weekly team sync",
      description: "Recurring Monday team meeting",
      metadata: { attendees: 5, duration: 30 },
      timestamp: Date.now() - 86400000,
    },
  ];
  
  const ids = [];
  for (const activity of activities) {
    const id = await ctx.db.insert("activities", activity);
    ids.push(id);
  }
  return ids;
}

export async function seedCalendarEvents(ctx: any, userId: string) {
  const events = [
    {
      userId,
      title: "Product Strategy Meeting",
      description: "Q1 roadmap planning session",
      startTime: Date.now() + 3600000,
      endTime: Date.now() + 7200000,
      timezone: "America/Los_Angeles",
      location: "Conference Room A",
      attendees: ["alice@example.com", "bob@example.com"],
      isAllDay: false,
      status: "confirmed" as const,
      color: "#4285F4",
      recurrence: null,
      reminders: [15, 30],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];
  
  const ids = [];
  for (const event of events) {
    const id = await ctx.db.insert("calendarEvents", event);
    ids.push(id);
  }
  return ids;
}

export async function seedContacts(ctx: any, userId: string) {
  const contacts = [
    {
      userId,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (555) 123-4567",
      company: "TechCorp Inc",
      role: "Product Manager",
      status: "lead" as const,
      source: "website",
      tags: ["enterprise", "saas"],
      notes: "Interested in AI automation solutions",
      lastContactedAt: Date.now() - 86400000,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];
  
  const ids = [];
  for (const contact of contacts) {
    const id = await ctx.db.insert("contacts", contact);
    ids.push(id);
  }
  return ids;
}

export async function seedContentDrafts(ctx: any, userId: string) {
  const drafts = [
    {
      userId,
      title: "AI Automation Best Practices",
      content: "# AI Automation Best Practices\n\nIn this guide, we'll explore...",
      format: "markdown" as const,
      platform: "blog" as const,
      status: "draft" as const,
      tags: ["ai", "automation", "productivity"],
      metadata: { wordCount: 1250, readingTime: 5 },
      scheduledFor: null,
      publishedAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];
  
  const ids = [];
  for (const draft of drafts) {
    const id = await ctx.db.insert("contentDrafts", draft);
    ids.push(id);
  }
  return ids;
}

export async function seedEcosystemProducts(ctx: any, userId: string) {
  const products = [
    {
      userId,
      name: "Linear Marketing Solutions",
      description: "Full-service marketing agency for SMBs",
      category: "service" as const,
      type: "own_product" as const,
      status: "active" as const,
      price: 3000,
      currency: "USD",
      url: "https://linearmarketingsolutions.com",
      tags: ["marketing", "agency", "b2b"],
      features: ["Strategy", "Creative", "AI Solutions", "Web Dev"],
      createdAt: Date.now(),
    },
  ];
  
  const ids = [];
  for (const product of products) {
    const id = await ctx.db.insert("ecosystemProducts", product);
    ids.push(id);
  }
  return ids;
}

export async function seedProjects(ctx: any, userId: string) {
  const projects = [
    {
      userId,
      name: "Client Onboarding Automation",
      description: "Automate the client onboarding workflow",
      status: "active" as const,
      color: "#00d4ff",
      createdAt: Date.now(),
    },
  ];
  
  const ids = [];
  for (const project of projects) {
    const id = await ctx.db.insert("projects", project);
    ids.push(id);
  }
  return ids;
}

export async function seedTasks(ctx: any, userId: string) {
  const tasks = [
    {
      userId,
      title: "Review Q1 marketing strategy",
      description: "Analyze current performance and adjust tactics",
      status: "in_progress" as const,
      priority: "high" as const,
      dueDate: Date.now() + 86400000 * 3,
      tags: ["strategy", "q1", "marketing"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];
  
  const ids = [];
  for (const task of tasks) {
    const id = await ctx.db.insert("tasks", task);
    ids.push(id);
  }
  return ids;
}
