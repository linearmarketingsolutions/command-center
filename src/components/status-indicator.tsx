"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type StatusType = "online" | "offline" | "away" | "busy" | "warning" | "error" | "success" | "idle" | "syncing";

interface StatusIndicatorProps {
  status: StatusType;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  pulse?: boolean;
  label?: string;
  labelPosition?: "left" | "right";
  className?: string;
  showDot?: boolean;
}

const statusConfig: Record<
  StatusType,
  { color: string; glow: string; label: string }
> = {
  online: {
    color: "bg-emerald-500",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.6)]",
    label: "Online",
  },
  offline: {
    color: "bg-slate-500",
    glow: "",
    label: "Offline",
  },
  away: {
    color: "bg-amber-500",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.5)]",
    label: "Away",
  },
  busy: {
    color: "bg-rose-500",
    glow: "shadow-[0_0_12px_rgba(244,63,94,0.6)]",
    label: "Busy",
  },
  warning: {
    color: "bg-amber-400",
    glow: "shadow-[0_0_12px_rgba(251,191,36,0.6)]",
    label: "Warning",
  },
  error: {
    color: "bg-red-500",
    glow: "shadow-[0_0_16px_rgba(239,68,68,0.7)]",
    label: "Error",
  },
  success: {
    color: "bg-emerald-400",
    glow: "shadow-[0_0_12px_rgba(52,211,153,0.6)]",
    label: "Success",
  },
  idle: {
    color: "bg-slate-400",
    glow: "",
    label: "Idle",
  },
  syncing: {
    color: "bg-cyan-400",
    glow: "shadow-[0_0_12px_rgba(34,211,238,0.6)]",
    label: "Syncing",
  },
};

const sizeConfig = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
};

const ringConfig = {
  xs: "border-2",
  sm: "border-2",
  md: "border-[2.5px]",
  lg: "border-[3px]",
  xl: "border-4",
};

export function StatusIndicator({
  status,
  size = "md",
  pulse = true,
  label,
  labelPosition = "right",
  className,
  showDot = true,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const displayLabel = label ?? config.label;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2",
        labelPosition === "left" && "flex-row-reverse",
        className
      )}
    >
      {showDot && (
        <div className="relative flex items-center justify-center">
          {/* Glow ring */}
          {pulse && config.glow && (
            <motion.span
              className={cn(
                "absolute inset-0 rounded-full",
                config.color,
                config.glow
              )}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Static dot with border */}
          <span
            className={cn(
              "relative rounded-full",
              sizeConfig[size],
              ringConfig[size],
              "border-slate-950",
              config.color,
              status === "syncing" && "animate-pulse"
            )}
          />

          {/* Inner highlight */}
          <span
            className={cn(
              "absolute top-0.5 left-0.5 rounded-full bg-white/40",
              size === "xs" && "w-[2px] h-[2px]",
              size === "sm" && "w-[3px] h-[3px]",
              size === "md" && "w-1 h-1",
              size === "lg" && "w-1 h-1",
              size === "xl" && "w-1.5 h-1.5"
            )}
          />
        </div>
      )}

      {displayLabel && (
        <span
          className={cn(
            "text-sm font-medium",
            status === "online" && "text-emerald-400",
            status === "offline" && "text-slate-400",
            status === "away" && "text-amber-400",
            status === "busy" && "text-rose-400",
            status === "warning" && "text-amber-300",
            status === "error" && "text-red-400",
            status === "success" && "text-emerald-300",
            status === "idle" && "text-slate-300",
            status === "syncing" && "text-cyan-300"
          )}
        >
          {displayLabel}
        </span>
      )}
    </div>
  );
}

// Group of status indicators
interface StatusGroupProps {
  items: Array<{
    id: string;
    status: StatusType;
    label?: string;
  }>;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  direction?: "horizontal" | "vertical";
  className?: string;
}

export function StatusGroup({
  items,
  size = "sm",
  direction = "horizontal",
  className,
}: StatusGroupProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "horizontal"
          ? "flex-row flex-wrap gap-4"
          : "flex-col gap-2",
        className
      )}
    >
      {items.map((item) => (
        <StatusIndicator
          key={item.id}
          status={item.status}
          size={size}
          label={item.label}
        />
      ))}
    </div>
  );
}

// Status badge variant
interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium",
        "bg-slate-950/60 backdrop-blur-sm border border-cyan-500/20",
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", config.color)} />
      {children}
    </span>
  );
}
