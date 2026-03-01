"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  CheckCircle2, 
  Plus, 
  Filter, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Inbox,
  PauseCircle,
  ChevronDown,
  Archive,
  Edit3
} from "lucide-react";
import { useData } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { DataExport } from "@/components/data-export";
import { TaskList, TaskRow, useTaskFilters, CollapsibleSection } from "@/components/task-list";
import { AddTaskForm } from "@/components/add-task-form";
import { TaskDetailModal } from "@/components/task-detail-modal";
import { cn } from "@/lib/utils";
import { Task } from "@/components/data-context";

const statusConfig = {
  inbox: { color: "bg-gray-500", label: "Inbox", icon: Inbox },
  next: { color: "bg-blue-500", label: "Next", icon: Clock },
  waiting: { color: "bg-yellow-500", label: "Waiting", icon: PauseCircle },
  done: { color: "bg-green-500", label: "Done", icon: CheckCircle2 },
};

export default function TasksPage() {
  const { tasks, clients, addTask, updateTask, deleteTask } = useData();
  const { business, getBusinessColor } = useBusinessContext();
  
  const {
    todayTasks,
    overdueTasks,
    upcoming3Days,
    upcoming7Days,
    futureTasks,
    completedTasks,
    inboxTasks,
    nextTasks,
    waitingTasks,
  } = useTaskFilters(tasks);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleComplete = (taskId: string) => {
    updateTask(taskId, { status: "done" });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleOrganize = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Task Modal */}
      <TaskDetailModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" style={{ color: getBusinessColor() }} />
          Tasks
        </h2>
        <div className="flex items-center gap-2">
          <DataExport />
          <AddTaskForm />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        <StatCard 
          label="Inbox" 
          count={inboxTasks.length} 
          icon={Inbox}
          color="#6b7280" 
        />
        <StatCard 
          label="Today" 
          count={todayTasks.length} 
          icon={Calendar}
          color={getBusinessColor()} 
        />
        <StatCard 
          label="Overdue" 
          count={overdueTasks.length} 
          icon={AlertCircle}
          color="#ef4444" 
        />
        <StatCard 
          label="Done" 
          count={completedTasks.length} 
          icon={CheckCircle2}
          color="#22c55e" 
        />
        <StatCard 
          label="Next" 
          count={nextTasks.length} 
          icon={Clock}
          color="#3b82f6" 
        />
        <StatCard 
          label="Waiting" 
          count={waitingTasks.length} 
          icon={PauseCircle}
          color="#eab308" 
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Filters</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterDropdown label="Status">
            <FilterOption value="all">All</FilterOption>
            <FilterOption value="inbox">Inbox</FilterOption>
            <FilterOption value="next">Next</FilterOption>
            <FilterOption value="waiting">Waiting</FilterOption>
            <FilterOption value="done">Done</FilterOption>
          </FilterDropdown>
          
          <FilterDropdown label="Business">
            <FilterOption value="all">All</FilterOption>
            <FilterOption value="personal">Personal</FilterOption>
            <FilterOption value="lms">LMS</FilterOption>
            <FilterOption value="commit">Commit</FilterOption>
          </FilterDropdown>
          
          <FilterDropdown label="Project">
            <FilterOption value="all">All</FilterOption>
            <FilterOption value="non-business">Non-Business</FilterOption>
            <FilterOption value="commit-internal">Commit Internal</FilterOption>
            <FilterOption value="lms-internal">LMS Internal</FilterOption>
            <FilterOption value="ai-edu">AI Edu</FilterOption>
            <FilterOption value="finances">Finances</FilterOption>
          </FilterDropdown>
          
          <FilterDropdown label="Client">
            <FilterOption value="all">All</FilterOption>
            {clients.map(c => (
              <FilterOption key={c.id} value={c.id}>{c.name}</FilterOption>
            ))}
          </FilterDropdown>
          
          <FilterDropdown label="Priority">
            <FilterOption value="all">All</FilterOption>
            <FilterOption value="low">Low</FilterOption>
            <FilterOption value="medium">Medium</FilterOption>
            <FilterOption value="high">High</FilterOption>
            <FilterOption value="urgent">Urgent</FilterOption>
          </FilterDropdown>
        </div>
      </div>

      {/* TASK INBOX - Primary Section at Top */}
      {inboxTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-500/20 to-gray-600/10 backdrop-blur-xl border border-gray-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-white">
                Task Inbox
                <span className="text-sm text-gray-500 ml-2">({inboxTasks.length} tasks needing organization)</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 bg-gray-500/20 px-2 py-1 rounded-full border border-gray-500/30">
                Click to organize
              </span>
            </div>
          </div>
          
          {/* Grid of inbox tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inboxTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="relative group"
              >
                {/* Clickable card background */}
                <div
                  onClick={() => handleTaskClick(task)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all",
                    "bg-white/5 hover:bg-white/10",
                    "border border-gray-500/30 hover:border-gray-400/50",
                    "group-hover:shadow-lg group-hover:shadow-gray-500/10"
                  )}
                >
                  {/* Visual indicator for inbox tasks - pulsing dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 animate-pulse" />
                  
                  {/* Task content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {/* Business badge */}
                      <span 
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ 
                          backgroundColor: task.business === 'lms' ? '#3b82f620' : task.business === 'commit' ? '#22c55e20' : '#8b5cf620',
                          color: task.business === 'lms' ? '#3b82f6' : task.business === 'commit' ? '#22c55e' : '#8b5cf6'
                        }}
                      >
                        {task.business === 'lms' ? 'LMS' : task.business === 'commit' ? 'Commit' : 'Personal'}
                      </span>
                      {/* Priority dot */}
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        task.priority === 'urgent' ? 'bg-red-500' :
                        task.priority === 'high' ? 'bg-orange-500' :
                        task.priority === 'medium' ? 'bg-blue-500' : 'bg-gray-500'
                      )} />
                      {/* Due date if present */}
                      {task.dueDate && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Organize button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrganize(task);
                    }}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-xs text-purple-400 hover:text-purple-300 transition-all flex-shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Organize
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Side-by-Side: Today's Tasks | Overdue Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: getBusinessColor() }} />
              Today
              <span className="text-sm text-gray-500">({todayTasks.length})</span>
            </h3>
          </div>
          <div className="space-y-2">
            {todayTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tasks for today</p>
            ) : (
              todayTasks.map((task, index) => (
                <TaskRow 
                  key={task.id} 
                  task={task} 
                  clients={clients}
                  onClick={() => handleTaskClick(task)}
                  onComplete={() => handleComplete(task.id)}
                  index={index}
                />
              ))
            )}
          </div>
        </motion.div>

        {/* Overdue Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              Overdue
              <span className="text-sm text-gray-500">({overdueTasks.length})</span>
            </h3>
          </div>
          <div className="space-y-2">
            {overdueTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No overdue tasks</p>
            ) : (
              overdueTasks.map((task, index) => (
                <TaskRow 
                  key={task.id} 
                  task={task} 
                  clients={clients}
                  onClick={() => handleTaskClick(task)}
                  onComplete={() => handleComplete(task.id)}
                  index={index}
                />
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* 3-Day Upcoming | 7-Day+ Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3-Day Upcoming */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Next 3 Days
              <span className="text-sm text-gray-500">({upcoming3Days.length})</span>
            </h3>
          </div>
          <div className="space-y-2">
            {upcoming3Days.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tasks in next 3 days</p>
            ) : (
              upcoming3Days.map((task, index) => (
                <TaskRow 
                  key={task.id} 
                  task={task} 
                  clients={clients}
                  onClick={() => handleTaskClick(task)}
                  onComplete={() => handleComplete(task.id)}
                  index={index}
                />
              ))
            )}
          </div>
        </motion.div>

        {/* 7-Day+ Upcoming */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Next 7 Days
              <span className="text-sm text-gray-500">({upcoming7Days.length})</span>
            </h3>
          </div>
          <div className="space-y-2">
            {upcoming7Days.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tasks in next 7 days</p>
            ) : (
              upcoming7Days.map((task, index) => (
                <TaskRow 
                  key={task.id} 
                  task={task} 
                  clients={clients}
                  onClick={() => handleTaskClick(task)}
                  onComplete={() => handleComplete(task.id)}
                  index={index}
                />
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Future Tasks */}
      {futureTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              Future
              <span className="text-sm text-gray-500">({futureTasks.length})</span>
            </h3>
          </div>
          <div className="space-y-2">
            {futureTasks.map((task, index) => (
              <TaskRow 
                key={task.id} 
                task={task} 
                clients={clients}
                onClick={() => handleTaskClick(task)}
                onComplete={() => handleComplete(task.id)}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Completed Tasks (Collapsible) */}
      <CollapsibleSection 
        title="Completed Tasks" 
        count={completedTasks.length}
        defaultOpen={false}
      >
        <div className="space-y-2 pt-4">
          {completedTasks.slice(0, 20).map((task, index) => (
            <TaskRow 
              key={task.id} 
              task={task} 
              clients={clients}
              index={index}
            />
          ))}
          {completedTasks.length === 0 && (
            <p className="text-gray-500 text-center py-8">No completed tasks yet</p>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
}

function StatCard({ 
  label, 
  count, 
  icon: Icon,
  color 
}: { 
  label: string; 
  count: number; 
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center"
    >
      <div className="flex justify-center mb-2">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold" style={{ color }}>{count}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}

function FilterDropdown({ 
  label, 
  children 
}: { 
  label: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-all">
        {label}
        <ChevronDown className="w-3 h-3" />
      </button>
      <div className="absolute top-full left-0 mt-1 w-40 bg-gray-900 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="py-1">
          {children}
        </div>
      </div>
    </div>
  );
}

function FilterOption({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">
      {children}
    </button>
  );
}
