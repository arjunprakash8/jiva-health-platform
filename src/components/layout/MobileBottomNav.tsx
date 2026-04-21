"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MobileNavItem {
  icon: LucideIcon;
  label: string;
  id: string;
  badge?: string | number;
}

interface MobileBottomNavProps {
  navItems: MobileNavItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export default function MobileBottomNav({
  navItems,
  activeSection,
  onSectionChange,
}: MobileBottomNavProps) {
  // Show max 5 items, rest hidden
  const visibleItems = navItems.slice(0, 5);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 overflow-x-auto"
      style={{
        backgroundColor: "hsl(240 21% 7%)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex min-w-max">
        {visibleItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 px-4 py-3 min-w-[64px] flex-1 transition-all duration-200",
                isActive ? "text-[#6366f1]" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#6366f1] rounded-full" />
              )}

              {/* Icon with optional badge */}
              <div className="relative">
                <item.icon
                  className={cn("w-5 h-5 transition-transform duration-200", isActive && "scale-110")}
                />
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "absolute -top-1.5 -right-1.5 text-[9px] font-bold rounded-full leading-none flex items-center justify-center",
                      item.badge === "LIVE"
                        ? "bg-emerald-500/25 text-emerald-400 px-1 py-0.5 animate-pulse"
                        : "w-4 h-4 bg-[#f43f5e] text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  isActive ? "text-[#6366f1]" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
