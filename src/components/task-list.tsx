"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Inbox, 
  PauseCircle,
  Calendar,
  Briefcase,
  User,
  Flag,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { 
  Task, 
  TaskStatus, 
  TaskBusiness, 
  TaskPriority,
  TaskProjectPersonal,
  Client 
} from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { cn } from "@/lib/utils";
import { isToday, isBefore, parseISO, isAfter, addDays, format } from "date-fns";

const statusConfig = {
  inbox: { color: "bg-gray-400", textColor: "text-gray-400", bgColor: "bg-gray-400/20", borderColor: "border-gray-400/30", label: "Inbox", icon: Inbox },
  next: { color: "bg-blue-500", textColor: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/30", label: "Next", icon: Clock },
  waiting: { color: "bg-yellow-500", textColor: "text-yellow-400", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/30", label: "Waiting", icon: PauseCircle },
  done: { color: "bg-green-500", textColor: "text-green-400", bgColor: "bg-green-500/20", borderColor: "border-green-500/30", label: "Done", icon: CheckCircle2 },
};

const priorityConfig = {
  low: { color: "bg-gray-500", label: "Low" },
  medium: { color: "bg-blue-500", label: "Medium" },
  high: { color: "bg-orange-500", label: "High" },
  urgent: { color: "bg-red-500", label: "Urgent" },
};

const businessConfig: Record<TaskBusiness, { label: string; color: string }> = {
  personal: { label: "Personal", color: "#8b5cf6" },
  lms: { label: "LMS", color: "#3b82f6" },
  commit: { label: "Commit", color: "#22c55e" },
};

interface TaskFilters {
  status: TaskStatus | "all";
  business: TaskBusiness | "all";
  project: TaskProjectPersonal | "all";
  client: string | "all";
  priority: TaskPriority | "all";
}

interface TaskListProps {
  tasks: Task[];
  clients: Client[];
  onTaskClick?: (task: Task) => void;
  onTaskComplete?: (taskId: string) => void;
  showFilters?: boolean;
  title?: string;
  emptyMessage?: string;
  maxItems?: number;
}

export function TaskList({ 
  tasks, 
  clients, 
  onTaskClick, 
  onTaskComplete,
  showFilters = false,
  title,
  emptyMessage = "No tasks found",
  maxItems
}: TaskListProps) {
  const { getBusinessColor } = useBusinessContext();
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    business: "all",
    project: "all",
    client: "all",
    priority: "all",
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.status !== "all" && task.status !== filters.status) return false;
      if (filters.business !== "all" && task.business !== filters.business) return false;
      if (filters.project !== "all" && task.project !== filters.project) return false;
      if (filters.client !== "all" && task.clientId !== filters.client) return false;
      if (filters.priority !== "all" && task.priority !== filters.priority) return false;
      return true;
    });
  }, [tasks, filters]);

  const displayedTasks = maxItems ? filteredTasks.slice(0, maxItems) : filteredTasks;
  const hasMore = maxItems && filteredTasks.length > maxItems;

  const uniqueClients = useMemo(() => {
    const clientIds = new Set(tasks.map(t => t.clientId).filter(Boolean));
    return clients.filter(c => clientIds.has(c.id));
  }, [tasks, clients]);

  const uniqueProjects = useMemo(() => {
    return Array.from(new Set(tasks.filter(t => t.project).map(t => t.project)));
  }, [tasks]);

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <FilterSelect
            value={filters.status}
            onChange={(v) => setFilters(f => ({ ...f, status: v as TaskStatus | "all" }))}
            options={[
              { value: "all", label: "All Status" },
              { value: "inbox", label: "Inbox" },
              { value: "next", label: "Next" },
              { value: "waiting", label: "Waiting" },
              { value: "done", label: "Done" },
            ]}
          />
          <FilterSelect
            value={filters.business}
            onChange={(v) => setFilters(f => ({ ...f, business: v as TaskBusiness | "all" }))}
            options={[
              { value: "all", label: "All Business" },
              { value: "personal", label: "Personal" },
              { value: "lms", label: "LMS" },
              { value: "commit", label: "Commit" },
            ]}
          />
          <FilterSelect
            value={filters.project}
            onChange={(v) => setFilters(f => ({ ...f, project: v as TaskProjectPersonal | "all" }))}
            options={[
              { value: "all", label: "All Projects" },
              ...uniqueProjects.filter((p): p is TaskProjectPersonal => p !== undefined)
                .map(p => ({ value: p, label: p.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) })),
            ]}
          />
          <FilterSelect
            value={filters.client}
            onChange={(v) => setFilters(f => ({ ...f, client: v }))}
            options={[
              { value: "all", label: "All Clients" },
              ...uniqueClients.map(c => ({ value: c.id, label: c.name })),
            ]}
          />
          <FilterSelect
            value={filters.priority}
            onChange={(v) => setFilters(f => ({ ...f, priority: v as TaskPriority | "all" }))}
            options={[
              { value: "all", label: "All Priority" },
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ]}
          />
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {displayedTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              <p className="text-sm">{emptyMessage}</p>
            </motion.div>
          ) : (
            displayedTasks.map((task, index) => (
              <TaskRow
                key={task.id}
                task={task}
                clients={clients}
                onClick={() => onTaskClick?.(task)}
                onComplete={() => onTaskComplete?.(task.id)}
                index={index}
              />
            ))
          )}
        </AnimatePresence>
        
        {hasMore && (
          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">
              +{filteredTasks.length - maxItems!} more tasks
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskRowProps {
  task: Task;
  clients: Client[];
  onClick?: () => void;
  onComplete?: () => void;
  index?: number;
}

export function TaskRow({ task, clients, onClick, onComplete, index = 0 }: TaskRowProps) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const client = clients.find(c => c.id === task.clientId);
  const StatusIcon = status.icon;

  const isOverdue = task.dueDate && !task.completedAt && isBefore(parseISO(task.dueDate), new Date()) && !isToday(parseISO(task.dueDate));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 p-3",
        "bg-white/5 hover:bg-white/10",
        "border border-white/10 hover:border-white/20",
        "rounded-xl transition-all cursor-pointer"
      )}
    >
      {/* Status Indicator */}
      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", status.color)} />
      
      {/* Complete Button */}
      {task.status !== "done" && onComplete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-green-400 transition-all flex-shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>
      )}
      
      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn(
            "text-sm font-medium truncate",
            task.status === "done" && "line-through text-gray-500"
          )}>
            {task.title}
          </p>
          {isOverdue && (
            <span className="text-[10px] text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">
              Overdue
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {/* Status Badge */}
          <span className={cn(
            "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border",
            status.bgColor,
            status.textColor,
            status.borderColor
          )}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
          
          {/* Due Date */}
          {task.dueDate && (
            <span className={cn(
              "flex items-center gap-1 text-[10px]",
              isOverdue ? "text-red-400" : "text-gray-400"
            )}>
              <Calendar className="w-3 h-3" />
              {format(parseISO(task.dueDate), "MMM d")}
            </span>
          )}
          
          {/* Priority */}
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            priority.color
          )} title={`Priority: ${priority.label}`} />
          
          {/* Project */}
          {task.project && (
            <span className="text-[10px] text-gray-500">
              {task.project.replace(/-/g, " ")}
            </span>
          )}
          
          {/* Business */}
          <span 
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{ 
              backgroundColor: businessConfig[task.business].color + "20",
              color: businessConfig[task.business].color 
            }}
          >
            {businessConfig[task.business].label}
          </span>
          
          {/* Client */}
          {client && (
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <User className="w-3 h-3" />
              {client.name}
            </span>
          )}
        </div>
      </div>
      
      {/* Right Arrow */}
      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
    </motion.div>
  );
}

