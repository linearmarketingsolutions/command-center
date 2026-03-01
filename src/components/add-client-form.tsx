"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Building2, Dumbbell } from "lucide-react";
import { useData } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { cn } from "@/lib/utils";

interface AddClientFormProps {
  onClose?: () => void;
}

export function AddClientForm({ onClose }: AddClientFormProps) {
  const { addClient } = useData();
  const { business, getBusinessColor } = useBusinessContext();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    business: business === "personal" ? "lms" : business,
    mrr: "",
    status: "active" as const,
    notes: "",
    lastContact: new Date().toISOString().split("T")[0],
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient({
      name: formData.name,
      business: formData.business as "lms" | "commit",
      mrr: parseFloat(formData.mrr) || 0,
      status: formData.status,
      notes: formData.notes,
      lastContact: formData.lastContact,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
    });
    setFormData({
      name: "",
      business: business === "personal" ? "lms" : business,
      mrr: "",
      status: "active",
      notes: "",
      lastContact: new Date().toISOString().split("T")[0],
      email: "",
      phone: "",
    });
    setIsOpen(false);
    onClose?.();
  };

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1.5";

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
        style={{ backgroundColor: getBusinessColor() + "30", border: `1px solid ${getBusinessColor()}` }}
      >
        <Plus className="w-4 h-4" />
        Add Client
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            {/* Modal Container - Centered */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md pointer-events-auto"
              >
                <div className="p-6 rounded-2xl bg-[#0f0f14] border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Add New Client</h3>
                    <button onClick={() => setIsOpen(false)} className="p-1 text-gray-400 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className={labelClass}>Client Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Point 2 Point"
                        className={inputClass}
                        autoFocus
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Business</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, business: "lms" })}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all",
                              formData.business === "lms"
                                ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                            )}
                          >
                            <Building2 className="w-4 h-4" />
                            LMS
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, business: "commit" })}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all",
                              formData.business === "commit"
                                ? "bg-red-500/20 border-red-500 text-red-400"
                                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                            )}
                          >
                            <Dumbbell className="w-4 h-4" />
                            Commit
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Monthly Revenue ($)</label>
                        <input
                          type="number"
                          value={formData.mrr}
                          onChange={(e) => setFormData({ ...formData, mrr: e.target.value })}
                          placeholder="3000"
                          className={inputClass}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className={cn(inputClass, "cursor-pointer")}
                        >
                          <option value="active" className="bg-[#0f0f14]">Active</option>
                          <option value="paused" className="bg-[#0f0f14]">Paused</option>
                          <option value="churned" className="bg-[#0f0f14]">Churned</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>Last Contact</label>
                        <input
                          type="date"
                          value={formData.lastContact}
                          onChange={(e) => setFormData({ ...formData, lastContact: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Email (optional)</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="client@example.com"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Phone (optional)</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Notes (optional)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any additional notes..."
                        className={cn(inputClass, "h-20 resize-none")}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all"
                        style={{ backgroundColor: getBusinessColor(), opacity: !formData.name ? 0.5 : 1 }}
                        disabled={!formData.name}
                      >
                        Add Client
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
