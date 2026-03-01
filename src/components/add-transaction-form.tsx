"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ArrowUpRight, ArrowDownRight, Building2, Dumbbell, User } from "lucide-react";
import { useData } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { cn } from "@/lib/utils";

interface AddTransactionFormProps {
  onClose?: () => void;
}

const categories = {
  income: ["client", "consulting", "product", "affiliate", "other"],
  expense: ["software", "hosting", "ads", "contractor", "equipment", "rent", "utilities", "meals", "travel", "other"],
};

export function AddTransactionForm({ onClose }: AddTransactionFormProps) {
  const { addTransaction } = useData();
  const { business, getBusinessColor } = useBusinessContext();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "income" as "income" | "expense",
    business: business,
    category: "client",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount) || 0;
    addTransaction({
      description: formData.description,
      amount: formData.type === "expense" ? -Math.abs(amount) : Math.abs(amount),
      date: formData.date,
      type: formData.type,
      business: formData.business as "personal" | "lms" | "commit",
      category: formData.category,
    });
    setFormData({
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      type: "income",
      business: business,
      category: "client",
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
        Add Transaction
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
                    <h3 className="text-lg font-semibold text-white">Add Transaction</h3>
                    <button onClick={() => setIsOpen(false)} className="p-1 text-gray-400 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Income/Expense Toggle */}
                    <div>
                      <label className={labelClass}>Transaction Type</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, type: "income", category: "client" })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all",
                            formData.type === "income"
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                          )}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                          Income
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, type: "expense", category: "software" })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all",
                            formData.type === "expense"
                              ? "bg-red-500/20 border-red-500 text-red-400"
                              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                          )}
                        >
                          <ArrowDownRight className="w-4 h-4" />
                          Expense
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Description</label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder={formData.type === "income" ? "e.g. P2P Payment" : "e.g. Vercel Hosting"}
                        className={inputClass}
                        autoFocus
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Amount ($)</label>
                        <input
                          type="number"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          placeholder="3000"
                          className={inputClass}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Date</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Business</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, business: "personal" })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all",
                            formData.business === "personal"
                              ? "bg-purple-500/20 border-purple-500 text-purple-400"
                              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                          )}
                        >
                          <User className="w-4 h-4" />
                          Personal
                        </button>
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
                      <label className={labelClass}>Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={cn(inputClass, "cursor-pointer")}
                      >
                        {categories[formData.type].map((cat) => (
                          <option key={cat} value={cat} className="bg-[#0f0f14] capitalize">
                            {cat}
                          </option>
                        ))}
                      </select>
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
                        style={{ backgroundColor: getBusinessColor(), opacity: !formData.description || !formData.amount ? 0.5 : 1 }}
                        disabled={!formData.description || !formData.amount}
                      >
                        Add Transaction
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
