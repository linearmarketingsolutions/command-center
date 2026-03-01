"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Trash2, Clock, Inbox, Play, FolderOpen, FileText, Plus, ExternalLink } from "lucide-react";
import { useData, Task, TaskStatus } from "@/components/data-context";
import { cn } from "@/lib/utils";
import { BrainVaultExplorer } from "./brain-vault-explorer";

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

// Keywords to file path mappings for intelligent suggestions
const KEYWORD_MAPPINGS: Record<string, string[]> = {
  "lms": ["Businesses/LMS.md", "Systems/Skill-Agent-Matrix.md"],
  "linear": ["Businesses/LMS.md", "Clients/Point-2-Point.md", "Clients/ACX-Technologies.md"],
  "marketing": ["Businesses/LMS.md", "Knowledge/Key-Articles.md"],
  "commit": ["Businesses/Commit-Fitness.md", "Active-Projects/Commit-Fit-App.md"],
  "fitness": ["Businesses/Commit-Fitness.md", "Blake/Goals.md"],
  "personal training": ["Businesses/Commit-Fitness.md", "Clients/Juan-Luna.md"],
  "agent": ["Systems/subagent-playbook.md", "Systems/Agent-Registry.md", "AGENTS.md"],
  "subagent": ["Systems/subagent-playbook.md", "Systems/Agent-Registry.md"],
  "client": ["brain/Clients/"],
  "website": ["Active-Projects/LMS-Website.md", "Systems/Tech-Stack.md"],
  "app": ["Active-Projects/Commit-Fit-App.md", "Active-Projects/Family-Budget-App.md"],
  "schedule": ["Active-Projects/Personal-Schedule-App.md", "Blake/Working-Style.md"],
  "calendar": ["Active-Projects/Personal-Schedule-App.md"],
  "finance": ["Blake/Goals.md", "Businesses/IronVest-Ventures.md"],
  "revenue": ["Businesses/LMS.md", "Businesses/Commit-Fitness.md"],
  "content": ["Knowledge/Key-Articles.md"],
  "strategy": ["Knowledge/Decisions-Log.md", "Soul/Core-Beliefs.md"],
  "decision": ["Knowledge/Decisions-Log.md"],
  "system": ["Systems/Config-State.md", "Systems/Capabilities.md"],
  "automation": ["Systems/APIs-Integrations.md", "Systems/subagent-playbook.md"],
  "model": ["Systems/Models.md"],
  "routing": ["AGENTS.md", "Systems/Models.md"],
  "skill": ["Systems/Skill-Agent-Matrix.md"],
  "goals": ["Blake/Goals.md"],
  "p2p": ["Clients/Point-2-Point.md", "Businesses/P2P-nanoFIBER.md"],
  "acx": ["Clients/ACX-Technologies.md"],
};

interface SuggestedFile {
  path: string;
  reason: string;
}

