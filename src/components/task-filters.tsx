"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Inbox, 
  Play, 
  Clock, 
  CheckCircle2, 
  User, 
  Building2, 
  Dumbbell, 
  Calendar,
  Search,
  X,
  Filter,
  ChevronDown
} from "lucide-react";
import { useData, TaskFilters, TaskStatus, TaskBusiness, TaskProjectPersonal, TaskPriority } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { cn } from "@/lib/utils";

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

const statusConfig: { value: TaskStatus; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'inbox', label: 'Inbox', icon: Inbox, color: '#8b5cf6' },
  { value: 'next', label: 'Next', icon: Play, color: '#00d4ff' },
  { value: 'waiting', label: 'Waiting', icon: Clock, color: '#f59e0b' },
  { value: 'done', label: 'Done', icon: CheckCircle2, color: '#22c55e' },
];

const businessConfig: { value: TaskBusiness; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'personal', label: 'Personal', icon: User, color: '#8b5cf6' },
  { value: 'lms', label: 'LMS', icon: Building2, color: '#00d4ff' },
  { value: 'commit', label: 'Commit', icon: Dumbbell, color: '#e94560' },
];

const projectConfig: { value: TaskProjectPersonal; label: string }[] = [
  { value: 'non-business', label: 'Non-Business' },
  { value: 'commit-internal', label: 'Commit Internal' },
  { value: 'lms-internal', label: 'LMS Internal' },
  { value: 'ai-edu', label: 'AI Education' },
  { value: 'finances', label: 'Finances' },
];

const priorityConfig: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#6b7280' },
  { value: 'medium', label: 'Medium', color: '#3b82f6' },
  { value: 'high', label: 'High', color: '#f59e0b' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
];

const dueDateConfig: { value: TaskFilters['dueDateRange']; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'next3days', label: 'Next 3 Days' },
  { value: 'next7days', label: 'Next 7 Days' },
  { value: 'future', label: 'Future' },
  { value: 'nodate', label: 'No Date' },
];

export function TaskFilterBar({ filters, onFiltersChange }: TaskFiltersProps) {
  const { clients, getClientsByBusiness } = useData();
  const { getBusinessColor } = useBusinessContext();
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const toggleStatus = (status: TaskStatus) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const toggleBusiness = (business: TaskBusiness) => {
    const newBusinesses = filters.business.includes(business)
      ? filters.business.filter(b => b !== business)
      : [...filters.business, business];
    onFiltersChange({ ...filters, business: newBusinesses });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: [],
      business: [],
      project: undefined,
      clientId: undefined,
      priority: undefined,
      dueDateRange: undefined,
      searchQuery: undefined,
    });
  };

  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.business.length > 0 ||
    filters.project ||
    filters.clientId ||
    filters.priority ||
    filters.dueDateRange ||
    filters.searchQuery;

  // Get available clients based on selected business
  const availableClients = filters.business.length === 1 && (filters.business[0] === 'lms' || filters.business[0] === 'commit')
    ? getClientsByBusiness(filters.business[0])
    : clients.filter(c => c.business === 'lms' || c.business === 'commit');

  return (
    <div className="space-y-4">
      {/* Search Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value || undefined })}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors text-sm"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFiltersChange({ ...filters, searchQuery: undefined })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            showMoreFilters 
              ? "bg-white/20 text-white" 
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={cn("w-3 h-3 transition-transform", showMoreFilters && "rotate-180")} />
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 mr-1">Status:</span>
        {statusConfig.map(({ value, label, icon: Icon, color }) => (
          <button
            key={value}
            onClick={() => toggleStatus(value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              filters.status.includes(value)
                ? "text-white"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            )}
            style={filters.status.includes(value) ? { backgroundColor: color + '30', border: `1px solid ${color}` } : {}}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: filters.status.includes(value) ? color : undefined }} />
            {label}
          </button>
        ))}
      </div>

      {/* Expanded Filters */}
      {showMoreFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 pt-2 border-t border-white/10"
        >
          {/* Business Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 mr-1">Business:</span>
            {businessConfig.map(({ value, label, icon: Icon, color }) => (
              <button
                key={value}
                onClick={() => toggleBusiness(value)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  filters.business.includes(value)
                    ? "text-white"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                )}
                style={filters.business.includes(value) ? { backgroundColor: color + '30', border: `1px solid ${color}` } : {}}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: filters.business.includes(value) ? color : undefined }} />
                {label}
              </button>
            ))}
          </div>

          {/* Project Filter (only for personal business) */}
          {(filters.business.includes('personal') || filters.business.length === 0) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 mr-1">Project:</span>
              <select
                value={filters.project || ''}
                onChange={(e) => onFiltersChange({ ...filters, project: (e.target.value as TaskProjectPersonal) || undefined })}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-white/30"
              >
                <option value="" className="bg-[#0f0f14]">All Projects</option>
                {projectConfig.map(({ value, label }) => (
                  <option key={value} value={value} className="bg-[#0f0f14]">{label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Client Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 mr-1">Client:</span>
            <select
              value={filters.clientId || ''}
              onChange={(e) => onFiltersChange({ ...filters, clientId: e.target.value || undefined })}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-white/30 min-w-[150px]"
            >
              <option value="" className="bg-[#0f0f14]">All Clients</option>
              {availableClients.map((client) => (
                <option key={client.id} value={client.id} className="bg-[#0f0f14]">
                  {client.name} ({client.business.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 mr-1">Priority:</span>
            {priorityConfig.map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => onFiltersChange({ ...filters, priority: filters.priority === value ? undefined : value })}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  filters.priority === value
                    ? "text-white"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                )}
                style={filters.priority === value ? { backgroundColor: color + '30', border: `1px solid ${color}` } : {}}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Due Date Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 mr-1">Due:</span>
            {dueDateConfig.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onFiltersChange({ ...filters, dueDateRange: filters.dueDateRange === value ? undefined : value })}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  filters.dueDateRange === value
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Compact version for small spaces
export function TaskFilterPills({ filters, onFiltersChange }: TaskFiltersProps) {
  const toggleStatus = (status: TaskStatus) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatuses });
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {statusConfig.map(({ value, label, icon: Icon, color }) => (
        <button
          key={value}
          onClick={() => toggleStatus(value)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all",
            filters.status.includes(value)
              ? "text-white"
              : "bg-white/5 text-gray-400 hover:text-white"
          )}
          style={filters.status.includes(value) ? { backgroundColor: color + '40' } : {}}
        >
          <Icon className="w-3 h-3" />
          {label}
        </button>
      ))}
    </div>
  );
}
