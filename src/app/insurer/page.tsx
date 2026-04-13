"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import {
  Shield,
  ArrowLeft,
  Bell,
  TrendingDown,
  TrendingUp,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  Download,
  BarChart3,
  DollarSign,
  Percent,
  Zap,
  Award,
  Target,
  Clock,
  RefreshCw,
  Info,
  Filter,
} from "lucide-react";
import {
  populationRiskDistribution,
  complianceTrend,
  claimsProjection,
  tierDistribution,
  pilotKPIs,
  premiumAdjustments,
  patientRoster,
} from "@/lib/mockData";

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  trend,
  trendLabel,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && trendLabel && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              trend === "up" ? "bg-emerald-100 text-emerald-700" : trend === "down" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
            {trendLabel}
          </div>
        )}
      </div>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-600 mt-0.5">{label}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}

// ─── Pilot KPI Row ─────────────────────────────────────────────────────────────
function PilotKPIRow() {
  const kpis = [
    {
      label: "Device Uptime",
      value: pilotKPIs.deviceUptime,
      target: 98,
      unit: "%",
      color: "#10b981",
      icon: Activity,
    },
    {
      label: "Sync Success Rate",
      value: pilotKPIs.syncSuccessRate,
      target: 99,
      unit: "%",
      color: "#3b82f6",
      icon: RefreshCw,
    },
    {
      label: "Failure Rate",
      value: pilotKPIs.failureRate,
      target: 1,
      unit: "%",
      color: pilotKPIs.failureRate < 1 ? "#10b981" : "#ef4444",
      icon: AlertCircle,
      inverted: true,
    },
    {
      label: "Avg Compliance",
      value: pilotKPIs.avgCompliance,
      target: 80,
      unit: "%",
      color: "#f59e0b",
      icon: Target,
    },
    {
      label: "Avg Health Score",
      value: pilotKPIs.avgHealthScore,
      target: 70,
      unit: "",
      color: "#8b5cf6",
      icon: BarChart3,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Pilot Programme KPIs</h3>
          <p className="text-xs text-slate-500">500 enrolled users · Nairobi pilot cohort</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-500">Live monitoring</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const met = kpi.inverted ? kpi.value <= kpi.target : kpi.value >= kpi.target;
          return (
            <div key={kpi.label} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg viewBox="0 0 64 64" className="transform -rotate-90">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke={kpi.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(kpi.inverted ? (1 - kpi.value / 2) : kpi.value / 100) * 163} 163`}
                    style={{ transition: "stroke-dasharray 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
              </div>
              <p className="text-lg font-extrabold" style={{ color: kpi.color }}>
                {kpi.value}{kpi.unit}
              </p>
              <p className="text-xs text-slate-500">{kpi.label}</p>
              <div className={`flex items-center justify-center gap-1 mt-1 text-xs font-semibold ${met ? "text-emerald-600" : "text-red-600"}`}>
                {met ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                <span>Target: {kpi.inverted ? "<" : ">"}{kpi.target}{kpi.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* User breakdown */}
      <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
        {[
          { label: "Total Enrolled", value: pilotKPIs.totalUsers, color: "#3b82f6" },
          { label: "Active Devices", value: pilotKPIs.activeDevices, color: "#10b981" },
          { label: "Active Alerts", value: pilotKPIs.highRiskAlerts, color: "#ef4444" },
          { label: "Resolved Alerts", value: pilotKPIs.resolvedAlerts, color: "#f59e0b" },
        ].map((item) => (
          <div key={item.label} className="text-center p-3 rounded-xl" style={{ backgroundColor: item.color + "10" }}>
            <p className="text-xl font-extrabold" style={{ color: item.color }}>{item.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function InsurerDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "compliance" | "claims" | "premiums">("overview");

  const totalClaimed = 500;
  const avgMonthlyPremium = 285;
  const projectedSavings = premiumAdjustments.reduce((sum, row) => {
    const n = parseFloat(row.savings.replace(/[^0-9.-]/g, "")) * (row.savings.startsWith("-") ? -1 : 1);
    return sum + n;
  }, 0);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "compliance", label: "Compliance" },
    { id: "claims", label: "Claims" },
    { id: "premiums", label: "Premium Adj." },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm">JIVA</span>
                <span className="text-slate-400 text-sm"> · Insurer Dashboard</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3 h-3" /> Data as of {new Date().toLocaleDateString()}
            </span>
            <button className="flex items-center gap-1.5 text-xs bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">
              <Download className="w-3 h-3" /> Export Report
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                AF
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-900">Amina Farooq</p>
                <p className="text-xs text-slate-500">JIVA Insurer Portal · CIC Group</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KPICard
            label="Enrolled Members"
            value="500"
            sub="Pilot cohort · Nairobi"
            icon={Users}
            color="#3b82f6"
            trend="up"
            trendLabel="+500 YTD"
          />
          <KPICard
            label="Avg Wellness Compliance"
            value="88%"
            sub="↑ from 64% at launch"
            icon={Activity}
            color="#10b981"
            trend="up"
            trendLabel="+24pp"
          />
          <KPICard
            label="Projected Claims Reduction"
            value="46%"
            sub="vs baseline by Dec 2025"
            icon={TrendingDown}
            color="#8b5cf6"
            trend="up"
            trendLabel="on track"
          />
          <KPICard
            label="Projected Annual Savings"
            value="$46.9K"
            sub="Net across 500 members"
            icon={DollarSign}
            color="#f59e0b"
            trend="up"
            trendLabel="vs baseline"
          />
        </div>

        {/* Pilot KPIs */}
        <div className="mb-5">
          <PilotKPIRow />
        </div>

        {/* Tab navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-5">
          <div className="flex border-b border-slate-100 px-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-violet-500 text-violet-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Risk Distribution */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Population Risk Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={populationRiskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {populationRiskDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => [v, "Members"]} contentStyle={{ borderRadius: "12px", border: "none", fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2.5 mt-2">
                    {populationRiskDistribution.map((d) => (
                      <div key={d.name} className="flex items-center gap-3">
                        <div className="w-24">
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${d.percentage}%`, backgroundColor: d.color }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-slate-600 flex-1">{d.name}</span>
                        <span className="text-xs font-bold text-slate-800">
                          {d.value} ({d.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tier Distribution */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Wellness Tier Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={tierDistribution} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="tier" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v: number) => [v, "Members"]} contentStyle={{ borderRadius: "12px", border: "none", fontSize: "11px" }} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {tierDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-xs text-amber-700 font-medium">
                      💡 Status Points = (Activity Verification × Incentive Multiplier) − Inactivity Penalty
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Tiers drive behaviour: Diamond members show 42% fewer claims vs Bronze
                    </p>
                  </div>
                </div>

                {/* Health score by cohort */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Health Score Breakdown by Cohort</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Healthy Members", count: 228, avgScore: 82, color: "#10b981" },
                      { label: "Hypertension", count: 132, avgScore: 58, color: "#f59e0b" },
                      { label: "Type 2 Diabetes", count: 95, avgScore: 48, color: "#ef4444" },
                      { label: "Comorbidities", count: 45, avgScore: 32, color: "#dc2626" },
                    ].map((cohort) => (
                      <div key={cohort.label} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                        <p className="text-2xl font-extrabold" style={{ color: cohort.color }}>{cohort.avgScore}</p>
                        <p className="text-xs font-medium text-slate-700 mt-1">{cohort.label}</p>
                        <p className="text-xs text-slate-400">{cohort.count} members</p>
                        <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                          <div className="h-full rounded-full" style={{ width: `${cohort.avgScore}%`, backgroundColor: cohort.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── COMPLIANCE ── */}
            {activeTab === "compliance" && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">12-Week Compliance Trend</h3>
                      <p className="text-xs text-slate-500">Activity verification rate across pilot cohort</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-semibold">
                      <TrendingUp className="w-3 h-3" /> Target 80% exceeded — Week 7
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={complianceTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[50, 100]} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "11px" }} formatter={(v: number, n: string) => [`${v}%`, n === "compliance" ? "Compliance" : "Target"]} />
                      <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "80% Target", fill: "#f59e0b", fontSize: 10, position: "right" }} />
                      <Area type="monotone" dataKey="compliance" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf620" name="compliance" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Members hitting 3+ active days/wk", value: "67%", sub: "338 / 500", color: "#10b981", icon: CheckCircle },
                    { label: "Members with 5+ active days/wk", value: "42%", sub: "210 / 500 — Gold+ tier", color: "#8b5cf6", icon: Award },
                    { label: "Members inactive (<2 days/wk)", value: "15%", sub: "75 / 500 — intervention needed", color: "#ef4444", icon: AlertCircle },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
                      <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Behavioural levers */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Incentive Optimisation Levers</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-3 text-slate-600 font-semibold rounded-tl-xl">Lever</th>
                          <th className="text-left p-3 text-slate-600 font-semibold">Description</th>
                          <th className="text-left p-3 text-slate-600 font-semibold">Projected Impact</th>
                          <th className="text-left p-3 text-slate-600 font-semibold rounded-tr-xl">Rationale</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { lever: "Increase Multiplier", desc: "Raise cashback from 10% → 15%", impact: "+15% activity, −5% claims", rationale: "Mirrors Apple Watch 34% uplift" },
                          { lever: "Lower Verification", desc: "Reduce weekly goal: 5→3 active days", impact: "+20% participation", rationale: "Addresses inactivity epidemic" },
                          { lever: "Pre-Commitment", desc: "Auto-enrol with opt-out; −20pts if non-compliant", impact: "+12% healthy behaviours", rationale: "Duke study: +3.5% adherence" },
                          { lever: "AI Personalisation", desc: "Claims data → tailored goals (lower for seniors)", impact: "+25% vitality score", rationale: "50M+ life-years data" },
                          { lever: "Inactivity Penalty", desc: "+10% premium for zero-activity month", impact: "−25% inactivity, −40% claim severity", rationale: "Vitality Drive 30–34% cuts" },
                        ].map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                            <td className="p-3 font-semibold text-violet-700">{row.lever}</td>
                            <td className="p-3 text-slate-600">{row.desc}</td>
                            <td className="p-3 text-emerald-600 font-medium">{row.impact}</td>
                            <td className="p-3 text-slate-500 italic">{row.rationale}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── CLAIMS ── */}
            {activeTab === "claims" && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Claims Cost Index (Baseline = 100)</h3>
                      <p className="text-xs text-slate-500">Actual vs projected trajectory with JIVA programme</p>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-violet-600 rounded-full inline-block" /> Actual</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-violet-300 rounded-full inline-block border-dashed" /> Projected</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={claimsProjection} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[40, 110]} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "11px" }} formatter={(v: number | null, n: string) => [v != null ? `${v}` : "—", n === "actual" ? "Actual" : "Projected"]} />
                      <Area type="monotone" dataKey="actual" stroke="#7c3aed" strokeWidth={2.5} fill="#7c3aed20" name="actual" connectNulls />
                      <Line type="monotone" dataKey="projected" stroke="#a78bfa" strokeWidth={2} strokeDasharray="6 3" name="projected" dot={false} />
                      <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="3 3" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Claims Reduction (Current)", value: "17%", sub: "vs baseline at programme start", color: "#10b981" },
                    { label: "Projected by Dec 2025", value: "46%", sub: "vs baseline — on trajectory", color: "#8b5cf6" },
                    { label: "Avg Claims Cost/Member", value: "$2,140", sub: "down from $2,580 baseline", color: "#3b82f6" },
                    { label: "Programme Net ROI", value: "3.4×", sub: "projected over 24 months", color: "#f59e0b" },
                  ].map((s) => (
                    <div key={s.label} className="p-4 rounded-xl text-center" style={{ backgroundColor: s.color + "10" }}>
                      <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs font-medium text-slate-700 mt-1">{s.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-violet-50 border border-violet-100 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-violet-800">AI-Powered Risk Scoring</p>
                      <p className="text-xs text-violet-600 mt-1">
                        JIVA's multi-sensor fusion model (ECG · PPG · HRV · SpO₂ · BIA · Temperature) generates a
                        normalised Health Score (0–100) used for actuarial modelling. High-risk flags (score ≤40)
                        trigger clinician review workflows, reducing late-stage intervention costs by an estimated 40%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── PREMIUM ADJ ── */}
            {activeTab === "premiums" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Premium Adjustment Recommendations</h3>
                    <p className="text-xs text-slate-500">Based on wellness compliance, health score, and activity tier</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-100">
                    <Download className="w-3 h-3" /> Export CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-left">
                        <th className="p-4 text-xs font-semibold text-slate-600 rounded-tl-xl">Cohort</th>
                        <th className="p-4 text-xs font-semibold text-slate-600">Members</th>
                        <th className="p-4 text-xs font-semibold text-slate-600">Premium Adj.</th>
                        <th className="p-4 text-xs font-semibold text-slate-600">Cashback</th>
                        <th className="p-4 text-xs font-semibold text-slate-600 rounded-tr-xl">Net Savings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {premiumAdjustments.map((row, i) => {
                        const isNeg = row.savings.startsWith("-");
                        return (
                          <tr
                            key={i}
                            className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                          >
                            <td className="p-4 font-medium text-slate-800">{row.cohort}</td>
                            <td className="p-4 text-slate-600">{row.users}</td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                  row.adjustment.startsWith("-")
                                    ? "bg-emerald-100 text-emerald-700"
                                    : row.adjustment === "0%"
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {row.adjustment}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-emerald-600 font-semibold">{row.cashback}</span>
                            </td>
                            <td className="p-4">
                              <span className={`font-bold text-sm ${isNeg ? "text-red-600" : "text-emerald-600"}`}>
                                {row.savings}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-violet-50 border-t-2 border-violet-200">
                        <td className="p-4 font-bold text-violet-800">Total (500 members)</td>
                        <td className="p-4 font-bold text-slate-700">500</td>
                        <td className="p-4 text-slate-600">—</td>
                        <td className="p-4 text-slate-600">—</td>
                        <td className="p-4 font-extrabold text-emerald-600 text-base">$46,940</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Formula reminder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                    <p className="text-sm font-bold text-amber-800 mb-2">Status Points Formula</p>
                    <p className="text-xs font-mono text-amber-700 bg-amber-100 rounded-lg px-3 py-2">
                      Status Points = (Activity Verification × Incentive Multiplier) − Inactivity Penalty
                    </p>
                    <div className="mt-3 space-y-1.5 text-xs text-amber-700">
                      <p>• Bronze (0–999): standard premium</p>
                      <p>• Silver (1000–2499): 5% cashback</p>
                      <p>• Gold (2500–4999): 10% cashback</p>
                      <p>• Platinum (5000–7499): 12% cashback</p>
                      <p>• Diamond (7500+): 15% cashback + free ring insurance</p>
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <p className="text-sm font-bold text-emerald-800 mb-2">Evidence Base</p>
                    <div className="space-y-2 text-xs text-emerald-700">
                      <p>📊 <strong>Apple Watch + Discovery:</strong> 34% activity uplift</p>
                      <p>📊 <strong>Vitality Drive:</strong> 30–34% claims reduction</p>
                      <p>📊 <strong>Duke Study:</strong> Pre-commitment +3.5% adherence</p>
                      <p>📊 <strong>2025 Personal Health Pathways:</strong> 42% COVID risk reduction via exercise</p>
                      <p>📊 <strong>ObeCity Index:</strong> 60%+ overweight — lower goals drive inclusion</p>
                    </div>
                  </div>
                </div>

                {/* Regulatory */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Compliance & Data Governance</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "HIPAA Aligned", "ODPC (Kenya) Compliant", "SOC 3 Ready",
                      "AES-256 Encryption", "TLS 1.3 Transport", "DSAR Supported",
                      "Right to be Forgotten", "Auditable Consent Records",
                    ].map((tag) => (
                      <span key={tag} className="text-xs bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full">
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center py-4 text-xs text-slate-400">
          JIVA APHP · Insurer Dashboard · Population Health Analytics · HIPAA Aligned · ODPC (Kenya) Compliant
        </footer>
      </main>
    </div>
  );
}
