"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Trash2, Clock, Inbox, Play } from "lucide-react";
import { useData, Task, TaskStatus } from "@/components/data-context";
import { cn } from "@/lib/utils";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const statusOptions = [
  { value: "inbox" as const, label: "Inbox", icon: Inbox, color: "#8b5cf6" },
  { value: "next" as const, label: "Next", icon: Play, color: "#00d4ff" },
  { value: "waiting" as const, label: "Waiting", icon: Clock, color: "#f59e0b" },
  { value: "done" as const, label: "Done", icon: CheckCircle2, color: "#22c55e" },
];

export function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  const { updateTask, deleteTask, clients } = useData();
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    } else {
      setEditedTask(null);
    }
  }, [task, isOpen]);

  if (!editedTask || !isOpen) return null;

  const handleStatusChange = (status: TaskStatus) => {
    const updates: Partial<Task> = { status };
    if (status === "done") {
      updates.completedAt = new Date().toISOString();
    } else {
      updates.completedAt = undefined;
    }
    setEditedTask({ ...editedTask, ...updates });
    if (task) updateTask(task.id, updates);
  };

  const handleFieldChange = (field: keyof Task, value: any) => {
    const updated = { ...editedTask, [field]: value };
    setEditedTask(updated);
    if (task) updateTask(task.id, { [field]: value });
  };

  const handleComplete = () => {
    if (task) {
      const isCompleting = editedTask.status !== "done";
      handleStatusChange(isCompleting ? "done" : "next");
    }
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
      onClose();
    }
  };

  const client = clients.find(c => c.id === editedTask.clientId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 rounded-2xl bg-[#0f0f14] border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Task Details</h3>
                  <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Title</label>
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {statusOptions.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => handleStatusChange(s.value)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          editedTask.status === s.value
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-white/5 text-gray-400 hover:text-white border border-transparent"
                        )}
                      >
                        <s.icon className="w-4 h-4" style={{ color: s.color }} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Waiting Note */}
                {editedTask.status === "waiting" && (
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Waiting For...</label>
                    <input
                      type="text"
                      value={editedTask.waitingNote || ""}
                      onChange={(e) => handleFieldChange("waitingNote", e.target.value)}
                      placeholder="Who/what are you waiting on?"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                )}

                {/* Priority & Due Date */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Priority</label>
                    <select
                      value={editedTask.priority}
                      onChange={(e) => handleFieldChange("priority", e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="low" className="bg-[#0f0f14]">Low</option>
                      <option value="medium" className="bg-[#0f0f14]">Medium</option>
                      <option value="high" className="bg-[#0f0f14]">High</option>
                      <option value="urgent" className="bg-[#0f0f14]">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Due Date</label>
                    <input
                      type="date"
                      value={editedTask.dueDate || ""}
                      onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                {/* Business & Project/Client */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Business</label>
                  <select
                    value={editedTask.business}
                    onChange={(e) => handleFieldChange("business", e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                  >
                    <option value="personal" className="bg-[#0f0f14]">Personal</option>
                    <option value="lms" className="bg-[#0f0f14]">LMS</option>
                    <option value="commit" className="bg-[#0f0f14]">Commit</option>
                  </select>
                </div>

                {/* Project (for personal) or Client (for business) */}
                {editedTask.business === "personal" ? (
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Project</label>
                    <select
                      value={editedTask.project || ""}
                      onChange={(e) => handleFieldChange("project", e.target.value || undefined)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="" className="bg-[#0f0f14]">Select project...</option>
                      <option value="non-business" className="bg-[#0f0f14]">Non-Business</option>
                      <option value="commit-internal" className="bg-[#0f0f14]">Commit Internal</option>
                      <option value="lms-internal" className="bg-[#0f0f14]">LMS Internal</option>
                      <option value="ai-edu" className="bg-[#0f0f14]">AI Edu/Dev</option>
                      <option value="finances" className="bg-[#0f0f14]">Finances</option>
                    </select>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Client</label>
                    <select
                      value={editedTask.clientId || ""}
                      onChange={(e) => handleFieldChange("clientId", e.target.value || undefined)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="" className="bg-[#0f0f14]">Select client...</option>
                      {clients
                        .filter(c => c.business === editedTask.business)
                        .map(c => (
                          <option key={c.id} value={c.id} className="bg-[#0f0f14]">{c.name}</option>
                        ))}
                    </select>
                    {client && (
                      <p className="text-xs text-gray-500 mt-1">{client.email || client.phone || client.company || ""}</p>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Notes</label>
                  <textarea
                    value={editedTask.notes || ""}
                    onChange={(e) => handleFieldChange("notes", e.target.value)}
                    placeholder="Additional notes..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 h-24 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleComplete}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                      editedTask.status === "done"
                        ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                        : "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {editedTask.status === "done" ? "Mark Incomplete" : "Complete Task"}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