export function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  const { updateTask, deleteTask, clients, suggestedFiles, updateSuggestions, loadedFiles, loadFile } = useData();
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [showVaultExplorer, setShowVaultExplorer] = useState(false);
  const [taskSuggestions, setTaskSuggestions] = useState<SuggestedFile[]>([]);

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
      // Generate suggestions based on task title and description
      const suggestions = generateSuggestions(task.title, task.description);
      setTaskSuggestions(suggestions);
      // Also update global suggestions
      updateSuggestions(task.title, task.description);
    } else {
      setEditedTask(null);
      setTaskSuggestions([]);
    }
  }, [task, isOpen, updateSuggestions]);

  const generateSuggestions = (title: string, description?: string): SuggestedFile[] => {
    const searchText = `${title} ${description || ""}`.toLowerCase();
    const suggestions: SuggestedFile[] = [];
    const addedPaths = new Set<string>();

    for (const [keyword, paths] of Object.entries(KEYWORD_MAPPINGS)) {
      if (searchText.includes(keyword.toLowerCase())) {
        for (const path of paths) {
          if (!addedPaths.has(path)) {
            suggestions.push({
              path,
              reason: `Matches "${keyword}"`,
            });
            addedPaths.add(path);
          }
        }
      }
    }

    // Include any loaded files that might be relevant
    loadedFiles.slice(-3).forEach((file) => {
      if (!addedPaths.has(file.path)) {
        suggestions.push({
          path: file.path,
          reason: "Recently loaded",
        });
        addedPaths.add(file.path);
      }
    });

    return suggestions.slice(0, 4);
  };

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

  const handleLoadFile = (path: string) => {
    // In a real implementation, this would fetch the file content
    const simulatedContent = `# ${path}\n\nFile content would be loaded here from the brain vault.`;
    loadFile(path, simulatedContent);
  };

  const client = clients.find(c => c.id === editedTask.clientId);
  const isFileLoaded = (path: string) => loadedFiles.some((f) => f.path === path);

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

                {/* Related Files Section */}
                <div className="mb-6 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-white flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-[#00d4ff]" />
                      Related Files
                    </h4>
                    <button
                      onClick={() => setShowVaultExplorer(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff]/20 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add File to Context
                    </button>
                  </div>

                  {/* Suggested Files */}
                  {taskSuggestions.length > 0 && (
                    <div className="space-y-2">
                      {taskSuggestions.map((suggestion) => {
                        const loaded = isFileLoaded(suggestion.path);
                        return (
                          <div
                            key={suggestion.path}
                            className={cn(
                              "flex items-center gap-3 p-2.5 rounded-lg transition-all",
                              loaded
                                ? "bg-green-500/10 border border-green-500/20"
                                : "bg-white/5 border border-white/5 hover:bg-white/10"
                            )}
                          >
                            <FileText className={cn(
                              "w-4 h-4",
                              loaded ? "text-green-400" : "text-gray-400"
                            )} />
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm truncate",
                                loaded ? "text-green-400" : "text-gray-300"
                              )}>
                                {suggestion.path}
                              </p>
                              <p className="text-xs text-gray-500">{suggestion.reason}</p>
                            </div>
                            {loaded ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <button
                                onClick={() => handleLoadFile(suggestion.path)}
                                className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                title="Load into context"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Global Suggested Files (from data context) */}
                  {suggestedFiles.length > 0 && suggestedFiles.some(f => !taskSuggestions.find(ts => ts.path === f.path)) && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-xs text-gray-500 mb-2">More suggestions</p>
                      <div className="space-y-2">
                        {suggestedFiles
                          .filter(f => !taskSuggestions.find(ts => ts.path === f.path))
                          .slice(0, 3)
                          .map((suggestion) => {
                            const loaded = isFileLoaded(suggestion.path);
                            return (
                              <div
                                key={suggestion.path}
                                className={cn(
                                  "flex items-center gap-3 p-2 rounded-lg transition-all",
                                  loaded
                                    ? "bg-green-500/10 border border-green-500/20"
                                    : "bg-white/5 border border-white/5 hover:bg-white/10"
                                )}
                              >
                                <FileText className={cn(
                                  "w-3.5 h-3.5",
                                  loaded ? "text-green-400" : "text-gray-500"
                                )} />
                                <div className="flex-1 min-w-0">
                                  <p className={cn(
                                    "text-xs truncate",
                                    loaded ? "text-green-400" : "text-gray-400"
                                  )}>
                                    {suggestion.path}
                                  </p>
                                </div>
                                {loaded ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                ) : (
                                  <button
                                    onClick={() => handleLoadFile(suggestion.path)}
                                    className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {taskSuggestions.length === 0 && suggestedFiles.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No related files found</p>
                      <p className="text-xs mt-1">Click &quot;Add File to Context&quot; to browse the vault</p>
                    </div>
                  )}
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

          {/* Vault Explorer Modal */}
          <BrainVaultExplorer
            isOpen={showVaultExplorer}
            onClose={() => setShowVaultExplorer(false)}
            onFileSelect={(path, content) => {
              loadFile(path, content);
              setShowVaultExplorer(false);
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
