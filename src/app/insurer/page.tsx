"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, ReferenceLine,
} from "recharts";
import {
  Shield, TrendingDown, TrendingUp, Users, Activity,
  AlertCircle, CheckCircle, Download, BarChart3, DollarSign,
  Target, RefreshCw, LayoutDashboard,
} from "lucide-react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardShell from "@/components/layout/DashboardShell";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import {
  populationRiskDistribution, complianceTrend, claimsProjection,
  tierDistribution, pilotKPIs, premiumAdjustments,
} from "@/lib/mockData";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: TrendingUp, label: "Compliance", id: "compliance" },
  { icon: DollarSign, label: "Claims", id: "claims" },
  { icon: Shield, label: "Premium", id: "premium" },
  { icon: Target, label: "Pilot KPIs", id: "kpis" },
];

const tooltipStyle = {
  backgroundColor: "rgba(10,10,20,0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  fontSize: "11px",
  color: "#f0eeeb",
  backdropFilter: "blur(16px)",
};

const axisTick = { fill: "rgba(255,255,255,0.35)", fontSize: 10 };

function StatCard({ label, value, unit = "", sub, color, icon: Icon, trend }: {
  label: string; value: string | number; unit?: string; sub?: string;
  color: string; icon: React.ElementType; trend?: "up" | "down" | "stable";
}) {
  return (
    <div className="stat-card hover-lift rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: color + "20", border: `1px solid ${color}30` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: trend === "up" ? "#10b981" : trend === "down" ? "#f43f5e" : "#94a3b8" }}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
          </div>
        )}
      </div>
      <p className="text-2xl font-extrabold metric-number" style={{ color }}>{value}{unit}</p>
      <p className="text-xs text-white/50 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