function FilterSelect({ 
  value, 
  onChange, 
  options 
}: { 
  value: string; 
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-gray-300 focus:outline-none focus:border-white/30"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

// Helper functions for date filtering
export function useTaskFilters(tasks: Task[]) {
  const today = useMemo(() => new Date(), []);
  
  return useMemo(() => {
    const todayTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === "done") return false;
      return isToday(parseISO(t.dueDate));
    });
    
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === "done") return false;
      return isBefore(parseISO(t.dueDate), today) && !isToday(parseISO(t.dueDate));
    });
    
    const upcoming3Days = tasks.filter(t => {
      if (!t.dueDate || t.status === "done") return false;
      const due = parseISO(t.dueDate);
      return (isAfter(due, today) || isToday(due)) && !isAfter(due, addDays(today, 3));
    });
    
    const upcoming7Days = tasks.filter(t => {
      if (!t.dueDate || t.status === "done") return false;
      const due = parseISO(t.dueDate);
      return isAfter(due, addDays(today, 3)) && !isAfter(due, addDays(today, 7));
    });
    
    const futureTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === "done") return false;
      return isAfter(parseISO(t.dueDate), addDays(today, 7));
    });
    
    const completedTasks = tasks
      .filter(t => t.status === "done")
      .sort((a, b) => {
        const aDate = a.completedAt ? new Date(a.completedAt) : new Date(0);
        const bDate = b.completedAt ? new Date(b.completedAt) : new Date(0);
        return bDate.getTime() - aDate.getTime();
      });
    
    const inboxTasks = tasks.filter(t => t.status === "inbox");
    const nextTasks = tasks.filter(t => t.status === "next");
    const waitingTasks = tasks.filter(t => t.status === "waiting");
    
    return {
      todayTasks,
      overdueTasks,
      upcoming3Days,
      upcoming7Days,
      futureTasks,
      completedTasks,
      inboxTasks,
      nextTasks,
      waitingTasks,
    };
  }, [tasks, today]);
}

interface CollapsibleSectionProps {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({ title, count, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {count !== undefined && (
            <span className="text-sm text-gray-500">({count})</span>
          )}
        </div>
        <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
