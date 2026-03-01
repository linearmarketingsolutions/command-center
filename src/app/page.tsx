"use client";

import { motion } from "framer-motion";
import { 
  Command, 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Clock,
  Shield,
  DollarSign,
  Inbox,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useBusinessContext } from "@/components/business-context";
import { useData } from "@/components/data-context";
import { EditableTasks } from "@/components/editable-tasks";
import { TaskRow, useTaskFilters } from "@/components/task-list";
import { TaskChatBox } from "@/components/task-chat-box";

export default function Home() {
  const { business, getBusinessColor, getBusinessName } = useBusinessContext();
  const { metrics, events, tasks, clients, updateTask } = useData();

  // Get filtered tasks
  const { todayTasks, inboxTasks } = useTaskFilters(tasks);
  
  // Filter by current business
  const businessTasks = tasks.filter(t => t.business === business);
  const businessEvents = events.filter(e => e.business === business);
  const pendingTasks = businessTasks.filter(t => t.status !== "done").length;
  const completedTasks = businessTasks.filter(t => t.status === "done").length;
  
  // Business inbox tasks (first 5)
  const businessInboxTasks = inboxTasks
    .filter(t => business === "personal" ? true : t.business === business)
    .slice(0, 5);

  // Get MRR based on business type
  let mrr = 0;
  if (business === "lms") {
    mrr = metrics.lms.mrr;
  } else if (business === "commit") {
    mrr = metrics.commit.mrr;
  }

  const handleComplete = (taskId: string) => {
    updateTask(taskId, { status: "done" });
  };

  return (
    <main className="min-h-screen p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header with Business Name */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-xl border"
              style={{ 
                backgroundColor: getBusinessColor() + "20",
                borderColor: getBusinessColor() + "30"
              }}
            >
              <Command className="w-8 h-8" style={{ color: getBusinessColor() }} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">
                {getBusinessName()}
              </h1>
              <p className="text-sm text-gray-400">
                Command Center • {business === "personal" ? "Personal Dashboard" : business === "lms" ? "Marketing Agency" : "Fitness Coaching"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="jarvis-badge flex items-center gap-1.5"
              style={{ 
                backgroundColor: getBusinessColor() + "20",
                borderColor: getBusinessColor() + "30",
                color: getBusinessColor()
              }}
            >
              <Shield className="w-3 h-3" />
              {business === "personal" ? "Personal" : business.toUpperCase()} Mode
            </span>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {business !== "personal" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="jarvis-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="w-5 h-5" style={{ color: getBusinessColor() }} />
                <span className="text-xs text-gray-400 uppercase tracking-wider">MRR</span>
              </div>
              <p className="text-2xl font-bold">${mrr.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Monthly Recurring</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="jarvis-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <CheckCircle2 className="w-5 h-5" style={{ color: getBusinessColor() }} />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Tasks</span>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{pendingTasks}</p>
              <span className="text-sm text-gray-500 mb-1">pending</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{completedTasks} completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="jarvis-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-5 h-5" style={{ color: getBusinessColor() }} />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Today</span>
            </div>
            <p className="text-2xl font-bold">{businessEvents.length}</p>
            <p className="text-xs text-gray-500 mt-1">Events scheduled</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="jarvis-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Activity className="w-5 h-5" style={{ color: getBusinessColor() }} />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Status</span>
            </div>
            <p className="text-2xl font-bold text-green-400">Online</p>
            <p className="text-xs text-gray-500 mt-1">All systems operational</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="jarvis-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: getBusinessColor() + "20" }}
                >
                  <Calendar className="w-5 h-5" style={{ color: getBusinessColor() }} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Today
                  </h3>
                  <p className="text-xs text-gray-500">{todayTasks.length} tasks</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {todayTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No tasks for today</p>
                </div>
              ) : (
                todayTasks.slice(0, 5).map((task, index) => (
                  <TaskRow 
                    key={task.id} 
                    task={task} 
                    clients={clients}
                    onComplete={() => handleComplete(task.id)}
                    index={index}
                  />
                ))
              )}
              {todayTasks.length > 5 && (
                <Link 
                  href="/tasks"
                  className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors pt-2"
                >
                  View all {todayTasks.length} tasks <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
            <TaskChatBox />
          </motion.div>

          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="jarvis-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: getBusinessColor() + "20" }}
                >
                  <Clock className="w-5 h-5" style={{ color: getBusinessColor() }} />
                </div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Today&apos;s Schedule
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              {businessEvents.length > 0 ? (
                businessEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 bg-white/5 rounded-xl"
                  >
                    <div 
                      className="w-1 h-10 rounded-full"
                      style={{ backgroundColor: getBusinessColor() }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>{event.time}</span>
                        <span>•</span>
                        <span>{event.duration}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No events today</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Task Inbox Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="jarvis-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: "#6b728020" }}
              >
                <Inbox className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Task Inbox
                </h3>
                <p className="text-xs text-gray-500">
                  {business === "personal" 
                    ? inboxTasks.length 
                    : inboxTasks.filter(t => t.business === business).length
                  } unassigned tasks
                </p>
              </div>
            </div>
            <Link 
              href="/tasks"
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {businessInboxTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Inbox is clear!</p>
              </div>
            ) : (
              businessInboxTasks.map((task, index) => (
                <TaskRow 
                  key={task.id} 
                  task={task} 
                  clients={clients}
                  onComplete={() => handleComplete(task.id)}
                  index={index}
                />
              ))
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-8"
        >
          <p className="text-xs text-gray-500">
            JARVIS Command Center v0.1.0 • Built for Blake
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
