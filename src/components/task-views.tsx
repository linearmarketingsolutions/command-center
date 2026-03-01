"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Inbox, 
  Play, 
  Clock, 
  CheckCircle2, 
  Calendar,
  AlertCircle,
  ChevronRight,
  MoreHorizontal,
  Edit2,
  Trash2,
  ArrowRight,
  Plus,
  User,
  Building2,
  Dumbbell
} from "lucide-react";
import { format, isToday, isBefore, isAfter, addDays, parseISO, isSameDay } from "date-fns";
import { useData, Task, TaskStatus, TaskFilters, TaskPriority } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { TaskFilterBar, TaskFilterPills } from "@/components/task-filters";
import { TaskDetailModal } from "@/components/task-detail-modal";
import { cn } from "@/lib/utils";

// Task Item Component
interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  compact?: boolean;
}

const statusIcons: Record<TaskStatus, React.ElementType> = {
  inbox: Inbox,
  next: Play,
  waiting: Clock,
  done: CheckCircle2,
};

const statusColors: Record<TaskStatus, string> = {
  inbox: '#8b5cf6',
  next: '#00d4ff',
  waiting: '#f59e0b',
  done: '#22c55e',
};

const priorityColors: Record<TaskPriority, string> = {
  low: '#6b7280',
  medium: '#3b82f6',
  high: '#f59e0b',
  urgent: '#ef4444',
};

const businessIcons: Record<string, React.ElementType> = {
  personal: User,
  lms: Building2,
  commit: Dumbbell,
};

const businessColors: Record<string, string> = {
  personal: '#8b5cf6',
  lms: '#00d4ff',
  commit: '#e94560',
};

