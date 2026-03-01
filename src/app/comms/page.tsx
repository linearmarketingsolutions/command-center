"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  Inbox,
  Send,
  FileText,
  Trash2,
  Star,
  AlertCircle,
  Plus,
  Search,
  MoreHorizontal,
  Paperclip,
  Clock,
} from "lucide-react";

const tabs = [
  { name: "Inbox", icon: Inbox, href: "/comms", count: 12 },
  { name: "Sent", icon: Send, href: "/comms/sent" },
  { name: "Drafts", icon: FileText, href: "/comms/drafts", count: 3 },
  { name: "Starred", icon: Star, href: "/comms/starred" },
  { name: "Trash", icon: Trash2, href: "/comms/trash" },
];

const emails = [
  {
    id: 1,
    from: "Sarah Chen",
    subject: "Q1 Strategy Meeting - Action Items",
    preview:
      "Hi team, Following up on our strategy meeting yesterday, here are the key action items...",
    time: "10:23 AM",
    unread: true,
    starred: true,
    hasAttachment: true,
  },
  {
    id: 2,
    from: "Alex Rivera",
    subject: "Design mockups for review",
    preview: "Attached are the latest design mockups for the new landing page. Let me know your thoughts...",
    time: "9:45 AM",
    unread: true,
    starred: false,
    hasAttachment: true,
  },
  {
    id: 3,
    from: "Marketing Team",
    subject: "Campaign Performance Report",
    preview: "The latest campaign metrics are in. We're seeing a 34% increase in engagement...",
    time: "Yesterday",
    unread: false,
    starred: true,
    hasAttachment: false,
  },
  {
    id: 4,
    from: "Jordan Smith",
    subject: "Invoice #2341 - Payment Received",
    preview: "Thank you for your payment. This email confirms we've received your payment of $2,400...",
    time: "Yesterday",
    unread: false,
    starred: false,
    hasAttachment: true,
  },
  {
    id: 5,
    from: "Support",
    subject: "Ticket #8923 - Resolved",
    preview: "Your support ticket has been resolved. If you need further assistance, please reply...",
    time: "Feb 25",
    unread: false,
    starred: false,
    hasAttachment: false,
  },
];

export default function CommsPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Tab Navigation */}
      <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold flex items-center">
              <Mail className="w-5 h-5 mr-2 text-[#e94560]" />
              Comms
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
                    {tab.count && (
                      <span className="ml-2 px-1.5 py-0.5 bg-[#e94560] rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </Link>
                );
              })}
              <button className="ml-4 flex items-center px-3 py-2 bg-[#e94560] hover:bg-[#e94560]/80 rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Compose</span>
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
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search emails..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-[#e94560]/50"
            />
          </div>
        </motion.div>

        {/* Email List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
        >
          {emails.map((email, index) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`flex items-center p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                email.unread ? "bg-white/[0.02]" : ""
              }`}
            >
              {/* Star */}
              <button className="mr-3 flex-shrink-0">
                <Star
                  className={`w-4 h-4 ${
                    email.starred ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
                  }`}
                />
              </button>

              {/* Unread Indicator */}
              <div className="mr-3 flex-shrink-0">
                {email.unread ? (
                  <div className="w-2 h-2 bg-[#e94560] rounded-full" />
                ) : (
                  <div className="w-2 h-2" />
                )}
              </div>

              {/* Sender */}
              <div className="w-40 flex-shrink-0 mr-4">
                <span className={`text-sm ${email.unread ? "font-semibold" : ""}`}>
                  {email.from}
                </span>
              </div>

              {/* Subject & Preview */}
              <div className="flex-1 min-w-0 mr-4">
                <span className={`text-sm ${email.unread ? "font-semibold" : ""}`}>
                  {email.subject}
                </span>
                <span className="text-sm text-gray-500 ml-2">-</span>
                <span className="text-sm text-gray-500 ml-2 truncate">{email.preview}</span>
              </div>

              {/* Attachment */}
              {email.hasAttachment && (
                <Paperclip className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
              )}

              {/* Time */}
              <div className="flex items-center text-xs text-gray-500 flex-shrink-0">
                <Clock className="w-3 h-3 mr-1" />
                {email.time}
              </div>

              {/* Actions */}
              <button className="ml-3 p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-all">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
