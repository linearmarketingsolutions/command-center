"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Send,
  Plus,
  Search,
  MoreHorizontal,
  Clock,
  Archive,
  Star,
} from "lucide-react";

const tabs = [
  { name: "All Chats", icon: MessageSquare, href: "/chat" },
  { name: "Favorites", icon: Star, href: "/chat/favorites" },
  { name: "Archived", icon: Archive, href: "/chat/archived" },
];

const conversations = [
  {
    id: 1,
    name: "General Assistant",
    preview: "I've analyzed the data and found some interesting patterns...",
    time: "2 min ago",
    unread: 2,
    avatar: "GA",
  },
  {
    id: 2,
    name: "Code Helper",
    preview: "Here's the optimized version of that function you asked about.",
    time: "15 min ago",
    unread: 0,
    avatar: "CH",
  },
  {
    id: 3,
    name: "Content Creator",
    preview: "Draft 3 is ready for your review. Let me know what you think!",
    time: "1 hr ago",
    unread: 1,
    avatar: "CC",
  },
  {
    id: 4,
    name: "Research Assistant",
    preview: "I've compiled the sources you requested about market trends.",
    time: "3 hr ago",
    unread: 0,
    avatar: "RA",
  },
  {
    id: 5,
    name: "Brainstorm Partner",
    preview: "That idea has potential. Here are some variations to consider...",
    time: "Yesterday",
    unread: 0,
    avatar: "BP",
  },
];

export default function ChatPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Tab Navigation */}
      <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-[#e94560]" />
              Chat
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
                <span className="hidden sm:inline">New Chat</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversation List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-[#e94560]/50"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {conversations.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${
                    index === 0 ? "bg-white/5" : ""
                  }`}
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-[#e94560]/20 flex items-center justify-center text-[#e94560] text-sm font-semibold mr-3">
                      {chat.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{chat.preview}</p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="ml-2 w-5 h-5 bg-[#e94560] rounded-full flex items-center justify-center text-xs font-medium">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#e94560]/20 flex items-center justify-center text-[#e94560] text-sm font-semibold mr-3">
                  GA
                </div>
                <div>
                  <h3 className="font-medium">General Assistant</h3>
                  <span className="text-xs text-green-500 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    Online
                  </span>
                </div>
              </div>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                  <p className="text-sm">Hello! How can I help you today?</p>
                  <span className="text-xs text-gray-500 mt-1 block">10:00 AM</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-[#e94560]/20 rounded-2xl rounded-tr-sm px-4 py-3">
                  <p className="text-sm">Can you analyze the recent sales data?</p>
                  <span className="text-xs text-gray-500 mt-1 block">10:02 AM</span>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                  <p className="text-sm">
                    I've analyzed the data and found some interesting patterns. Revenue is up 23%
                    compared to last month, with the highest growth in the enterprise segment.
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">10:03 AM</span>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:border-[#e94560]/50"
                />
                <button className="p-3 bg-[#e94560] hover:bg-[#e94560]/80 rounded-xl transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
