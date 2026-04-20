"use client";

import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color?: string;
  glow?: boolean;
  size?: "sm" | "md" | "lg";
  sub?: string;
  className?: string;
  children?: React.ReactNode;
}

const sizeConfig = {
  sm: { value: "text-xl", icon: "w-8 h-8", iconInner: "w-3.5 h-3.5", unit: "text-xs", label: "text-xs" },
  md: { value: "text-2xl", icon: "w-9 h-9", iconInner: "w-4 h-4", unit: "text-sm", label: "text-xs" },
  lg: { value: "text-3xl", icon: "w-11 h-11", iconInner: "w-5 h-5", unit: "text-base", label: "text-sm" },
};

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  color = "#6366f1",
  glow = false,
  size = "md",
  sub,
  className,
  children,
}: MetricCardProps) {
  const sizes = sizeConfig[size];
  const iconBg = color + "18";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "#10b981" : trend === "down" ? "#f43f5e" : "#94a3b8";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all duration-300",
        "hover:border-white/10 hover:shadow-card-hover",
        glow && "animate-glow-pulse",
        className
      )}
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Hover radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 120%, ${color}1a 0%, transparent 70%)`,
        }}
      />

      {/* Top gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-card rounded-2xl" />

      <div className="relative">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          {Icon && (
            <div
              className={cn("rounded-xl flex items-center justify-center shrink-0", sizes.icon)}
              style={{ backgroundColor: iconBg }}
            >
              <Icon className={sizes.iconInner} style={{ color }} />
            </div>
          )}
          {trend && trendValue && (
            <div className="flex items-center gap-1" style={{ color: trendColor }}>
              <TrendIcon className="w-3 h-3" />
              <span className="text-xs font-semibold tabular">{trendValue}</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-end gap-1 mb-0.5">
          <span
            className={cn("font-bold metric-number leading-none", sizes.value)}
            style={{ color }}
          >
            {value}
          </span>
          {unit && (
            <span className={cn("text-muted-foreground mb-0.5 leading-tight", sizes.unit)}>
              {unit}
            </span>
          )}
        </div>

        {/* Label */}
        <p className={cn("text-muted-foreground font-medium mt-0.5", sizes.label)}>{label}</p>

        {/* Sub */}
        {sub && (
          <p className="text-2xs font-medium mt-1" style={{ color }}>
            {sub}
          </p>
        )}

        {/* Custom children */}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}
