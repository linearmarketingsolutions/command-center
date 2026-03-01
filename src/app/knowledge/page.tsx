"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Plus,
  Search,
  Folder,
  Tag,
  Clock,
  Star,
  FileText,
  MoreVertical,
  ExternalLink,
  Bookmark,
} from "lucide-react";

const tabs = [
  { name: "All Notes", icon: BookOpen, href: "/knowledge" },
  { name: "Favorites", icon: Star, href: "/knowledge/favorites" },
  { name: "Recent", icon: Clock, href: "/knowledge/recent" },
  { name: "Tags", icon: Tag, href: "/knowledge/tags" },
];

const categories = [
  { name: "Documentation", count: 24, icon: FileText },
  { name: "SOPs", count: 12, icon: Bookmark },
  { name: "Research", count: 8, icon: Search },
  { name: "Resources", count: 15, icon: Folder },
];

const notes = [
  {
    id: 1,
    title: "Project Alpha - Technical Spec",
    excerpt:
      "Comprehensive technical specification for Project Alpha including architecture decisions...",
    category: "Documentation",
    tags: ["tech", "spec"],
    updatedAt: "2 hours ago",
    starred: true,
  },
  {
    id: 2,
    title: "Client Onboarding Process",
    excerpt: "Step-by-step guide for onboarding new clients to our platform...",
    category: "SOPs",
    tags: ["process", "client"],
    updatedAt: "Yesterday",
    starred: false,
  },
  {
    id: 3,
    title: "Market Research - Q1 2026",
    excerpt: "Analysis of market trends and competitive landscape for Q1...",
    category: "Research",
    tags: ["research", "market"],
    updatedAt: "3 days ago",
    starred: true,
  },
  {
    id: 4,
    title: "API Integration Guide",
    excerpt: "Documentation for integrating with our REST API including authentication...",
    category: "Documentation",
    tags: ["api", "dev"],
    updatedAt: "1 week ago",
    starred: false,
  },
  {
    id: 5,
    title: "Content Marketing Playbook",
    excerpt: "Best practices and templates for content marketing campaigns...",
    category: "Resources",
    tags: ["marketing", "content"],
    updatedAt: "2 weeks ago",
    starred: true,
  },
  {
    id: 6,
    title: "Team Retreat Planning",
    excerpt: "Ideas and logistics for the upcoming team retreat in Q2...",
    category: "SOPs",
    tags: ["team", "planning"],
    updatedAt: "2 weeks ago",
    starred: false,
  },
];

export default function KnowledgePage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Tab Navigation */}
      <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-[#e94560]" />
              Knowledge
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
                <span className="hidden sm:inline">New Note</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:border-[#e94560]/50"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-[#e94560]/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <category.icon className="w-5 h-5 text-[#e94560]" />
                <span className="text-lg font-semibold">{category.count}</span>
              </div>
              <p className="text-sm text-gray-400">{category.name}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Notes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-[#e94560]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-[#e94560] bg-[#e94560]/10 px-2 py-1 rounded-full">
                  {note.category}
                </span>
                <div className="flex items-center gap-2">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Star
                      className={`w-4 h-4 ${
                        note.starred ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
                      }`}
                    />
                  </button>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-base mb-2 group-hover:text-[#e94560] transition-colors">
                {note.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{note.excerpt}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {note.tags.map((tag) => (
                    <span key={tag} className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {note.updatedAt}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
