"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useData, TaskStatus, TaskPriority, TaskBusiness } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { cn } from "@/lib/utils";

interface AddTaskFormProps {
  onClose?: () => void;
  defaultStatus?: TaskStatus;
  defaultBusiness?: TaskBusiness;
}

export function AddTaskForm({ onClose, defaultStatus = "inbox", defaultBusiness }: AddTaskFormProps) {
  const { addTask, clients } = useData();
  const { business: currentBusiness } = useBusinessContext();
  
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [business, setBusiness] = useState<TaskBusiness>(defaultBusiness || currentBusiness);
  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    addTask({
      title: title.trim(),
      status,
      priority,
      business,
      clientId: clientId || undefined,
      dueDate: dueDate || undefined,
      tags: [],
    });

    setTitle("");
    setDueDate("");
    setClientId("");
    onClose?.();
  };

  const businessClients = clients.filter(c => c.business === business);

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">Add New Task</h3>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1 text-gray-500 hover:text-gray-300">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30"
        autoFocus
      />

      <div className="grid grid-cols-2 gap-3">
        <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
          <option value="inbox">Inbox</option>
          <option value="next">Next</option>
          <option value="waiting">Waiting</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <select value={business} onChange={(e) => { setBusiness(e.target.value as TaskBusiness); setClientId(""); }} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
          <option value="personal">Personal</option>
          <option value="lms">LMS</option>
          <option value="commit">Commit</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300" />
      </div>

      {businessClients.length > 0 && (
        <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
          <option value="">No Client</option>
          {businessClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      )}

      <button type="submit" disabled={!title.trim()} className={cn("w-full py-2 rounded-lg text-sm font-medium", title.trim() ? "bg-white/10 hover:bg-white/20 text-white" : "bg-white/5 text-gray-500 cursor-not-allowed")}>
        Add Task
      </button>
    </motion.form>
  );
}

export function AddTaskButton({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white", className)}>
      <Plus className="w-4 h-4" /> Add Task
    </motion.button>
  );
}
