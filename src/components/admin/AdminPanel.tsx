"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Users, TrendingUp, Activity, Shield, FileText,
  BarChart2, Search, Check, X, AlertCircle, Download, Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/ui/metric-card";
import { cn } from "@/lib/utils";

const chartTooltipStyle = {
  backgroundColor: "hsl(240 22% 9%)",
  border: "1px solid hsl(240 12% 15%)",
  borderRadius: "10px",
  fontSize: "11px",
  color: "#f0eeeb",
};

const cardShadow = "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)";

const userGrowthData = [
  { month: "Nov", users: 320, dau: 210 },
  { month: "Dec", users: 360, dau: 238 },
  { month: "Jan", users: 395, dau: 262 },
  { month: "Feb", users: 422, dau: 285 },
  { month: "Mar", users: 455, dau: 308 },
  { month: "Apr", users: 478, dau: 324 },
  { month: "May", users: 500, dau: 342 },
];

const engagementData = [
  { feature: "Vitals", usage: 88 },
  { feature: "Activity", usage: 76 },
  { feature: "Sleep", usage: 71 },
  { feature: "Nutrition", usage: 54 },
  { feature: "Chat", usage: 62 },
  { feature: "AI Insights", usage: 69 },
  { feature: "Hydration", usage: 45 },
];

const adminUsers = [
  { id: "U001", name: "Kwame Mensah", email: "kwame@example.com", role: "patient", status: "active", joined: "Jan 15, 2025", lastActive: "Today", tier: "Gold" },
  { id: "U002", name: "Dr. Ama Owusu", email: "dr.owusu@jiva.health", role: "provider", status: "active", joined: "Nov 1, 2024", lastActive: "Today", tier: "Provider" },
  { id: "U003", name: "Kofi Asante", email: "kofi@example.com", role: "patient", status: "active", joined: "Feb 10, 2025", lastActive: "Yesterday", tier: "Silver" },
  { id: "U004", name: "Abena Dankwa", email: "abena@example.com", role: "patient", status: "suspended", joined: "Dec 5, 2024", lastActive: "Apr 20", tier: "Bronze" },
  { id: "U005", name: "StarLife Insurance", email: "admin@starlife.com", role: "insurer", status: "active", joined: "Oct 1, 2024", lastActive: "Today", tier: "Enterprise" },
  { id: "U006", name: "Efua Mensah", email: "efua@example.com", role: "patient", status: "pending", joined: "May 14, 2025", lastActive: "Yesterday", tier: "Bronze" },
  { id: "U007", name: "Emmanuel Boateng", email: "emmab@example.com", role: "patient", status: "active", joined: "Jan 22, 2025", lastActive: "Today", tier: "Diamond" },
  { id: "U008", name: "Ibrahim Diallo", email: "ibrahim@example.com", role: "patient", status: "active", joined: "Mar 1, 2025", lastActive: "May 12", tier: "Gold" },
];

const roleColors: Record<string, string> = {
  patient: "#14b8a6",
  provider: "#6366f1",
  insurer: "#a78bfa",
  admin: "#f59e0b",
};

const statusColors: Record<string, string> = {
  active: "#22c55e",
  suspended: "#f43f5e",
  pending: "#f59e0b",
};

type Permission = "view_records" | "edit_records" | "manage_users" | "view_analytics" | "export_data" | "manage_billing";

const permissions: Permission[] = ["view_records", "edit_records", "manage_users", "view_analytics", "export_data", "manage_billing"];
const roles = ["patient", "provider", "insurer", "admin"];

const rbacMatrix: Record<string, Record<Permission, boolean>> = {
  patient: { view_records: true, edit_records: false, manage_users: false, view_analytics: false, export_data: true, manage_billing: false },
  provider: { view_records: true, edit_records: true, manage_users: false, view_analytics: true, export_data: true, manage_billing: false },
  insurer: { view_records: false, edit_records: false, manage_users: false, view_analytics: true, export_data: true, manage_billing: true },
  admin: { view_records: true, edit_records: true, manage_users: true, view_analytics: true, export_data: true, manage_billing: true },
};

const flaggedContent = [
  { id: "f1", user: "User #U045", content: "Post containing unverified health claim about diabetes cure.", date: "May 14, 2025", type: "Health Misinformation" },
  { id: "f2", user: "User #U112", content: "Message sharing personal medical information of another user without consent.", date: "May 13, 2025", type: "Privacy Violation" },
  { id: "f3", user: "User #U089", content: "Repeated spam messages in Care Team channel.", date: "May 12, 2025", type: "Spam" },
];

