"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "default" | "pills" | "underline" | "glass";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export function TabBar({
  tabs,
  activeTab,
  onChange,
  variant = "default",
  size = "md",
  fullWidth = false,
  className,
}: TabBarProps) {
  const variants = {
    default: {
      container: "bg-slate-950/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-1",
      tab: "relative px-4 py-2 rounded-xl text-sm font-medium transition-colors",
      active: "text-cyan-50",
      inactive: "text-slate-400 hover:text-cyan-200 hover:bg-cyan-500/10",
      indicator: "absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-cyan-600/10 rounded-xl border border-cyan-400/30",
    },
    pills: {
      container: "bg-slate-950/30 rounded-full p-1 border border-cyan-500/20",
      tab: "relative px-5 py-2 rounded-full text-sm font-medium transition-colors",
      active: "text-slate-950",
      inactive: "text-slate-400 hover:text-cyan-200",
      indicator: "absolute inset-0 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)]",
    },
    underline: {
      container: "border-b border-cyan-500/20",
      tab: "relative px-4 py-3 text-sm font-medium transition-colors",
      active: "text-cyan-300",
      inactive: "text-slate-400 hover:text-cyan-200",
      indicator: "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]",
    },
    glass: {
      container: "bg-gradient-to-b from-slate-900/60 to-slate-950/80 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-2 shadow-[0_8px_32px_-12px_rgba(6,182,212,0.2)]",
      tab: "relative px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200",
      active: "text-cyan-50",
      inactive: "text-slate-400 hover:text-cyan-200 hover:bg-cyan-500/5",
      indicator: "absolute inset-0 bg-cyan-500/10 rounded-2xl border border-cyan-400/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
    },
  };

  const sizeStyles = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const activeTabIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div
      className={cn(
        "relative flex",
        fullWidth && "w-full",
        variants[variant].container,
        className
      )}
      role="tablist"
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        const isDisabled = tab.disabled;

        return (
          <motion.button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(tab.id)}
            className={cn(
              variants[variant].tab,
              sizeStyles[size],
              isActive ? variants[variant].active : variants[variant].inactive,
              isDisabled && "opacity-40 cursor-not-allowed",
              fullWidth && "flex-1 text-center",
              "flex items-center justify-center gap-2"
            )}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={!isDisabled ? { scale: 1.02 } : undefined}
            whileTap={!isDisabled ? { scale: 0.98 } : undefined}
          >
            {/* Active indicator background */}
            {isActive && variant !== "underline" && (
              <motion.div
                layoutId={`tab-indicator-${variant}`}
                className={variants[variant].indicator}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
              />
            )}

            {/* Underline indicator */}
            {isActive && variant === "underline" && (
              <motion.div
                layoutId="tab-underline"
                className={variants[variant].indicator}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}

            {/* Tab content */}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && (
                <span className={cn("w-4 h-4", isActive && "text-cyan-300")}>
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={cn(
                    "ml-1 px-1.5 py-0.5 text-xs rounded-full min-w-[18px] text-center",
                    variant === "pills" && isActive
                      ? "bg-slate-950/30 text-cyan-100"
                      : isActive
                      ? "bg-cyan-400/30 text-cyan-100"
                      : "bg-slate-700/50 text-slate-300"
                  )}
                >
                  {tab.badge > 99 ? "99+" : tab.badge}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}

      {/* Sliding glow effect for glass variant */}
      {variant === "glass" && (
        <motion.div
          className="absolute h-1 rounded-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none"
          style={{
            bottom: "4px",
            left: `${(activeTabIndex / tabs.length) * 100 + 2}%`,
            width: `${100 / tabs.length - 4}%`,
          }}
          animate={{
            left: `${(activeTabIndex / tabs.length) * 100 + 2}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}
    </div>
  );
}

// Vertical tab bar variant
interface VerticalTabBarProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function VerticalTabBar({
  tabs,
  activeTab,
  onChange,
  className,
}: VerticalTabBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-2 rounded-2xl",
        "bg-slate-950/40 backdrop-blur-xl border border-cyan-500/20",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        const isDisabled = tab.disabled;

        return (
          <motion.button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left",
              "transition-colors duration-200",
              isActive
                ? "text-cyan-50"
                : "text-slate-400 hover:text-cyan-200 hover:bg-cyan-500/10",
              isDisabled && "opacity-40 cursor-not-allowed"
            )}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            {/* Active background */}
            {isActive && (
              <motion.div
                layoutId="vertical-tab-indicator"
                className={cn(
                  "absolute inset-0 rounded-xl",
                  "bg-gradient-to-r from-cyan-500/20 to-transparent",
                  "border-l-2 border-cyan-400"
                )}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
              />
            )}

            {/* Content */}
            <span className="relative z-10 flex items-center gap-3 w-full">
              {tab.icon && (
                <span className={cn("w-5 h-5", isActive && "text-cyan-300")}>
                  {tab.icon}
                </span>
              )}
              <span className="flex-1">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-full",
                    isActive
                      ? "bg-cyan-400/30 text-cyan-100"
                      : "bg-slate-700/50 text-slate-300"
                  )}
                >
                  {tab.badge > 99 ? "99+" : tab.badge}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
