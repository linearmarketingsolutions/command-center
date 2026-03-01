"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Check, X, CheckCircle2, Inbox, Play, Clock } from "lucide-react";
import { useData, Task, TaskStatus } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { TaskDetailModal } from "@/components/task-detail-modal";
import { cn } from "@/lib/utils";

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

export function EditableTasks() {
  const { tasks, getTasksByBusiness, addTask, updateTask, deleteTask } = useData();
  const { business, getBusinessColor } = useBusinessContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const businessTasks = getTasksByBusiness(business).filter(t => t.status !== 'done');

  const handleStatusToggle = (task: Task) => {
    const newStatus = task.status === 'done' ? 'next' : 'done';
    updateTask(task.id, { status: newStatus });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-3">
      {/* Add Task Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsModalOpen(true)}
        className="w-full p-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Task
      </motion.button>

      {/* Tasks List */}
      <AnimatePresence mode="popLayout">
        {businessTasks.map((task) => {
          const StatusIcon = statusIcons[task.status];
          return (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="group flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => handleEdit(task)}
            >
              <button
                onClick={(e) => { e.stopPropagation(); handleStatusToggle(task); }}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.status === 'done'
                    ? "bg-green-500 border-green-500"
                    : "border-gray-500 hover:border-white"
                }`}
              >
                {task.status === 'done' && <Check className="w-3 h-3 text-white" />}
              </button>
              
              <div className="flex-shrink-0">
                <StatusIcon 
                  className="w-4 h-4" 
                  style={{ color: statusColors[task.status] }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${task.status === 'done' ? "line-through text-gray-500" : ""}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span 
                    className="text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ 
                      backgroundColor: getBusinessColor() + "20",
                      color: getBusinessColor()
                    }}
                  >
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className="text-[10px] text-gray-500">
                      {task.dueDate}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleEdit(task); }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {businessTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No active tasks</p>
          <p className="text-xs">All caught up!</p>
        </div>
      )}

      {/* Task Modal */}
      <TaskDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        
      />
    </div>
  );
}
