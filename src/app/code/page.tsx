"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code,
  Plus,
  Search,
  GitBranch,
  Play,
  Terminal,
  Folder,
  FileCode,
  Bug,
  Settings,
  MoreVertical,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

const tabs = [
  { name: "Projects", icon: Folder, href: "/code" },
  { name: "Snippets", icon: FileCode, href: "/code/snippets" },
  { name: "Run", icon: Play, href: "/code/run" },
  { name: "Terminal", icon: Terminal, href: "/code/terminal" },
  { name: "Debug", icon: Bug, href: "/code/debug" },
  { name: "Settings", icon: Settings, href: "/code/settings" },
];

const projects = [
  {
    id: 1,
    name: "command-center",
    description: "Central operations dashboard",
    language: "TypeScript",
    lastModified: "2 hours ago",
    branch: "main",
    files: 24,
  },
  {
    id: 2,
    name: "api-server",
    description: "Backend API services",
    language: "Node.js",
    lastModified: "1 day ago",
    branch: "develop",
    files: 56,
  },
  {
    id: 3,
    name: "mobile-app",
    description: "React Native mobile application",
    language: "TypeScript",
    lastModified: "3 days ago",
    branch: "feature/auth",
    files: 128,
  },
  {
    id: 4,
    name: "data-pipeline",
    description: "ETL and data processing",
    language: "Python",
    lastModified: "1 week ago",
    branch: "main",
    files: 42,
  },
  {
    id: 5,
    name: "landing-page",
    description: "Marketing website",
    language: "Next.js",
    lastModified: "2 weeks ago",
    branch: "main",
    files: 18,
  },
];

const snippets = [
  {
    id: 1,
    title: "API Error Handler",
    language: "typescript",
    code: `export const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};`,
  },
  {
    id: 2,
    title: "React Hook - useDebounce",
    language: "typescript",
    code: `export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debounced;
}`,
  },
];

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500/20 text-blue-400",
  "Node.js": "bg-green-500/20 text-green-400",
  Python: "bg-yellow-500/20 text-yellow-400",
  "Next.js": "bg-white/20 text-white",
};

export default function CodePage() {
  const pathname = usePathname();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Tab Navigation */}
      <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold flex items-center">
              <Code className="w-5 h-5 mr-2 text-[#e94560]" />
              Code
            </h1>
            <nav className="flex items-center space-x-1 overflow-x-auto">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-[#e94560]/20 text-[#e94560]"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </Link>
                );
              })}
              <button className="ml-4 flex items-center px-3 py-2 bg-[#e94560] hover:bg-[#e94560]/80 rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">New</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects, files, or snippets..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-[#e94560]/50"
            />
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Folder className="w-5 h-5 mr-2 text-[#e94560]" />
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-[#e94560]/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-[#e94560]/20 flex items-center justify-center mr-3">
                      <Code className="w-5 h-5 text-[#e94560]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{project.name}</h3>
                      <span className="text-xs text-gray-500">{project.files} files</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <p className="text-sm text-gray-400 mb-4">{project.description}</p>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      languageColors[project.language] || "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {project.language}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <GitBranch className="w-3 h-3 mr-1" />
                    {project.branch}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Snippets Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FileCode className="w-5 h-5 mr-2 text-[#e94560]" />
            Code Snippets
          </h2>
          <div className="space-y-4">
            {snippets.map((snippet, index) => (
              <motion.div
                key={snippet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center">
                    <FileCode className="w-4 h-4 text-[#e94560] mr-2" />
                    <span className="font-medium text-sm">{snippet.title}</span>
                    <span className="ml-3 text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                      {snippet.language}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(snippet.code, snippet.id)}
                    className="flex items-center px-2 py-1 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors"
                  >
                    {copiedId === snippet.id ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-black/30 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
