"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Upload, Trash2, X, AlertTriangle, Check } from "lucide-react";
import { useData } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { cn } from "@/lib/utils";

export function DataExport() {
  const { exportData, importData, resetAllData, clients, transactions, tasks, events } = useData();
  const { getBusinessColor } = useBusinessContext();
  const [isOpen, setIsOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `command-center-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const success = importData(importText);
    setImportSuccess(success);
    if (success) {
      setImportText("");
      setTimeout(() => {
        setImportSuccess(null);
        setIsOpen(false);
      }, 1500);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setImportText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    setIsOpen(false);
  };

  const stats = [
    { label: "Clients", value: clients.length },
    { label: "Transactions", value: transactions.length },
    { label: "Tasks", value: tasks.length },
    { label: "Events", value: events.length },
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
      >
        <Download className="w-4 h-4" />
        Data
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
                className="w-full max-w-lg pointer-events-auto"
              >
                <div className="p-6 rounded-2xl bg-[#0f0f14] border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Data Management</h3>
                    <button onClick={() => setIsOpen(false)} className="p-1 text-gray-400 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {stats.map((stat) => (
                      <div key={stat.label} className="p-3 rounded-xl bg-white/5 text-center">
                        <div className="text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Export */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-white mb-3">Export Data</h4>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleExport}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all"
                      style={{ backgroundColor: getBusinessColor() + "30", border: `1px solid ${getBusinessColor()}` }}
                    >
                      <Download className="w-4 h-4" />
                      Download Backup (.json)
                    </motion.button>
                  </div>

                  {/* Import */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-white mb-3">Import Data</h4>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".json"
                      className="hidden"
                    />
                    
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all mb-3"
                    >
                      <Upload className="w-4 h-4" />
                      Load from File
                    </motion.button>

                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="Or paste JSON data here..."
                      className="w-full h-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors resize-none font-mono"
                    />

                    {importSuccess === true && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 text-emerald-400 text-sm"
                      >
                        <Check className="w-4 h-4" />
                        Import successful!
                      </motion.div>
                    )}
                    {importSuccess === false && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 text-red-400 text-sm"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Invalid JSON data
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleImport}
                      disabled={!importText.trim()}
                      className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      Import Data
                    </motion.button>
                  </div>

                  {/* Reset */}
                  <div className="pt-4 border-t border-white/10">
                    {!showResetConfirm ? (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Reset All Data
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-400">Are you sure?</p>
                            <p className="text-xs text-red-300/70 mt-1">This will delete all clients, transactions, tasks, and events. This cannot be undone.</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowResetConfirm(false)}
                            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleReset}
                            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-all"
                          >
                            Yes, Reset Everything
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