export default function InsurerDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <>
      <DashboardShell
        navItems={navItems}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        role="insurer"
        userName="Amina Farooq"
        userInitials="AF"
        userSub="CIC Group · Insurer Portal"
        notificationCount={0}
        topBarTitle={navItems.find(n => n.id === activeSection)?.label ?? "Dashboard"}
        topBarSub={`Data as of ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · Nairobi Pilot`}
      >

        {/* ── OVERVIEW ── */}
        {activeSection === "overview" && (
          <div className="space-y-5 animate-fade-up">
            {/* Hero banner */}
            <div className="relative overflow-hidden rounded-2xl p-5"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(20,184,166,0.08) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(99,102,241,0.5) 0%, transparent 60%)" }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-400">PORTFOLIO ANALYTICS</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">CIC Group · Nairobi Pilot</h2>
                <p className="text-white/50 text-sm">500 enrolled members · Health-linked insurance programme</p>
              </div>
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Enrolled Members" value="500" sub="Pilot cohort · Nairobi" color="#3b82f6" icon={Users} trend="up" />
              <StatCard label="Avg Compliance" value="88" unit="%" sub="↑ from 64% at launch" color="#10b981" icon={Activity} trend="up" />
              <StatCard label="Claims Reduction" value="46" unit="%" sub="vs baseline by Dec 2025" color="#8b5cf6" icon={TrendingDown} trend="up" />
              <StatCard label="Annual Savings" value="$46.9K" sub="Net across 500 members" color="#f59e0b" icon={DollarSign} trend="up" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Risk distribution */}
              <div className="glass rounded-2xl p-4">
                <p className="text-sm font-bold text-white mb-1">Population Risk Distribution</p>
                <p className="text-xs text-white/40 mb-3">500 enrolled members</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={populationRiskDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                      {populationRiskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [v, "Members"]} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2.5 mt-2">
                  {populationRiskDistribution.map(d => (
                    <div key={d.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-white/50">{d.name}</span>
                        </span>
                        <span className="font-semibold text-white tabular">{d.value} ({d.percentage}%)</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.percentage}%`, backgroundColor: d.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance trend */}
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-white">Compliance Trend</p>
                    <p className="text-xs text-white/40">12-week rolling</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
                    <TrendingUp className="w-3 h-3" /> 80% target hit
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={complianceTrend} margin={{ top: 4, right: 4, left: -25, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="week" tick={axisTick} axisLine={false} tickLine={false} />
                    <YAxis tick={axisTick} axisLine={false} tickLine={false} domain={[50, 100]} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Compliance"]} />
                    <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="5 5"
                      label={{ value: "80%", fill: "#f59e0b", fontSize: 9, position: "right" }} />
                    <Area type="monotone" dataKey="compliance" stroke="#8b5cf6" strokeWidth={2} fill="rgba(139,92,246,0.15)" name="compliance" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cohort health scores */}
            <div className="glass rounded-2xl p-4">
              <p className="text-sm font-bold text-white mb-3">Health Score by Cohort</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Healthy", count: 228, avgScore: 82, color: "#10b981" },
                  { label: "Hypertension", count: 132, avgScore: 58, color: "#f59e0b" },
                  { label: "Type 2 Diabetes", count: 95, avgScore: 48, color: "#f43f5e" },
                  { label: "Comorbidities", count: 45, avgScore: 32, color: "#dc2626" },
                ].map(c => (
                  <div key={c.label} className="rounded-xl p-4 text-center hover-lift"
                    style={{ background: c.color + "10", border: `1px solid ${c.color}25` }}>
                    <p className="text-2xl font-extrabold metric-number" style={{ color: c.color }}>{c.avgScore}</p>
                    <p className="text-xs font-medium text-white/70 mt-1">{c.label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{c.count} members</p>
                    <div className="mt-2 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.avgScore}%`, backgroundColor: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── COMPLIANCE ── */}
        {activeSection === "compliance" && (
          <div className="space-y-5 animate-fade-up">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-white">12-Week Compliance Trend</p>
                  <p className="text-xs text-white/40">Activity verification rate across pilot cohort</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
                  <TrendingUp className="w-3 h-3" /> Target exceeded — Week 7
                </span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <ComposedChart data={complianceTrend} margin={{ top: 4, right: 4, left: -25, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="week" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis tick={axisTick} axisLine={false} tickLine={false} domain={[50, 100]} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Compliance"]} />
                  <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="5 5"
                    label={{ value: "80% Target", fill: "#f59e0b", fontSize: 10, position: "right" }} />
                  <Area type="monotone" dataKey="compliance" stroke="#8b5cf6" strokeWidth={2.5} fill="rgba(139,92,246,0.15)" name="compliance" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <StatCard label="3+ active days/week" value="67" unit="%" sub="338 / 500 members" color="#10b981" icon={CheckCircle} />
              <StatCard label="5+ active days/week" value="42" unit="%" sub="210 / 500 — Gold+ tier" color="#8b5cf6" icon={Target} />
              <StatCard label="Inactive (<2 days/wk)" value="15" unit="%" sub="75 / 500 — intervention" color="#f43f5e" icon={AlertCircle} />
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/[0.06]">
                <p className="text-sm font-bold text-white">Incentive Optimisation Levers</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-white/40 text-xs">Lever</TableHead>
                    <TableHead className="text-white/40 text-xs">Description</TableHead>
                    <TableHead className="text-white/40 text-xs">Projected Impact</TableHead>
                    <TableHead className="text-white/40 text-xs">Rationale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { lever: "Increase Multiplier", desc: "Raise cashback 10%→15%", impact: "+15% activity, −5% claims", rationale: "Apple Watch 34% uplift" },
                    { lever: "Lower Verification", desc: "Weekly goal: 5→3 active days", impact: "+20% participation", rationale: "SA inactivity epidemic" },
                    { lever: "Pre-Commitment", desc: "Auto-enrol; −20pts if non-compliant", impact: "+12% healthy behaviours", rationale: "Duke study: +3.5%" },
                    { lever: "AI Personalisation", desc: "Claims data → tailored goals", impact: "+25% vitality score", rationale: "50M+ life-years data" },
                    { lever: "Inactivity Penalty", desc: "+10% premium — zero-activity month", impact: "−25% inactivity, −40% severity", rationale: "Vitality Drive 30–34%" },
                  ].map((row, i) => (
                    <TableRow key={i} className="border-white/[0.04] hover:bg-white/[0.02]">
                      <TableCell className="font-semibold text-purple-400 text-xs">{row.lever}</TableCell>
                      <TableCell className="text-xs text-white/70">{row.desc}</TableCell>
                      <TableCell className="text-xs text-teal-400 font-medium">{row.impact}</TableCell>
                      <TableCell className="text-xs text-white/40 italic">{row.rationale}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* ── CLAIMS ── */}
        {activeSection === "claims" && (
          <div className="space-y-5 animate-fade-up">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-white">Claims Cost Index (Baseline = 100)</p>
                  <p className="text-xs text-white/40">Actual vs projected with JIVA programme</p>
                </div>
                <div className="flex gap-3 text-xs text-white/40">
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-0.5 bg-[#7c3aed] inline-block rounded" /> Actual
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-0.5 bg-[#a78bfa] inline-block rounded border-dashed" /> Projected
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <ComposedChart data={claimsProjection} margin={{ top: 4, right: 4, left: -25, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis tick={axisTick} axisLine={false} tickLine={false} domain={[40, 110]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <ReferenceLine y={100} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="actual" stroke="#7c3aed" strokeWidth={2.5} fill="rgba(124,58,237,0.15)" name="actual" connectNulls />
                  <Line type="monotone" dataKey="projected" stroke="#a78bfa" strokeWidth={2} strokeDasharray="6 3" name="projected" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Claims Reduction (Now)" value="17" unit="%" sub="vs programme start" color="#10b981" icon={TrendingDown} />
              <StatCard label="Projected by Dec 2025" value="46" unit="%" sub="On trajectory" color="#8b5cf6" icon={Target} />
              <StatCard label="Avg Claims/Member" value="$2,140" sub="Down from $2,580" color="#3b82f6" icon={DollarSign} />
              <StatCard label="Programme Net ROI" value="3.4×" sub="Projected 24 months" color="#f59e0b" icon={TrendingUp} />
            </div>

            <div className="glass-teal rounded-2xl p-4">
              <p className="font-semibold text-sm text-teal-300 mb-2">AI-Powered Risk Scoring</p>
              <p className="text-xs text-white/60 leading-relaxed">
                JIVA&apos;s multi-sensor fusion model (ECG · PPG · HRV · SpO₂ · BIA · Temperature) generates a normalised Health Score (0–100) used for actuarial modelling. High-risk flags (score ≤40) trigger clinician review workflows, reducing late-stage intervention costs by an estimated 40%.
              </p>
            </div>
          </div>
        )}

        {/* ── PREMIUM ── */}
        {activeSection === "premium" && (
          <div className="space-y-5 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Premium Adjustment Recommendations</h2>
                <p className="text-xs text-white/40 mt-0.5">Based on wellness compliance, health score, and activity tier</p>
              </div>
              <button className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold glass text-white/70 hover:text-white press-scale">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-white/40 text-xs">Cohort</TableHead>
                    <TableHead className="text-white/40 text-xs">Members</TableHead>
                    <TableHead className="text-white/40 text-xs">Premium Adj.</TableHead>
                    <TableHead className="text-white/40 text-xs">Cashback</TableHead>
                    <TableHead className="text-white/40 text-xs">Net Savings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {premiumAdjustments.map((row, i) => {
                    const isNeg = row.savings.startsWith("-");
                    const adjColor = row.adjustment.startsWith("-") ? "#10b981" : row.adjustment === "0%" ? "#94a3b8" : "#f43f5e";
                    return (
                      <TableRow key={i} className="border-white/[0.04] hover:bg-white/[0.02]">
                        <TableCell className="font-medium text-sm text-white">{row.cohort}</TableCell>
                        <TableCell className="text-sm tabular text-white/70">{row.users}</TableCell>
                        <TableCell>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: adjColor + "18", color: adjColor }}>
                            {row.adjustment}
                          </span>
                        </TableCell>
                        <TableCell className="text-teal-400 font-semibold text-sm tabular">{row.cashback}</TableCell>
                        <TableCell className={`font-bold text-sm tabular ${isNeg ? "text-rose-400" : "text-emerald-400"}`}>{row.savings}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow className="border-white/[0.06]">
                    <TableCell className="font-bold text-purple-400 text-sm">Total (500 members)</TableCell>
                    <TableCell className="font-bold text-white tabular">500</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell className="font-extrabold text-emerald-400 text-base tabular">$46,940</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-4">
                <p className="text-xs font-bold text-white mb-3">Status Points Formula</p>
                <div className="rounded-xl px-3 py-2 mb-3"
                  style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <code className="text-xs text-amber-400">Status Points = (Activity × Multiplier) − Inactivity Penalty</code>
                </div>
                {["Bronze (0–999): standard premium", "Silver (1,000–2,499): 5% cashback", "Gold (2,500–4,999): 10% cashback", "Platinum (5,000–7,499): 12% cashback", "Diamond (7,500+): 15% cashback + free band"].map((t, i) => (
                  <p key={t} className="text-xs text-white/50 mt-1">
                    <span style={{ color: ["#b45309", "#64748b", "#f59e0b", "#94a3b8", "#a78bfa"][i] }}>•</span> {t}
                  </p>
                ))}
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-xs font-bold text-white mb-3">Evidence Base</p>
                {[
                  "Apple Watch + Discovery: 34% activity uplift",
                  "Vitality Drive: 30–34% claims reduction",
                  "Duke Study: Pre-commitment +3.5% adherence",
                  "2025 Health Pathways: 42% COVID risk reduction",
                  "ObeCity Index: 60%+ overweight — lower goals drive inclusion",
                ].map(e => <p key={e} className="text-xs text-white/50 mt-1">• {e}</p>)}
              </div>
            </div>
          </div>
        )}

        {/* ── PILOT KPIs ── */}
        {activeSection === "kpis" && (
          <div className="space-y-5 animate-fade-up">
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm font-bold text-white">Pilot Programme KPIs</p>
                  <p className="text-xs text-white/40">500 enrolled users · Nairobi pilot cohort</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="live-dot" />
                  <span className="text-xs text-white/40">Live monitoring</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Device Uptime", value: pilotKPIs.deviceUptime, target: 98, unit: "%", color: "#10b981", icon: Activity, inverted: false },
                  { label: "Sync Success", value: pilotKPIs.syncSuccessRate, target: 99, unit: "%", color: "#3b82f6", icon: RefreshCw, inverted: false },
                  { label: "Failure Rate", value: pilotKPIs.failureRate, target: 1, unit: "%", color: pilotKPIs.failureRate < 1 ? "#10b981" : "#f43f5e", icon: AlertCircle, inverted: true },
                  { label: "Compliance", value: pilotKPIs.avgCompliance, target: 80, unit: "%", color: "#f59e0b", icon: Target, inverted: false },
                  { label: "Avg Health Score", value: pilotKPIs.avgHealthScore, target: 70, unit: "", color: "#8b5cf6", icon: BarChart3, inverted: false },
                ].map(kpi => {
                  const met = kpi.inverted ? kpi.value <= kpi.target : kpi.value >= kpi.target;
                  const progress = kpi.inverted ? Math.max(0, (1 - kpi.value / 2) * 100) : kpi.value;
                  return (
                    <div key={kpi.label} className="text-center space-y-2">
                      <div className="relative w-16 h-16 mx-auto">
                        <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                          <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                          <circle cx="32" cy="32" r="26" fill="none" stroke={kpi.color} strokeWidth="7" strokeLinecap="round"
                            strokeDasharray={`${(progress / 100) * 163} 163`}
                            style={{ transition: "stroke-dasharray 1s ease-out", filter: `drop-shadow(0 0 4px ${kpi.color}80)` }} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                        </div>
                      </div>
                      <p className="text-lg font-extrabold metric-number" style={{ color: kpi.color }}>{kpi.value}{kpi.unit}</p>
                      <p className="text-xs text-white/40">{kpi.label}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={met
                          ? { backgroundColor: "rgba(16,185,129,0.15)", color: "#10b981" }
                          : { backgroundColor: "rgba(244,63,94,0.15)", color: "#f43f5e" }}>
                        {met ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {kpi.inverted ? "<" : ">"}{kpi.target}{kpi.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Enrolled", value: pilotKPIs.totalUsers, color: "#3b82f6" },
                { label: "Active Devices", value: pilotKPIs.activeDevices, color: "#10b981" },
                { label: "Active Alerts", value: pilotKPIs.highRiskAlerts, color: "#f43f5e" },
                { label: "Resolved", value: pilotKPIs.resolvedAlerts, color: "#f59e0b" },
              ].map(item => (
                <div key={item.label} className="text-center rounded-2xl p-4 hover-lift"
                  style={{ background: item.color + "10", border: `1px solid ${item.color}25` }}>
                  <p className="text-2xl font-extrabold metric-number" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-xs text-white/50 mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Tier distribution */}
            <div className="glass rounded-2xl p-4">
              <p className="text-sm font-bold text-white mb-3">Wellness Tier Distribution</p>
              <p className="text-xs text-white/40 mb-3">Status tier breakdown across 500 members</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={tierDistribution} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="tier" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.7)" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [v, "Members"]} contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {tierDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Compliance tags */}
            <div className="glass rounded-2xl p-4">
              <p className="text-xs font-semibold text-white mb-3">Compliance & Data Governance</p>
              <div className="flex flex-wrap gap-2">
                {["HIPAA Aligned", "ODPC (Kenya)", "SOC 3 Ready", "AES-256", "TLS 1.3", "DSAR Supported", "Right to Erasure", "Auditable Consent"].map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full glass text-white/50">
                    <CheckCircle className="w-3 h-3 text-teal-400" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-white/20 pt-6 pb-2">
          JIVA APHP · Insurer Dashboard · Population Health Analytics · HIPAA Aligned · ODPC (Kenya) Compliant
        </p>
      </DashboardShell>
      <MobileBottomNav navItems={navItems} activeSection={activeSection} onSectionChange={setActiveSection} />
    </>
  );
}
