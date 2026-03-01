"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard,
  Zap,
  Bot,
  MessageSquare,
  FileText,
  Mail,
  BookOpen,
  Code,
  Command,
  CheckCircle2,
  Calendar,
  DollarSign,
  Building2,
  Dumbbell,
  User,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBusinessContext } from "@/components/business-context";

const navItems = [
  { id: "home", label: "Home", icon: LayoutDashboard, href: "/" },
  { id: "schedule", label: "Schedule", icon: Calendar, href: "/schedule" },
  { id: "tasks", label: "Tasks", icon: CheckCircle2, href: "/tasks" },
  { id: "ops", label: "Ops", icon: Zap, href: "/ops" },
  { id: "agents", label: "Agents", icon: Bot, href: "/agents" },
  { id: "chat", label: "Chat", icon: MessageSquare, href: "/chat" },
  { id: "content", label: "Content", icon: FileText, href: "/content" },
  { id: "comms", label: "Comms", icon: Mail, href: "/comms" },
  { id: "knowledge", label: "Knowledge", icon: BookOpen, href: "/knowledge" },
  { id: "code", label: "Code", icon: Code, href: "/code" },
  { id: "finances", label: "Finances", icon: DollarSign, href: "/finances/revenue" },
];

const businessOptions = [
  { id: "personal", label: "Personal", icon: User, color: "#8b5cf6" },
  { id: "lms", label: "LMS", icon: Building2, color: "#00d4ff" },
  { id: "commit", label: "Commit", icon: Dumbbell, color: "#e94560" },
];

export function MainNav() {
  const pathname = usePathname();
  const { business, setBusiness, getBusinessColor } = useBusinessContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Bar - Logo + Business Toggle */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl lg:pl-64"
      >
        <div className="h-full flex items-center justify-between px-4">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center gap-3 lg:hidden">
            <div 
              className="p-2 rounded-lg border"
              style={{ 
                backgroundColor: getBusinessColor() + "20",
                borderColor: getBusinessColor() + "50"
              }}
            >
              <Command className="w-5 h-5" style={{ color: getBusinessColor() }} />
            </div>
          </Link>

          {/* Center - can add breadcrumbs here later */}
          <div className="flex-1" />

          {/* Business Toggle - Top Right */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
              {businessOptions.map((option) => {
                const isActive = business === option.id;
                const Icon = option.icon;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => setBusiness(option.id as any)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                      isActive ? "text-white" : "text-gray-400 hover:text-white"
                    )}
                    style={{
                      backgroundColor: isActive ? option.color + "30" : "transparent",
                      border: isActive ? `1px solid ${option.color}` : "1px solid transparent",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: option.color }} />
                    <span className="hidden sm:inline">{option.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* LEFT Side Navigation */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 w-64 border-r border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg border"
                style={{ 
                  backgroundColor: getBusinessColor() + "20",
                  borderColor: getBusinessColor() + "50"
                }}
              >
                <Command className="w-5 h-5" style={{ color: getBusinessColor() }} />
              </div>
              <div>
                <span className="text-lg font-semibold text-white">Command</span>
                <span className="text-lg font-semibold ml-1" style={{ color: getBusinessColor() }}>Center</span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                    style={{
                      backgroundColor: isActive ? getBusinessColor() + "20" : undefined,
                      border: isActive ? `1px solid ${getBusinessColor()}40` : "1px solid transparent",
                    }}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ color: isActive ? getBusinessColor() : undefined }}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: getBusinessColor() }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Bottom Status */}
          <div className="p-4 border-t border-white/10">
            <div className="p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: getBusinessColor() }}
                />
                <span className="text-xs text-gray-400 uppercase tracking-wider">System Status</span>
              </div>
              <p className="text-sm text-white">All Systems Online</p>
              <p className="text-xs text-gray-500 mt-1">v0.1.0 • JARVIS Active</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
