"use client";

import { motion } from "framer-motion";
import { Sparkles, Wand2, Code2, Palette } from "lucide-react";
import { useState } from "react";

export default function AriaPage() {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    // TODO: Connect to ARIA agent
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-cyan-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">ARIA</h2>
            <p className="text-sm text-gray-400">Adaptive Responsive Interface Architect</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">Qwen 7B Ready</span>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Qwen 14B Ready</span>
        </div>
      </div>

      {/* Capabilities */}
      <div className="grid grid-cols-3 gap-4">
        <CapabilityCard 
          icon={Palette}
          title="Design Concepts"
          description="Generate 2-3 visual directions for any interface"
        />
        <CapabilityCard 
          icon={Code2}
          title="Code Implementation"
          description="React/Next.js with TypeScript and Tailwind"
        />
        <CapabilityCard 
          icon={Wand2}
          title="Smart Animation"
          description="Framer Motion and GSAP animations"
        />
      </div>

      {/* Chat Interface */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-h-[400px] flex flex-col"
      >
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Describe what you want to build</p>
            <p className="text-sm opacity-70">ARIA will generate concepts and implement the code</p>
            <div className="mt-6 flex gap-2 justify-center">
              <ExampleChip text="Landing page for P2P" />
              <ExampleChip text="Dashboard with sidebar" />
              <ExampleChip text="Pricing cards with 3 tiers" />
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe what you need..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Designing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CapabilityCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl">
      <Icon className="w-6 h-6 text-cyan-400 mb-3" />
      <h3 className="font-medium text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function ExampleChip({ text }: { text: string }) {
  return (
    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-400 hover:text-white transition-colors">
      {text}
    </button>
  );
}
