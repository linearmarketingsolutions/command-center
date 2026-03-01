"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Building2, Dumbbell, User } from "lucide-react";
import { useData } from "@/components/data-context";
import { cn } from "@/lib/utils";

interface QuickAddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBusiness?: "lms" | "commit";
  onClientAdded?: (clientId: string) => void;
}

export function QuickAddClientModal({ 
  isOpen, 
  onClose, 
  defaultBusiness = "lms",
  onClientAdded 
}: QuickAddClientModalProps) {
  const { addClient } = useData();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    business: defaultBusiness,
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    
    const clientId = addClient({
      name: formData.name.trim(),
      company: formData.company.trim() || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      business: formData.business,
      mrr: 0,
      status: "active",
      notes: formData.notes.trim() || undefined,
      lastContact: new Date().toISOString().split("T")[0],
    });

    setIsSubmitting(false);
    onClientAdded?.(clientId);
    
    // Reset form
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      business: defaultBusiness,
      notes: "",
    });
    
    onClose();
  };

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors text-sm";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1";

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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md pointer-events-auto"
            >
              <div className="p-6 rounded-2xl bg-[#0f0f14] border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Add Client</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Quickly add a new client</p>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className={labelClass}>Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Client name"
                      className={inputClass}
                      autoFocus
                      required
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className={labelClass}>Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company name (optional)"
                      className={inputClass}
                    />
                  </div>

                  {/* Business Type */}
                  <div>
                    <label className={labelClass}>Business</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, business: "lms" })}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
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
                          "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
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

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className={labelClass}>Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any additional notes..."
                      rows={3}
                      className={cn(inputClass, "resize-none")}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
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
                      disabled={!formData.name.trim() || isSubmitting}
                      className={cn(
                        "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all",
                        formData.business === "lms" ? "bg-cyan-500 hover:bg-cyan-600" : "bg-red-500 hover:bg-red-600",
                        (!formData.name.trim() || isSubmitting) && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isSubmitting ? "Adding..." : "Add Client"}
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

// Button to trigger the modal
export function QuickAddClientButton({ 
  onClientAdded,
  defaultBusiness = "lms" 
}: { 
  onClientAdded?: (clientId: string) => void;
  defaultBusiness?: "lms" | "commit";
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        New Client
      </motion.button>
      
      <QuickAddClientModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultBusiness={defaultBusiness}
        onClientAdded={onClientAdded}
      />
    </>
  );
}
