"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

export interface LoadedFile {
  path: string;
  content: string;
  loadedAt: Date;
  lastReadAt: Date;
  readCount: number;
}

export interface SuggestedFile {
  path: string;
  reason: string;
  relevanceScore: number;
}

interface VaultContextType {
  // Currently loaded files
  loadedFiles: LoadedFile[];
  // Suggested files based on current task/context
  suggestedFiles: SuggestedFile[];
  // Actions
  loadFile: (path: string, content: string) => void;
  unloadFile: (path: string) => void;
  markFileAsRead: (path: string) => void;
  clearLoadedFiles: () => void;
  // Suggestions
  updateSuggestions: (taskTitle: string, taskDescription?: string) => void;
  clearSuggestions: () => void;
  // Helpers
  isFileLoaded: (path: string) => boolean;
  getFileContent: (path: string) => string | undefined;
  getLoadedFilePaths: () => string[];
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

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
  "client": ["brain/Clients/", "Systems/HANDOFF-TEMPLATE.md"],
  "website": ["Active-Projects/LMS-Website.md", "Systems/Tech-Stack.md"],
  "app": ["Active-Projects/Commit-Fit-App.md", "Active-Projects/Family-Budget-App.md", "Active-Projects/Personal-Schedule-App.md"],
  "schedule": ["Active-Projects/Personal-Schedule-App.md", "Blake/Working-Style.md"],
  "calendar": ["Active-Projects/Personal-Schedule-App.md"],
  "finance": ["Blake/Goals.md", "Businesses/IronVest-Ventures.md"],
  "revenue": ["Businesses/LMS.md", "Businesses/Commit-Fitness.md"],
  "content": ["Knowledge/Key-Articles.md", "Systems/Capabilities.md"],
  "social media": ["Knowledge/Key-Articles.md"],
  "tiktok": ["Active-Projects/Commit-Fit-App.md"],
  "strategy": ["Knowledge/Decisions-Log.md", "Soul/Core-Beliefs.md"],
  "decision": ["Knowledge/Decisions-Log.md"],
  "system": ["Systems/Config-State.md", "Systems/Capabilities.md", "Systems/Tech-Stack.md"],
  "automation": ["Systems/APIs-Integrations.md", "Systems/subagent-playbook.md"],
  "integration": ["Systems/APIs-Integrations.md"],
  "model": ["Systems/Models.md"],
  "routing": ["AGENTS.md", "Systems/Models.md"],
  "skill": ["Systems/Skill-Agent-Matrix.md"],
  "vault": ["brain/README.md"],
  "brain": ["brain/README.md"],
  "context": ["brain/README.md", "Blake/Context.md"],
  "goals": ["Blake/Goals.md"],
  "travel": ["Blake/Travel-2026.md"],
  "point 2 point": ["Clients/Point-2-Point.md"],
  "p2p": ["Clients/Point-2-Point.md", "Businesses/P2P-nanoFIBER.md"],
  "acx": ["Clients/ACX-Technologies.md", "Clients/ACX-Investor-Leads-27.md"],
};

