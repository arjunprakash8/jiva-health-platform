"use client";

import { useState } from "react";
import {
  LayoutDashboard, Users, Shield, AlertCircle,
  FileText, BarChart2,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import AdminPanel from "@/components/admin/AdminPanel";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Users, label: "Users", id: "users" },
  { icon: Shield, label: "RBAC", id: "rbac" },
  { icon: AlertCircle, label: "Moderation", id: "moderation" },
  { icon: FileText, label: "GDPR/ODPC", id: "gdpr" },
  { icon: BarChart2, label: "Analytics", id: "analytics" },
];

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <>
      <DashboardShell
        navItems={navItems}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        role="admin"
        userName="Admin"
        userInitials="AD"
        userSub="Platform Administrator"
        notificationCount={5}
        topBarTitle={navItems.find(n => n.id === activeSection)?.label ?? "Admin"}
        topBarSub="Platform management and oversight"
      >
        <AdminPanel activeSection={activeSection} />
      </DashboardShell>
      <MobileBottomNav navItems={navItems} activeSection={activeSection} onSectionChange={setActiveSection} />
    </>
  );
}
