# Command Center - Convex Backend

Production-ready Convex backend for the AI Command Center application.

## Schema Overview

### Tables

1. **users** - Authentication and user profiles
2. **projects** - Project organization for tasks
3. **activities** - User activity logs and history
4. **calendarEvents** - Scheduled meetings and events
5. **tasks** - Todo items and task management
6. **contacts** - CRM contact management
7. **contentDrafts** - Content creation and management
8. **ecosystemProducts** - Product and resource catalog

## File Structure

```
convex/
├── schema.ts       # Database schema definitions
├── seed.ts         # Seed function to populate test data
├── seedData.ts     # Sample data for testing
└── README.md       # This file
```

## Setup

### 1. Install Convex

```bash
npm install convex
# or
yarn add convex
# or
pnpm add convex
```

### 2. Initialize Convex

```bash
npx convex dev
```

### 3. Push Schema

```bash
npx convex push
```

### 4. Seed Test Data (Development Only)

```bash
# For development
npx convex run seed:seedData

# For production (use with caution!)
npx convex run seed:seedData --prod
```

Optional: Specify a user ID
```bash
npx convex run seed:seedData '{"userId": "your-user-id"}'
```

## Indexes Reference

### users
- `by_email` - Lookup by email address
- `by_role` - Filter by user role

### projects
- `by_userId` - User's projects
- `by_userId_status` - Filter by status

### activities
- `by_userId` - User's activities
- `by_userId_timestamp` - Chronological feed
- `by_type` - Filter by activity type
- `by_timestamp` - Global timeline

### calendarEvents
- `by_userId` - User's events
- `by_userId_startTime` - Upcoming events
- `by_startTime` - Global calendar view
- `by_externalId` - Sync with external calendars
- `by_userId_status` - Filter by status

### tasks
- `by_userId` - User's tasks
- `by_userId_status` - Filter by status
- `by_userId_priority` - Priority sorting
- `by_userId_dueDate` - Due date sorting
- `by_userId_status_dueDate` - Combined filter/sort
- `by_projectId` - Project tasks
- `by_assignedTo` - Assigned tasks
- `by_parentTaskId` - Subtasks

### contacts
- `by_userId` - User's contacts
- `by_userId_status` - CRM pipeline
- `by_email` - Unique lookup
- `by_userId_company` - Company grouping
- `by_userId_lastContacted` - Follow-up queue
- `by_nextFollowUp` - Scheduled follow-ups
- `search_name` - Full-text search

### contentDrafts
- `by_userId` - User's content
- `by_userId_status` - Content pipeline
- `by_userId_type` - Content type filter
- `by_status_scheduledFor` - Publishing queue
- `by_scheduledFor` - Scheduled content
- `by_publishedAt` - Published content
- `search_content` - Full-text search

### ecosystemProducts
- `by_userId` - User's products
- `by_userId_category` - Category filter
- `by_userId_status` - Status filter
- `by_userId_type` - Type filter
- `by_category_status` - Catalog view
- `by_launchDate` - Product timeline
- `search_name` - Full-text search

## Type Safety

All tables are fully typed. Import types from the generated client:

```typescript
import { Doc } from "../convex/_generated/dataModel";

type Task = Doc<"tasks">;
type Contact = Doc<"contacts">;
```

## Next Steps

1. Add authentication (Clerk, Auth0, or custom)
2. Create API functions for each table
3. Set up real-time subscriptions
4. Add validation and business logic
5. Configure Convex actions for external API calls

## Deployment

```bash
npx convex deploy
```

See [Convex Documentation](https://docs.convex.dev/) for more details.