const gdprRequests = [
  { id: "g1", user: "User #U087", type: "export", status: "pending", date: "May 10, 2025" },
  { id: "g2", user: "User #U034", type: "delete", status: "completed", date: "May 5, 2025" },
  { id: "g3", user: "User #U201", type: "export", status: "processing", date: "May 8, 2025" },
  { id: "g4", user: "User #U145", type: "delete", status: "pending", date: "May 12, 2025" },
];

const gdprStatusColors: Record<string, string> = {
  pending: "#f59e0b",
  completed: "#22c55e",
  processing: "#6366f1",
};

export default function AdminPanel() {
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>(
    Object.fromEntries(adminUsers.map(u => [u.id, u.status]))
  );

  const filteredUsers = adminUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleStatus = (id: string) => {
    setUserStatuses(s => ({ ...s, [id]: s[id] === "active" ? "suspended" : "active" }));
  };

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="bg-[hsl(240_18%_9%)] border border-border/40 h-9 rounded-xl p-1">
        <TabsTrigger value="overview" className="text-xs rounded-lg data-[state=active]:bg-[#6366f1]/20 data-[state=active]:text-[#6366f1]">Overview</TabsTrigger>
        <TabsTrigger value="users" className="text-xs rounded-lg data-[state=active]:bg-[#6366f1]/20 data-[state=active]:text-[#6366f1]">Users</TabsTrigger>
        <TabsTrigger value="rbac" className="text-xs rounded-lg data-[state=active]:bg-[#6366f1]/20 data-[state=active]:text-[#6366f1]">RBAC</TabsTrigger>
        <TabsTrigger value="moderation" className="text-xs rounded-lg data-[state=active]:bg-[#6366f1]/20 data-[state=active]:text-[#6366f1]">Moderation</TabsTrigger>
        <TabsTrigger value="gdpr" className="text-xs rounded-lg data-[state=active]:bg-[#6366f1]/20 data-[state=active]:text-[#6366f1]">GDPR/ODPC</TabsTrigger>
        <TabsTrigger value="analytics" className="text-xs rounded-lg data-[state=active]:bg-[#6366f1]/20 data-[state=active]:text-[#6366f1]">Analytics</TabsTrigger>
      </TabsList>

      {/* OVERVIEW */}
      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Total Users" value={500} icon={Users} trend="up" trendValue="+12.4%" color="#6366f1" />
          <MetricCard label="Daily Active" value={342} unit="DAU" icon={Activity} trend="up" trendValue="+8.2%" color="#14b8a6" />
          <MetricCard label="Monthly Active" value={487} unit="MAU" icon={TrendingUp} trend="up" trendValue="+5.1%" color="#22c55e" />
          <MetricCard label="Churn Rate" value="2.4%" icon={BarChart2} trend="down" trendValue="-0.3%" color="#f59e0b" />
        </div>

        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#6366f1]" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 12%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} width={35} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} fill="url(#totalGrad)" dot={false} name="Total Users" />
                <Area type="monotone" dataKey="dau" stroke="#14b8a6" strokeWidth={2} fill="url(#dauGrad)" dot={false} name="DAU" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      {/* USERS */}
      <TabsContent value="users" className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="h-9 pl-8 text-xs bg-[hsl(240_18%_7%)] border-border/60 rounded-xl"
            />
          </div>
          <div className="flex gap-1.5">
            {["all", "patient", "provider", "insurer", "admin"].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize",
                  roleFilter === r ? "bg-[#6366f1]/20 text-[#6366f1] border-[#6366f1]/40" : "bg-[hsl(240_18%_7%)] text-muted-foreground border-border/30 hover:text-foreground")}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/40">
                  {["Name", "Email", "Role", "Status", "Joined", "Last Active", "Tier", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-b border-border/20 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge className="text-[10px] h-4 px-2 border-0 capitalize" style={{ backgroundColor: (roleColors[u.role] ?? "#94a3b8") + "18", color: roleColors[u.role] ?? "#94a3b8" }}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="text-[10px] h-4 px-2 border-0 capitalize" style={{ backgroundColor: (statusColors[userStatuses[u.id] ?? u.status] ?? "#94a3b8") + "18", color: statusColors[userStatuses[u.id] ?? u.status] ?? "#94a3b8" }}>
                        {userStatuses[u.id] ?? u.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.lastActive}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.tier}</td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        onClick={() => toggleStatus(u.id)}
                        className={cn("h-6 px-2 text-[10px] rounded-lg border", (userStatuses[u.id] ?? u.status) === "active"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                          : "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20 hover:bg-[#22c55e]/20")}
                      >
                        {(userStatuses[u.id] ?? u.status) === "active" ? "Suspend" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* RBAC */}
      <TabsContent value="rbac" className="space-y-4">
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#a78bfa]" />
              Role Permissions Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Role</th>
                  {permissions.map(p => (
                    <th key={p} className="px-3 py-3 text-center text-muted-foreground font-medium capitalize">
                      {p.replace("_", " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map(role => (
                  <tr key={role} className="border-b border-border/20">
                    <td className="px-4 py-3">
                      <Badge className="text-[10px] px-2 h-5 border-0 capitalize" style={{ backgroundColor: (roleColors[role] ?? "#94a3b8") + "18", color: roleColors[role] ?? "#94a3b8" }}>
                        {role}
                      </Badge>
                    </td>
                    {permissions.map(p => (
                      <td key={p} className="px-3 py-3 text-center">
                        {rbacMatrix[role]?.[p] ? (
                          <Check className="w-4 h-4 text-[#22c55e] mx-auto" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-muted-foreground/40 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* MODERATION */}
      <TabsContent value="moderation" className="space-y-4">
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
              Content Flags
              <Badge className="text-[10px] px-2 h-4 bg-[#f59e0b]/15 text-[#f59e0b] border-0 ml-1">{flaggedContent.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {flaggedContent.map(flag => (
              <div key={flag.id} className="p-3 rounded-xl bg-[hsl(240_18%_7%)] border border-[#f59e0b]/20">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="text-[10px] h-4 px-2 bg-[#f59e0b]/15 text-[#f59e0b] border-0">{flag.type}</Badge>
                      <span className="text-[10px] text-muted-foreground">{flag.user}</span>
                      <span className="text-[10px] text-muted-foreground">{flag.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{flag.content}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="h-6 px-3 text-[10px] rounded-lg bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 hover:bg-[#22c55e]/20">
                    <Check className="w-2.5 h-2.5 mr-1" />Approve
                  </Button>
                  <Button size="sm" className="h-6 px-3 text-[10px] rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20">
                    <X className="w-2.5 h-2.5 mr-1" />Remove
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* GDPR/ODPC */}
      <TabsContent value="gdpr" className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Data Requests", value: gdprRequests.filter(r => r.type === "export").length, color: "#6366f1" },
            { label: "Delete Requests", value: gdprRequests.filter(r => r.type === "delete").length, color: "#f43f5e" },
            { label: "Compliance Score", value: "98%", color: "#22c55e" },
          ].map(item => (
            <div key={item.label} className="p-4 rounded-2xl bg-[hsl(240_18%_7%)] border border-border/40 text-center">
              <p className="text-2xl font-extrabold metric-number" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6366f1]" />
              Data Requests (GDPR/ODPC)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {gdprRequests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-[hsl(240_18%_7%)] border border-border/30">
                <div className="flex items-center gap-3">
                  {req.type === "export" ? <Download className="w-4 h-4 text-[#6366f1]" /> : <Trash2 className="w-4 h-4 text-[#f43f5e]" />}
                  <div>
                    <p className="text-xs font-semibold text-foreground capitalize">{req.type} Request — {req.user}</p>
                    <p className="text-[10px] text-muted-foreground">Submitted: {req.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-[10px] h-4 px-2 border-0 capitalize" style={{ backgroundColor: (gdprStatusColors[req.status] ?? "#94a3b8") + "18", color: gdprStatusColors[req.status] ?? "#94a3b8" }}>
                    {req.status}
                  </Badge>
                  {req.status === "pending" && (
                    <Button size="sm" className="h-6 px-2 text-[10px] rounded-lg bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 hover:bg-[#6366f1]/20">
                      Process
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* ANALYTICS */}
      <TabsContent value="analytics" className="space-y-4">
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#6366f1]" />
              Feature Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={engagementData} layout="vertical" barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 12%)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
                <YAxis dataKey="feature" type="category" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} width={65} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}%`, "Usage"]} />
                <Bar dataKey="usage" fill="#6366f1" fillOpacity={0.8} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
