"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: number;
}

interface NavProps {
  items: NavItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

export function Nav({ items, activeId, onItemClick, className }: NavProps) {
  return (
    <nav
      className={cn(
        "flex items-center gap-1 p-2 rounded-2xl",
        "bg-slate-950/40 backdrop-blur-xl border border-cyan-500/20",
        "shadow-[0_0_40px_-12px_rgba(6,182,212,0.25)]",
        "overflow-x-auto scrollbar-hide",
        className
      )}
    >
      {items.map((item, index) => {
        const isActive = activeId === item.id;

        return (
          <motion.button
            key={item.id}
            onClick={() => {
              item.onClick?.();
              onItemClick?.(item.id);
            }}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-xl",
              "text-sm font-medium whitespace-nowrap",
              "transition-colors duration-200",
              isActive
                ? "text-cyan-50"
                : "text-slate-400 hover:text-cyan-200 hover:bg-cyan-500/10"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Active background glow */}
            {isActive && (
              <motion.div
                layoutId="nav-active-glow"
                className={cn(
                  "absolute inset-0 rounded-xl",
                  "bg-gradient-to-b from-cyan-500/20 to-cyan-600/10",
                  "border border-cyan-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                )}
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
              {item.icon && (
                <span className={cn("w-4 h-4", isActive && "text-cyan-300")}>
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={cn(
                    "ml-1 px-1.5 py-0.5 text-xs rounded-full",
                    isActive
                      ? "bg-cyan-400/30 text-cyan-100"
                      : "bg-slate-700/50 text-slate-300"
                  )}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
