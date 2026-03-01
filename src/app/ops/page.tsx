"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Zap,
  Settings,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const tabs = [
  { name: "Overview", icon: LayoutDashboard, href: "/ops" },
  { name: "Activity", icon: Activity, href: "/ops/activity" },
  { name: "Performance", icon: TrendingUp, href: "/ops/performance" },
  { name: "Settings", icon: Settings, href: "/ops/settings" },
];

const metrics = [
  { label: "System Load", value: "42%", status: "good" },
  { label: "Active Tasks", value: "24", status: "good" },
  { label: "Queue Depth", value: "8", status: "warning" },
  { label: "Uptime", value: "99.9%", status: "good" },
];

const recentActivity = [
  { action: "Agent deployed", time: "2 min ago", status: "success" },
  { action: "Task completed", time: "5 min ago", status: "success" },
  { action: "Alert triggered", time: "12 min ago", status: "warning" },
  { action: "Backup completed", time: "1 hr ago", status: "success" },
];

export default function OpsPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Tab Navigation */}
      <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">
              <Zap className="inline-block w-5 h-5 mr-2 text-[#e94560]" />
              Ops
            </h1>
            <nav className="flex space-x-1 overflow-x-auto">
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
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{metric.label}</span>
                {metric.status === "good" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{metric.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Activity className="w-5 h-5 mr-2 text-[#e94560]" />
                Recent Activity
              </h2>
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <div className="space-y-3">
              {recentActivity.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center">
                    {item.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-3" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500 mr-3" />
                    )}
                    <span className="text-sm">{item.action}</span>
                  </div>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-[#e94560]" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Deploy Agent",
                "Run Task",
                "View Logs",
                "Clear Cache",
                "Restart Service",
                "Generate Report",
              ].map((action) => (
                <button
                  key={action}
                  className="p-3 bg-white/5 hover:bg-[#e94560]/20 border border-white/10 hover:border-[#e94560]/50 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  {action}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
