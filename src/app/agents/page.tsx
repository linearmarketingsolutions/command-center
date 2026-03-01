"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Plus,
  Play,
  Pause,
  Settings,
  Activity,
  Grid3X3,
  List,
  Search,
  MoreVertical,
} from "lucide-react";

const tabs = [
  { name: "All Agents", icon: Grid3X3, href: "/agents" },
  { name: "Active", icon: Play, href: "/agents/active" },
  { name: "Paused", icon: Pause, href: "/agents/paused" },
  { name: "Settings", icon: Settings, href: "/agents/settings" },
];

const agents = [
  {
    id: 1,
    name: "Content Writer",
    status: "active",
    type: "Creative",
    tasks: 12,
    successRate: "94%",
    lastActive: "2 min ago",
  },
  {
    id: 2,
    name: "Email Assistant",
    status: "active",
    type: "Communication",
    tasks: 48,
    successRate: "98%",
    lastActive: "5 min ago",
  },
  {
    id: 3,
    name: "Code Reviewer",
    status: "paused",
    type: "Development",
    tasks: 23,
    successRate: "91%",
    lastActive: "1 hr ago",
  },
  {
    id: 4,
    name: "Data Analyst",
    status: "active",
    type: "Analytics",
    tasks: 7,
    successRate: "96%",
    lastActive: "10 min ago",
  },
  {
    id: 5,
    name: "Social Manager",
    status: "active",
    type: "Marketing",
    tasks: 34,
    successRate: "92%",
    lastActive: "15 min ago",
  },
  {
    id: 6,
    name: "Research Bot",
    status: "paused",
    type: "Research",
    tasks: 89,
    successRate: "88%",
    lastActive: "3 hr ago",
  },
];

export default function AgentsPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Tab Navigation */}
      <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold flex items-center">
              <Bot className="w-5 h-5 mr-2 text-[#e94560]" />
              Agents
            </h1>
            <nav className="flex items-center space-x-1">
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
                <span className="hidden sm:inline">New Agent</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-[#e94560]/50"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              <List className="w-4 h-4 mr-2" />
              List
            </button>
            <button className="flex items-center px-3 py-2 bg-[#e94560]/20 border border-[#e94560]/50 rounded-lg text-sm text-[#e94560]">
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid
            </button>
          </div>
        </motion.div>

        {/* Agents Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-[#e94560]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-[#e94560]/20 flex items-center justify-center mr-3">
                    <Bot className="w-5 h-5 text-[#e94560]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{agent.name}</h3>
                    <span className="text-xs text-gray-500">{agent.type}</span>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Tasks</p>
                  <p className="text-lg font-semibold">{agent.tasks}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Success</p>
                  <p className="text-lg font-semibold text-green-500">{agent.successRate}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      agent.status === "active" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-xs text-gray-400 capitalize">{agent.status}</span>
                </div>
                <span className="text-xs text-gray-500">{agent.lastActive}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
