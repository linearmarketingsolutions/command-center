// Enhanced Task System - Component Exports

// Core data types and context (updated in data-context.tsx)
export type {
  Task,
  TaskStatus,
  TaskProjectPersonal,
  TaskBusiness,
  TaskPriority,
  TaskFilters,
  Client,
} from "@/components/data-context";

// Task Filter Components
export { TaskFilterBar, TaskFilterPills } from "@/components/task-filters";

// Task Views
export { TaskViews } from "@/components/task-views";

// Task Modal (Create/Edit)
export { TaskModal } from "@/components/task-modal";

// Quick Add Client
export { 
  QuickAddClientModal, 
  QuickAddClientButton 
} from "@/components/quick-add-client-modal";

// Task Form
export { AddTaskForm, AddTaskButton } from "@/components/add-task-form";

// Updated Editable Tasks (compatible with new schema)
export { EditableTasks } from "@/components/editable-tasks";
