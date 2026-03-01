"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles, MessageSquare, Play, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: "active" | "beta" | "offline";
  color: string;
  features: string[];
}

const agents: Agent[] = [
  {
    id: "aria",
    name: "ARIA",
    description: "Adaptive Responsive Interface Architect — designs and builds UI/UX",
    icon: Sparkles,
    status: "active",
    color: "from-purple-500 via-cyan-500 to-blue-500",
    features: ["Design concepts", "React/Next.js code", "Animations", "Accessibility"]
  },
  {
    id: "marvin",
    name: "Marvin",
    description: "Chief of Staff — orchestration, task management, research",
    icon: Bot,
    status: "active",
    color: "from-emerald-500 to-teal-500",
    features: ["Task tracking", "Research", "Coordination", "Strategy"]
  }
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [chatInput, setChatInput] = useState("");
  const router = useRouter();

  const startAgentChat = (agent: Agent) => {
    if (agent.id === "aria") {
      // Open ARIA in full interface
      router.push("/aria");
    }
  };

  const handleQuickChat = () => {
    if (!chatInput.trim()) return;
    // Simple chat functionality - would connect to agent backend
    console.log("Quick chat:", chatInput);
    setChatInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Agents</h2>
          <p className="text-sm text-gray-400">AI assistants for specialized tasks</p>
        </div>
      </div>

      {/* Quick Chat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          <h3 className="font-medium">Quick Agent Chat</h3>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleQuickChat()}
            placeholder="Ask any agent for quick help..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
          />
          <button
            onClick={handleQuickChat}
            disabled={!chatInput.trim()}
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 disabled:opacity-50 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          For complex tasks, select an agent below and start a dedicated session
        </p>
      </motion.div>

      {/* Agents List */}
      <div className="grid gap-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors group cursor-pointer"
            onClick={() => setSelectedAgent(agent)}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center flex-shrink-0`}>
                <agent.icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold">{agent.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    agent.status === "active" 
                      ? "bg-green-500/20 text-green-400" 
                      : agent.status === "beta"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}>
                    {agent.status}
                  </span>
                </div>
                
                <p className="text-gray-400 mb-3">{agent.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {agent.features.map((feature) => (
                    <span key={feature} className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startAgentChat(agent);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
              >
                <Play className="w-4 h-4" />
                Start Chat
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Agent Modal */}
      {selectedAgent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAgent(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0f0f14] border border-white/10 rounded-2xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center`}>
                <selectedAgent.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{selectedAgent.name}</h3>
                <p className="text-gray-400">{selectedAgent.description}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-300">Capabilities</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedAgent.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedAgent(null);
                  startAgentChat(selectedAgent);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Start Full Session
              </button>
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
