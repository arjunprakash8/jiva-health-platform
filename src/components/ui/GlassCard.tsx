"use client";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "teal" | "purple" | "dark" | "glow-teal" | "glow-purple";
  hover?: boolean;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
}

const variants = {
  default: "glass",
  teal: "glass-teal",
  purple: "glass-purple",
  dark: "glass-dark",
  "glow-teal": "glass-teal glow-teal",
  "glow-purple": "glass-purple glow-purple",
};

const paddings = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function GlassCard({
  children,
  className,
  variant = "default",
  hover = false,
  onClick,
  padding = "md",
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        variants[variant],
        paddings[padding],
        hover && "hover-lift cursor-pointer",
        onClick && "cursor-pointer press-scale",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
