"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check } from "lucide-react";
import { useData } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { cn } from "@/lib/utils";

export function TaskChatBox() {
  const { addTask } = useData();
  const { business } = useBusinessContext();
  const [input, setInput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addTask({
      title: input.trim(),
      status: "inbox",
      priority: "medium",
      business: business === "personal" ? "personal" : business,
      tags: [],
    });

    setInput("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a task and press Enter..."
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
        />
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-green-400"
            >
              <Check className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.button
              key="send"
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!input.trim()}
              className={cn(
                "p-2 rounded-lg transition-all",
                input.trim() 
                  ? "bg-white/10 text-white hover:bg-white/20" 
                  : "bg-white/5 text-gray-500 cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
