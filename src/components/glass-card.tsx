"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "bordered" | "glow";
  size?: "sm" | "md" | "lg" | "xl";
  padding?: "none" | "sm" | "md" | "lg";
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  hover?: boolean;
  animate?: boolean;
}

const variantStyles = {
  default: [
    "bg-slate-950/40",
    "backdrop-blur-xl",
    "border border-cyan-500/20",
    "shadow-[0_8px_32px_-12px_rgba(6,182,212,0.15)]",
  ],
  elevated: [
    "bg-slate-950/50",
    "backdrop-blur-2xl",
    "border border-cyan-400/30",
    "shadow-[0_16px_48px_-12px_rgba(6,182,212,0.25)]",
  ],
  bordered: [
    "bg-slate-950/30",
    "backdrop-blur-xl",
    "border-2 border-cyan-500/40",
    "shadow-[0_0_0_1px_rgba(6,182,212,0.1),0_8px_32px_-12px_rgba(6,182,212,0.15)]",
  ],
  glow: [
    "bg-slate-950/60",
    "backdrop-blur-2xl",
    "border border-cyan-400/50",
    "shadow-[0_0_60px_-15px_rgba(6,182,212,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
  ],
};

const sizeStyles = {
  sm: "rounded-xl",
  md: "rounded-2xl",
  lg: "rounded-3xl",
  xl: "rounded-3xl",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-6 lg:p-8",
};

export function GlassCard({
  children,
  className,
  variant = "default",
  size = "md",
  padding = "md",
  header,
  footer,
  onClick,
  hover = false,
  animate = false,
}: GlassCardProps) {
  const Component = onClick ? motion.button : motion.div;

  const content = (
    <>
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-cyan-400/30 rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-400/30 rounded-tr-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-400/30 rounded-bl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-cyan-400/30 rounded-br-2xl pointer-events-none" />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {header && (
          <div className="pb-4 mb-4 border-b border-cyan-500/10">{header}</div>
        )}
        <div className={paddingStyles[padding]}>{children}</div>
        {footer && (
          <div className="pt-4 mt-4 border-t border-cyan-500/10">{footer}</div>
        )}
      </div>
    </>
  );

  const baseClasses = cn(
    "relative overflow-hidden",
    variantStyles[variant],
    sizeStyles[size],
    onClick && "cursor-pointer",
    hover && "transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_16px_48px_-12px_rgba(6,182,212,0.3)]",
    className
  );

  if (animate) {
    return (
      <Component
        className={baseClasses}
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={hover ? { scale: 1.01 } : undefined}
        whileTap={onClick ? { scale: 0.99 } : undefined}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        {content}
      </Component>
    );
  }

  return (
    <Component
      className={baseClasses}
      onClick={onClick}
      whileHover={hover ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
    >
      {content}
    </Component>
  );
}

// Simple version without animations
export function GlassCardStatic({
  children,
  className,
  variant = "default",
  size = "md",
  padding = "md",
  header,
  footer,
  onClick,
  hover = false,
}: Omit<GlassCardProps, "animate">) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        variantStyles[variant],
        sizeStyles[size],
        onClick && "cursor-pointer",
        hover && "transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_16px_48px_-12px_rgba(6,182,212,0.3)]",
        className
      )}
      onClick={onClick}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-cyan-400/30 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-cyan-400/30 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-cyan-400/30 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-cyan-400/30 rounded-br-xl pointer-events-none" />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {header && (
          <div className="pb-4 mb-4 border-b border-cyan-500/10">{header}</div>
        )}
        <div className={paddingStyles[padding]}>{children}</div>
        {footer && (
          <div className="pt-4 mt-4 border-t border-cyan-500/10">{footer}</div>
        )}
      </div>
    </div>
  );
}
