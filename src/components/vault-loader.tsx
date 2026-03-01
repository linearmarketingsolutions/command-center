"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileText, ChevronRight, ChevronDown, Plus, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface VaultItem {
  name: string;
  path: string;
  type: "folder" | "file";
  children?: VaultItem[];
}

const vaultStructure: VaultItem[] = [
  {
    name: "Brain",
    path: "brain",
    type: "folder",
    children: [
      { name: "Clients", path: "brain/Clients", type: "folder" },
      { name: "Projects", path: "brain/Projects", type: "folder" },
      { name: "Goals.md", path: "brain/Blake/Goals.md", type: "file" },
    ]
  },
  {
    name: "Skills",
    path: "skills",
    type: "folder",
  },
  {
    name: "Command Center",
    path: "command-center",
    type: "folder",
  },
];

interface VaultLoaderProps {
  onLoadFile?: (path: string) => void;
  className?: string;
}

export function VaultLoader({ onLoadFile, className }: VaultLoaderProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loadedFiles, setLoadedFiles] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const loadFile = (path: string) => {
    setLoadedFiles(new Set([...loadedFiles, path]));
    onLoadFile?.(path);
  };

  const renderItem = (item: VaultItem, depth = 0) => {
    const isExpanded = expanded.has(item.path);
    const isLoaded = loadedFiles.has(item.path);

    return (
      <div key={item.path} style={{ marginLeft: depth * 12 }}>
        <motion.div
          whileHover={{ x: 2 }}
          className={cn(
            "flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition-colors",
            isLoaded ? "bg-green-500/10 text-green-400" : "hover:bg-white/5"
          )}
          onClick={() => {
            if (item.type === "folder") {
              toggleFolder(item.path);
            } else {
              loadFile(item.path);
            }
          }}
        >
          {item.type === "folder" ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              )}
              <Folder className="w-4 h-4 text-yellow-500/70" />
            </>
          ) : (
            <>
              <span className="w-3" />
              <FileText className="w-4 h-4 text-blue-400/70" />
            </>
          )}
          <span className="text-sm text-gray-300">{item.name}</span>
          {isLoaded && <span className="text-xs text-green-500 ml-auto">✓</span>}
        </motion.div>

        <AnimatePresence>
          {item.type === "folder" && isExpanded && item.children && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {item.children.map(child => renderItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
          "bg-white/5 hover:bg-white/10 border border-white/10 transition-colors",
          className
        )}
      >
        <Brain className="w-4 h-4" />
        Vault
        {loadedFiles.size > 0 && (
          <span className="ml-1 text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
            {loadedFiles.size}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md pointer-events-auto"
              >
                <div className="p-6 rounded-2xl bg-[#0f0f14] border border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Brain Vault Explorer
                    </h3>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-sm text-gray-400 mb-4">
                    Click files to load them into context. Progressive disclosure - only load what you need.
                  </p>

                  <div className="space-y-1">
                    {vaultStructure.map(item => renderItem(item))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-500">
                      {loadedFiles.size} files loaded • Click ✓ to unload
                    </p>
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
