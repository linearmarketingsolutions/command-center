"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FileText,
  ChevronRight,
  ChevronDown,
  X,
  Upload,
  Eye,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVault, VAULT_STRUCTURE, LoadedFile } from "./vault-context";

interface BrainVaultExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect?: (path: string, content: string) => void;
}

type FolderState = Record<string, boolean>;

interface FilePreviewProps {
  path: string;
  content: string;
  onClose: () => void;
  onLoad: () => void;
  isLoaded: boolean;
}

function FilePreview({ path, content, onClose, onLoad, isLoaded }: FilePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute z-50 w-80 p-4 rounded-xl bg-[#1a1a24] border border-white/10 shadow-2xl"
      style={{ top: "100%", left: 0, marginTop: 8 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-white truncate">{path}</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto mb-4">
        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
          {content.slice(0, 800)}{content.length > 800 && "..."}
        </pre>
      </div>
      <button
        onClick={onLoad}
        disabled={isLoaded}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
          isLoaded
            ? "bg-green-500/20 text-green-400 cursor-default"
            : "bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30 border border-[#00d4ff]/30"
        )}
      >
        {isLoaded ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Loaded
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Load into Context
          </>
        )}
      </button>
    </motion.div>
  );
}

interface FileNodeProps {
  folder: string;
  file: string;
  isLoaded: boolean;
  onHover: (path: string | null) => void;
  hoveredPath: string | null;
  onLoadFile: (path: string) => void;
}

function FileNode({ folder, file, isLoaded, onHover, hoveredPath, onLoadFile }: FileNodeProps) {
  const fullPath = `${folder}/${file}`;
  const isHovered = hoveredPath === fullPath;

  // Simulated file content - in real implementation, this would be fetched
  const getSimulatedContent = useCallback((path: string) => {
    return `# ${path}\n\nThis is a simulated preview of the file content. In the full implementation, this would fetch the actual file content from the brain vault.\n\n## Key Sections\n- Section 1\n- Section 2\n- Section 3\n\nLast updated: ${new Date().toLocaleDateString()}`;
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => onHover(fullPath)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all group",
          isLoaded
            ? "bg-green-500/10 border border-green-500/20"
            : "hover:bg-white/5 border border-transparent"
        )}
        onClick={() => onLoadFile(fullPath)}
      >
        <FileText className={cn(
          "w-4 h-4",
          isLoaded ? "text-green-400" : "text-gray-400 group-hover:text-[#00d4ff]"
        )} />
        <span className={cn(
          "text-sm truncate",
          isLoaded ? "text-green-400" : "text-gray-300 group-hover:text-white"
        )}>
          {file}
        </span>
        {isLoaded && (
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400 ml-auto" />
        )}
      </div>

      <AnimatePresence>
        {isHovered && !isLoaded && (
          <FilePreview
            path={fullPath}
            content={getSimulatedContent(fullPath)}
            onClose={() => onHover(null)}
            onLoad={() => onLoadFile(fullPath)}
            isLoaded={isLoaded}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface FolderNodeProps {
  name: string;
  files: string[];
  expandedFolders: FolderState;
  toggleFolder: (name: string) => void;
  loadedFiles: LoadedFile[];
  onHover: (path: string | null) => void;
  hoveredPath: string | null;
  onLoadFile: (path: string) => void;
}

function FolderNode({
  name,
  files,
  expandedFolders,
  toggleFolder,
  loadedFiles,
  onHover,
  hoveredPath,
  onLoadFile,
}: FolderNodeProps) {
  const isExpanded = expandedFolders[name];
  const loadedCount = files.filter((f) =>
    loadedFiles.some((lf) => lf.path === `${name}/${f}`)
  ).length;

  return (
    <div className="mb-1">
      <button
        onClick={() => toggleFolder(name)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
        <Folder className="w-4 h-4 text-[#00d4ff]" />
        <span className="text-sm font-medium text-gray-200">{name}</span>
        <span className="text-xs text-gray-500 ml-auto">
          {loadedCount > 0 && `${loadedCount}/`}{files.length}
        </span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-6 pl-3 border-l border-white/10 space-y-0.5 mt-1">
              {files.map((file) => (
                <FileNode
                  key={file}
                  folder={name}
                  file={file}
                  isLoaded={loadedFiles.some((lf) => lf.path === `${name}/${file}`)}
                  onHover={onHover}
                  hoveredPath={hoveredPath}
                  onLoadFile={onLoadFile}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BrainVaultExplorer({ isOpen, onClose, onFileSelect }: BrainVaultExplorerProps) {
  const { loadedFiles, loadFile, isFileLoaded } = useVault();
  const [expandedFolders, setExpandedFolders] = useState<FolderState>({
    "Active-Projects": true,
    "Clients": true,
  });
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFolder = useCallback((name: string) => {
    setExpandedFolders((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const handleLoadFile = useCallback((path: string) => {
    // In real implementation, this would fetch the file content
    const simulatedContent = `# ${path}\n\nFile content would be loaded here from the actual brain vault filesystem.`;
    loadFile(path, simulatedContent);
    if (onFileSelect) {
      onFileSelect(path, simulatedContent);
    }
  }, [loadFile, onFileSelect]);

  // Filter folders based on search
  const filteredStructure = Object.entries(VAULT_STRUCTURE).reduce(
    (acc, [folder, files]) => {
      if (searchQuery) {
        const matchesFolder = folder.toLowerCase().includes(searchQuery.toLowerCase());
        const matchingFiles = files.filter((f) =>
          f.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (matchesFolder || matchingFiles.length > 0) {
          acc[folder] = matchesFolder ? files : matchingFiles;
        }
      } else {
        acc[folder] = files;
      }
      return acc;
    },
    {} as Record<string, string[]>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        />

        {/* Explorer Panel */}
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-96 z-50 bg-[#0f0f14] border-l border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-[#00d4ff]" />
                <h2 className="text-lg font-semibold text-white">Brain Vault</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/20"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                {loadedFiles.length} loaded
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#00d4ff]" />
                {loadedFiles.reduce((sum, f) => sum + f.readCount, 0)} reads
              </span>
            </div>
          </div>

          {/* File Tree */}
          <div className="p-3 overflow-y-auto" style={{ height: "calc(100% - 140px)" }}>
            {Object.entries(filteredStructure).map(([folder, files]) => (
              <FolderNode
                key={folder}
                name={folder}
                files={files}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                loadedFiles={loadedFiles}
                onHover={setHoveredPath}
                hoveredPath={hoveredPath}
                onLoadFile={handleLoadFile}
              />
            ))}

            {Object.keys(filteredStructure).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No files match your search</p>
              </div>
            )}
          </div>

          {/* Footer - Loaded Files */}
          {loadedFiles.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#1a1a24] border-t border-white/10">
              <h4 className="text-xs font-medium text-gray-400 mb-2">Loaded Files</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {loadedFiles.slice(-5).map((file) => (
                  <div
                    key={file.path}
                    className="flex items-center gap-2 px-2 py-1.5 rounded bg-green-500/10 border border-green-500/20"
                  >
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400 truncate flex-1">
                      {file.path}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </>
    </AnimatePresence>
  );
}
