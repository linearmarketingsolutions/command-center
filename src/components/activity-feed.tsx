"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatusIndicator, StatusType } from "./status-indicator";

interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: Date | string;
  status?: StatusType;
  icon?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  metadata?: Record<string, string>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
  }>;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
  maxItems?: number;
  showTimestamps?: boolean;
  groupByDate?: boolean;
  emptyState?: React.ReactNode;
  onItemClick?: (item: ActivityItem) => void;
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTimestamp(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ActivityFeed({
  items,
  className,
  maxItems,
  showTimestamps = true,
  groupByDate = false,
  emptyState,
  onItemClick,
}: ActivityFeedProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  if (displayItems.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-8 rounded-2xl",
          "bg-slate-950/20 border border-cyan-500/10 border-dashed",
          className
        )}
      >
        {emptyState || (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">No recent activity</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence mode="popLayout">
        {displayItems.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: [0.23, 1, 0.32, 1],
            }}
            onClick={() => onItemClick?.(item)}
            className={cn(
              "group relative flex items-start gap-4 p-4 rounded-xl",
              "bg-slate-950/30 backdrop-blur-sm",
              "border border-transparent hover:border-cyan-500/20",
              "transition-all duration-200",
              onItemClick && "cursor-pointer hover:bg-slate-900/50"
            )}
          >
            {/* Status indicator / Icon */}
            <div className="relative flex-shrink-0">
              {item.user ? (
                <div className="relative">
                  {item.user.avatar ? (
                    <img
                      src={item.user.avatar}
                      alt={item.user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center ring-2 ring-cyan-500/30">
                      <span className="text-sm font-medium text-cyan-300">
                        {item.user.initials || item.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {item.status && (
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <StatusIndicator status={item.status} size="xs" pulse={false} showDot={true} />
                    </div>
                  )}
                </div>
              ) : item.icon ? (
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    "bg-cyan-500/10 border border-cyan-500/20",
                    "text-cyan-400"
                  )}
                >
                  {item.icon}
                </div>
              ) : item.status ? (
                <StatusIndicator status={item.status} size="lg" pulse />
              ) : null}

              {/* Connector line */}
              {index < displayItems.length - 1 && (
                <div className="absolute top-12 left-5 w-px h-[calc(100%+16px)] bg-gradient-to-b from-cyan-500/20 to-transparent" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-100 truncate">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="mt-0.5 text-sm text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Metadata */}
                  {item.metadata && Object.keys(item.metadata).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(item.metadata).map(([key, value]) => (
                        <span
                          key={key}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-800/50 text-slate-400 border border-slate-700/50"
                        >
                          <span className="text-slate-500 mr-1">{key}:</span>
                          {value}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  {item.actions && item.actions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            action.variant === "primary" &&
                              "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30",
                            action.variant === "danger" &&
                              "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30",
                            (!action.variant || action.variant === "secondary") &&
                              "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50"
                          )}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                {showTimestamps && (
                  <div className="flex-shrink-0 text-right">
                    <time
                      className="text-xs text-slate-500 tabular-nums"
                      dateTime={new Date(item.timestamp).toISOString()}
                      title={new Date(item.timestamp).toLocaleString()}
                    >
                      {formatTimeAgo(item.timestamp)}
                    </time>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {formatTimestamp(item.timestamp)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Compact version for sidebars/dense UIs
interface ActivityFeedCompactProps {
  items: ActivityItem[];
  className?: string;
  maxItems?: number;
}

export function ActivityFeedCompact({
  items,
  className,
  maxItems,
}: ActivityFeedCompactProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <div className={cn("space-y-1", className)}>
      {displayItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.03 }}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg",
            "hover:bg-slate-900/50 transition-colors cursor-pointer"
          )}
        >
          {/* Dot */}
          <div
            className={cn(
              "w-2 h-2 rounded-full flex-shrink-0",
              item.status === "success" && "bg-emerald-400",
              item.status === "error" && "bg-red-400",
              item.status === "warning" && "bg-amber-400",
              item.status === "syncing" && "bg-cyan-400 animate-pulse",
              !item.status && "bg-slate-500"
            )}
          />

          {/* Title */}
          <span className="flex-1 text-sm text-slate-300 truncate">
            {item.title}
          </span>

          {/* Time */}
          <span className="text-xs text-slate-500 tabular-nums">
            {formatTimeAgo(item.timestamp)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// Activity feed with header
interface ActivityFeedWithHeaderProps extends ActivityFeedProps {
  title: string;
  viewAllHref?: string;
  onViewAll?: () => void;
}

export function ActivityFeedWithHeader({
  title,
  viewAllHref,
  onViewAll,
  ...feedProps
}: ActivityFeedWithHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          {title}
        </h3>
        {(viewAllHref || onViewAll) && (
          <a
            href={viewAllHref}
            onClick={onViewAll}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View all
          </a>
        )}
      </div>
      <ActivityFeed {...feedProps} />
    </div>
  );
}