// Static vault structure for the explorer
export const VAULT_STRUCTURE = {
  "Active-Projects": [
    "Commit-Fit-App.md",
    "Command-Center.md",
    "Family-Budget-App.md",
    "LMS-Website.md",
    "LMS-Website-Health.md",
    "Personal-Schedule-App.md",
    "Pitch-Deck-Agent.md",
  ],
  "Blake": [
    "Context.md",
    "Goals.md",
    "Relationships.md",
    "Travel-2026.md",
    "Working-Style.md",
  ],
  "Businesses": [
    "Commit-Fitness.md",
    "IronVest-Ventures.md",
    "LMS.md",
    "P2P-nanoFIBER.md",
  ],
  "Clients": [
    "ACX-Investor-Leads-27.md",
    "ACX-Investor-Leads-Complete-65.md",
    "ACX-Technologies.md",
    "Ben-Farrell.md",
    "Cabling-Resources.md",
    "Cold-Blood-Tattoos.md",
    "Drake-Arthur.md",
    "Garrett-Williams.md",
    "Heritage-RV.md",
    "Iceberg-Cabinets.md",
    "Jake-Ensign.md",
    "Jennifer-Williams.md",
    "Juan-Luna.md",
    "Nick-Long.md",
    "Point-2-Point.md",
    "Sean-Warner.md",
  ],
  "Knowledge": [
    "Decisions-Log.md",
    "Key-Articles.md",
  ],
  "Soul": [
    "Anti-Patterns.md",
    "Core-Beliefs.md",
    "Productive-Flaw.md",
  ],
  "Systems": [
    "Agent-Registry.md",
    "APIs-Integrations.md",
    "Capabilities.md",
    "Config-State.md",
    "HANDOFF-TEMPLATE.md",
    "Models.md",
    "Skill-Agent-Matrix.md",
    "subagent-playbook.md",
    "Tech-Stack.md",
  ],
};

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [loadedFiles, setLoadedFiles] = useState<LoadedFile[]>([]);
  const [suggestedFiles, setSuggestedFiles] = useState<SuggestedFile[]>([]);

  const loadFile = useCallback((path: string, content: string) => {
    setLoadedFiles((prev) => {
      const existing = prev.find((f) => f.path === path);
      if (existing) {
        // Update content if file already loaded
        return prev.map((f) =>
          f.path === path
            ? { ...f, content, loadedAt: new Date() }
            : f
        );
      }
      return [
        ...prev,
        {
          path,
          content,
          loadedAt: new Date(),
          lastReadAt: new Date(),
          readCount: 0,
        },
      ];
    });
  }, []);

  const unloadFile = useCallback((path: string) => {
    setLoadedFiles((prev) => prev.filter((f) => f.path !== path));
  }, []);

  const markFileAsRead = useCallback((path: string) => {
    setLoadedFiles((prev) =>
      prev.map((f) =>
        f.path === path
          ? { ...f, lastReadAt: new Date(), readCount: f.readCount + 1 }
          : f
      )
    );
  }, []);

  const clearLoadedFiles = useCallback(() => {
    setLoadedFiles([]);
  }, []);

  const isFileLoaded = useCallback(
    (path: string) => loadedFiles.some((f) => f.path === path),
    [loadedFiles]
  );

  const getFileContent = useCallback(
    (path: string) => loadedFiles.find((f) => f.path === path)?.content,
    [loadedFiles]
  );

  const getLoadedFilePaths = useCallback(
    () => loadedFiles.map((f) => f.path),
    [loadedFiles]
  );

  const updateSuggestions = useCallback((taskTitle: string, taskDescription?: string) => {
    const searchText = `${taskTitle} ${taskDescription || ""}`.toLowerCase();
    const suggestions: SuggestedFile[] = [];
    const addedPaths = new Set<string>();

    // Check for keyword matches
    for (const [keyword, paths] of Object.entries(KEYWORD_MAPPINGS)) {
      if (searchText.includes(keyword.toLowerCase())) {
        for (const path of paths) {
          if (!addedPaths.has(path)) {
            suggestions.push({
              path,
              reason: `Matches "${keyword}"`,
              relevanceScore: 1.0,
            });
            addedPaths.add(path);
          }
        }
      }
    }

    // Add recently loaded files as suggestions with lower priority
    loadedFiles.slice(-3).forEach((file) => {
      if (!addedPaths.has(file.path)) {
        suggestions.push({
          path: file.path,
          reason: "Recently loaded",
          relevanceScore: 0.5,
        });
        addedPaths.add(file.path);
      }
    });

    // Sort by relevance
    suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);

    setSuggestedFiles(suggestions.slice(0, 5)); // Top 5 suggestions
  }, [loadedFiles]);

  const clearSuggestions = useCallback(() => {
    setSuggestedFiles([]);
  }, []);

  const value = useMemo(
    () => ({
      loadedFiles,
      suggestedFiles,
      loadFile,
      unloadFile,
      markFileAsRead,
      clearLoadedFiles,
      updateSuggestions,
      clearSuggestions,
      isFileLoaded,
      getFileContent,
      getLoadedFilePaths,
    }),
    [
      loadedFiles,
      suggestedFiles,
      loadFile,
      unloadFile,
      markFileAsRead,
      clearLoadedFiles,
      updateSuggestions,
      clearSuggestions,
      isFileLoaded,
      getFileContent,
      getLoadedFilePaths,
    ]
  );

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}
