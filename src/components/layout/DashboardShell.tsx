"use client";

import { useState } from "react";
import Link from "next/link";
import { type LucideIcon, ChevronLeft, ChevronRight, Bell, Menu, X, Home, Settings, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  id: string;
  badge?: string | number;
}

export interface DashboardShellProps {
  navItems: NavItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  role: "patient" | "provider" | "insurer" | "admin";
  userName: string;
  userInitials: string;
  userSub: string;
  notificationCount?: number;
  topBarTitle: string;
  topBarSub?: string;
  children: React.ReactNode;
}

const roleGradients: Record<string, string> = {
  patient: "from-[#14b8a6] to-[#6366f1]",
  provider: "from-[#3b82f6] to-[#6366f1]",
  insurer: "from-[#8b5cf6] to-[#6366f1]",
  admin: "from-[#f59e0b] to-[#6366f1]",
};

const roleLabels: Record<string, string> = {
  patient: "Patient Portal",
  provider: "Provider Portal",
  insurer: "Insurer Portal",
  admin: "Admin Portal",
};

export default function DashboardShell({
  navItems,
  activeSection,
  onSectionChange,
  role,
  userName,
  userInitials,
  userSub,
  notificationCount = 0,
  topBarTitle,
  topBarSub,
  children,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const gradient = roleGradients[role];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-border/60", collapsed && "justify-center px-3")}>
        <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-glow-teal", gradient)}>
          <Activity className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-foreground tracking-tight leading-tight">JIVA</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{roleLabels[role]}</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <div key={item.id} className="relative group px-2">
              <button
                onClick={() => { onSectionChange(item.id); setMobileOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#6366f1]/15 text-[#6366f1] sidebar-item-active"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-[#6366f1]" : "")} style={{ width: "1.125rem", height: "1.125rem" }} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none",
                        item.badge === "LIVE"
                          ? "bg-emerald-500/20 text-emerald-400 animate-pulse"
                          : "bg-[#f43f5e]/15 text-[#f43f5e] min-w-[18px] text-center"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Collapsed tooltip */}
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 hidden group-hover:flex items-center gap-2 bg-[hsl(240_22%_12%)] border border-border rounded-lg px-3 py-2 shadow-card whitespace-nowrap pointer-events-none">
                  <span className="text-xs font-medium text-foreground">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none",
                      item.badge === "LIVE" ? "bg-emerald-500/20 text-emerald-400" : "bg-[#f43f5e]/15 text-[#f43f5e]"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className={cn("border-t border-border/60 p-3 space-y-1", collapsed && "flex flex-col items-center")}>
        {/* Settings */}
        <div className="relative group">
          <button className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground transition-all duration-200",
            collapsed && "justify-center px-2"
          )}>
            <Settings className="shrink-0" style={{ width: "1.125rem", height: "1.125rem" }} />
            {!collapsed && <span>Settings</span>}
          </button>
          {collapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 hidden group-hover:flex bg-[hsl(240_22%_12%)] border border-border rounded-lg px-3 py-2 shadow-card whitespace-nowrap pointer-events-none">
              <span className="text-xs font-medium text-foreground">Settings</span>
            </div>
          )}
        </div>

        {/* User */}
        <div className={cn("flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-default", collapsed && "justify-center")}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className={cn("text-white text-xs font-bold bg-gradient-to-br", gradient)}>
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-foreground truncate leading-tight">{userName}</p>
              <p className="text-[10px] text-muted-foreground truncate leading-tight">{userSub}</p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground transition-all duration-200",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col shrink-0 bg-[hsl(240_21%_7%)] border-r border-border/60 transition-all duration-300 ease-spring overflow-hidden",
          collapsed ? "w-[72px]" : "w-[240px]"
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.32, 1)" }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 w-[240px] bg-[hsl(240_21%_7%)] border-r border-border/60 flex flex-col animate-slide-in">
            <button
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-5 bg-[hsl(240_21%_7%)]/80 backdrop-blur-md border-b border-border/60 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="md:hidden w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-sm font-semibold text-foreground leading-tight">{topBarTitle}</h1>
              {topBarSub && <p className="text-xs text-muted-foreground leading-tight">{topBarSub}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors">
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#f43f5e] rounded-full text-white text-[9px] flex items-center justify-center font-bold animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Home link */}
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground h-9 px-3 text-xs rounded-xl">
              <Link href="/"><Home className="w-3.5 h-3.5 mr-1.5" />Home</Link>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
