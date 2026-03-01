"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Plus,
  Edit3,
  Calendar,
  FolderOpen,
  LayoutGrid,
  List,
  Search,
  MoreVertical,
  Clock,
  Eye,
} from "lucide-react";

const tabs = [
  { name: "All Content", icon: LayoutGrid, href: "/content" },
  { name: "Drafts", icon: Edit3, href: "/content/drafts" },
  { name: "Scheduled", icon: Calendar, href: "/content/scheduled" },
  { name: "Published", icon: FolderOpen, href: "/content/published" },
];

const content = [
  {
    id: 1,
    title: "Product Launch Announcement",
    type: "Blog Post",
    status: "published",
    views: 1247,
    date: "Feb 25, 2026",
    excerpt: "We're excited to announce our biggest release yet...",
  },
  {
    id: 2,
    title: "Q1 Strategy Document",
    type: "Document",
    status: "draft",
    views: 0,
    date: "Feb 26, 2026",
    excerpt: "Overview of our strategic initiatives for the first quarter...",
  },
  {
    id: 3,
    title: "Social Media Campaign",
    type: "Campaign",
    status: "scheduled",
    views: 0,
    date: "Mar 1, 2026",
    excerpt: "Spring promotion campaign across all channels...",
  },
  {
    id: 4,
    title: "User Guide v2.0",
    type: "Documentation",
    status: "published",
    views: 3420,
    date: "Feb 20, 2026",
    excerpt: "Complete guide to using our platform effectively...",
  },
  {
    id: 5,
    title: "Newsletter - March Edition",
    type: "Newsletter",
    status: "draft",
    views: 0,
    date: "Feb 27, 2026",
    excerpt: "Monthly updates, tips, and company news...",
  },
  {
    id: 6,
    title: "Case Study: Enterprise Client",
    type: "Case Study",
    status: "published",
    views: 892,
    date: "Feb 18, 2026",
    excerpt: "How we helped streamline their workflow...",
  },
];

const statusColors: Record<string, string> = {
  published: "bg-green-500/20 text-green-500",
  draft: "bg-yellow-500/20 text-yellow-500",
  scheduled: "bg-blue-500/20 text-blue-500",
};

export default function ContentPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Tab Navigation */}
      <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#e94560]" />
              Content
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
                <span className="hidden sm:inline">Create</span>
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
              placeholder="Search content..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-[#e94560]/50"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              <List className="w-4 h-4 mr-2" />
              List
            </button>
            <button className="flex items-center px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              <LayoutGrid className="w-4 h-4 mr-2" />
              Grid
            </button>
          </div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {content.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-[#e94560]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-gray-500">{item.type}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      statusColors[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-base mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.excerpt}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {item.date}
                </div>
                {item.views > 0 && (
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {item.views.toLocaleString()} views
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
