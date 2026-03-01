"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Building2, Dumbbell, User, MoreVertical, Trash2 } from "lucide-react";
import { useData, Client } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { AddClientForm } from "@/components/add-client-form";
import { DataExport } from "@/components/data-export";
import { useState } from "react";
import { cn } from "@/lib/utils";

const statusColors = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  paused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  churned: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function RevenuePage() {
  const { clients, deleteClient } = useData();
  const { business, getBusinessColor } = useBusinessContext();
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);

  // Filter clients by business context
  const filteredClients = business === "personal" 
    ? clients 
    : clients.filter(c => c.business === business);

  const lmsClients = filteredClients.filter(c => c.business === "lms");
  const commitClients = filteredClients.filter(c => c.business === "commit");

  const lmsMrr = lmsClients.reduce((acc, c) => acc + (c.status === "active" ? c.mrr : 0), 0);
  const commitMrr = commitClients.reduce((acc, c) => acc + (c.status === "active" ? c.mrr : 0), 0);
  const totalMrr = lmsMrr + commitMrr;

  const metrics = [
    { label: "Total MRR", value: `$${totalMrr.toLocaleString()}`, change: "+12%", positive: true },
    { label: "LMS Revenue", value: `$${lmsMrr.toLocaleString()}`, change: "+67%", positive: true },
    { label: "Commit Revenue", value: `$${commitMrr.toLocaleString()}`, change: "+32%", positive: true },
    { label: "Target MRR", value: "$10,000", change: `${Math.round((totalMrr / 10000) * 100)}% reached`, positive: true },
  ];

  const revenueData = [
    { name: "Linear Marketing Solutions", value: lmsMrr, color: "#00d4ff", icon: Building2 },
    { name: "Commit Fitness", value: commitMrr, color: "#e94560", icon: Dumbbell },
  ];

  const handleDelete = (id: string) => {
    deleteClient(id);
    setShowDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Revenue Overview</h2>
        <div className="flex items-center gap-2">
          <DataExport />
          <AddClientForm />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5"
          >
            <p className="text-sm text-gray-400">{metric.label}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-bold">{metric.value}</p>
              <span className={`text-xs flex items-center ${metric.positive ? "text-green-500" : "text-red-500"}`}>
                {metric.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {metric.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Bars */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Revenue Breakdown</h3>
          
          <div className="space-y-4">
            {revenueData.filter(item => item.value > 0).map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-medium">${item.value.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / totalMrr) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.round((item.value / totalMrr) * 100)}%</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Client Breakdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Client Breakdown</h3>
          
          {/* LMS Clients */}
          {(business === "personal" || business === "lms") && lmsClients.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-[#00d4ff]" />
                <h4 className="text-sm font-medium text-gray-300">Linear Marketing Solutions</h4>
                <span className="ml-auto text-sm font-bold text-[#00d4ff]">${lmsMrr.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                {lmsClients.map((client) => (
                  <ClientRow 
                    key={client.id} 
                    client={client} 
                    showDeleteId={showDeleteId}
                    setShowDeleteId={setShowDeleteId}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Commit Fitness Clients */}
          {(business === "personal" || business === "commit") && commitClients.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Dumbbell className="w-4 h-4 text-[#e94560]" />
                <h4 className="text-sm font-medium text-gray-300">Commit Fitness</h4>
                <span className="ml-auto text-sm font-bold text-[#e94560]">${commitMrr.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                {commitClients.map((client) => (
                  <ClientRow 
                    key={client.id} 
                    client={client} 
                    showDeleteId={showDeleteId}
                    setShowDeleteId={setShowDeleteId}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No clients yet.</p>
              <p className="text-sm mt-1">Click "Add Client" to get started.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Revenue Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Revenue Goals</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Current MRR</span>
              <span className="text-sm font-medium">${totalMrr.toLocaleString()} / $10,000</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalMrr / 10000) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-[#00d4ff] to-[#e94560] rounded-full"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round((totalMrr / 10000) * 100)}% of target reached</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ClientRow({ 
  client, 
  showDeleteId, 
  setShowDeleteId, 
  onDelete 
}: { 
  client: Client; 
  showDeleteId: string | null; 
  setShowDeleteId: (id: string | null) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg group">
      <div className="flex items-center gap-3">
        <span className={cn("text-xs px-2 py-0.5 rounded border", statusColors[client.status])}>
          {client.status}
        </span>
        <span className="text-sm">{client.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">${client.mrr.toLocaleString()}/mo</span>
        <div className="relative">
          <button 
            onClick={() => setShowDeleteId(showDeleteId === client.id ? null : client.id)}
            className="p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {showDeleteId === client.id && (
            <div className="absolute right-0 top-full mt-1 p-2 bg-red-500/20 border border-red-500/30 rounded-lg z-10">
              <p className="text-xs text-red-400 mb-2">Delete {client.name}?</p>
              <div className="flex gap-1">
                <button 
                  onClick={() => setShowDeleteId(null)}
                  className="px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => onDelete(client.id)}
                  className="px-2 py-1 text-xs bg-red-500 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
