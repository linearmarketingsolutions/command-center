"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, User, Building2, Dumbbell, Clock, Inbox, Play, CheckCircle2 } from "lucide-react";
import { useData, Task, TaskStatus, TaskPriority, TaskProjectPersonal, TaskBusiness } from "@/components/data-context";
import { QuickAddClientButton } from "@/components/quick-add-client-modal";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
  defaultBusiness?: TaskBusiness;
}

const statusConfig: { value: TaskStatus; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'inbox', label: 'Inbox', icon: Inbox, color: '#8b5cf6' },
  { value: 'next', label: 'Next', icon: Play, color: '#00d4ff' },
  { value: 'waiting', label: 'Waiting', icon: Clock, color: '#f59e0b' },
  { value: 'done', label: 'Done', icon: CheckCircle2, color: '#22c55e' },
];

const priorityConfig: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#6b7280' },
  { value: 'medium', label: 'Medium', color: '#3b82f6' },
  { value: 'high', label: 'High', color: '#f59e0b' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
];

const projectConfig: { value: TaskProjectPersonal; label: string }[] = [
  { value: 'non-business', label: 'Non-Business' },
  { value: 'commit-internal', label: 'Commit Internal' },
  { value: 'lms-internal', label: 'LMS Internal' },
  { value: 'ai-edu', label: 'AI Education' },
  { value: 'finances', label: 'Finances' },
];

export function TaskModal({ 
  isOpen, 
  onClose, 
  task, 
  defaultStatus = 'inbox',
  defaultBusiness = 'personal'
}: TaskModalProps) {
  const { addTask, updateTask, clients, getClientsByBusiness } = useData();
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: defaultStatus,
    priority: "medium" as TaskPriority,
    dueDate: "",
    business: defaultBusiness,
    project: undefined as TaskProjectPersonal | undefined,
    clientId: undefined as string | undefined,
    waitingNote: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title,
          description: task.description || "",
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate || "",
          business: task.business,
          project: task.project,
          clientId: task.clientId,
          waitingNote: task.waitingNote || "",
          tags: task.tags,
        });
      } else {
        setFormData({
          title: "",
          description: "",
          status: defaultStatus,
          priority: "medium",
          dueDate: "",
          business: defaultBusiness,
          project: undefined,
          clientId: undefined,
          waitingNote: "",
          tags: [],
        });
      }
    }
  }, [isOpen, task, defaultStatus, defaultBusiness]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      business: formData.business,
      project: formData.business === 'personal' ? formData.project : undefined,
      clientId: (formData.business === 'lms' || formData.business === 'commit') ? formData.clientId : undefined,
      waitingNote: formData.status === 'waiting' ? formData.waitingNote.trim() || undefined : undefined,
      tags: formData.tags,
    };

    if (isEditing && task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }

    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const availableClients = formData.business === 'lms' || formData.business === 'commit'
    ? getClientsByBusiness(formData.business)
    : [];

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors text-sm";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1.5";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg pointer-events-auto my-8"
            >
              <div className="p-6 rounded-2xl bg-[#0f0f14] border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    {isEditing ? "Edit Task" : "New Task"}
                  </h3>
                  <button 
                    onClick={onClose} 
                    className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className={labelClass}>Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="What needs to be done?"
                      className={inputClass}
                      autoFocus
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add details..."
                      rows={3}
                      className={cn(inputClass, "resize-none")}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className={labelClass}>Status</label>
                    <div className="flex gap-2">
                      {statusConfig.map(({ value, label, icon: Icon, color }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData({ ...formData, status: value })}
                          className={cn(
                            "flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-lg border transition-all text-xs",
                            formData.status === value
                              ? "text-white"
                              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                          )}
                          style={formData.status === value ? { backgroundColor: color + '20', borderColor: color } : {}}
                        >
                          <Icon className="w-4 h-4" style={{ color: formData.status === value ? color : undefined }} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Waiting Note (only for waiting status) */}
                  {formData.status === 'waiting' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className={labelClass}>Waiting For</label>
                      <input
                        type="text"
                        value={formData.waitingNote}
                        onChange={(e) => setFormData({ ...formData, waitingNote: e.target.value })}
                        placeholder="What are you waiting for?"
                        className={inputClass}
                      />
                    </motion.div>
                  )}

                  {/* Business */}
                  <div>
                    <label className={labelClass}>Business</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, business: 'personal', clientId: undefined })}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
                          formData.business === 'personal'
                            ? "bg-purple-500/20 border-purple-500 text-purple-400"
                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                        )}
                      >
                        <User className="w-4 h-4" />
                        Personal
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, business: 'lms', project: undefined })}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
                          formData.business === 'lms'
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                        )}
                      >
                        <Building2 className="w-4 h-4" />
                        LMS
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, business: 'commit', project: undefined })}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
                          formData.business === 'commit'
                            ? "bg-red-500/20 border-red-500 text-red-400"
                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                        )}
                      >
                        <Dumbbell className="w-4 h-4" />
                        Commit
                      </button>
                    </div>
                  </div>

                  {/* Project (Personal only) */}
                  {formData.business === 'personal' && (
                    <div>
                      <label className={labelClass}>Project</label>
                      <select
                        value={formData.project || ''}
                        onChange={(e) => setFormData({ ...formData, project: (e.target.value as TaskProjectPersonal) || undefined })}
                        className={cn(inputClass, "cursor-pointer")}
                      >
                        <option value="" className="bg-[#0f0f14]">Select project...</option>
                        {projectConfig.map(({ value, label }) => (
                          <option key={value} value={value} className="bg-[#0f0f14]">{label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Client (LMS/Commit only) */}
                  {(formData.business === 'lms' || formData.business === 'commit') && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className={labelClass}>Client</label>
                        <QuickAddClientButton 
                          defaultBusiness={formData.business}
                          onClientAdded={(clientId) => setFormData({ ...formData, clientId })}
                        />
                      </div>
                      <select
                        value={formData.clientId || ''}
                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value || undefined })}
                        className={cn(inputClass, "cursor-pointer")}
                      >
                        <option value="" className="bg-[#0f0f14]">Select client...</option>
                        {availableClients.map((client) => (
                          <option key={client.id} value={client.id} className="bg-[#0f0f14]">
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Priority & Due Date Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                        className={cn(inputClass, "cursor-pointer")}
                      >
                        {priorityConfig.map(({ value, label }) => (
                          <option key={value} value={value} className="bg-[#0f0f14]">{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Due Date</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className={labelClass}>Tags</label>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {formData.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                        >
                          #{tag}
                          <button 
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add tag..."
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!formData.title.trim()}
                      className={cn(
                        "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all",
                        formData.business === 'lms' ? "bg-cyan-500 hover:bg-cyan-600" :
                        formData.business === 'commit' ? "bg-red-500 hover:bg-red-600" :
                        "bg-purple-500 hover:bg-purple-600",
                        !formData.title.trim() && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isEditing ? "Save Changes" : "Create Task"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
