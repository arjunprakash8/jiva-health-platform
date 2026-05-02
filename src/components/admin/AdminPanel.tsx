"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Users, TrendingUp, Activity, Shield, FileText,
  BarChart2, Search, Check, X, AlertCircle, Download, Trash2, Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const tooltipStyle = {
  backgroundColor: "rgba(10,10,20,0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  fontSize: "11px",
  color: "#f0eeeb",
  backdropFilter: "blur(16px)",
};

const axisTick = { fill: "rgba(255,255,255,0.35)", fontSize: 10 };

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

function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: string | number; sub?: string;
  color: string; icon: React.ElementType;
}) {
  return (
    <div className="stat-card hover-lift rounded-2xl p-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
        style={{ background: color + "20", border: `1px solid ${color}30` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <p className="text-2xl font-extrabold metric-number" style={{ color }}>{value}</p>
      <p className="text-xs text-white/50 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminPanel({ activeSection }: { activeSection: string }) {
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>(
    Object.fromEntries(adminUsers.map(u => [u.id, u.status]))
  );

  const filteredUsers = adminUsers.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleStatus = (id: string) => {
    setUserStatuses(s => ({ ...s, [id]: s[id] === "active" ? "suspended" : "active" }));
  };

  // ── OVERVIEW ──
  if (activeSection === "overview") return (
    <div className="space-y-5 animate-fade-up">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(167,139,250,0.1) 50%, rgba(20,184,166,0.08) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(99,102,241,0.5) 0%, transparent 60%)" }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <div className="live-dot" />
            <span className="text-xs font-semibold text-indigo-400">PLATFORM ADMIN</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">JIVA Platform Overview</h2>
          <p className="text-white/50 text-sm">500 active users · Real-time monitoring · Nairobi Pilot</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Users" value={500} sub="+12.4% MoM" color="#6366f1" icon={Users} />
        <StatCard label="Daily Active" value={342} sub="DAU · +8.2%" color="#14b8a6" icon={Activity} />
        <StatCard label="Monthly Active" value={487} sub="MAU · +5.1%" color="#22c55e" icon={TrendingUp} />
        <StatCard label="Churn Rate" value="2.4%" sub="−0.3% MoM" color="#f59e0b" icon={BarChart2} />
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <p className="text-sm font-bold text-white">User Growth</p>
        </div>
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} width={35} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} fill="url(#totalGrad)" dot={false} name="Total Users" />
            <Area type="monotone" dataKey="dau" stroke="#14b8a6" strokeWidth={2} fill="url(#dauGrad)" dot={false} name="DAU" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* System health */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "API Uptime", value: "99.97%", color: "#22c55e", status: "Nominal" },
          { label: "Avg Latency", value: "42ms", color: "#14b8a6", status: "Excellent" },
          { label: "Error Rate", value: "0.03%", color: "#6366f1", status: "Normal" },
          { label: "Active Sessions", value: "284", color: "#f59e0b", status: "Live" },
          { label: "Data Syncs/hr", value: "1,247", color: "#a78bfa", status: "Healthy" },
          { label: "Security Alerts", value: "0", color: "#22c55e", status: "All Clear" },
        ].map(m => (
          <div key={m.label} className="glass rounded-xl p-3 hover-lift">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/40">{m.label}</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: m.color + "20", color: m.color }}>{m.status}</span>
            </div>
            <p className="text-xl font-extrabold metric-number" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ── USERS ──
  if (activeSection === "users") return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <Input placeholder="Search users..." value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            className="h-9 pl-8 text-xs bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 rounded-xl" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "patient", "provider", "insurer", "admin"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className="px-3 h-9 rounded-xl text-xs font-semibold transition-all capitalize press-scale"
              style={roleFilter === r
                ? { background: "rgba(99,102,241,0.2)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.4)" }
                : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Name", "Email", "Role", "Status", "Joined", "Last Active", "Tier", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-white/40 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                  <td className="px-4 py-3 text-white/50">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{ background: (roleColors[u.role] ?? "#94a3b8") + "18", color: roleColors[u.role] ?? "#94a3b8" }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{ background: (statusColors[userStatuses[u.id] ?? u.status] ?? "#94a3b8") + "18", color: statusColors[userStatuses[u.id] ?? u.status] ?? "#94a3b8" }}>
                      {userStatuses[u.id] ?? u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40">{u.joined}</td>
                  <td className="px-4 py-3 text-white/40">{u.lastActive}</td>
                  <td className="px-4 py-3 text-white/40">{u.tier}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(u.id)}
                      className="h-6 px-3 text-[10px] rounded-lg font-semibold press-scale"
                      style={(userStatuses[u.id] ?? u.status) === "active"
                        ? { background: "rgba(244,63,94,0.1)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.2)" }
                        : { background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                      {(userStatuses[u.id] ?? u.status) === "active" ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ── RBAC ──
  if (activeSection === "rbac") return (
    <div className="space-y-4 animate-fade-up">
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <Shield className="w-5 h-5 text-purple-400" />
        <div>
          <p className="text-sm font-bold text-white">Role Permissions Matrix</p>
          <p className="text-xs text-white/40">Access control across all platform roles</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-left text-white/40 font-medium">Role</th>
                {permissions.map(p => (
                  <th key={p} className="px-3 py-3 text-center text-white/40 font-medium capitalize">
                    {p.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{ background: (roleColors[role] ?? "#94a3b8") + "18", color: roleColors[role] ?? "#94a3b8" }}>
                      {role}
                    </span>
                  </td>
                  {permissions.map(p => (
                    <td key={p} className="px-3 py-3 text-center">
                      {rbacMatrix[role]?.[p] ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center mx-auto"
                          style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                      ) : (
                        <X className="w-3.5 h-3.5 text-white/20 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role capability summaries */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {roles.map(role => {
          const permsGranted = permissions.filter(p => rbacMatrix[role]?.[p]).length;
          const color = roleColors[role] ?? "#94a3b8";
          return (
            <div key={role} className="rounded-2xl p-4 hover-lift"
              style={{ background: color + "10", border: `1px solid ${color}25` }}>
              <p className="text-sm font-bold capitalize" style={{ color }}>{role}</p>
              <p className="text-2xl font-extrabold metric-number mt-2" style={{ color }}>{permsGranted}/{permissions.length}</p>
              <p className="text-xs text-white/40 mt-0.5">permissions granted</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── MODERATION ──
  if (activeSection === "moderation") return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center gap-2 rounded-2xl p-4"
        style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
        <AlertCircle className="w-4 h-4 text-amber-400" />
        <p className="text-sm font-bold text-white">Content Flags</p>
        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>{flaggedContent.length} pending</span>
      </div>

      <div className="space-y-3">
        {flaggedContent.map(flag => (
          <div key={flag.id} className="glass rounded-2xl p-4 hover-lift">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>{flag.type}</span>
              <span className="text-xs text-white/40">{flag.user}</span>
              <span className="text-xs text-white/30 ml-auto">{flag.date}</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mb-3">{flag.content}</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 h-7 px-3 rounded-xl text-[10px] font-semibold press-scale"
                style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                <Check className="w-3 h-3" /> Approve
              </button>
              <button className="flex items-center gap-1.5 h-7 px-3 rounded-xl text-[10px] font-semibold press-scale"
                style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.2)" }}>
                <X className="w-3 h-3" /> Remove
              </button>
              <button className="flex items-center gap-1.5 h-7 px-3 rounded-xl text-[10px] font-semibold glass text-white/50 hover:text-white ml-auto press-scale">
                <Zap className="w-3 h-3" /> Escalate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Moderation stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Reviewed Today", value: "12", color: "#6366f1" },
          { label: "Removed This Week", value: "7", color: "#f43f5e" },
          { label: "False Positive Rate", value: "4.2%", color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} className="text-center rounded-2xl p-4 hover-lift"
            style={{ background: s.color + "10", border: `1px solid ${s.color}25` }}>
            <p className="text-xl font-extrabold metric-number" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-white/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ── GDPR/ODPC ──
  if (activeSection === "gdpr") return (
    <div className="space-y-4 animate-fade-up">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Data Requests", value: gdprRequests.filter(r => r.type === "export").length, color: "#6366f1" },
          { label: "Delete Requests", value: gdprRequests.filter(r => r.type === "delete").length, color: "#f43f5e" },
          { label: "Compliance Score", value: "98%", color: "#22c55e" },
        ].map(item => (
          <div key={item.label} className="rounded-2xl p-4 text-center hover-lift"
            style={{ background: item.color + "10", border: `1px solid ${item.color}25` }}>
            <p className="text-2xl font-extrabold metric-number" style={{ color: item.color }}>{item.value}</p>
            <p className="text-xs text-white/50 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <p className="text-sm font-bold text-white">Data Requests (GDPR/ODPC)</p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {gdprRequests.map(req => (
            <div key={req.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                {req.type === "export"
                  ? <Download className="w-4 h-4 text-indigo-400" />
                  : <Trash2 className="w-4 h-4 text-rose-400" />}
                <div>
                  <p className="text-xs font-semibold text-white capitalize">{req.type} Request — {req.user}</p>
                  <p className="text-[10px] text-white/40">Submitted: {req.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                  style={{ background: (gdprStatusColors[req.status] ?? "#94a3b8") + "18", color: gdprStatusColors[req.status] ?? "#94a3b8" }}>
                  {req.status}
                </span>
                {req.status === "pending" && (
                  <button className="h-6 px-3 text-[10px] rounded-lg font-semibold press-scale"
                    style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.2)" }}>
                    Process
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance tags */}
      <div className="glass rounded-2xl p-4">
        <p className="text-xs font-semibold text-white mb-3">Active Compliance Standards</p>
        <div className="flex flex-wrap gap-2">
          {["HIPAA Aligned", "ODPC (Kenya)", "SOC 3 Ready", "AES-256 Encryption", "TLS 1.3", "DSAR Supported", "Right to Erasure", "Auditable Consent", "ISO 27001 (target)"].map(tag => (
            <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full glass text-white/50">
              <Check className="w-3 h-3 text-teal-400" /> {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // ── ANALYTICS ──
  if (activeSection === "analytics") return (
    <div className="space-y-4 animate-fade-up">
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="w-4 h-4 text-indigo-400" />
          <p className="text-sm font-bold text-white">Feature Engagement</p>
          <span className="ml-auto text-xs text-white/40">% of active users</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={engagementData} layout="vertical" barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} unit="%" />
            <YAxis dataKey="feature" type="category" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }} tickLine={false} axisLine={false} width={70} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Usage"]} />
            <Bar dataKey="usage" fill="#6366f1" fillOpacity={0.85} radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-teal-400" />
          <p className="text-sm font-bold text-white">User Growth Trend</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={userGrowthData}>
            <defs>
              <linearGradient id="totalGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="dauGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} width={35} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} fill="url(#totalGrad2)" dot={false} name="Total Users" />
            <Area type="monotone" dataKey="dau" stroke="#14b8a6" strokeWidth={2} fill="url(#dauGrad2)" dot={false} name="DAU" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Platform health metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "Avg Session Duration", value: "8.4 min", color: "#6366f1" },
          { label: "Notifications Sent/day", value: "2,847", color: "#14b8a6" },
          { label: "AI Insights Generated", value: "1,204", color: "#a78bfa" },
          { label: "Sync Failures Rate", value: "0.8%", color: "#22c55e" },
          { label: "Support Tickets Open", value: "14", color: "#f59e0b" },
          { label: "SLA Compliance", value: "99.1%", color: "#22c55e" },
        ].map(m => (
          <div key={m.label} className="glass rounded-xl p-3 hover-lift">
            <p className="text-xs text-white/40 mb-1">{m.label}</p>
            <p className="text-xl font-extrabold metric-number" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return null;
}