function TaskItem({ task, onEdit, onDelete, onStatusChange, compact = false }: TaskItemProps) {
  const { getClientById } = useData();
  const [showActions, setShowActions] = useState(false);
  
  const client = task.clientId ? getClientById(task.clientId) : null;
  const StatusIcon = statusIcons[task.status];
  const BusinessIcon = businessIcons[task.business];
  
  const cycleStatus = () => {
    const statuses: TaskStatus[] = ['inbox', 'next', 'waiting', 'done'];
    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onStatusChange?.(task.id, nextStatus);
  };

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className={cn(
          "group flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer",
          task.status === 'done' && "opacity-50"
        )}
        onClick={() => onEdit?.(task)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); cycleStatus(); }}
          className="flex-shrink-0"
        >
          <StatusIcon 
            className="w-4 h-4" 
            style={{ color: statusColors[task.status] }} 
          />
        </button>
        <span className={cn(
          "flex-1 text-sm truncate",
          task.status === 'done' && "line-through text-gray-500"
        )}>
          {task.title}
        </span>
        {client && (
          <span className="text-[10px] text-gray-500 truncate max-w-[80px]">
            {client.name}
          </span>
        )}
        <span 
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: priorityColors[task.priority] }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "group relative p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all",
        task.status === 'done' && "opacity-60"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-3">
        {/* Status Toggle */}
        <button
          onClick={() => cycleStatus()}
          className="flex-shrink-0 mt-0.5 p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <StatusIcon 
            className="w-5 h-5" 
            style={{ color: statusColors[task.status] }} 
          />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn(
              "font-medium text-white truncate",
              task.status === 'done' && "line-through text-gray-500"
            )}>
              {task.title}
            </h4>
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1"
                >
                  <button
                    onClick={() => onEdit?.(task)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete?.(task.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {task.description && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{task.description}</p>
          )}

          {task.waitingNote && task.status === 'waiting' && (
            <div className="flex items-center gap-2 mt-2 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg w-fit">
              <Clock className="w-3 h-3" />
              {task.waitingNote}
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Business */}
            <div 
              className="flex items-center gap-1 text-xs"
              style={{ color: businessColors[task.business] }}
            >
              <BusinessIcon className="w-3 h-3" />
              <span className="capitalize">{task.business}</span>
            </div>

            {/* Client */}
            {client && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <User className="w-3 h-3" />
                {client.name}
              </div>
            )}

            {/* Project (personal only) */}
            {task.business === 'personal' && task.project && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                {task.project}
              </span>
            )}

            {/* Priority */}
            <span 
              className="text-xs px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ 
                backgroundColor: priorityColors[task.priority] + '20',
                color: priorityColors[task.priority]
              }}
            >
              {task.priority}
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                isBefore(parseISO(task.dueDate), new Date()) && !isToday(parseISO(task.dueDate)) 
                  ? "text-red-400" 
                  : "text-gray-400"
              )}>
                <Calendar className="w-3 h-3" />
                {format(parseISO(task.dueDate), 'MMM d')}
              </div>
            )}

            {/* Tags */}
            {task.tags.map(tag => (
              <span key={tag} className="text-[10px] text-gray-500">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Section Header
function SectionHeader({ 
  title, 
  count, 
  icon: Icon, 
  color = "#00d4ff",
  action
}: { 
  title: string; 
  count: number; 
  icon: React.ElementType;
  color?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div 
          className="p-1.5 rounded-lg"
          style={{ backgroundColor: color + '20' }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="font-semibold text-white">{title}</h3>
        <span className="text-sm text-gray-500">({count})</span>
      </div>
      {action}
    </div>
  );
}

// Main Task Views Component
export function TaskViews() {
  const { 
    tasks, 
    getTodayTasks, 
    getOverdueTasks, 
    getUpcomingTasks, 
    getInboxTasks,
    updateTask, 
    deleteTask 
  } = useData();
  const { getBusinessColor } = useBusinessContext();
  
  const [filters, setFilters] = useState<TaskFilters>({
    status: [],
    business: [],
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Get categorized tasks
  const todayTasks = useMemo(() => getTodayTasks(), [getTodayTasks]);
  const overdueTasks = useMemo(() => getOverdueTasks(), [getOverdueTasks]);
  const upcoming3Days = useMemo(() => getUpcomingTasks(3), [getUpcomingTasks]);
  const upcoming7Days = useMemo(() => {
    const next7 = getUpcomingTasks(7);
    const next3 = getUpcomingTasks(3);
    return next7.filter(t => !next3.includes(t));
  }, [getUpcomingTasks]);
  const futureTasks = useMemo(() => {
    const cutoff = addDays(new Date(), 7);
    return tasks.filter(t => {
      if (!t.dueDate || t.status === 'done') return false;
      return isAfter(parseISO(t.dueDate), cutoff);
    });
  }, [tasks]);
  const inboxTasks = useMemo(() => getInboxTasks(), [getInboxTasks]);

  // Apply filters to each section
  const applyFilters = (taskList: Task[]) => {
    if (filters.status.length === 0 && filters.business.length === 0 && !filters.priority && !filters.clientId) {
      return taskList;
    }
    return taskList.filter(t => {
      if (filters.status.length > 0 && !filters.status.includes(t.status)) return false;
      if (filters.business.length > 0 && !filters.business.includes(t.business)) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.clientId && t.clientId !== filters.clientId) return false;
      return true;
    });
  };

  const filteredToday = applyFilters(todayTasks);
  const filteredOverdue = applyFilters(overdueTasks);
  const filteredUpcoming3 = applyFilters(upcoming3Days);
  const filteredUpcoming7 = applyFilters(upcoming7Days);
  const filteredFuture = applyFilters(futureTasks);
  const filteredInbox = applyFilters(inboxTasks);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <TaskFilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Today + Overdue Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today */}
        <div className="space-y-3">
          <SectionHeader
            title="Today"
            count={filteredToday.length}
            icon={Calendar}
            color="#00d4ff"
          />
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filteredToday.length > 0 ? (
                filteredToday.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={deleteTask}
                    onStatusChange={(id, status) => updateTask(id, { status })}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No tasks for today</p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Overdue */}
        <div className="space-y-3">
          <SectionHeader
            title="Overdue"
            count={filteredOverdue.length}
            icon={AlertCircle}
            color="#ef4444"
          />
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filteredOverdue.length > 0 ? (
                filteredOverdue.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={deleteTask}
                    onStatusChange={(id, status) => updateTask(id, { status })}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No overdue tasks</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Upcoming 3 Days */}
      <div className="space-y-3">
        <SectionHeader
          title="Next 3 Days"
          count={filteredUpcoming3.length}
          icon={ChevronRight}
          color="#f59e0b"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredUpcoming3.length > 0 ? (
              filteredUpcoming3.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  compact
                  onEdit={setEditingTask}
                  onDelete={deleteTask}
                  onStatusChange={(id, status) => updateTask(id, { status })}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-full py-4">No upcoming tasks</p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Upcoming 7 Days */}
      <div className="space-y-3">
        <SectionHeader
          title="Next 7 Days"
          count={filteredUpcoming7.length}
          icon={ArrowRight}
          color="#8b5cf6"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredUpcoming7.length > 0 ? (
              filteredUpcoming7.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  compact
                  onEdit={setEditingTask}
                  onDelete={deleteTask}
                  onStatusChange={(id, status) => updateTask(id, { status })}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-full py-4">No tasks in this range</p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Future Tasks */}
      {filteredFuture.length > 0 && (
        <div className="space-y-3">
          <SectionHeader
            title="Future"
            count={filteredFuture.length}
            icon={Calendar}
            color="#6b7280"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredFuture.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  compact
                  onEdit={setEditingTask}
                  onDelete={deleteTask}
                  onStatusChange={(id, status) => updateTask(id, { status })}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

            <TaskDetailModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
      />

{/* Inbox */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <SectionHeader
          title="Inbox (Unfiled)"
          count={filteredInbox.length}
          icon={Inbox}
          color="#8b5cf6"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredInbox.length > 0 ? (
              filteredInbox.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  compact
                  onEdit={setEditingTask}
                  onDelete={deleteTask}
                  onStatusChange={(id, status) => updateTask(id, { status })}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-full py-4">Inbox empty</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
